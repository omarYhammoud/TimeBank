import React, { useState } from "react";

const LeaveReviewPage: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Mock data of the service being reviewed
  const serviceDetails = {
    title: "React Portfolio Debugging",
    provider: "Alex Rivera",
    date: "July 6, 2026",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }
    // Form action handling logic goes here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-sm w-full">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold mb-2">Review Submitted!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Thank you for sharing your feedback. Your review has been saved and credited to {serviceDetails.provider}'s profile.
          </p>
          <button
            onClick={() => { setSubmitted(false); setRating(0); setComment(""); }}
            className="px-4 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Return to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">LEAVE A REVIEW</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share your experience to help maintain high skill-sharing standards across the network.
        </p>
      </div>

      {/* 📋 Context Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm mb-6">
        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          Completed Exchange
        </span>
        <h3 className="font-bold text-base mt-3 mb-1">{serviceDetails.title}</h3>
        <p className="text-xs text-gray-400">Provided by {serviceDetails.provider} • Completed on {serviceDetails.date}</p>
      </div>

      {/* ⭐ Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col gap-6">
        
        {/* Star Selection Block */}
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

        {/* Comment Box Block */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Feedback Comments
          </label>
          <textarea
            rows={4}
            placeholder="Describe your learning experience, what went well, or areas of improvement..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-gray-400"
            required
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-3 text-sm font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
        >
          Submit Review
        </button>
      </form>

    </div>
  );
};

export default LeaveReviewPage;