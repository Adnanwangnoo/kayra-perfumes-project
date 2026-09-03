import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/kayra/SearchOverlay";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "The House" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-ink/92 text-on-ink backdrop-blur-sm">
        <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-8 md:h-20">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="-ml-2 grid h-10 w-10 shrink-0 place-items-center text-on-ink md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="eyebrow text-on-ink-muted transition-colors duration-500 hover:text-on-ink"
                  activeProps={{ className: "eyebrow text-on-ink" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            to="/"
            className="kayra-wordmark justify-self-center text-[0.95rem] text-on-ink md:text-[1.05rem]"
            aria-label="Kayra Perfumes — home"
          >
            Kayra
          </Link>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search fragrances"
              className="grid h-10 w-10 place-items-center text-on-ink-muted transition-colors hover:text-on-ink"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={cart.open}
              aria-label={`Open cart, ${cart.count} item${cart.count === 1 ? "" : "s"}`}
              className="relative -mr-2 grid h-10 w-10 place-items-center text-on-ink-muted transition-colors hover:text-on-ink"
            >
              <ShoppingBag className="h-4 w-4" />
              {cart.count > 0 && (
                <span className="absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brass px-1 text-[0.5625rem] font-medium text-ink">
                  {cart.count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-on-ink/10 transition-[max-height,opacity] duration-500 [transition-timing-function:var(--ease-luxe)] md:hidden",
            menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b border-on-ink/10 py-4 font-serif text-2xl text-on-ink last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
