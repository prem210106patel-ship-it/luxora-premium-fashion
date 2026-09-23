import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}

export function RatingStars({ rating, count, size = 12, className }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-[11px] text-muted", className)}>
      <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(rating) ? "fill-primary text-primary" : "text-stone"}
          />
        ))}
      </span>
      <span>
        {rating.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}
