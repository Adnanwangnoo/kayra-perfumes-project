import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/kayra/Button";
import { Reveal } from "@/components/kayra/Reveal";
import { ProductCard } from "@/components/kayra/ProductCard";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { BRAND, formatPrice, getProduct, products, type NoteLayer } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/fragrance/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Fragrance not found — Kayra" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${product.concentration} | Kayra Perfumes`;
    return {
      meta: [
        { title },
        { name: "description", content: product.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: product.summary },
        { property: "og:type", content: "product" },
        { property: "og:image", content: absoluteUrl(product.image) },
        { property: "og:url", content: absoluteUrl(`/fragrance/${product.slug}`) },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: product.summary },
        { name: "twitter:image", content: absoluteUrl(product.image) },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(`/fragrance/${product.slug}`) }],
    };
  },
  notFoundComponent: FragranceNotFound,
  component: FragranceDetail,
});

function FragranceNotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-40 text-center">
      <h1 className="display-lg">Fragrance not found</h1>
      <Link to="/shop" className="eyebrow mt-8 inline-block border-b border-foreground pb-1">
        Back to the collection
      </Link>
    </div>
  );
}

const layerLabels: { key: NoteLayer; label: string }[] = [
  { key: "top", label: "Top notes" },
  { key: "heart", label: "Heart notes" },
  { key: "base", label: "Base notes" },
];

function FragranceDetail() {
  const { product } = Route.useLoaderData();
  const cart = useCart();
  const [sku, setSku] = useState(product.variants[0]!.sku);
  const variant = product.variants.find((v) => v.sku === sku) ?? product.variants[0]!;
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const specs = [
    { label: "Longevity", value: product.longevity },
    { label: "Projection", value: product.projection },
    { label: "Occasion", value: product.occasion },
    { label: "Season", value: product.season },
    { label: "Formulation", value: product.formulation },
    { label: "Made in", value: "Srinagar, Kashmir" },
  ];

  return (
    <div className="pt-24 sm:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${BRAND.name} ${product.name}`,
            description: product.summary,
            brand: { "@type": "Brand", name: BRAND.name },
            offers: product.variants.map((v) => ({
              "@type": "Offer",
              name: v.size,
              sku: v.sku,
              price: (v.price / 100).toFixed(2),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            })),
          }),
        }}
      />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <ol className="flex gap-2 text-xs tracking-[0.14em] uppercase text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground">
              Kayra
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/shop" className="hover:text-foreground">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="mx-auto mt-8 grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="group overflow-hidden bg-secondary">
            <img
              src={product.image}
              alt={product.imageAlt}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[2000ms] [transition-timing-function:var(--ease-luxe)] group-hover:scale-[1.06]"
            />
          </div>
        </div>

        <div>
          <p className="eyebrow text-walnut">{product.identity}</p>
          <h1 className="display-lg mt-4">{product.name}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{product.concentration}</p>

          <p className="measure mt-8 text-base leading-relaxed sm:text-lg">{product.summary}</p>

          <div className="mt-10">
            <p className="eyebrow text-muted-foreground">Size</p>
            <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Size">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  type="button"
                  role="radio"
                  aria-checked={v.sku === sku}
                  onClick={() => setSku(v.sku)}
                  className={cn(
                    "border px-6 py-3 text-xs tracking-[0.18em] uppercase transition-colors duration-300",
                    v.sku === sku
                      ? "border-foreground bg-foreground text-on-ink"
                      : "border-border hover:border-foreground",
                  )}
                >
                  {v.size} — {formatPrice(v.price)}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 font-serif text-3xl">{formatPrice(variant.price)}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => cart.add(product.slug, variant.sku)}
              className="min-w-[200px] flex-1"
            >
              Add to bag
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="min-w-[160px] flex-1"
              onClick={() => cart.add(product.slug, variant.sku)}
            >
              <Link to="/checkout" onClick={() => track("begin_checkout", { source: "pdp" })}>
                Buy now
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free shipping in India above {formatPrice(BRAND.shippingThreshold)}. Dispatched from
            Srinagar within 2 working days.
          </p>

          <div className="mt-14 border-t border-border pt-10">
            <h2 className="eyebrow text-muted-foreground">The composition</h2>
            <dl className="mt-6 space-y-6">
              {layerLabels.map((layer) => (
                <div key={layer.key} className="grid gap-2 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <dt className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                    {layer.label}
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {product.notes[layer.key].map((note) => (
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

          <div className="mt-12 border-t border-border pt-10">
            <h2 className="eyebrow text-muted-foreground">The story</h2>
            <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {product.editorial}
            </p>
          </div>

          <div className="mt-12 border-t border-border pt-10">
            <h2 className="eyebrow text-muted-foreground">Details</h2>
            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-sm">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-heading" className="mt-28 bg-secondary">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Also from Kayra</p>
            <h2 id="related-heading" className="display-lg mt-4">
              Continue the collection
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
