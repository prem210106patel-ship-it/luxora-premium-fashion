import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Check, Info, X, AlertTriangle } from "lucide-react";

type ToastTone = "success" | "info" | "error";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<{ toast: (message: string, tone?: ToastTone) => void } | null>(
  null,
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, tone }]);
    setTimeout(() => setItems((current) => current.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md bg-foreground px-4 py-3 text-background shadow-lg"
          >
            <span className="mt-0.5 shrink-0">
              {item.tone === "success" ? (
                <Check size={16} />
              ) : item.tone === "error" ? (
                <AlertTriangle size={16} />
              ) : (
                <Info size={16} />
              )}
            </span>
            <p className="min-w-0 flex-1 text-[13px] leading-snug">{item.message}</p>
            <button
              onClick={() => setItems((c) => c.filter((t) => t.id !== item.id))}
              aria-label="Dismiss notification"
              className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
