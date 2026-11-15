import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { normalize } from "@/lib/search";

const suggested = [
  "Ediciones",
  "Reino Fungi",
  "Fotografías",
  "Actividades",
  "Suscripción",
  "New Fungi",
];

export default function SearchDialog({ items }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const term = normalize(query);
  const results = useMemo(() => {
    if (!term) return [];
    return items
      .filter((item) =>
        normalize(
          `${item.title} ${item.description} ${item.group} ${item.keywords ?? ""}`,
        ).includes(term),
      )
      .slice(0, 10);
  }, [items, term]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleKeyDown = (event) => {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + results.length) % results.length,
      );
    }
    if (event.key === "Enter") {
      const item = results[activeIndex];
      if (item) {
        event.preventDefault();
        if (item.external) {
          window.open(item.href, "_blank", "noopener,noreferrer");
          setOpen(false);
        } else {
          window.location.href = item.href;
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="icon-btn header-search-trigger"
          aria-label="Buscar en el sitio"
        >
          <Search
            className="size-[1.05rem]"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <span className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.12em] xl:inline">
            Buscar
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="top-[10%] max-h-[82vh] w-[calc(100%-1.5rem)] max-w-3xl translate-y-0 gap-0 overflow-hidden rounded-lg border border-line bg-paper p-0 text-ink shadow-2xl sm:max-w-3xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader className="gap-2 border-b border-line px-5 pb-4 pt-5 sm:px-7">
          <p className="eyebrow text-forest-700">Buscar en Micelio</p>
          <DialogTitle className="type-display text-3xl sm:text-4xl">
            ¿Qué quieres descubrir?
          </DialogTitle>
          <DialogDescription className="sr-only">
            Busca ediciones, artículos, guías y páginas de Revista Micelio.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b border-line px-4 py-3 sm:px-6">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-forest-700"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Busca ediciones, funga, entrevistas…"
              aria-label="Término de búsqueda"
              className="h-12 rounded-none border-0 bg-transparent pl-8 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
          </div>
        </div>

        <div
          className="max-h-[48vh] overflow-y-auto p-2 sm:p-3"
          aria-label="Resultados"
        >
          {!term ? (
            <div className="px-3 py-4 sm:px-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                Búsquedas recomendadas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggested.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-forest-800 transition-colors hover:border-forest-700 hover:bg-bone/60"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <a
                key={`${item.group}-${item.title}`}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setActiveIndex(index)}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`group flex items-start gap-4 rounded-md px-3 py-3 transition-colors sm:px-4 ${
                  index === activeIndex ? "bg-bone/80" : "hover:bg-bone/50"
                }`}
              >
                <span className="mt-1 hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-forest-700 sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.group}
                  </span>
                  <span className="block font-display text-lg leading-tight">
                    {item.title}
                  </span>
                  <span className="mt-1 line-clamp-1 block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-forest-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            ))
          ) : (
            <p className="px-4 py-10 text-center font-display text-xl">
              No encontramos resultados para esta búsqueda.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
          <span>↑ ↓ para navegar · Enter para abrir</span>
          <span className="hidden sm:inline">Esc para cerrar</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
