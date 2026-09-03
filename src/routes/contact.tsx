import { absoluteUrl } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/kayra/Button";
import { Reveal } from "@/components/kayra/Reveal";
import { BRAND } from "@/lib/products";
import { track } from "@/lib/analytics";

const title = "Contact Kayra Perfumes — Srinagar, Kashmir";
const description =
  "Reach the Kayra workshop in Srinagar for orders, gifting, stockist enquiries and fragrance advice.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/contact") },
      { property: "og:image", content: absoluteUrl("/images/paris.jpg") },
      { name: "twitter:image", content: absoluteUrl("/images/paris.jpg") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
      <Reveal>
        <p className="eyebrow text-muted-foreground">Contact</p>
        <h1 className="display-lg mt-5">Talk to the workshop.</h1>
        <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Orders, gifting, stockist enquiries or help choosing a fragrance — write to us and a
          person from the workshop replies.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        {sent ? (
          <div className="border border-border p-10">
            <h2 className="font-serif text-3xl">Message noted.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Thank you — please also write to {BRAND.email} if your enquiry is urgent, and we will
              reply the same working day.
            </p>
          </div>
        ) : (
          <form
            className="grid gap-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              track("contact_submitted", {});
              setSent(true);
            }}
          >
            <div>
              <label
                htmlFor="c-name"
                className="block text-xs tracking-[0.16em] uppercase text-muted-foreground"
              >
                Name
              </label>
              <input
                id="c-name"
                name="name"
                required
                autoComplete="name"
                className="mt-2 h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="c-email"
                className="block text-xs tracking-[0.16em] uppercase text-muted-foreground"
              >
                Email
              </label>
              <input
                id="c-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="c-message"
                className="block text-xs tracking-[0.16em] uppercase text-muted-foreground"
              >
                Message
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={5}
                required
                className="mt-2 w-full border border-border bg-transparent p-4 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg">
                Send message
              </Button>
            </div>
          </form>
        )}

        <aside className="space-y-8 text-sm">
          <div>
            <h2 className="eyebrow text-muted-foreground">Workshop</h2>
            <p className="mt-3 leading-relaxed">{BRAND.address}</p>
          </div>
          <div>
            <h2 className="eyebrow text-muted-foreground">Email</h2>
            <a href={`mailto:${BRAND.email}`} className="mt-3 block hover:text-walnut">
              {BRAND.email}
            </a>
          </div>
          <div>
            <h2 className="eyebrow text-muted-foreground">Phone & WhatsApp</h2>
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              className="mt-3 block hover:text-walnut"
            >
              {BRAND.phone}
            </a>
            <a
              href={`https://wa.me/${BRAND.phone.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 block hover:text-walnut"
            >
              Message us on WhatsApp
            </a>
          </div>
          <div>
            <h2 className="eyebrow text-muted-foreground">Instagram</h2>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 block hover:text-walnut"
            >
              @kayraperfumes
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
