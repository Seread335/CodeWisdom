import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertSubscriptionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validationResult = insertSubscriptionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      
      const subscription = await storage.createSubscription(validationResult.data);
      res.status(201).json({ message: "Subscription successful", data: subscription });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  // API route for contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      
      const message = await storage.createContactMessage(validationResult.data);
      res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  // API route for getting all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  // API route for getting courses by category
  app.get("/api/courses/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const courses = await storage.getCoursesByCategory(category);
      res.json(courses);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  // API route for getting all roadmaps
  app.get("/api/roadmaps", async (req, res) => {
    try {
      const roadmaps = await storage.getAllRoadmaps();
      res.json(roadmaps);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  // API route for getting roadmaps by category
  app.get("/api/roadmaps/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const roadmaps = await storage.getRoadmapsByCategory(category);
      res.json(roadmaps);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
