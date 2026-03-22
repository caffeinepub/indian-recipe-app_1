import { useState } from "react";

export interface Review {
  recipeId: number;
  rating: number;
  comment: string;
  timestamp: number;
}

const STORAGE_KEY = "rasoi_reviews";

function loadReviews(): Review[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function getAvgRating(
  recipeId: number,
): { avg: number; count: number } | null {
  const all = loadReviews().filter((r) => r.recipeId === recipeId);
  if (all.length === 0) return null;
  const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
  return { avg, count: all.length };
}

export function useReviews(recipeId: number) {
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadReviews().filter((r) => r.recipeId === recipeId),
  );

  const addReview = (rating: number, comment: string) => {
    const all = loadReviews();
    const newReview: Review = {
      recipeId,
      rating,
      comment: comment.trim(),
      timestamp: Date.now(),
    };
    const updated = [...all, newReview];
    saveReviews(updated);
    setReviews(updated.filter((r) => r.recipeId === recipeId));
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return { reviews, addReview, avgRating, count: reviews.length };
}
