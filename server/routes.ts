import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { checkPlagiarism } from "./openai";
import { insertAssignmentSchema, insertSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Assignments
  app.post("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isTeacher) {
      return res.status(403).send("Only teachers can create assignments");
    }

    const parsed = insertAssignmentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const assignment = await storage.createAssignment({
      ...parsed.data,
      teacherId: req.user.id,
    });
    res.status(201).json(assignment);
  });

  app.get("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    
    const assignments = req.user.isTeacher 
      ? await storage.getAssignmentsByTeacher(req.user.id)
      : await storage.getAssignments();
    
    res.json(assignments);
  });

  // Submissions
  app.post("/api/submissions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();

    const parsed = insertSubmissionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    // Check for plagiarism
    const { aiScore, plagiarismScore } = await checkPlagiarism(parsed.data.fileContent);

    const submission = await storage.createSubmission({
      ...parsed.data,
      studentId: req.user.id,
      submitDate: new Date(),
      aiScore,
      plagiarismScore,
    });

    res.status(201).json(submission);
  });

  app.get("/api/submissions/assignment/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isTeacher) {
      return res.status(403).send("Only teachers can view all submissions");
    }

    const submissions = await storage.getSubmissionsByAssignment(
      parseInt(req.params.id)
    );
    res.json(submissions);
  });

  app.get("/api/submissions/student", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();

    const submissions = await storage.getSubmissionsByStudent(req.user.id);
    res.json(submissions);
  });

  const httpServer = createServer(app);
  return httpServer;
}
