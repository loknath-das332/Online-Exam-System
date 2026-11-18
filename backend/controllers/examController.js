
import Exam from "../models/Exam.js";

export const createExam = async (req, res) => {
  try {
    const { title, subject, description, duration, totalMarks } = req.body;

    if (!title || !subject || !duration || !totalMarks) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const exam = await Exam.create({
      title,
      subject,
      description,
      duration,
      totalMarks,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam
    });

  } catch (error) {
    res.status(500).json({
      message: "Exam creation failed",
      error: error.message
    });
  }
};
export const getExams = async (req, res) => {
    try {
      const exams = await Exam.find()
        .populate("createdBy", "fullName")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        exams
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch exams",
        error: error.message
      });
    }
  };
  // Get Available Exams for Students
export const getAvailableExams = async (req, res) => {
  try {
    const exams = await Exam.find({ status: "active" })
      .select("title subject description duration totalMarks createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Available exams fetched successfully",
      exams
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch available exams",
      error: error.message
    });
  }
};