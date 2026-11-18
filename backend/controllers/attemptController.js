
import Attempt from "../models/Attempt.js";

// Get logged-in student's exam results
export const getMyResults = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attempts = await Attempt.find({
      student: studentId
    })
      .populate("exam", "title subject totalMarks duration")
      .select("-answers")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      message: "Results fetched successfully",
      results: attempts
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch results",
      error: error.message
    });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const results = await Attempt.find()
      .populate("student", "fullName email studentId")
      .populate("exam", "title subject totalMarks")
      .select("-answers")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      message: "All results fetched successfully",
      totalResults: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all results",
      error: error.message
    });
  }
};
