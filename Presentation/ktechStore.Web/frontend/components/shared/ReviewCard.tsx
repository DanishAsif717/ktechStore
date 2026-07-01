import type { Review } from "@/types";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-border pb-4 last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold text-sm">
          {review.userName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{review.userName}</p>
          <p className="text-xs text-muted">{review.date}</p>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < review.rating ? "text-accent fill-accent" : "text-border"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">{review.content}</p>
    </div>
  );
}
