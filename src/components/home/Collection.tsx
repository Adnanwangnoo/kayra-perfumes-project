import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/kayra/Reveal";
import { ProductCard } from "@/components/kayra/ProductCard";
import { products } from "@/lib/products";

export function Collection() {
  return (
    <section aria-labelledby="collection-heading" className="bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-muted-foreground">The collection</p>
            <h2 id="collection-heading" className="display-lg mt-5">
              Four fragrances.
            </h2>
          </div>
          <Link to="/shop" className="eyebrow border-b border-foreground pb-1">
            Shop all
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 90}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
