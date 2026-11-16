import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";

import { cn } from "@/lib/utils";

const spans = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-3",
];

export default function GalleryGrid({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  const closeRef = useRef(null);
  const triggerRefs = useRef([]);
  const lastTrigger = useRef(null);

  const open = (index) => {
    lastTrigger.current = index;
    setOpenIndex(index);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    const index = lastTrigger.current;
    if (index !== null) {
      window.setTimeout(() => triggerRefs.current[index]?.focus(), 0);
    }
  }, []);

  const step = useCallback(
    (direction) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
      if (event.key === "Tab") {
        const dialog = document.getElementById("gallery-lightbox");
        if (!dialog) return;
        const focusable = dialog.querySelectorAll("button, [href]");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-5"
        role="list"
      >
        {items.map((item, index) => (
          <figure
            key={item.id}
            role="listitem"
            className={cn(
              "group min-w-0",
              index === 0 ? "md:col-span-6" : spans[index % spans.length],
            )}
          >
            <button
              type="button"
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              onClick={() => open(index)}
              className="relative block w-full cursor-zoom-in overflow-hidden border border-cream/15 bg-forest-950"
              aria-label={`Ampliar fotografía: ${item.alt}`}
            >
              <picture>
                <source srcSet={item.thumbWebp} type="image/webp" />
                <img
                  src={item.thumbFallback}
                  alt={item.alt}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className={cn(
                    "block w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105",
                    index === 0 ? "aspect-16/8" : "aspect-4/3",
                  )}
                />
              </picture>
              <span
                className="absolute inset-0 bg-linear-to-t from-forest-950/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden="true"
              />
              <span
                className="absolute right-3 bottom-3 z-10 flex size-10 translate-y-2 items-center justify-center rounded-full bg-apple text-forest-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                aria-hidden="true"
              >
                <Maximize2 className="size-4" strokeWidth={1.4} />
              </span>
              <span
                className="absolute top-3 left-3 z-10 font-mono text-nano tracking-widest text-cream/60"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
            <figcaption className="flex flex-col gap-0.5 pt-2 font-mono text-nano tracking-wider uppercase md:flex-row md:items-baseline md:justify-between md:gap-4">
              <span className="text-cream">{item.caption}</span>
              <span className="text-cream/40 md:text-right">{item.credit}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {current && openIndex !== null && (
        <div
          id="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografía ${openIndex + 1} de ${items.length}: ${current.alt}`}
          className="fixed inset-0 z-95 flex flex-col bg-forest-950/95 p-4 text-cream backdrop-blur-md md:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="flex shrink-0 items-center justify-between gap-4">
            <span className="font-mono text-micro tracking-widest text-apple">
              {String(openIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              ref={closeRef}
              onClick={close}
              className="flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:bg-apple hover:text-forest-900"
              aria-label="Cerrar fotografía"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-0 z-10 flex size-11 items-center justify-center rounded-full border border-cream/20 bg-forest-950/60 text-cream transition-colors hover:bg-apple hover:text-forest-900 md:left-2"
              aria-label="Fotografía anterior"
            >
              <ArrowLeft className="size-5" strokeWidth={1.4} />
            </button>

            <figure className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3">
              <picture className="flex min-h-0 flex-1 items-center justify-center">
                <source srcSet={current.srcWebp} type="image/webp" />
                <img
                  src={current.srcFallback}
                  alt={current.alt}
                  decoding="async"
                  className="max-h-full max-w-full border border-cream/15 object-contain"
                />
              </picture>
              <figcaption className="flex w-full max-w-5xl flex-wrap justify-between gap-x-8 gap-y-1 font-mono text-nano tracking-wider uppercase">
                <span>{current.caption}</span>
                <span className="text-cream/40">{current.credit}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-0 z-10 flex size-11 items-center justify-center rounded-full border border-cream/20 bg-forest-950/60 text-cream transition-colors hover:bg-apple hover:text-forest-900 md:right-2"
              aria-label="Fotografía siguiente"
            >
              <ArrowRight className="size-5" strokeWidth={1.4} />
            </button>
          </div>

          <p className="hidden shrink-0 text-center font-mono text-nano tracking-wider text-cream/30 uppercase md:block">
            Usa las flechas ← → para recorrer · Esc para cerrar
          </p>
        </div>
      )}
    </>
  );
}
