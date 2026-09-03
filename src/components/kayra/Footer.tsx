import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/kayra/Button";
import { BRAND } from "@/lib/products";
import { track } from "@/lib/analytics";

const emailSchema = z.string().trim().email().max(254);

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setState("error");
      return;
    }
    // Opt-in only. Wired to the newsletter endpoint when email delivery is connected.
    track("newsletter_signup", { source: "footer" });
    setState("done");
    setEmail("");
  };

  return (
    <footer className="bg-ink text-on-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.2fr_repeat(2,minmax(0,0.7fr))_1.1fr]">
          <div>
            <p className="kayra-wordmark text-lg">Kayra</p>
            <p className="measure mt-5 text-sm leading-relaxed text-on-ink-muted">
              Non-alcoholic eau de parfum, composed and bottled in Srinagar, Kashmir.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="eyebrow text-on-ink-muted">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "The House" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to as "/"}
                    className="text-on-ink-muted transition-colors hover:text-on-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-on-ink-muted">Customer care</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {["Shipping", "Returns", "FAQ", "Privacy", "Terms"].map((l) => (
                <li key={l}>
                  <Link
                    to="/contact"
                    className="text-on-ink-muted transition-colors hover:text-on-ink"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-on-ink-muted">The Kayra letter</h2>
            <p className="mt-5 text-sm text-on-ink-muted">
              New compositions and private releases. Only if you ask for it.
            </p>
            <form onSubmit={submit} className="mt-5" noValidate>
              <label className="block">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setState("idle");
                  }}
                  placeholder="you@email.com"
                  autoComplete="email"
                  maxLength={254}
                  className="w-full border-b border-on-ink/25 bg-transparent pb-3 text-sm text-on-ink placeholder:text-on-ink-muted/60 focus:border-brass focus:outline-none"
                />
              </label>
              <Button type="submit" variant="ghostOnDark" size="sm" className="mt-4">
                Subscribe
              </Button>
              <p aria-live="polite" className="mt-3 text-xs text-on-ink-muted">
                {state === "done" && "Thank you — we'll be in touch."}
                {state === "error" && "Please enter a valid email address."}
              </p>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-on-ink/10 pt-8 text-xs text-on-ink-muted sm:flex-row sm:items-end sm:justify-between">
          <address className="not-italic leading-relaxed">
            {BRAND.address}
            <br />
            <a href={`mailto:${BRAND.email}`} className="hover:text-on-ink">
              {BRAND.email}
            </a>{" "}
            ·{" "}
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="hover:text-on-ink">
              {BRAND.phone}
            </a>
          </address>
          <div className="flex items-center gap-6">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Kayra Perfumes on Instagram"
              className="hover:text-on-ink"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <span>© {new Date().getFullYear()} Kayra Perfumes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
