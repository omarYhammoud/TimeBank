import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  try {

    const {
      bookingId,
      reviewerId,
      rating,
      comment,
    } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Reviews can only be submitted after a completed booking.",
      });
    }

    const alreadyReviewed = await Review.findOne({
      bookingId,
      reviewerId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this booking.",
      });
    }

    const reviewedUserId =
      booking.providerId.toString() === reviewerId
        ? booking.requesterId
        : booking.providerId;

    const review = await Review.create({
      bookingId,
      reviewerId,
      reviewedUserId,
      rating,
      comment,
    });

    const reviews = await Review.find({
      reviewedUserId,
    });

    const average =
      reviews.reduce((sum, item) => sum + item.rating, 0) /
      reviews.length;

    await User.findByIdAndUpdate(reviewedUserId, {
      "profile.ratingAverage": average,
    });

    res.status(201).json(review);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getReviewsForUser = async (req, res) => {

  try {

    const reviews = await Review.find({
      reviewedUserId: req.params.userId,
    })
      .populate("reviewerId", "fullName")
      .sort({
        createdAt: -1,
      });

    res.json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const deleteReview = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {

      return res.status(404).json({
        message: "Review not found",
      });

    }

    await review.deleteOne();

    res.json({
      message: "Review deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};