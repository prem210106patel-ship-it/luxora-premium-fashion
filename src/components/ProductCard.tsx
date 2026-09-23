import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { discountPercent } from "@/lib/format";
import { RatingStars } from "@/components/lux/RatingStars";
import { PriceDisplay } from "@/components/lux/PriceDisplay";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const toast = useToast();
  const off = discountPercent(product.price, product.originalPrice);
  const wished = isWishlisted(product.id);
  const hoverImage = product.images[1] ?? product.images[0];

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-md bg-stone">
        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          aria-label={product.name}
          className="block"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1000}
            className="aspect-4/5 w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 aspect-4/5 w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-sm bg-foreground/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-background">
            -{off}%
          </span>
        )}
        {off === 0 && product.tags.includes("new") && (
          <span className="absolute left-3 top-3 rounded-sm bg-foreground/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-background">
            New
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-foreground/70 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-background">
            Sold out
          </span>
        )}

        <button
          onClick={() => {
            toggleWishlist(product.id);
            toast(wished ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="glass-panel absolute right-3 top-3 grid size-8 place-items-center rounded-full text-foreground transition-transform hover:scale-105"
        >
          <Heart size={14} className={cn(wished && "fill-primary text-primary")} />
        </button>

        <button
          disabled={!product.inStock}
          onClick={() => {
            addToCart(product, product.sizes[0] ?? "One Size", product.colors[0] ?? "Default");
            toast(`${product.name} added to bag`);
          }}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-foreground py-3 text-[12px] tracking-wide text-background transition-transform duration-300 group-hover:translate-y-0 disabled:hidden"
        >
          Add to Bag
        </button>
      </div>

      <div className="mt-3">
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          className="mt-1 block text-[14px] hover:text-primary"
        >
          {product.name}
        </Link>
        <PriceDisplay
          price={product.price}
          {...(product.originalPrice !== undefined ? { originalPrice: product.originalPrice } : {})}
          className="mt-0.5"
        />
      </div>
    </article>
  );
}
