import { db } from "@db";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { 
  eq, and, desc, asc, like,
  isNull, isNotNull, inArray,
  sql,
} from "drizzle-orm";
import { 
  users, User, InsertUser,
  courses, Course, InsertCourse,
  lessons, Lesson, InsertLesson,
  modules, Module, InsertModule,
  categories, Category, InsertCategory,
  courseCategories, CourseCategory, InsertCourseCategory,
  instructors, Instructor, InsertInstructor,
  learningPaths, LearningPath, InsertLearningPath,
  pathCourses, PathCourse, InsertPathCourse,
  enrollments, Enrollment, InsertEnrollment,
  progress, Progress, InsertProgress,
  reviews, Review, InsertReview
} from "@shared/schema";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Courses
  getCourses(options?: {
    categoryId?: number;
    level?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }): Promise<Course[]>;
  getCourseById(courseId: number): Promise<Course | undefined>;
  getCoursesWithProgress(userId: number): Promise<(Course & { progress: number })[]>;
  getRecommendedCourses(userId: number, limit?: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Modules
  getModulesByCourseId(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;

  // Lessons
  getLessonById(lessonId: number): Promise<Lesson | undefined>;
  getLessonsByCourseId(courseId: number): Promise<Lesson[]>;
  getLessonsByModuleId(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson | undefined>;

  // Learning Paths
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPathById(pathId: number): Promise<LearningPath | undefined>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;

  // Enrollments
  enrollUserInCourse(userId: number, courseId: number): Promise<Enrollment>;
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  isUserEnrolledInCourse(userId: number, courseId: number): Promise<boolean>;

  // Progress tracking
  markLessonComplete(userId: number, lessonId: number): Promise<Progress>;
  getUserProgress(userId: number, courseId?: number): Promise<Progress[]>;
  calculateCourseProgress(userId: number, courseId: number): Promise<number>;

  // Reviews
  getCourseReviews(courseId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Badges
  getBadges(): Promise<Badge[]>;
  getBadgeById(badgeId: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]>;
  awardBadgeToUser(userId: number, badgeId: number): Promise<UserBadge>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getAchievementById(achievementId: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<(Achievement & { progress: number; completed: boolean; completedAt?: Date })[]>;
  updateUserAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement>;
  
  // Session store
  sessionStore: any; // Use any for session store
}

class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session' 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Categories methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Courses methods
  async getCourses(options: {
    categoryId?: number;
    level?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Course[]> {
    let query = db.select().from(courses);

    // Apply filters
    const conditions = [];
    
    if (options.categoryId && options.categoryId !== 0) {
      const courseIdsQuery = db.select({ courseId: courseCategories.courseId })
        .from(courseCategories)
        .where(eq(courseCategories.categoryId, options.categoryId));
      
      const courseIds = await courseIdsQuery;
      if (courseIds.length > 0) {
        conditions.push(inArray(courses.id, courseIds.map(c => c.courseId)));
      } else {
        // If no courses match the category, return empty array
        return [];
      }
    }

    if (options.level && options.level !== 'all') {
      conditions.push(eq(courses.level, options.level));
    }

    if (options.searchQuery) {
      conditions.push(
        like(courses.title, `%${options.searchQuery}%`)
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.offset(options.offset);
    }

    query = query.orderBy(desc(courses.createdAt));

    return await query;
  }

  async getCourseById(courseId: number): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    return result[0];
  }

  async getCoursesWithProgress(userId: number): Promise<(Course & { progress: number })[]> {
    // Get all courses the user is enrolled in
    const enrolledCourses = await db
      .select({
        courseId: enrollments.courseId
      })
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    if (enrolledCourses.length === 0) {
      return [];
    }

    const courseIds = enrolledCourses.map(e => e.courseId);
    
    // Get all courses data
    const coursesData = await db
      .select()
      .from(courses)
      .where(inArray(courses.id, courseIds));

    // For each course, calculate progress
    const coursesWithProgress = await Promise.all(
      coursesData.map(async (course) => {
        const progress = await this.calculateCourseProgress(userId, course.id);
        return { ...course, progress };
      })
    );

    return coursesWithProgress;
  }

  async getRecommendedCourses(userId: number, limit: number = 8): Promise<Course[]> {
    // In a real implementation, this would contain recommendation logic
    // For now, just return courses the user hasn't enrolled in yet
    
    // Get all courses the user is already enrolled in
    const enrolledCourses = await db
      .select({
        courseId: enrollments.courseId
      })
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    const enrolledCourseIds = enrolledCourses.map(e => e.courseId);
    
    // Get courses the user is not enrolled in
    let query = db.select().from(courses);
    
    if (enrolledCourseIds.length > 0) {
      // Sử dụng NOT IN condition
      query = query.where(
        and(
          isNotNull(courses.id),
          sql`${courses.id} NOT IN (${enrolledCourseIds.join(',')})`
        )
      );
    } else {
      // Nếu không có khóa học đã đăng ký, chỉ cần lấy tất cả khóa học
      query = query.where(isNotNull(courses.id));
    }
    
    query = query.limit(limit).orderBy(desc(courses.createdAt));
    
    return await query;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined> {
    const result = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return result[0];
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id)).returning({ id: courses.id });
    return result.length > 0;
  }

  // Modules methods
  async getModulesByCourseId(courseId: number): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.order));
  }

  async createModule(module: InsertModule): Promise<Module> {
    const result = await db.insert(modules).values(module).returning();
    return result[0];
  }

  // Lessons methods
  async getLessonById(lessonId: number): Promise<Lesson | undefined> {
    const result = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    return result[0];
  }

  async getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
    const courseModules = await this.getModulesByCourseId(courseId);
    if (courseModules.length === 0) return [];

    const moduleIds = courseModules.map(m => m.id);
    
    return await db
      .select()
      .from(lessons)
      .where(inArray(lessons.moduleId, moduleIds))
      .orderBy(asc(lessons.moduleId), asc(lessons.order));
  }

  async getLessonsByModuleId(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(asc(lessons.order));
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const result = await db.insert(lessons).values(lesson).returning();
    return result[0];
  }

  async updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson | undefined> {
    const result = await db.update(lessons).set(updates).where(eq(lessons.id, id)).returning();
    return result[0];
  }

  // Learning Paths methods
  async getLearningPaths(): Promise<LearningPath[]> {
    return await db.select().from(learningPaths).orderBy(asc(learningPaths.order));
  }

  async getLearningPathById(pathId: number): Promise<LearningPath | undefined> {
    const result = await db.select().from(learningPaths).where(eq(learningPaths.id, pathId)).limit(1);
    return result[0];
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const result = await db.insert(learningPaths).values(path).returning();
    return result[0];
  }

  // Enrollments methods
  async enrollUserInCourse(userId: number, courseId: number): Promise<Enrollment> {
    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, courseId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const result = await db
      .insert(enrollments)
      .values({
        userId,
        courseId,
        enrolledAt: new Date()
      })
      .returning();

    return result[0];
  }

  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async isUserEnrolledInCourse(userId: number, courseId: number): Promise<boolean> {
    try {
      const result = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, userId),
            eq(enrollments.courseId, courseId)
          )
        );

      return result && result.length > 0;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  }

  // Progress tracking methods
  async markLessonComplete(userId: number, lessonId: number): Promise<Progress> {
    // Get the lesson to find its course
    const lessonData = await this.getLessonById(lessonId);
    if (!lessonData) {
      throw new Error("Lesson not found");
    }

    // Get the module to find its course
    const moduleData = await db
      .select()
      .from(modules)
      .where(eq(modules.id, lessonData.moduleId))
      .limit(1);
      
    if (moduleData.length === 0) {
      throw new Error("Module not found");
    }

    const courseId = moduleData[0].courseId;

    // Check if progress already exists
    const existing = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new progress record
    const result = await db
      .insert(progress)
      .values({
        userId,
        lessonId,
        courseId,
        completedAt: new Date(),
        status: "completed"
      })
      .returning();

    return result[0];
  }

  async getUserProgress(userId: number, courseId?: number): Promise<Progress[]> {
    let query = db.select().from(progress).where(eq(progress.userId, userId));
    
    if (courseId) {
      query = query.where(eq(progress.courseId, courseId));
    }
    
    return await query.orderBy(desc(progress.completedAt));
  }

  async calculateCourseProgress(userId: number, courseId: number): Promise<number> {
    // Get total number of lessons for the course
    const allLessons = await this.getLessonsByCourseId(courseId);
    if (allLessons.length === 0) return 0;

    // Get completed lessons for this user and course
    const completedLessons = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.courseId, courseId),
          eq(progress.status, "completed")
        )
      );

    // Calculate percentage
    return Math.round((completedLessons.length / allLessons.length) * 100);
  }

  // Reviews methods
  async getCourseReviews(courseId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  // Badges methods
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges).orderBy(asc(badges.name));
  }

  async getBadgeById(badgeId: number): Promise<Badge | undefined> {
    const result = await db.select().from(badges).where(eq(badges.id, badgeId)).limit(1);
    return result[0];
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const result = await db.insert(badges).values(badge).returning();
    return result[0];
  }

  async getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]> {
    const userBadgesResult = await db
      .select()
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));

    return userBadgesResult.map((row) => ({
      ...row.badges,
      earnedAt: row.user_badges.earnedAt,
    }));
  }

  async awardBadgeToUser(userId: number, badgeId: number): Promise<UserBadge> {
    // Check if user already has this badge
    const existing = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badgeId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Award the badge
    const result = await db
      .insert(userBadges)
      .values({
        userId,
        badgeId,
        earnedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  // Achievements methods
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(asc(achievements.name));
  }

  async getAchievementById(achievementId: number): Promise<Achievement | undefined> {
    const result = await db.select().from(achievements).where(eq(achievements.id, achievementId)).limit(1);
    return result[0];
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  async getUserAchievements(userId: number): Promise<(Achievement & { progress: number; completed: boolean; completedAt?: Date })[]> {
    // Get user achievements
    const userAchievementsResult = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    if (userAchievementsResult.length === 0) {
      // If user has no achievements yet, return all achievements with progress=0
      const allAchievements = await this.getAchievements();
      return allAchievements.map(achievement => ({
        ...achievement,
        progress: 0,
        completed: false,
      }));
    }

    // Get all achievement details
    const achievementsMap = new Map<number, Achievement>();
    const achievements = await db.select().from(achievements);
    achievements.forEach(achievement => {
      achievementsMap.set(achievement.id, achievement);
    });

    // Combine with user progress
    return userAchievementsResult.map(userAchievement => {
      const achievement = achievementsMap.get(userAchievement.achievementId);
      if (!achievement) {
        throw new Error(`Achievement with id ${userAchievement.achievementId} not found`);
      }

      return {
        ...achievement,
        progress: userAchievement.progress,
        completed: userAchievement.completed,
        completedAt: userAchievement.completedAt,
      };
    });
  }

  async updateUserAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement> {
    // Get the achievement to check if the progress completes it
    const achievement = await this.getAchievementById(achievementId);
    if (!achievement) {
      throw new Error(`Achievement with id ${achievementId} not found`);
    }

    // Check if user already has a record for this achievement
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      )
      .limit(1);

    // Determine if the achievement is completed with this progress update
    const completed = progress >= achievement.requiredCount;
    const now = new Date();
    
    if (existing.length > 0) {
      // Update existing record
      const existingRecord = existing[0];
      
      // Only mark as completed if it wasn't already completed
      const completedNow = !existingRecord.completed && completed;
      const completedAt = completedNow ? now : existingRecord.completedAt;

      const result = await db
        .update(userAchievements)
        .set({
          progress,
          completed,
          completedAt,
          updatedAt: now,
        })
        .where(eq(userAchievements.id, existingRecord.id))
        .returning();
      
      // If this progress update completed the achievement and it has an associated badge, award it
      if (completedNow && achievement.badgeId) {
        await this.awardBadgeToUser(userId, achievement.badgeId);
      }
      
      return result[0];
    } else {
      // Create new record
      const result = await db
        .insert(userAchievements)
        .values({
          userId,
          achievementId,
          progress,
          completed,
          completedAt: completed ? now : null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      
      // If this progress update completed the achievement and it has an associated badge, award it
      if (completed && achievement.badgeId) {
        await this.awardBadgeToUser(userId, achievement.badgeId);
      }
      
      return result[0];
    }
  }
}

export const storage: IStorage = new DatabaseStorage();
