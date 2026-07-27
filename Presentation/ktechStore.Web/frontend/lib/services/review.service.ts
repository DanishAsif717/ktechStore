import reviewsData from "@/data/reviews.json";
import type { Review } from "@/types";

const reviews: Review[] = reviewsData as Review[];

export async function fetchReviewsByProduct(productId: number): Promise<Review[]> {
  return reviews.filter(r => r.productId === productId);
}
