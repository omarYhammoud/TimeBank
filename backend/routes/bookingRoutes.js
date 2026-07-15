import express from "express";
// Import the middleware
import { protect, checkBookingOwnership } from "../middleware/authMiddleware.js";

import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookings);

router.get("/:id", getBookingById);

router.post("/", createBooking);

// Added protect and checkBookingOwnership middleware to the status update route
router.put("/:id/status", protect, checkBookingOwnership, updateBookingStatus);

router.delete("/:id", deleteBooking);

export default router;