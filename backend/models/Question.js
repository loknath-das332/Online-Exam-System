import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },
    questionText: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => options.length === 4,
        message: "Exactly 4 options are required"
      }
    },
    correctAnswer: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;