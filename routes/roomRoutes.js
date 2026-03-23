import express from "express";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateStatus,
} from "../controllers/roomController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);

router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);
router.patch("/:id/status", protect, adminOnly, updateStatus);

export default router;
