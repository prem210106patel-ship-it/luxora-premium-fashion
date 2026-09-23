import { useState, useMemo } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, categories, allSizes, allColors, priceBounds } from "@/data/products";
import type { Category } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/lux/Button";
import { GridSkeleton } from "@/components/lux/States";
import { EmptyState } from "@/components/lux/States";
import { useStore } from "@/store/store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) ?? "All",
    q: (search.q as string) ?? "",
    sort: (search.sort as string) ?? "popularity",
  }),
});

type SortKey = "popularity" | "price-asc" | "price-desc" | "newest" | "rating";
const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "popularity", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

const CATEGORY_FILTERS: Array<Category | "All"> = ["All", "Men", "Women", "Accessories"];

function ShopPage() {
  const { category, q, sort } = Route.useSearch() as { category: string; q: string; sort: string };
  const navigate = useNavigate();
  const { hydrated } = useStore();

  const [search, setSearch] = useState(q);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [priceRange, setPriceRange] = useState<[number, number]>(priceBounds);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync local state when URL params change
  useMemo(() => {
    setSearch(q);
    setSelectedCategory(category);
  }, [q, category]);

  const updateUrl = (updates: { category?: string; q?: string; sort?: string }) => {
    navigate({
      to: "/shop",
      search: {
        category: updates.category ?? selectedCategory,
        q: updates.q ?? search,
        sort: updates.sort ?? sort,
      },
    });
  };

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.type.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower),
      );
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    }
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    const sortKey = sort as SortKey;
    result.sort((a, b) => {
      switch (sortKey) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return b.addedOn.localeCompare(a.addedOn);
        case "rating":
          return b.rating - a.rating;
        default:
          return b.popularity - a.popularity;
      }
    });
    return result;
  }, [selectedCategory, search, priceRange, selectedSizes, selectedColors, minRating, sort]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearch("");
    setPriceRange(priceBounds);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    updateUrl({ category: "All", q: "", sort: "popularity" });
  };

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (minRating > 0 ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-7">
      {/* Category */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Category</p>
        <div className="space-y-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                updateUrl({ category: cat });
              }}
              className={cn(
                "block w-full text-left text-[13px] transition-colors hover:text-primary",
                selectedCategory === cat ? "font-medium text-primary" : "text-foreground/80",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Price range</p>
        <div className="flex items-center justify-between text-[13px] text-foreground/80">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="mt-2 w-full accent-primary"
          aria-label="Maximum price"
        />
        <div className="mt-2 flex gap-2">
          {[
            [0, 5000],
            [5000, 10000],
            [10000, priceBounds[1]],
          ].map(([min, max]) => (
            <button
              key={min}
              onClick={() => setPriceRange([min, max])}
              className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:border-foreground/30 hover:text-foreground"
            >
              {formatPrice(min)}–{formatPrice(max)}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Size</p>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSizes((prev) => toggleArray(prev, size))}
              className={cn(
                "grid min-w-9 place-items-center rounded-md border px-2 py-1.5 text-[12px] transition-colors",
                selectedSizes.includes(size)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/80 hover:border-foreground/40",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Colour</p>
        <div className="space-y-2">
          {allColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColors((prev) => toggleArray(prev, color))}
              className="flex items-center gap-2 text-[13px] text-foreground/80 hover:text-primary"
            >
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full border",
                  selectedColors.includes(color)
                    ? "border-primary"
                    : "border-border",
                )}
              >
                {selectedColors.includes(color) && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </span>
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Minimum rating</p>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[12px] transition-colors",
                minRating === r
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/80 hover:border-foreground/40",
              )}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-[13px] text-muted underline hover:text-foreground"
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">
          {selectedCategory === "All" ? "All Products" : selectedCategory}
        </h1>
        <p className="mt-2 text-[14px] text-muted">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      {/* Search + sort row */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md flex-1">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              updateUrl({ q: v });
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[13px] text-foreground/80 lg:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateUrl({ sort: e.target.value })}
              className="appearance-none rounded-full border border-border bg-surface py-2.5 pl-4 pr-10 text-[13px] text-foreground focus:outline-none"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop filters sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterContent />
        </aside>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          {!hydrated ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<SlidersHorizontal size={22} />}
              title="No products found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              action={
                <Button variant="outline" shape="rounded" size="md" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className="fadein absolute inset-0 bg-foreground/25 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="rise relative ml-auto flex h-full w-full max-w-xs flex-col bg-surface shadow-xl">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <FilterContent />
            </div>
            <div className="border-t border-border p-5">
              <Button variant="solid" shape="rounded" block onClick={() => setDrawerOpen(false)}>
                Show {filtered.length} results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
