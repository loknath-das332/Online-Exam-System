
import express from "express";

import {
  getMyResults,
  getAllResults
} from "../controllers/attemptController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-results", protect, getMyResults);

router.get("/all-results", protect, adminOnly, getAllResults);

export default router;
