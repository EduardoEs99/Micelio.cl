import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { normalize } from '@/lib/search';

const recommended = ['Ediciones', 'Reino Fungi', 'Fotografías', 'Actividades', 'Suscripción', 'New Fungi'];

export default function SearchDialog({ items }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const term = normalize(query);

  const suggestionCorpus = useMemo(() => {
    const set = new Set();
    recommended.forEach((value) => set.add(value));
    items.forEach((item) => {
      if (item.title) set.add(item.title);
      if (item.group) set.add(item.group);
    });
    return [...set];
  }, [items]);

  const suggestions = useMemo(() => {
    if (!term) return [];
    return suggestionCorpus
      .filter((value) => normalize(value).includes(term))
      .slice(0, 8);
  }, [suggestionCorpus, term]);

  const results = useMemo(() => {
    const search = normalize(submitted);
    if (!search) return [];
    return items
      .filter((item) =>
        normalize(`${item.title} ${item.description} ${item.group} ${item.keywords ?? ''}`).includes(
          search,
        ),
      )
      .slice(0, 10);
  }, [items, submitted]);

  const isIdle = !term && !submitted;
  const isSuggesting = !!term && !submitted;
  const isResults = !!submitted && results.length > 0;
  const isNoResults = !!submitted && results.length === 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [query, submitted]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSubmitted('');
      setActiveIndex(0);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  const runSearch = (value) => {
    const next = (value ?? query).trim();
    setSubmitted(next);
  };

  const handleKeyDown = (event) => {
    const list = isSuggesting ? suggestions : isResults ? results : recommended;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (list.length) setActiveIndex((index) => (index + 1) % list.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.length) setActiveIndex((index) => (index - 1 + list.length) % list.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (isSuggesting && suggestions.length) {
        const chosen = suggestions[activeIndex] ?? suggestions[0];
        setQuery(chosen);
        setSubmitted(chosen);
      } else if (isIdle && recommended.length) {
        const chosen = recommended[activeIndex] ?? recommended[0];
        setQuery(chosen);
        setSubmitted(chosen);
      } else {
        runSearch();
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full p-2 opacity-82 transition duration-300 hover:bg-current/8 hover:opacity-100 xl:px-3"
          aria-label="Buscar en el sitio"
        >
          <Search className="size-4" strokeWidth={1.6} aria-hidden="true" />
          <span className="hidden text-tiny font-medium uppercase tracking-editorial lg:inline">
            Buscar
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="top-1/12 max-h-gallery w-11/12 max-w-3xl translate-y-0 gap-0 overflow-hidden rounded-lg border border-line bg-paper p-0 text-ink shadow-2xl sm:max-w-3xl"
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
              onChange={(event) => {
                setQuery(event.target.value);
                setSubmitted('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Busca ediciones, funga, entrevistas…"
              aria-label="Término de búsqueda"
              className="h-12 rounded-none border-0 bg-transparent pl-8 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
          </div>
        </div>

        <div
          className="max-h-mobile-dialog overflow-y-auto p-2 sm:p-3"
          aria-label="Resultados"
        >
          {isIdle && (
            <div className="px-3 py-4 sm:px-4">
              <p className="font-mono text-eyebrow uppercase tracking-editorial-wide text-muted-foreground">
                Búsquedas recomendadas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommended.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setQuery(value);
                      setSubmitted(value);
                    }}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-forest-800 transition-colors hover:border-forest-700 hover:bg-bone/60"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSuggesting && (
            <div className="px-3 py-4 sm:px-4">
              <p className="font-mono text-eyebrow uppercase tracking-editorial-wide text-muted-foreground">
                Sugerencias
              </p>
              {suggestions.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Sin sugerencias.</p>
              ) : (
                <ul className="mt-2">
                  {suggestions.map((value, index) => (
                    <li key={value}>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(value);
                          setSubmitted('');
                          inputRef.current?.focus();
                        }}
                        className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                          index === activeIndex ? 'bg-bone/80 text-ink' : 'text-ink hover:bg-bone/50'
                        }`}
                      >
                        <Search className="size-3.5 shrink-0 text-forest-700" aria-hidden="true" />
                        <span>{value}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {isResults &&
            results.map((item, index) => (
              <a
                key={`${item.group}-${item.title}`}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setActiveIndex(index)}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={`group flex items-start gap-4 rounded-md px-3 py-3 transition-colors sm:px-4 ${
                  index === activeIndex ? 'bg-bone/80' : 'hover:bg-bone/50'
                }`}
              >
                <span className="mt-1 hidden shrink-0 font-mono text-eyebrow uppercase tracking-editorial text-forest-700 sm:block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-mono text-eyebrow uppercase tracking-editorial-wide text-muted-foreground">
                    {item.group}
                  </span>
                  <span className="block font-display text-lg leading-tight">{item.title}</span>
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
            ))}

          {isNoResults && (
            <p className="px-4 py-10 text-center font-display text-xl">
              No encontramos resultados para esta búsqueda.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-eyebrow uppercase tracking-widest text-muted-foreground">
          <span>↑ ↓ para navegar · Enter para abrir</span>
          <span>Esc para cerrar</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
