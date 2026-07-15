import React, { useEffect, useState } from 'react';
import { getReviewsForUser, getLatestReviews, Review } from '../../pages/Services/ReviewService';

interface Props {
  userId?: string;
  isLatest?: boolean;
}

const ReviewList: React.FC<Props> = ({ userId, isLatest }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let data: any; // Using any temporarily to handle potential API response shapes
        if (isLatest) {
          data = await getLatestReviews();
        } else if (userId) {
          data = await getReviewsForUser(userId);
        }
        
        // Ensure we always set an array, even if API response is null/undefined
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviews([]); // Reset to empty array on failure
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [userId, isLatest]);

  if (loading) return <div>Loading reviews...</div>;
  
  // Safe check: Only render if we have an array and it has items
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <div className="text-slate-400">No reviews yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">
        {isLatest ? "Recent Reviews" : "User Reviews"}
      </h3>
      {reviews.map((review) => (
        <div key={review._id} className="border p-4 rounded shadow-sm bg-white">
          <h4 className="font-bold text-blue-600">
            {review.reviewerId?.fullName || "Anonymous"}
          </h4>
          <div className="text-yellow-500">{"★".repeat(review.rating || 0)}</div>
          <p className="text-gray-700">{review.comment}</p>
          <small className="text-gray-400">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;