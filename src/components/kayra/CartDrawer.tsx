import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/kayra/Button";
import { useCart } from "@/lib/cart";
import { BRAND, formatPrice } from "@/lib/products";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const cart = useCart();

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart.isOpen, cart]);

  return (
    <>
      <div
        onClick={cart.close}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[65] bg-ink/50 transition-opacity duration-500",
          cart.isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal={cart.isOpen}
        aria-label="Shopping bag"
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-[430px] flex-col bg-background transition-transform duration-700 [transition-timing-function:var(--ease-luxe)]",
          cart.isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="eyebrow text-muted-foreground">Your bag ({cart.count})</h2>
          <button
            type="button"
            onClick={cart.close}
            aria-label="Close bag"
            className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {cart.resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-2xl">Your bag is empty.</p>
            <p className="text-sm text-muted-foreground">
              Four fragrances, each bottled in Srinagar.
            </p>
            <Button asChild variant="outline" size="sm" onClick={cart.close}>
              <Link to="/shop">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {cart.resolved.map((line) => (
                <li
                  key={line.sku}
                  className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-border py-6"
                >
                  <Link
                    to="/fragrance/$slug"
                    params={{ slug: line.slug }}
                    onClick={cart.close}
                    className="block"
                  >
                    <img
                      src={line.product.image}
                      alt={line.product.imageAlt}
                      loading="lazy"
                      className="h-24 w-[72px] object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-serif text-xl leading-tight">
                          {line.product.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {line.size} · {line.product.concentration}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(line.sku)}
                        className="eyebrow shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease ${line.product.name} quantity`}
                          onClick={() => cart.setQuantity(line.sku, line.quantity - 1)}
                          className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${line.product.name} quantity`}
                          onClick={() => cart.setQuantity(line.sku, line.quantity + 1)}
                          className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm">{formatPrice(line.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-6 py-6">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{cart.shipping === 0 ? "Complimentary" : formatPrice(cart.shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-serif text-xl">
                  <dt>Total</dt>
                  <dd>{formatPrice(cart.total)}</dd>
                </div>
              </dl>
              {cart.shipping > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Complimentary shipping over {formatPrice(BRAND.shippingThreshold)}.
                </p>
              )}
              <Button
                asChild
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  track("begin_checkout", { value: cart.total, items: cart.count });
                  cart.close();
                }}
              >
                <Link to="/checkout">Checkout</Link>
              </Button>
              <button
                type="button"
                onClick={cart.close}
                className="eyebrow mt-4 w-full text-muted-foreground hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
