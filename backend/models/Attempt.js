
import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true
        },

        selectedAnswer: {
          type: String,
          default: ""
        },

        isCorrect: {
          type: Boolean,
          default: false
        }
      }
    ],

    score: {
      type: Number,
      default: 0
    },

    totalMarks: {
      type: Number,
      required: true
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;
