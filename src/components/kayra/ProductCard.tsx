import { Link } from "@tanstack/react-router";

import { formatPrice, fromPrice, type Product } from "@/lib/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="group">
      <Link
        to="/fragrance/$slug"
        params={{ slug: product.slug }}
        className="block focus-visible:outline-offset-4"
      >
        <div className="relative overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.imageAlt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] [transition-timing-function:var(--ease-luxe)] group-hover:scale-[1.05]"
          />
        </div>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
          <h3 className="truncate font-serif text-2xl">{product.name}</h3>
          <p className="shrink-0 text-sm text-muted-foreground">
            from {formatPrice(fromPrice(product))}
          </p>
        </div>
        <p className="eyebrow mt-2 text-walnut">{product.identity}</p>
        <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
          {product.summary}
        </p>
        <p className="eyebrow mt-5 inline-block border-b border-transparent pb-1 transition-colors duration-500 group-hover:border-foreground">
          {product.variants.map((v) => v.size).join(" · ")} — View fragrance
        </p>
      </Link>
    </article>
  );
}
