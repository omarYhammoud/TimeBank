import { Link } from "react-router-dom";
import React, { useState } from "react";
import { postReview } from "./Services/ReviewService";

const LeaveReviewPage: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token") || ""; 

      // Send the feedback as a general platform review
      await postReview({ 
        reviewedUserId: "000000000000000000000000", 
        rating, 
        comment 
      }, token);
      
      setSubmitted(true);
    } catch (error) {
      alert("Failed to submit review.");
    }
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-sm w-full">
          <div className="text-4xl mb-3"></div>
          <h2 className="text-xl font-bold mb-2">Feedback Received!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Thank you for sharing your experience. Your feedback helps us improve the platform.🤍
          </p>
          <Link
            to="/" 
            className="px-4 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">PLATFORM FEEDBACK</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share your experience to help us improve the platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl transition-transform focus:outline-none hover:scale-110"
              >
                {star <= (hoveredRating || rating) ? "★" : "☆"}
              </button>
            ))}
            <span className="text-xs text-gray-400 ml-2 font-medium">
              {rating > 0 ? `${rating} of 5 stars selected` : "Select a rating"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Your Experience
          </label>
          <textarea
            rows={4}
            placeholder="Tell us what you think..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 text-sm font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default LeaveReviewPage;