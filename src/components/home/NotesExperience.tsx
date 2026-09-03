import { useState } from "react";

import { Reveal } from "@/components/kayra/Reveal";
import { products, type NoteLayer } from "@/lib/products";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const layers: { key: NoteLayer; label: string; caption: string }[] = [
  { key: "top", label: "Top", caption: "The first minutes" },
  { key: "heart", label: "Heart", caption: "The hour after" },
  { key: "base", label: "Base", caption: "What stays on skin" },
];

export function NotesExperience() {
  const [slug, setSlug] = useState(products[0]?.slug ?? "");
  const active = products.find((p) => p.slug === slug) ?? products[0];
  if (!active) return null;

  return (
    <section aria-labelledby="notes-heading" className="bg-secondary">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-32">
        <Reveal>
          <p className="eyebrow text-muted-foreground">The composition</p>
          <h2 id="notes-heading" className="display-lg mt-5 max-w-3xl">
            Read a fragrance before you wear it.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div
            role="tablist"
            aria-label="Choose a fragrance"
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-5"
          >
            {products.map((p) => (
              <button
                key={p.slug}
                role="tab"
                type="button"
                aria-selected={p.slug === slug}
                onClick={() => {
                  setSlug(p.slug);
                  track("product_interaction", { slug: p.slug, surface: "notes" });
                }}
                className={cn(
                  "font-serif text-2xl transition-colors duration-500 sm:text-3xl",
                  p.slug === slug
                    ? "text-foreground"
                    : "text-muted-foreground/60 hover:text-foreground",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="relative">
            <img
              key={active.slug}
              src={active.image}
              alt={active.imageAlt}
              loading="lazy"
              decoding="async"
              className="stage-veil aspect-[4/5] w-full object-cover"
            />
          </Reveal>

          <div>
            <p className="measure font-serif text-2xl leading-snug sm:text-3xl">
              {active.editorial}
            </p>
            <dl className="mt-12 space-y-8">
              {layers.map((layer, i) => (
                <div
                  key={layer.key}
                  className="grid gap-2 border-t border-border pt-6 sm:grid-cols-[160px_minmax(0,1fr)]"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <dt>
                    <span className="eyebrow block text-muted-foreground">{layer.label} notes</span>
                    <span className="mt-1 block text-xs text-muted-foreground/70">
                      {layer.caption}
                    </span>
                  </dt>
                  <dd key={active.slug + layer.key} className="stage-rise flex flex-wrap gap-2">
                    {active.notes[layer.key].map((note) => (
                      <span
                        key={note}
                        className="border border-border px-3 py-1.5 text-xs tracking-[0.12em] uppercase"
                      >
                        {note}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
