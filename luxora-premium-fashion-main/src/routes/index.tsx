import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import heroCoat from "@/assets/hero-coat.jpg";
import lookbook from "@/assets/lookbook.jpg";
import aboutAtelier from "@/assets/about-atelier.jpg";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/lux/Button";
import {
  products,
  categories,
  newArrivals,
  bestSellers,
  trending,
  testimonials,
} from "@/data/products";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { addToCart } = useStore();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast("Thanks for subscribing — check your inbox for 10% off");
    setEmail("");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-20 min-h-[92vh] overflow-hidden">
        <img
          src={heroCoat}
          alt="LUXORA Winter Collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/60" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-end px-6 pb-24 lg:px-10 lg:pb-32">
          <div className="max-w-xl text-background">
            <p className="rise mb-4 text-[12px] uppercase tracking-[0.3em] text-background/80">
              Winter Collection 2026
            </p>
            <h1
              className="rise font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "100ms" }}
            >
              Clothing made<br />to be kept.
            </h1>
            <p
              className="rise mt-6 max-w-md text-[15px] leading-relaxed text-background/85"
              style={{ animationDelay: "200ms" }}
            >
              Considered materials, honest construction, and a quiet approach to
              dressing. Pieces designed to outlast the season.
            </p>
            <div
              className="rise mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "300ms" }}
            >
              <Link to="/shop">
                <Button variant="solid" shape="rounded" size="lg">
                  Shop the collection
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/shop" search={{ sort: "newest" }}>
                <Button variant="outline" shape="rounded" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
                  New arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-3 lg:px-10">
          {[
            { icon: Truck, title: "Free shipping", text: "On all orders above ₹5,000" },
            { icon: RotateCcw, title: "30-day returns", text: "Easy, no-questions returns" },
            { icon: ShieldCheck, title: "Secure checkout", text: "Protected at every step" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <item.icon size={20} className="text-primary" />
              <div>
                <p className="text-[13px] font-medium text-foreground">{item.title}</p>
                <p className="text-[12px] text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Browse</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Featured Categories</h2>
          </div>
          <Link to="/shop" className="link-sweep hidden text-[13px] text-muted hover:text-foreground sm:block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              blurb={cat.blurb}
              image={cat.image}
              count={cat.count}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Just in</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">New Arrivals</h2>
          </div>
          <Link to="/shop" search={{ sort: "newest" }} className="link-sweep text-[13px] text-muted hover:text-foreground">
            View all
          </Link>
        </div>
        {mounted ? (
          <ProductGrid products={newArrivals} />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/5] w-full rounded-md" />
                <div className="skeleton mt-3 h-3 w-24 rounded-sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Promotional banner */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={lookbook}
            alt="LUXORA Lookbook"
            className="h-[340px] w-full object-cover sm:h-[420px]"
          />
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-background">
            <p className="text-[11px] uppercase tracking-[0.3em] text-background/80">Limited time</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">Up to 30% off selected pieces</h2>
            <p className="mt-3 max-w-md text-[14px] text-background/85">
              Explore the season's most-loved styles, now reduced.
            </p>
            <Link to="/shop" className="mt-6">
              <Button variant="solid" shape="rounded" size="md">
                Shop the sale
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Most loved</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Best Sellers</h2>
          </div>
          <Link to="/shop" search={{ sort: "popularity" }} className="link-sweep text-[13px] text-muted hover:text-foreground">
            View all
          </Link>
        </div>
        {mounted ? (
          <ProductGrid products={bestSellers} />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/5] w-full rounded-md" />
                <div className="skeleton mt-3 h-3 w-24 rounded-sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">On the rise</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Trending Now</h2>
          </div>
        </div>
        {mounted ? (
          <ProductGrid products={trending} />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/5] w-full rounded-md" />
                <div className="skeleton mt-3 h-3 w-24 rounded-sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">In their words</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">What our customers say</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.author} className="rounded-lg border border-border bg-surface p-8">
              <blockquote className="text-[14px] leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5">
                <p className="text-[13px] font-medium text-foreground">{t.author}</p>
                <p className="text-[12px] text-muted">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Atelier strip */}
      <section className="relative overflow-hidden">
        <img src={aboutAtelier} alt="The LUXORA atelier" className="h-[420px] w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/35" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-md text-background">
              <p className="text-[11px] uppercase tracking-[0.3em] text-background/80">The atelier</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight">Made by people who care</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-background/85">
                Every piece is designed in-house and produced in small runs by
                workshops we trust — from Italian leather ateliers to Scottish
                knitting mills.
              </p>
              <Link to="/about" className="mt-6 inline-block">
                <Button variant="outline" shape="rounded" size="md" className="border-background/40 text-background hover:bg-background hover:text-foreground">
                  Our story
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="rounded-lg border border-border bg-surface px-6 py-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Stay in the loop</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Join the LUXORA list</h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-muted">
            Early access to new arrivals, private sales, and 10% off your first order.
          </p>
          <form onSubmit={handleNewsletter} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-[13px] placeholder:text-muted focus:border-foreground/30 focus:outline-none"
            />
            <Button type="submit" variant="solid" shape="pill" size="md">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
