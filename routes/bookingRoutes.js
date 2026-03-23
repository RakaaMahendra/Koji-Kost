import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, updateBookingStatus);
router.delete("/:id", protect, adminOnly, deleteBooking);

export default router;
