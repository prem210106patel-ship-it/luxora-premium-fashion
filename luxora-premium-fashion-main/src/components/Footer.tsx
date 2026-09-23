import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 lg:px-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl tracking-tight">LUXORA</p>
          <p className="mt-3 max-w-[26ch] text-[13px] text-muted">
            Considered clothing, made to be kept.
          </p>
          <div className="mt-5 flex gap-4 text-muted">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-foreground">
              <Instagram size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-foreground">
              <Twitter size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-foreground">
              <Facebook size={16} />
            </a>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Shop</p>
          <ul className="space-y-2 text-[13px] text-foreground/80">
            <li><Link to="/shop" search={{ category: "Men" }} className="hover:text-primary">Men</Link></li>
            <li><Link to="/shop" search={{ category: "Women" }} className="hover:text-primary">Women</Link></li>
            <li><Link to="/shop" search={{ category: "Accessories" }} className="hover:text-primary">Accessories</Link></li>
            <li><Link to="/shop" search={{ sort: "newest" }} className="hover:text-primary">New arrivals</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Company</p>
          <ul className="space-y-2 text-[13px] text-foreground/80">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/account" className="hover:text-primary">My account</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Care</p>
          <ul className="space-y-2 text-[13px] text-foreground/80">
            <li><Link to="/contact" hash="shipping" className="hover:text-primary">Shipping</Link></li>
            <li><Link to="/contact" hash="returns" className="hover:text-primary">Returns</Link></li>
            <li><Link to="/contact" hash="sizing" className="hover:text-primary">Size guide</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 px-6 py-5 text-[12px] text-muted sm:flex-row lg:px-10">
          <p>© 2026 LUXORA. All rights reserved.</p>
          <p>Designed in-house · Made to last</p>
        </div>
      </div>
    </footer>
  );
}
