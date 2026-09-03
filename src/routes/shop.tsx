import { absoluteUrl } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/kayra/ProductCard";
import { Reveal } from "@/components/kayra/Reveal";
import { BRAND, products } from "@/lib/products";

const title = "Shop all fragrances — Kayra Perfumes";
const description =
  "Browse the full Kayra collection: Bloom, London, Paris and Signature Oudh, non-alcoholic eau de parfum in 6 ml and 12 ml, hand-filled in Srinagar.";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/shop") },
      { property: "og:image", content: absoluteUrl("/images/london.jpg") },
      { name: "twitter:image", content: absoluteUrl("/images/london.jpg") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/shop") }],
  }),
  component: Shop,
});

/** CollectionPage + ItemList so the collection is eligible for rich results. */
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "All Kayra fragrances",
  description,
  url: "/shop",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${BRAND.name} ${product.name}`,
        url: `/fragrance/${product.slug}`,
        category: "Eau de parfum",
        brand: { "@type": "Brand", name: BRAND.name },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          offerCount: product.variants.length,
          lowPrice: (Math.min(...product.variants.map((v) => v.price)) / 100).toFixed(2),
          highPrice: (Math.max(...product.variants.map((v) => v.price)) / 100).toFixed(2),
        },
      },
    })),
  },
};

function Shop() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Reveal>
        <p className="eyebrow text-muted-foreground">The collection</p>
        <h1 className="display-lg mt-5">All fragrances</h1>
        <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every Kayra fragrance is a non-alcoholic eau de parfum, blended and filled by hand in
          Srinagar. Choose 6 ml for carrying, 12 ml for keeping.
        </p>
      </Reveal>


      <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={i * 80}>
            <ProductCard product={product} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
