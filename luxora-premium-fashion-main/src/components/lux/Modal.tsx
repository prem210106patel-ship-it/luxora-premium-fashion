import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: boolean;
}

export function Modal({ open, onClose, title, children, side = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex" role="dialog" aria-modal="true" aria-label={title}>
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="fadein absolute inset-0 bg-foreground/25 backdrop-blur-sm"
      />
      <div
        className={
          side
            ? "rise relative ml-auto flex h-full w-full max-w-sm flex-col bg-surface shadow-xl"
            : "rise relative m-auto flex max-h-[85vh] w-[min(34rem,92vw)] flex-col rounded-lg bg-surface shadow-xl"
        }
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-foreground">
            <X size={18} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
