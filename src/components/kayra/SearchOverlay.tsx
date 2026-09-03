import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatPrice, fromPrice, searchProducts } from "@/lib/products";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!query.trim()) return;
    const t = window.setTimeout(() => track("search", { query: query.trim() }), 600);
    return () => window.clearTimeout(t);
  }, [query]);

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] bg-ink/96 text-on-ink transition-opacity duration-500 [transition-timing-function:var(--ease-luxe)]",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
      role="dialog"
      aria-modal={open}
      aria-label="Search fragrances"
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col px-5 pt-8 sm:px-8">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-on-ink-muted">Search</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid h-10 w-10 place-items-center text-on-ink-muted hover:text-on-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-8 block">
          <span className="sr-only">Search by name, note or occasion</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, 60))}
            placeholder="Oudh, amber, evening…"
            inputMode="search"
            autoComplete="off"
            className="w-full border-b border-on-ink/25 bg-transparent pb-4 font-serif text-3xl text-on-ink placeholder:text-on-ink-muted/60 focus:border-brass focus:outline-none sm:text-4xl"
          />
        </label>

        <div className="mt-8 flex-1 overflow-y-auto pb-16">
          {results.length === 0 ? (
            <p className="text-sm text-on-ink-muted">
              Nothing matches “{query}”. Try a note such as oudh, amber or bergamot.
            </p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/fragrance/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border-b border-on-ink/10 py-4"
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="h-16 w-16 object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-xl">{p.name}</span>
                      <span className="block truncate text-xs text-on-ink-muted">
                        {p.identity}
                      </span>
                    </span>
                    <span className="text-xs text-on-ink-muted">
                      from {formatPrice(fromPrice(p))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
