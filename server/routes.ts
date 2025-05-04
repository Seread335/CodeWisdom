import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Categories
  app.get("/api/categories", async (req, res, next) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  // Courses
  app.get("/api/courses", async (req, res, next) => {
    try {
      const { categoryId, level, search, limit, offset } = req.query;
      
      const options = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        level: level as string || "all",
        searchQuery: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      
      const courses = await storage.getCourses(options);
      
      // Get additional data for each course
      const coursesWithDetails = await Promise.all(
        courses.map(async (course) => {
          // Get course categories
          const categoriesQuery = await db
            .select({
              id: categories.id,
              name: categories.name,
            })
            .from(courseCategories)
            .innerJoin(categories, eq(categories.id, courseCategories.categoryId))
            .where(eq(courseCategories.courseId, course.id));
          
          // For authenticated users, check enrollment status
          let isEnrolled = false;
          if (req.isAuthenticated()) {
            isEnrolled = await storage.isUserEnrolledInCourse(req.user.id, course.id);
          }
          
          // Get lesson count
          const lessons = await storage.getLessonsByCourseId(course.id);
          
          return {
            ...course,
            categories: categoriesQuery,
            isEnrolled,
            lessonsCount: lessons.length,
          };
        })
      );
      
      res.json(coursesWithDetails);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/courses/recommended", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get courses in progress
      const coursesWithProgress = await storage.getCoursesWithProgress(req.user.id);
      
      // Sort by progress (ascending) to prioritize courses that are started but not completed
      const inProgress = coursesWithProgress
        .filter(course => course.progress > 0 && course.progress < 100)
        .sort((a, b) => a.progress - b.progress);
      
      // Get recommended courses
      const recommended = await storage.getRecommendedCourses(req.user.id, 8);
      
      // Get additional data for each course
      const coursesWithDetails = await Promise.all(
        [...inProgress, ...recommended].map(async (course) => {
          // Get course categories
          const categoriesQuery = await db
            .select({
              id: categories.id,
              name: categories.name,
            })
            .from(courseCategories)
            .innerJoin(categories, eq(categories.id, courseCategories.categoryId))
            .where(eq(courseCategories.courseId, course.id));
          
          // Get lessons
          const courseLessons = await storage.getLessonsByCourseId(course.id);
          
          // Get completed lessons
          const userProgress = await storage.getUserProgress(req.user.id, course.id);
          const completedLessons = userProgress.filter(p => p.status === "completed");
          
          // Find the next lesson to continue (first incomplete lesson)
          const allLessonsIds = courseLessons.map(l => l.id);
          const completedLessonIds = completedLessons.map(p => p.lessonId);
          const incompleteLessonIds = allLessonsIds.filter(id => !completedLessonIds.includes(id));
          const currentLessonId = incompleteLessonIds.length > 0 ? incompleteLessonIds[0] : allLessonsIds[0];
          
          return {
            ...course,
            categories: categoriesQuery,
            lessonsCount: courseLessons.length,
            totalLessons: courseLessons.length,
            completedLessons: completedLessons.length,
            currentLessonId,
            progress: "progress" in course ? course.progress : 0,
          };
        })
      );
      
      res.json({
        inProgress: coursesWithDetails.filter(c => c.progress > 0 && c.progress < 100),
        recommended: recommended.map(r => {
          const withDetails = coursesWithDetails.find(c => c.id === r.id);
          return withDetails || r;
        }),
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/courses/:id", async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Get course categories
      const courseCategoriesQuery = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(courseCategories)
        .innerJoin(categories, eq(categories.id, courseCategories.categoryId))
        .where(eq(courseCategories.courseId, courseId));
      
      // Get course modules with lessons
      const courseModules = await storage.getModulesByCourseId(courseId);
      const modulesWithLessons = await Promise.all(
        courseModules.map(async (module) => {
          const moduleLessons = await storage.getLessonsByModuleId(module.id);
          
          // For authenticated users, mark completed lessons
          if (req.isAuthenticated()) {
            const userProgress = await storage.getUserProgress(req.user.id, courseId);
            const completedLessonIds = userProgress
              .filter(p => p.status === "completed")
              .map(p => p.lessonId);
            
            const lessonsWithStatus = moduleLessons.map(lesson => ({
              ...lesson,
              completed: completedLessonIds.includes(lesson.id),
            }));
            
            return {
              ...module,
              lessons: lessonsWithStatus,
            };
          }
          
          return {
            ...module,
            lessons: moduleLessons,
          };
        })
      );
      
      // Get course instructor
      const instructorQuery = await db
        .select()
        .from(instructors)
        .where(eq(instructors.id, course.instructorId))
        .limit(1);
      
      const instructor = instructorQuery.length > 0 ? instructorQuery[0] : null;
      
      // Get course reviews
      const reviews = await storage.getCourseReviews(courseId);
      
      // For authenticated users, check enrollment status and calculate progress
      let isEnrolled = false;
      let progress = 0;
      let completedLessons = 0;
      let firstLessonId = null;
      
      if (req.isAuthenticated()) {
        isEnrolled = await storage.isUserEnrolledInCourse(req.user.id, courseId);
        if (isEnrolled) {
          progress = await storage.calculateCourseProgress(req.user.id, courseId);
          
          // Get user progress for this course
          const userProgress = await storage.getUserProgress(req.user.id, courseId);
          completedLessons = userProgress.filter(p => p.status === "completed").length;
        }
      }
      
      // Get first lesson ID for "Start Course" button
      if (modulesWithLessons.length > 0 && 
          modulesWithLessons[0].lessons && 
          modulesWithLessons[0].lessons.length > 0) {
        firstLessonId = modulesWithLessons[0].lessons[0].id;
      }
      
      // Calculate counts
      const allLessons = modulesWithLessons.flatMap(m => m.lessons);
      const lessonsCount = allLessons.length;
      const videoLessons = allLessons.filter(l => l.type === "video");
      const videoDuration = allLessons
        .filter(l => l.type === "video" && l.duration)
        .reduce((total, lesson) => {
          // Convert "HH:MM:SS" to seconds
          const durationParts = (lesson.duration || "0:0:0").split(":");
          const hours = parseInt(durationParts[0]) || 0;
          const minutes = parseInt(durationParts[1]) || 0;
          const seconds = parseInt(durationParts[2]) || 0;
          return total + (hours * 3600 + minutes * 60 + seconds);
        }, 0);
      
      // Format video duration as hours
      const videoDurationHours = Math.round(videoDuration / 3600 * 10) / 10;
      
      const exercisesCount = allLessons.filter(l => l.type === "exercise").length;
      const resourcesCount = allLessons.filter(l => l.type === "resource" || l.type === "document").length;
      
      res.json({
        ...course,
        categories: courseCategoriesQuery,
        modules: modulesWithLessons,
        instructor,
        reviews,
        isEnrolled,
        progress,
        lessonsCount,
        completedLessons,
        totalLessons: lessonsCount,
        firstLessonId,
        videoDuration: `${videoDurationHours}`,
        exercisesCount,
        resourcesCount,
      });
    } catch (error) {
      next(error);
    }
  });

  // Lessons
  app.get("/api/lessons/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLessonById(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      // Get module to find course
      const moduleQuery = await db
        .select()
        .from(modules)
        .where(eq(modules.id, lesson.moduleId))
        .limit(1);
      
      if (moduleQuery.length === 0) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      const courseId = moduleQuery[0].courseId;
      
      // Check if user is enrolled in the course
      const isEnrolled = await storage.isUserEnrolledInCourse(req.user.id, courseId);
      if (!isEnrolled) {
        return res.status(403).json({ message: "You are not enrolled in this course" });
      }
      
      // Get all lessons for the course to find prev/next
      const allLessons = await storage.getLessonsByCourseId(courseId);
      
      // Find current lesson index
      const currentIndex = allLessons.findIndex(l => l.id === lessonId);
      if (currentIndex === -1) {
        return res.status(404).json({ message: "Lesson not found in course" });
      }
      
      // Find prev/next lesson IDs
      const prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1].id : null;
      const nextLessonId = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : null;
      
      // Check if lesson is completed by user
      const userProgress = await storage.getUserProgress(req.user.id, courseId);
      const completed = userProgress.some(
        p => p.lessonId === lessonId && p.status === "completed"
      );
      
      res.json({
        ...lesson,
        courseId,
        prevLessonId,
        nextLessonId,
        completed,
        order: currentIndex + 1,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/lessons/:id/complete", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLessonById(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      // Mark lesson as complete
      const progress = await storage.markLessonComplete(req.user.id, lessonId);
      
      res.status(200).json({ success: true, progress });
    } catch (error) {
      next(error);
    }
  });

  // Learning Paths
  app.get("/api/learning-paths", async (req, res, next) => {
    try {
      const paths = await storage.getLearningPaths();
      
      // Get additional data for each path
      const pathsWithDetails = await Promise.all(
        paths.map(async (path) => {
          // Get path courses
          const pathCoursesQuery = await db
            .select({
              courseId: pathCourses.courseId,
              order: pathCourses.order,
            })
            .from(pathCourses)
            .where(eq(pathCourses.pathId, path.id))
            .orderBy(asc(pathCourses.order));
          
          const courseIds = pathCoursesQuery.map(pc => pc.courseId);
          
          // Get categories for the path
          const pathCategoriesQuery = await db
            .select({
              id: categories.id,
              name: categories.name,
            })
            .from(categories)
            .innerJoin(courseCategories, eq(courseCategories.categoryId, categories.id))
            .where(inArray(courseCategories.courseId, courseIds))
            .groupBy(categories.id);
          
          // For authenticated users, calculate overall progress
          let progress = 0;
          let enrolled = false;
          let firstCourseId = courseIds.length > 0 ? courseIds[0] : null;
          
          if (req.isAuthenticated() && courseIds.length > 0) {
            // Check if enrolled in any course in the path
            const enrollments = await Promise.all(
              courseIds.map(courseId => 
                storage.isUserEnrolledInCourse(req.user.id, courseId)
              )
            );
            
            enrolled = enrollments.some(e => e);
            
            if (enrolled) {
              // Calculate average progress across all courses
              const coursesProgress = await Promise.all(
                courseIds.map(courseId => 
                  storage.calculateCourseProgress(req.user.id, courseId)
                )
              );
              
              progress = Math.round(
                coursesProgress.reduce((sum, p) => sum + p, 0) / courseIds.length
              );
            }
          }
          
          return {
            ...path,
            courseCount: courseIds.length,
            categories: pathCategoriesQuery,
            progress,
            enrolled,
            firstCourseId,
          };
        })
      );
      
      res.json(pathsWithDetails);
    } catch (error) {
      next(error);
    }
  });

  // Enrollments
  app.post("/api/enrollments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }
      
      // Check if course exists
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Enroll user
      const enrollment = await storage.enrollUserInCourse(req.user.id, courseId);
      
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Import necessary Drizzle ORM functions and models
import { db } from "@db";
import { 
  eq, and, desc, asc, 
  like, inArray
} from "drizzle-orm";
import { 
  categories,
  courseCategories,
  instructors,
  modules,
  progress,
  pathCourses
} from "@shared/schema";
