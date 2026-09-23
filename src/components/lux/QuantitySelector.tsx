import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 10 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-surface">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="grid size-9 place-items-center text-muted transition-colors hover:text-foreground disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="w-9 text-center text-[13px] tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid size-9 place-items-center text-muted transition-colors hover:text-foreground disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
