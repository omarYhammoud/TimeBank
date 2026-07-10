import express from "express";

import {
  getDashboardStats,
  getAllUsers,
  suspendUser,
  activateUser,
  getAllServices,
  getAllBookings,
  getAllReports,
} from "../controllers/adminController.js";

// Optional (recommended)
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// If you don't have authorize middleware yet,
// remove protect and authorize temporarily.

router.get(
  "/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.put(
  "/users/:id/suspend",
  protect,
  authorize("admin"),
  suspendUser
);

router.put(
  "/users/:id/activate",
  protect,
  authorize("admin"),
  activateUser
);

router.get(
  "/services",
  protect,
  authorize("admin"),
  getAllServices
);

router.get(
  "/bookings",
  protect,
  authorize("admin"),
  getAllBookings
);

router.get(
  "/reports",
  protect,
  authorize("admin"),
  getAllReports
);

export default router;