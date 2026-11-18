
import express from "express";

import {
  addQuestion,
  getQuestionsByExam,
  submitExam
} from "../controllers/questionController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: Add Question
router.post("/", protect, adminOnly, addQuestion);

// Student: Submit Exam
router.post("/submit", protect, submitExam);

// Student: Get Questions for an Exam
router.get("/:examId", protect, getQuestionsByExam);

export default router;
