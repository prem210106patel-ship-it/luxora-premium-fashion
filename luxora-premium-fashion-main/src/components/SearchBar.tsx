import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, placeholder = "Search products", autoFocus }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-10 text-[13px] placeholder:text-muted focus:border-foreground/40 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
