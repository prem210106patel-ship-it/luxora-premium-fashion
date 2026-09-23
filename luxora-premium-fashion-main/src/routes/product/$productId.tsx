import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import { products, getProduct, relatedProducts } from "@/data/products";
import { RatingStars } from "@/components/lux/RatingStars";
import { PriceDisplay } from "@/components/lux/PriceDisplay";
import { QuantitySelector } from "@/components/lux/QuantitySelector";
import { Button } from "@/components/lux/Button";
import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$productId")({
  component: ProductDetailPage,
  loader: ({ params }) => {
    return getProduct(params.productId);
  },
});

function ProductDetailPage() {
  const product = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "One Size");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "Default");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping" | "reviews">("description");

  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 text-center lg:px-10">
        <h1 className="font-display text-3xl">Product not found</h1>
        <p className="mt-2 text-muted">This product may have been removed.</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button variant="solid" shape="rounded">Back to shop</Button>
        </Link>
      </div>
    );
  }

  const wished = isWishlisted(product.id);
  const related = relatedProducts(product);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    toast(`${product.name} added to bag`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate({ to: "/checkout" });
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(wished ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[12px] text-muted">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight size={12} />
        <Link to="/shop" search={{ category: product.category }} className="hover:text-foreground">
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg bg-stone">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "overflow-hidden rounded-md border-2 transition-colors",
                  selectedImage === i ? "border-foreground" : "border-transparent",
                )}
              >
                <img src={img} alt="" className="h-20 w-16 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{product.type}</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">{product.name}</h1>

          <div className="mt-3">
            <RatingStars rating={product.rating} count={product.reviewCount} size={14} />
          </div>

          <div className="mt-5">
            <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />
          </div>

          <p className="mt-5 text-[14px] leading-relaxed text-foreground/80">
            {product.description}
          </p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-[12px] uppercase tracking-[0.15em] text-muted">
                Colour: <span className="text-foreground">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[12px] transition-colors",
                      selectedColor === color
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground/80 hover:border-foreground/40",
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-[0.15em] text-muted">
                  Size: <span className="text-foreground">{selectedSize}</span>
                </p>
                <Link to="/contact" hash="sizing" className="text-[12px] text-muted hover:text-foreground">
                  Size guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "grid min-w-11 place-items-center rounded-md border px-3 py-2 text-[13px] transition-colors",
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground/80 hover:border-foreground/40",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-3 text-[12px] uppercase tracking-[0.15em] text-muted">Quantity</p>
            <QuantitySelector value={quantity} onChange={setQuantity} max={10} />
          </div>

          {/* Stock */}
          <p className="mt-5 text-[13px]">
            {product.inStock ? (
              <span className="text-success">In stock — ready to ship</span>
            ) : (
              <span className="text-destructive">Currently sold out</span>
            )}
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="solid"
              shape="rounded"
              size="lg"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={16} />
              Add to Bag
            </Button>
            <Button
              variant="outline"
              shape="rounded"
              size="lg"
              disabled={!product.inStock}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <Button
              variant="ghost"
              shape="rounded"
              size="lg"
              onClick={handleWishlist}
              aria-pressed={wished}
            >
              <Heart size={16} className={cn(wished && "fill-primary text-primary")} />
              {wished ? "Saved" : "Save"}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { icon: Truck, label: "Free shipping over ₹5,000" },
              { icon: RotateCcw, label: "30-day returns" },
              { icon: ShieldCheck, label: "Secure checkout" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                <item.icon size={18} className="text-primary" />
                <p className="text-[11px] text-muted">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-10 border-t border-border pt-6">
            <div className="flex gap-6 border-b border-border">
              {[
                { key: "description", label: "Description" },
                { key: "specs", label: "Specifications" },
                { key: "shipping", label: "Shipping" },
                { key: "reviews", label: `Reviews (${product.reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "border-b-2 pb-3 text-[13px] transition-colors",
                    activeTab === tab.key
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6 text-[14px] leading-relaxed text-foreground/80">
              {activeTab === "description" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <p className="text-muted">
                    Each piece is designed in-house and produced in small runs to
                    ensure quality and longevity.
                  </p>
                </div>
              )}
              {activeTab === "specs" && (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-border pb-2">
                      <dt className="text-muted">{key}</dt>
                      <dd className="text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-3">
                  <p><strong className="text-foreground">Shipping:</strong> Free on orders above ₹5,000. Standard delivery 3–5 business days.</p>
                  <p><strong className="text-foreground">Returns:</strong> 30-day no-questions returns. Items must be unworn with tags attached.</p>
                  <p><strong className="text-foreground">Care:</strong> {product.specifications.Care ?? "Follow care label instructions."}</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-5">
                  {product.reviews.map((review, i) => (
                    <div key={i} className="border-b border-border pb-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-medium text-foreground">{review.author}</p>
                          <p className="text-[11px] text-muted">{formatDate(review.date)}</p>
                        </div>
                        <RatingStars rating={review.rating} size={12} />
                      </div>
                      <p className="mt-2 text-[13px] font-medium text-foreground">{review.title}</p>
                      <p className="mt-1 text-[13px] text-foreground/80">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl tracking-tight">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
