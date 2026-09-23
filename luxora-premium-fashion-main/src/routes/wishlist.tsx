import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { getProduct } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/lux/Button";
import { EmptyState } from "@/components/lux/States";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, addToCart, hydrated } = useStore();
  const toast = useToast();

  const items = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <div className="skeleton h-8 w-48 rounded-sm" />
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/5] w-full rounded-md" />
              <div className="skeleton mt-3 h-3 w-24 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <EmptyState
          icon={<Heart size={22} />}
          title="Your wishlist is empty"
          description="Save the pieces you love by tapping the heart icon on any product."
          action={
            <Link to="/shop">
              <Button variant="solid" shape="rounded" size="md">
                Discover products
                <ArrowRight size={15} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const moveAllToCart = () => {
    items.forEach((p) => {
      addToCart(p, p.sizes[0] ?? "One Size", p.colors[0] ?? "Default");
    });
    toast(`${items.length} items moved to bag`);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Saved</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">My Wishlist</h1>
          <p className="mt-2 text-[14px] text-muted">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button variant="outline" shape="rounded" size="md" onClick={moveAllToCart}>
          <ShoppingBag size={15} />
          Move all to bag
        </Button>
      </div>

      <ProductGrid products={items} />

      <div className="mt-10">
        <Link to="/shop">
          <Button variant="ghost" shape="rounded" size="md">
            Continue shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
