import express from "express";

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

router.put("/:id/status", updateBookingStatus);

router.delete("/:id", deleteBooking);

export default router;