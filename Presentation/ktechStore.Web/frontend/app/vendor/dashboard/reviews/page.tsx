"use client";

import { useAuth } from "@/context/AuthContext";
import { getProductsByVendor, getReviewsByProduct } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";

export default function VendorReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const vendorProducts = getProductsByVendor(user.vendor.id);
      const allReviews = vendorProducts.flatMap(p =>
        getReviewsByProduct(p.id).map(r => ({ ...r, productName: p.name, productId: p.id }))
      );
      setReviews(allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted text-sm mt-1">Customer feedback on your products</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <MessageSquare className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-muted font-medium">No reviews yet</p>
          <p className="text-sm text-muted mt-1">Customer reviews will appear here once products are purchased.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.userName}</p>
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-primary font-medium mb-1">Product: {review.productName}</p>
              <p className="text-sm text-muted leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
