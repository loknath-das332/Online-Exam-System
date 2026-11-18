
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    duration: {
      type: Number,
      required: true,
      min: 1
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
