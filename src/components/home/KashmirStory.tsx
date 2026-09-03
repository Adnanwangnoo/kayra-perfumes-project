import { Reveal } from "@/components/kayra/Reveal";
import { getProduct } from "@/lib/products";

export function KashmirStory() {
  const backdrop = getProduct("london");

  return (
    <section aria-labelledby="kashmir-heading" className="bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Born in Kashmir</p>
            <h2 id="kashmir-heading" className="display-lg mt-5">
              Composed where
              <br />
              the air is cold.
            </h2>
            <div className="measure mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Kayra is made in Srinagar. The valley shapes the work — snowmelt, walnut wood,
                saffron fields, the resin of chinar bark after rain. These are the references our
                perfumer returns to.
              </p>
              <p>
                Every bottle is a non-alcoholic eau de parfum, blended and filled by hand in Lal
                Bazar, then boxed in black and gold before it leaves us.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-border pt-8 text-sm sm:grid-cols-3">
              <div>
                <dt className="eyebrow text-muted-foreground">Made in</dt>
                <dd className="mt-2 font-serif text-xl">Srinagar</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Formulation</dt>
                <dd className="mt-2 font-serif text-xl">Non-alcoholic</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Shelf life</dt>
                <dd className="mt-2 font-serif text-xl">48 months</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={140} className="relative">
            {backdrop && (
              <img
                src={backdrop.image}
                alt={backdrop.imageAlt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 hidden h-24 w-24 border-b border-l border-walnut/50 lg:block"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
