import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Heart, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { products, getProduct, coupons } from "@/data/products";
import { Button } from "@/components/lux/Button";
import { EmptyState } from "@/components/lux/States";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { cart, updateQuantity, removeFromCart, toggleWishlist, subtotal, hydrated } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const lines = cart
    .map((line) => ({ line, product: getProduct(line.productId) }))
    .filter((entry): entry is { line: typeof entry.line; product: NonNullable<typeof entry.product> } =>
      entry.product !== undefined,
    );

  const coupon = appliedCoupon ? coupons[appliedCoupon] : null;
  const discount = coupon
    ? coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value
    : 0;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - discount) + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (coupons[code]) {
      setAppliedCoupon(code);
      toast(`Coupon ${coupons[code].label} applied`);
    } else {
      toast("Invalid coupon code", "error");
    }
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <div className="skeleton h-8 w-48 rounded-sm" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <EmptyState
          icon={<ShoppingBag size={22} />}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet. Explore the collection and find your next favourite piece."
          action={
            <Link to="/shop">
              <Button variant="solid" shape="rounded" size="md">
                Start shopping
                <ArrowRight size={15} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      <h1 className="font-display text-4xl tracking-tight">Shopping Bag</h1>
      <p className="mt-2 text-[14px] text-muted">{lines.length} {lines.length === 1 ? "item" : "items"} in your bag</p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {lines.map(({ line, product }) => (
              <div
                key={`${line.productId}-${line.size}-${line.color}`}
                className="flex gap-4 rounded-lg border border-border bg-surface p-4"
              >
                <Link
                  to="/product/$productId"
                  params={{ productId: product.id }}
                  className="shrink-0 overflow-hidden rounded-md bg-stone"
                >
                  <img src={product.images[0]} alt={product.name} className="h-28 w-24 object-cover" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/product/$productId"
                        params={{ productId: product.id }}
                        className="text-[14px] font-medium hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[12px] text-muted">
                        {line.size} · {line.color}
                      </p>
                    </div>
                    <p className="shrink-0 text-[14px] font-medium">
                      {formatPrice(product.price * line.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-md border border-border">
                      <button
                        onClick={() => updateQuantity(line, line.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="grid size-8 place-items-center text-muted hover:text-foreground"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-[13px] tabular-nums">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line, line.quantity + 1)}
                        aria-label="Increase quantity"
                        className="grid size-8 place-items-center text-muted hover:text-foreground"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          toggleWishlist(product.id);
                          toast(`${product.name} moved to wishlist`);
                        }}
                        className="text-[12px] text-muted hover:text-primary"
                      >
                        <Heart size={15} />
                      </button>
                      <button
                        onClick={() => {
                          removeFromCart(line);
                          toast(`${product.name} removed from bag`, "info");
                        }}
                        className="text-muted hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/shop" className="mt-6 inline-block text-[13px] text-muted hover:text-foreground">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-border bg-surface p-6">
            <h2 className="font-display text-xl">Order Summary</h2>

            {/* Coupon */}
            <form onSubmit={handleApplyCoupon} className="mt-5">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted">Coupon code</label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="LUXORA10"
                    className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-[13px] placeholder:text-muted focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="outline" shape="rounded" size="sm">
                  Apply
                </Button>
              </div>
              {coupon && (
                <p className="mt-2 text-[12px] text-success">{coupon.label} applied</p>
              )}
              <p className="mt-2 text-[11px] text-muted">
                Try: LUXORA10, WELCOME500, ATELIER20
              </p>
            </form>

            {/* Totals */}
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted">Discount</span>
                  <span className="text-success">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-[15px] font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="solid"
              shape="rounded"
              size="lg"
              block
              className="mt-6"
              onClick={() => navigate({ to: "/checkout" })}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
