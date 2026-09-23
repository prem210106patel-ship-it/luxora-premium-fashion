import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        solid: "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
        outline:
          "border border-foreground/25 text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
        glass: "glass-panel text-foreground hover:bg-surface",
        ghost: "text-foreground hover:text-primary",
        quiet: "border-b border-foreground/30 text-foreground hover:border-foreground",
        danger: "border border-destructive/30 text-destructive hover:bg-destructive/10",
      },
      size: {
        sm: "px-4 py-2 text-[12px]",
        md: "px-7 py-3.5 text-[13px]",
        lg: "px-9 py-4 text-[14px]",
        icon: "size-9",
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-md",
        pill: "rounded-full",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "solid", size: "md", shape: "rounded", block: false },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  shape,
  block,
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, shape, block }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
