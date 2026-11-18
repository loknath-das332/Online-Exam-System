import Question from "../models/Question.js";
import Exam from "../models/Exam.js";
import Attempt from "../models/Attempt.js";

export const addQuestion = async (req, res) => {
  try {
    const { exam, questionText, options, correctAnswer, marks } = req.body;

    if (!exam || !questionText || !options || !correctAnswer) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        message: "Exactly 4 options are required"
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        message: "Correct answer must match one of the options"
      });
    }

    const examExists = await Exam.findById(exam);

    if (!examExists) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    const question = await Question.create({
      exam,
      questionText,
      options,
      correctAnswer,
      marks: marks || 1
    });

    res.status(201).json({
      message: "Question added successfully",
      question
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add question",
      error: error.message
    });
  }
};
// Get Questions for a Specific Exam
// Get Questions for a Specific Exam
export const getQuestionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId)
      .select("title subject duration totalMarks status");

    if (!exam || exam.status !== "active") {
      return res.status(404).json({
        message: "Exam not found or inactive"
      });
    }

    const questions = await Question.find({ exam: examId })
      .select("-correctAnswer")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Questions fetched successfully",
      exam,
      questions
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch questions",
      error: error.message
    });
  }
};

// Submit Exam and Calculate Result
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user.id;

    if (!examId || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Exam ID and answers are required"
      });
    }

    // Check exam
    const exam = await Exam.findById(examId);

    if (!exam || exam.status !== "active") {
      return res.status(404).json({
        message: "Exam not found or inactive"
      });
    }

    // Prevent multiple submissions
    const existingAttempt = await Attempt.findOne({
      student: studentId,
      exam: examId
    });

    if (existingAttempt) {
      return res.status(400).json({
        message: "You have already submitted this exam"
      });
    }

    // Get correct answers from database
    const questions = await Question.find({ exam: examId });

    if (questions.length === 0) {
      return res.status(400).json({
        message: "No questions found"
      });
    }

    let score = 0;
    let totalMarks = 0;
    const checkedAnswers = [];

    for (const question of questions) {
      totalMarks += question.marks;

      const submittedAnswer = answers.find(
        (answer) =>
          answer.questionId === question._id.toString()
      );

      const selectedAnswer = submittedAnswer?.selectedAnswer || "";

      const isCorrect =
        selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.marks;
      }

      checkedAnswers.push({
        question: question._id,
        selectedAnswer,
        isCorrect
      });
    }

    // Save result
    const attempt = await Attempt.create({
      student: studentId,
      exam: examId,
      answers: checkedAnswers,
      score,
      totalMarks
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      result: {
        score,
        totalMarks,
        percentage:
          totalMarks > 0
            ? ((score / totalMarks) * 100).toFixed(2)
            : "0.00",
        submittedAt: attempt.submittedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit exam",
      error: error.message
    });
  }
};
