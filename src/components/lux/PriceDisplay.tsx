import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function PriceDisplay({ price, originalPrice, size = "sm", className }: PriceDisplayProps) {
  const off = discountPercent(price, originalPrice);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={size === "lg" ? "font-display text-2xl" : "text-[13px] text-foreground"}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn("text-muted line-through", size === "lg" ? "text-sm" : "text-[13px]")}>
            {formatPrice(originalPrice)}
          </span>
          <span className={cn("text-primary", size === "lg" ? "text-sm" : "text-[12px]")}>
            {off}% off
          </span>
        </>
      )}
    </div>
  );
}
