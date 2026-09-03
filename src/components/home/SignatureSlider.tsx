import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/kayra/Button";
import { formatPrice, fromPrice, products } from "@/lib/products";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Scene-change slider: image, name, description and notes cross-fade together
 * so a slide change reads like a cut in a film rather than a carousel slide.
 * Only opacity/transform animate — GPU-friendly, no layout work.
 */
export function SignatureSlider() {
  const [index, setIndex] = useState(0);

  const go = (next: number) => {
    const i = (next + products.length) % products.length;
    setIndex(i);
    const slug = products[i]?.slug;
    if (slug) track("product_interaction", { slug, surface: "signature_slider" });
  };

  return (
    <section
      aria-label="Signature fragrances"
      className="relative overflow-hidden bg-ink text-on-ink"
    >
      <div className="relative grid min-h-[92svh] lg:grid-cols-2">
        {/* Stage */}
        <div className="relative order-1 min-h-[52svh] lg:order-2 lg:min-h-full">
          {products.map((p, i) => (
            <img
              key={p.slug}
              src={p.image}
              alt={p.imageAlt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] [transition-timing-function:var(--ease-luxe)]",
                i === index ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* Copy */}
        <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-8 lg:order-1 lg:px-16 lg:py-24">
          <p className="eyebrow text-on-ink-muted">
            Signature · {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
          </p>

          {products.map((p, i) => (
            <div
              key={p.slug}
              aria-hidden={i !== index}
              className={cn(
                "transition-all duration-700 [transition-timing-function:var(--ease-luxe)]",
                i === index
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute -z-10 opacity-0 translate-y-3",
              )}
            >
              {i === index && (
                <>
                  <h2 className="display-lg mt-4">{p.name}</h2>
                  <p className="eyebrow mt-3 text-brass">{p.identity}</p>
                  <p className="measure mt-6 text-sm leading-relaxed text-on-ink-muted sm:text-base">
                    {p.summary}
                  </p>
                  <dl className="mt-8 grid gap-4 border-t border-on-ink/15 pt-6 text-sm sm:grid-cols-3">
                    {(["top", "heart", "base"] as const).map((layer) => (
                      <div key={layer}>
                        <dt className="eyebrow text-on-ink-muted">{layer} notes</dt>
                        <dd className="mt-2 text-on-ink-muted">{p.notes[layer].join(", ")}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Button asChild variant="onDark">
                      <Link to="/fragrance/$slug" params={{ slug: p.slug }}>
                        Shop {p.name} · from {formatPrice(fromPrice(p))}
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="mt-12 flex items-center gap-6">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous fragrance"
                className="grid h-11 w-11 place-items-center border border-on-ink/25 text-on-ink transition-colors hover:bg-on-ink hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next fragrance"
                className="grid h-11 w-11 place-items-center border border-on-ink/25 text-on-ink transition-colors hover:bg-on-ink hover:text-ink"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <ul className="flex flex-wrap gap-4">
              {products.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index}
                    className={cn(
                      "eyebrow transition-colors",
                      i === index ? "text-on-ink" : "text-on-ink-muted hover:text-on-ink",
                    )}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
