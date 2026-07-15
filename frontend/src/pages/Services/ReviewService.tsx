import axios from 'axios';

// Define the shape of a Review for TypeScript
export interface Review {
  _id: string;
  reviewerId: { fullName: string };
  rating: number;
  comment: string;
  createdAt: string;
}

// Ensure this matches your backend proxy or base URL configuration

const API_URL = 'http://localhost:3000/api/reviews/';
// Fetch reviews for a specific user (the person being reviewed)
export const getReviewsForUser = async (userId: string): Promise<Review[]> => {
  const response = await axios.get(`${API_URL}${userId}`);
  return response.data;
};

// Fetch the latest reviews from the whole site
export const getLatestReviews = async (): Promise<Review[]> => {
  const response = await axios.get(`${API_URL}latest`);
  return response.data;
};

// Post a new review
export const postReview = async (reviewData: { reviewedUserId: string, rating: number, comment: string }, token: string) => {
  const config = { 
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    } 
  };
  return await axios.post(API_URL, reviewData, config);
};