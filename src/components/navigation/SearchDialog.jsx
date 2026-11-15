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

  // Corpus de sugerencias de texto (autocompletado), no enlaces.
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
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (open) return;
    setQuery('');
    setSubmitted('');
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, submitted]);

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
          aria-label="Buscar en el sitio"
          className="header-search-trigger"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar en el sitio</DialogTitle>
          <DialogDescription>Busca páginas, ediciones y artículos de Revista Micelio.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSubmitted('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar..."
            aria-label="Término de búsqueda"
            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => runSearch()}
            className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Buscar
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-2 py-3">
          {isIdle && (
            <div>
              <p className="px-2 pb-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-muted-foreground">
                Búsquedas recomendadas
              </p>
              <ul className="flex flex-wrap gap-2 px-2">
                {recommended.map((value) => (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(value);
                        setSubmitted(value);
                      }}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-foreground transition-colors hover:border-forest-700 hover:text-forest-700"
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSuggesting && (
            <div>
              <p className="px-2 pb-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-muted-foreground">
                Sugerencias
              </p>
              {suggestions.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted-foreground">Sin sugerencias.</p>
              ) : (
                <ul>
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
                          index === activeIndex ? 'bg-muted text-foreground' : 'text-foreground hover:bg-muted/60'
                        }`}
                      >
                        <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span>{value}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {isResults && (
            <ul>
              {results.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={`flex items-start gap-3 rounded-md px-2 py-3 transition-colors ${
                      index === activeIndex ? 'bg-muted' : 'hover:bg-muted/60'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {item.group}
                    </span>
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {isNoResults && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No encontramos resultados para esta búsqueda.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
