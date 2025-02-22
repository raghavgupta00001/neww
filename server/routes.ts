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

    const parsed = insertAssignmentSchema.safeParse({
      ...req.body,
      teacherId: req.user.id
    });

    if (!parsed.success) {
      console.log("Validation error:", parsed.error);
      return res.status(400).json(parsed.error);
    }

    const assignment = await storage.createAssignment(parsed.data);
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

    try {
      console.log("Submission request body:", {
        ...req.body,
        fileContent: req.body.fileContent ? 'present' : 'missing'
      });

      const submissionData = {
        ...req.body,
        studentId: req.user.id,
        submitDate: new Date(),
      };

      const parsed = insertSubmissionSchema.safeParse(submissionData);

      if (!parsed.success) {
        console.log("Validation error:", parsed.error);
        return res.status(400).json(parsed.error);
      }

      // Check for plagiarism
      const { aiScore, plagiarismScore } = await checkPlagiarism(parsed.data.fileContent);

      const submission = await storage.createSubmission({
        ...parsed.data,
        aiScore,
        plagiarismScore,
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ message: "Failed to process submission" });
    }
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

  app.post("/api/analyze", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();

    try {
      const { text } = req.body;
      const { aiScore, plagiarismScore } = await checkPlagiarism(text);
      res.json({ aiScore, plagiarismScore });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to analyze text" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}