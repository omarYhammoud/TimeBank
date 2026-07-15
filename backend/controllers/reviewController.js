import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  try {
    const { reviewedUserId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    // We check for the dummy ID we are now sending
    const isPlatform = reviewedUserId === "000000000000000000000000";

    const review = await Review.create({
      reviewerId,
      reviewedUserId, // Save the dummy ID
      rating,
      comment,
    });

    // Only update User rating if it is NOT the platform dummy ID
    if (!isPlatform) {
      const reviews = await Review.find({ reviewedUserId });
      const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

      await User.findByIdAndUpdate(reviewedUserId, {
        "profile.ratingAverage": average,
      });
    }

    res.status(201).json(review);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// getReviewsForUser, deleteReview, and getLatestReviews remain the same...
export const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUserId: req.params.userId })
      .populate("reviewerId", "fullName")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.reviewerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewerId", "fullName")
      .sort({ createdAt: -1 })
      .limit(5); 

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};