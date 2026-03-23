import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback,
  toggleFeedbackDone,
} from "../controllers/feedbackController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createFeedback);

router.get("/", protect, adminOnly, getAllFeedbacks);
router.delete("/:id", protect, adminOnly, deleteFeedback);
router.patch("/:id/done", protect, adminOnly, toggleFeedbackDone);

export default router;
