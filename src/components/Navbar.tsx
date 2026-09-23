import { useState, useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Men", to: "/shop", search: { category: "Men" } },
  { label: "Women", to: "/shop", search: { category: "Women" } },
  { label: "Accessories", to: "/shop", search: { category: "Accessories" } },
] as const;

export function Navbar() {
  const { cartCount, wishlist, user } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.searchStr]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    navigate({ to: "/shop", search: { q: query.trim() } });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled ? "glass-panel border-x-0 border-t-0 py-3" : "border-b border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-10">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid size-9 place-items-center text-foreground lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-tight text-foreground">
            LUXORA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                search={"search" in link ? link.search : undefined}
                className="link-sweep text-[13px] uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 lg:gap-5">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              <Search size={18} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-foreground/80 transition-colors hover:text-foreground"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative text-foreground/80 transition-colors hover:text-foreground"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              aria-label="Account"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="fadein mx-auto mt-4 max-w-[1400px] px-6 lg:px-10">
            <form onSubmit={submitSearch} className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, categories…"
                aria-label="Search products"
                className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-[13px] placeholder:text-muted focus:border-foreground/30 focus:outline-none"
              />
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[79] lg:hidden">
          <div
            className="fadein absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="rise absolute left-0 top-0 flex h-full w-72 flex-col gap-1 bg-surface px-6 py-24 shadow-xl">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                search={"search" in link ? link.search : undefined}
                className="border-b border-border py-3 text-[14px] uppercase tracking-[0.15em] text-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              className="border-b border-border py-3 text-[14px] uppercase tracking-[0.15em] text-foreground hover:text-primary"
            >
              {user ? "My Account" : "Login / Register"}
            </Link>
            <Link
              to="/about"
              className="border-b border-border py-3 text-[14px] uppercase tracking-[0.15em] text-foreground hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="border-b border-border py-3 text-[14px] uppercase tracking-[0.15em] text-foreground hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
