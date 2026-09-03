import { Link } from "@tanstack/react-router";

import { Button } from "@/components/kayra/Button";
import { formatPrice, fromPrice, type Product } from "@/lib/products";

/**
 * Cinematic opening. Sequenced with CSS animation-delay only — no JS timeline,
 * no layout thrash, and fully disabled under prefers-reduced-motion.
 */
export function Hero({ product }: { product: Product }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-on-ink pb-14 pt-28 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 stage-veil" aria-hidden="true">
        <img
          src={product.image}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="stage-drift h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_35%,transparent,var(--ink))]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p
            className="kayra-wordmark stage-rise text-[1.75rem] leading-none sm:text-[2.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            Kayra
          </p>
          <p
            className="eyebrow stage-rise mt-5 text-on-ink-muted"
            style={{ animationDelay: "1000ms" }}
          >
            Born in Kashmir · Eau de Parfum
          </p>
          <h1
            className="display-xl stage-rise mt-4"
            style={{ animationDelay: "1300ms" }}
          >
            {product.name}
          </h1>
          <p
            className="eyebrow stage-rise mt-4 text-brass"
            style={{ animationDelay: "1600ms" }}
          >
            {product.identity}
          </p>
          <p
            className="measure stage-rise mt-6 text-sm leading-relaxed text-on-ink-muted sm:text-base"
            style={{ animationDelay: "1850ms" }}
          >
            {product.summary}
          </p>
          <div
            className="stage-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "2100ms" }}
          >
            <Button asChild variant="onDark" size="lg">
              <Link to="/fragrance/$slug" params={{ slug: product.slug }}>
                Discover {product.name}
              </Link>
            </Button>
            <Button asChild variant="ghostOnDark" size="lg">
              <Link to="/shop">The collection</Link>
            </Button>
          </div>
        </div>

        <dl
          className="stage-rise grid grid-cols-2 gap-x-8 gap-y-6 border-t border-on-ink/15 pt-8 text-sm lg:border-t-0 lg:pt-0"
          style={{ animationDelay: "2350ms" }}
        >
          <div>
            <dt className="eyebrow text-on-ink-muted">From</dt>
            <dd className="mt-2 font-serif text-2xl">{formatPrice(fromPrice(product))}</dd>
          </div>
          <div>
            <dt className="eyebrow text-on-ink-muted">Sizes</dt>
            <dd className="mt-2 font-serif text-2xl">
              {product.variants.map((v) => v.size).join(" · ")}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="eyebrow text-on-ink-muted">Notes</dt>
            <dd className="mt-2 text-on-ink-muted">
              {[...product.notes.top, ...product.notes.heart, ...product.notes.base].join(", ")}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
