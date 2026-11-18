
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);

app.get("/", (req, res) => {
  res.send("Online Exam System Backend is Running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
