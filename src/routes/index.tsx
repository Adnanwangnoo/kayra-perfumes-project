import { absoluteUrl } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Hero } from "@/components/home/Hero";
import { SignatureSlider } from "@/components/home/SignatureSlider";
import { KashmirStory } from "@/components/home/KashmirStory";
import { NotesExperience } from "@/components/home/NotesExperience";
import { Collection } from "@/components/home/Collection";
import { Reveal } from "@/components/kayra/Reveal";
import { BRAND, products } from "@/lib/products";

const title = "Kayra Perfumes — Non-alcoholic eau de parfum from Kashmir";
const description =
  "Kayra blends non-alcoholic eau de parfum by hand in Srinagar. Bloom, London, Paris and Signature Oudh in 6 ml and 12 ml.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:image", content: absoluteUrl("/images/bloom.jpg") },
      { name: "twitter:image", content: absoluteUrl("/images/bloom.jpg") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: BRAND.name,
            email: BRAND.email,
            telephone: BRAND.phone,
            sameAs: [BRAND.instagram],
            address: { "@type": "PostalAddress", streetAddress: BRAND.address },
          }),
        }}
      />
      <Hero product={products.find((p) => p.featured) ?? products[0]!} />
      <SignatureSlider />
      <KashmirStory />
      <NotesExperience />
      <Collection />

      <section aria-labelledby="cta-heading" className="bg-ink text-on-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8 md:py-36">
          <Reveal>
            <p className="eyebrow text-on-ink-muted">Wear it</p>
            <h2 id="cta-heading" className="display-lg mt-6">
              Find your Kayra.
            </h2>
            <p className="measure mx-auto mt-6 text-sm text-on-ink-muted sm:text-base">
              Free shipping across India on orders above ₹999. Hand-filled in Srinagar and
              dispatched within two working days.
            </p>
            <Link
              to="/shop"
              className="eyebrow mt-10 inline-block border-b border-on-ink pb-1"
            >
              Shop the collection
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
