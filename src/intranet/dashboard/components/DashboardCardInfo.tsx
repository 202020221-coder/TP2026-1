import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DashboardCardInfoProps {
  content: string;
  className?: string;
}

export function DashboardCardInfo({ content, className }: DashboardCardInfoProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupId = useId();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const popupWidth = 272;
    const left = Math.min(
      Math.max(8, rect.right - popupWidth),
      window.innerWidth - popupWidth - 8,
    );
    setPosition({ top: rect.bottom + 8, left });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleResize = () => updatePosition();

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [open]);

  return (
    <>
      <div className={cn("absolute right-3 top-3 z-20", className)}>
        <button
          ref={buttonRef}
          type="button"
          aria-label="Ver información de la métrica"
          aria-expanded={open}
          aria-controls={popupId}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border border-slate-300/80 bg-white text-slate-500 shadow-sm transition-colors",
            "hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700",
            open && "border-slate-400 bg-slate-50 text-slate-700",
          )}
        >
          <Info className="h-3 w-3" strokeWidth={2.5} />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            id={popupId}
            ref={popupRef}
            role="tooltip"
            style={{ top: position.top, left: position.left }}
            className="fixed z-[100] w-[min(17rem,calc(100vw-1rem))] rounded-lg border border-slate-200 bg-white p-3 text-left text-xs leading-relaxed text-slate-600 shadow-[0_4px_20px_rgba(15,23,42,0.12)]"
          >
            <span
              className="absolute -top-1.5 right-3 block h-2.5 w-2.5 rotate-45 border-l border-t border-slate-200 bg-white"
              aria-hidden
            />
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
