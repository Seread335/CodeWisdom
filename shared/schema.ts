import { pgTable, text, serial, integer, boolean, timestamp, json, unique, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stats: json("stats").$type<{
    totalLearningTime?: number;
    completedCourses?: number;
    completedLessons?: number;
    certificates?: number;
  }>(),
});

export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  reviews: many(reviews),
  userBadges: many(userBadges),
  userAchievements: many(userAchievements),
}));

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  courseCategories: many(courseCategories),
}));

// Instructors
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  email: text("email"),
  website: text("website"),
  courseCount: integer("course_count").default(0),
  studentCount: integer("student_count").default(0),
  reviewScore: integer("review_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const instructorsRelations = relations(instructors, ({ many }) => ({
  courses: many(courses),
}));

// Courses
export const courseLevelEnum = pgEnum("course_level", ["beginner", "intermediate", "advanced"]);

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  duration: text("duration"),
  price: integer("price").default(0),
  originalPrice: integer("original_price"),
  enrollmentCount: integer("enrollment_count").default(0),
  instructorId: integer("instructor_id").references(() => instructors.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coursesRelations = relations(courses, ({ many, one }) => ({
  modules: many(modules),
  courseCategories: many(courseCategories),
  enrollments: many(enrollments),
  reviews: many(reviews),
  instructor: one(instructors, {
    fields: [courses.instructorId],
    references: [instructors.id],
  }),
}));

// Course Categories (many-to-many relationship)
export const courseCategories = pgTable("course_categories", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    unq: unique().on(table.courseId, table.categoryId),
  };
});

export const courseCategoriesRelations = relations(courseCategories, ({ one }) => ({
  course: one(courses, {
    fields: [courseCategories.courseId],
    references: [courses.id],
  }),
  category: one(categories, {
    fields: [courseCategories.categoryId],
    references: [categories.id],
  }),
}));

// Modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

// Lessons
export const lessonTypeEnum = pgEnum("lesson_type", ["video", "text", "quiz", "exercise", "resource", "document"]);

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["video", "text", "quiz", "exercise", "resource", "document"] }).notNull(),
  content: json("content").$type<{
    sections: Array<{
      type: string;
      content: string;
      language?: string;
      title?: string;
      items?: string[];
    }>;
  }>(),
  videoUrl: text("video_url"),
  duration: text("duration"),
  order: integer("order").notNull(),
  isPreview: boolean("is_preview").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  progress: many(progress),
}));

// Learning Paths
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  duration: text("duration"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
  pathCourses: many(pathCourses),
}));

// Path Courses (many-to-many relationship)
export const pathCourses = pgTable("path_courses", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull().references(() => learningPaths.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").default(0),
}, (table) => {
  return {
    unq: unique().on(table.pathId, table.courseId),
  };
});

export const pathCoursesRelations = relations(pathCourses, ({ one }) => ({
  path: one(learningPaths, {
    fields: [pathCourses.pathId],
    references: [learningPaths.id],
  }),
  course: one(courses, {
    fields: [pathCourses.courseId],
    references: [courses.id],
  }),
}));

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  status: text("status").default("active"),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.courseId),
  };
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// Progress
export const progressStatusEnum = pgEnum("progress_status", ["started", "in_progress", "completed"]);

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["started", "in_progress", "completed"] }).default("completed"),
  completedAt: timestamp("completed_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.lessonId),
  };
});

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [progress.courseId],
    references: [courses.id],
  }),
  lesson: one(lessons, {
    fields: [progress.lessonId],
    references: [lessons.id],
  }),
}));

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  content: text("content"),
  userName: text("user_name"),
  date: text("date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.courseId),
  };
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [reviews.courseId],
    references: [courses.id],
  }),
}));

// Zod schemas for validation

// Users
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: (schema) => schema.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const selectUserSchema = createSelectSchema(users);

// Categories
export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
});

export const selectCategorySchema = createSelectSchema(categories);

// Instructors
export const insertInstructorSchema = createInsertSchema(instructors, {
  name: (schema) => schema.min(2, "Tên giảng viên phải có ít nhất 2 ký tự"),
});

export const selectInstructorSchema = createSelectSchema(instructors);

// Courses
export const insertCourseSchema = createInsertSchema(courses, {
  title: (schema) => schema.min(5, "Tiêu đề khóa học phải có ít nhất 5 ký tự"),
  description: (schema) => schema.min(10, "Mô tả khóa học phải có ít nhất 10 ký tự"),
  level: (schema) => schema.refine(
    (val: string) => ["beginner", "intermediate", "advanced"].includes(val),
    "Cấp độ khóa học không hợp lệ"
  ),
});

export const selectCourseSchema = createSelectSchema(courses);

// Modules
export const insertModuleSchema = createInsertSchema(modules, {
  title: (schema) => schema.min(3, "Tiêu đề chương phải có ít nhất 3 ký tự"),
});

export const selectModuleSchema = createSelectSchema(modules);

// Lessons
export const insertLessonSchema = createInsertSchema(lessons, {
  title: (schema) => schema.min(3, "Tiêu đề bài học phải có ít nhất 3 ký tự"),
  type: (schema) => schema.refine(
    (val: string) => ["video", "text", "quiz", "exercise", "resource", "document"].includes(val),
    "Loại bài học không hợp lệ"
  ),
});

export const selectLessonSchema = createSelectSchema(lessons);

// Learning Paths
export const insertLearningPathSchema = createInsertSchema(learningPaths, {
  title: (schema) => schema.min(5, "Tiêu đề lộ trình học phải có ít nhất 5 ký tự"),
  description: (schema) => schema.min(10, "Mô tả lộ trình học phải có ít nhất 10 ký tự"),
});

export const selectLearningPathSchema = createSelectSchema(learningPaths);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Instructor = typeof instructors.$inferSelect;
export type InsertInstructor = z.infer<typeof insertInstructorSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CourseCategory = typeof courseCategories.$inferSelect;
export type InsertCourseCategory = typeof courseCategories.$inferInsert;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type PathCourse = typeof pathCourses.$inferSelect;
export type InsertPathCourse = typeof pathCourses.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = typeof progress.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Badges System
export const badgeTypeEnum = pgEnum("badge_type", ["course", "achievement", "streak", "special"]);

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type", { enum: ["course", "achievement", "streak", "special"] }).notNull(),
  requiredPoints: integer("required_points").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
  achievements: many(achievements),
}));

// User Badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: integer("badge_id").notNull().references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.badgeId),
  };
});

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

// Achievements
export const achievementTypeEnum = pgEnum("achievement_type", ["login_streak", "course_completion", "perfect_quiz", "community_contribution"]);

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["login_streak", "course_completion", "perfect_quiz", "community_contribution"] }).notNull(),
  requiredCount: integer("required_count").default(1).notNull(),
  points: integer("points").default(0).notNull(),
  badgeId: integer("badge_id").references(() => badges.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const achievementsRelations = relations(achievements, ({ many, one }) => ({
  userAchievements: many(userAchievements),
  badge: one(badges, {
    fields: [achievements.badgeId],
    references: [badges.id],
  }),
}));

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  progress: integer("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.achievementId),
  };
});

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// Insert and Select schemas for Badges and Achievements
export const insertBadgeSchema = createInsertSchema(badges, {
  name: (schema) => schema.min(2, "Tên huy hiệu phải có ít nhất 2 ký tự"),
  description: (schema) => schema.min(5, "Mô tả huy hiệu phải có ít nhất 5 ký tự"),
});

export const selectBadgeSchema = createSelectSchema(badges);

export const insertAchievementSchema = createInsertSchema(achievements, {
  name: (schema) => schema.min(2, "Tên thành tích phải có ít nhất 2 ký tự"),
  description: (schema) => schema.min(5, "Mô tả thành tích phải có ít nhất 5 ký tự"),
});

export const selectAchievementSchema = createSelectSchema(achievements);

// Types for Badges and Achievements
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
