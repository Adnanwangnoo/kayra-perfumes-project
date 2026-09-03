import { absoluteUrl } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/kayra/Reveal";
import { BRAND, getProduct } from "@/lib/products";

const title = "About Kayra — Perfumery from Srinagar, Kashmir";
const description =
  "Kayra Perfumes is a small perfume house in Srinagar making non-alcoholic eau de parfum by hand, inspired by the Kashmir valley.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/about") },
      { property: "og:image", content: absoluteUrl("/images/signature-oudh.jpg") },
      { name: "twitter:image", content: absoluteUrl("/images/signature-oudh.jpg") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
  component: About,
});

function About() {
  const hero = getProduct("signature-oudh");

  return (
    <div className="pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-muted-foreground">About</p>
          <h1 className="display-lg mt-5 max-w-3xl">
            A small perfume house in the valley.
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <div className="measure space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Kayra began in Lal Bazar, Srinagar, with a simple idea: a fragrance can hold a
                place. The valley gives us our references — snowmelt, walnut wood, chinar bark
                after rain, the sweetness of an orchard in spring.
              </p>
              <p>
                Every fragrance is a non-alcoholic eau de parfum. We blend in small batches, fill
                by hand, and box each bottle in black and gold before it leaves the workshop. There
                are four fragrances today; we would rather have four we believe in than forty.
              </p>
              <p>
                We are a young brand and we sell directly. If you write to us, you reach the people
                who made your bottle.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-8 text-sm">
              <div>
                <dt className="eyebrow text-muted-foreground">Workshop</dt>
                <dd className="mt-2 leading-relaxed">{BRAND.address}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Reach us</dt>
                <dd className="mt-2 leading-relaxed">
                  {BRAND.email}
                  <br />
                  {BRAND.phone}
                </dd>
              </div>
            </dl>

            <Link
              to="/contact"
              className="eyebrow mt-10 inline-block border-b border-foreground pb-1"
            >
              Contact us
            </Link>
          </Reveal>

          <Reveal delay={140}>
            {hero && (
              <img
                src={hero.image}
                alt={hero.imageAlt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
