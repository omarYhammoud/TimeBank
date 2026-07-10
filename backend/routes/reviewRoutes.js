import express from "express";

import {
  createReview,
  getReviewsForUser,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);

router.get("/:userId", getReviewsForUser);

router.delete("/:id", deleteReview);

export default router;