import express from "express";
// 1. Import the protect middleware
import { protect } from "../middleware/authMiddleware.js"; 
import {
  createReview,
  getReviewsForUser,
  deleteReview,
  getLatestReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// 2. Add 'protect' to these routes so only logged-in users can perform these actions
router.post("/", protect, createReview);

// Public route: Everyone can see reviews without logging in
router.get("/latest", getLatestReviews);
router.get("/:userId", getReviewsForUser);

// 3. Add 'protect' here so only the owner can delete their review
router.delete("/:id", protect, deleteReview);

export default router;