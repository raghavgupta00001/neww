import { User, Assignment, Submission, InsertUser, InsertAssignment, InsertSubmission } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignments(): Promise<Assignment[]>;
  getAssignmentsByTeacher(teacherId: number): Promise<Assignment[]>;

  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: number): Promise<Submission[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assignments: Map<number, Assignment>;
  private submissions: Map<number, Submission>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      isTeacher: insertUser.isTeacher ?? false 
    };
    this.users.set(id, user);
    return user;
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = this.currentId++;
    const assignment: Assignment = { ...insertAssignment, id };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async getAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async getAssignmentsByTeacher(teacherId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.teacherId === teacherId
    );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentId++;
    const submission: Submission = {
      ...insertSubmission,
      id,
      aiScore: insertSubmission.aiScore ?? null,
      plagiarismScore: insertSubmission.plagiarismScore ?? null
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.assignmentId === assignmentId
    );
  }

  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.studentId === studentId
    );
  }
}

export const storage = new MemStorage();