import express from "express";

import {
  createExam,
  getExams,
  getAvailableExams
} from "../controllers/examController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: Create Exam
router.post("/", protect, adminOnly, createExam);

// Admin: Get All Exams
router.get("/", protect, adminOnly, getExams);

// Student: Get Available Exams
router.get("/available", protect, getAvailableExams);

export default router;