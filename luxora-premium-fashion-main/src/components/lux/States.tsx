import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="fadein flex flex-col items-center justify-center rounded-lg border border-border bg-surface/60 px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-stone text-muted">{icon}</span>
      <h2 className="mt-5 font-display text-2xl tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[42ch] text-[14px] text-muted">{description}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-14 text-center">
      <AlertCircle size={22} className="text-destructive" />
      <p className="mt-3 text-[14px] text-foreground">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] w-full rounded-md" />
      <div className="skeleton mt-3 h-3 w-24 rounded-sm" />
      <div className="skeleton mt-2 h-3 w-16 rounded-sm" />
    </div>
  );
}

export function GridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
