import { Link } from "@tanstack/react-router";

interface CategoryCardProps {
  name: string;
  blurb: string;
  image: string;
  count: number;
  className?: string;
}

export function CategoryCard({ name, blurb, image, count, className }: CategoryCardProps) {
  return (
    <Link
      to="/shop"
      search={{ category: name }}
      className={`group relative block overflow-hidden rounded-md ${className ?? ""}`}
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        width={1024}
        height={1280}
        className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="glass-panel absolute inset-x-0 bottom-0 border-x-0 border-b-0 px-4 py-3">
        <p className="font-display text-lg">{name}</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
          {count} pieces · {blurb}
        </p>
      </div>
    </Link>
  );
}
