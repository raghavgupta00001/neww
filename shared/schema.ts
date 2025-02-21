import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isTeacher: boolean("is_teacher").notNull().default(false),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  teacherId: integer("teacher_id").notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentId: integer("student_id").notNull(),
  fileContent: text("file_content").notNull(),
  fileName: text("file_name").notNull(),
  submitDate: timestamp("submit_date").notNull(),
  aiScore: integer("ai_score"),
  plagiarismScore: integer("plagiarism_score"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertSubmissionSchema = createInsertSchema(submissions);

export type User = typeof users.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
