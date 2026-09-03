import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";

import { useState } from "react";

import { Button } from "@/components/kayra/Button";
import { useCart } from "@/lib/cart";
import { placeOrder, reportPaymentFailure, verifyPayment } from "@/lib/checkout.functions";
import { openProviderCheckout } from "@/lib/payments/checkout-client";
import { BRAND, formatPrice } from "@/lib/products";
import { track } from "@/lib/analytics";

const title = "Checkout — Kayra Perfumes";
const description = "Complete your Kayra order. Hand-filled in Srinagar, shipped across India.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Checkout,
});

type Field = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  span?: boolean;
};

const fields: Field[] = [
  { name: "name", label: "Full name", autoComplete: "name", span: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Address", autoComplete: "street-address", span: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "state", label: "State", autoComplete: "address-level1" },
  { name: "pincode", label: "Pincode", autoComplete: "postal-code" },
];

type Confirmation = {
  orderRef: string;
  total: number;
  paid: boolean;
};

function Checkout() {
  const cart = useCart();
  const submit = useServerFn(placeOrder);
  const verify = useServerFn(verifyPayment);
  const reportFailure = useServerFn(reportPaymentFailure);
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const order = await submit({
        data: {
          lines: cart.resolved.map((l) => ({ sku: l.sku, quantity: l.quantity })),
          customer: {
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
            address: String(form.get("address") ?? ""),
            city: String(form.get("city") ?? ""),
            state: String(form.get("state") ?? ""),
            pincode: String(form.get("pincode") ?? ""),
            notes: String(form.get("notes") ?? "") || undefined,
            marketingOptIn: form.get("marketingOptIn") === "on",
            whatsappOptIn: form.get("whatsappOptIn") === "on",
          },
        },
      });

      track("payment_initiated", { orderRef: order.orderRef, total: order.pricing.total });

      const { payment } = order;
      // No live provider configured — the order is recorded and confirmed manually.
      if (!payment.providerOrderId || !payment.publicKey) {
        return { orderRef: order.orderRef, total: order.pricing.total, paid: false };
      }

      const handoff = await openProviderCheckout({
        provider: payment.provider,
        providerOrderId: payment.providerOrderId,
        publicKey: payment.publicKey,
        amount: payment.amount,
        orderRef: order.orderRef,
        customer: order.customer,
      });

      if (handoff.outcome !== "completed") {
        await reportFailure({
          data: {
            orderRef: order.orderRef,
            reason: handoff.outcome === "dismissed" ? "cancelled_by_customer" : handoff.reason,
          },
        }).catch(() => undefined);
        track("payment_failed", { orderRef: order.orderRef });
        throw new Error(handoff.outcome === "dismissed" ? "payment_cancelled" : "payment_failed");
      }

      // The browser's "success" means nothing until the server verifies it.
      const verified = await verify({
        data: {
          orderRef: order.orderRef,
          providerOrderId: handoff.providerOrderId,
          providerPaymentId: handoff.providerPaymentId,
          signature: handoff.signature,
        },
      });

      if (!verified.ok) {
        track("payment_failed", { orderRef: order.orderRef, reason: verified.status });
        throw new Error("payment_unverified");
      }

      track("payment_completed", { orderRef: order.orderRef, total: order.pricing.total });
      return { orderRef: order.orderRef, total: order.pricing.total, paid: true };
    },
    onSuccess: (result) => {
      setConfirmed(result);
      setError(null);
      cart.clear();
    },
    onError: (err: unknown) => {
      const reason = err instanceof Error ? err.message : "";
      if (reason === "payment_cancelled") {
        setError("Payment was cancelled — nothing has been charged. Your bag is still here.");
      } else if (reason === "payment_failed") {
        setError("That payment didn't go through. Nothing was charged — please try again.");
      } else if (reason === "payment_unverified") {
        setError(
          "We couldn't verify that payment. If money has left your account it will be refunded automatically — write to us and we'll confirm.",
        );
      } else {
        setError(
          "We couldn't place that order. Please check your details and try again, or write to us.",
        );
      }
    },
  });

  if (confirmed) {
    return (
      <div className="mx-auto max-w-xl px-5 py-40 text-center sm:px-8">
        <p className="eyebrow text-muted-foreground">
          {confirmed.paid ? "Payment confirmed" : "Order received"}
        </p>
        <h1 className="display-lg mt-5">Thank you.</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Your order reference is{" "}
          <span className="text-foreground">{confirmed.orderRef}</span> for{" "}
          {formatPrice(confirmed.total)}.{" "}
          {confirmed.paid
            ? "A confirmation is on its way to you, and we'll message you again the moment it ships."
            : "Our team will confirm payment and dispatch details with you shortly on the contact information you provided."}
        </p>
        <Link to="/shop" className="eyebrow mt-10 inline-block border-b border-foreground pb-1">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (cart.resolved.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-40 text-center sm:px-8">
        <h1 className="display-lg">Your bag is empty</h1>
        <Link to="/shop" className="eyebrow mt-8 inline-block border-b border-foreground pb-1">
          Browse fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
      <h1 className="display-lg">Checkout</h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(new FormData(e.currentTarget));
          }}
          className="grid gap-6 sm:grid-cols-2"
          noValidate
        >
          <h2 className="eyebrow text-muted-foreground sm:col-span-2">Shipping details</h2>

          {fields.map((f) => (
            <div key={f.name} className={f.span ? "sm:col-span-2" : undefined}>
              <label
                htmlFor={f.name}
                className="block text-xs tracking-[0.16em] uppercase text-muted-foreground"
              >
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                required
                className="mt-2 h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="block text-xs tracking-[0.16em] uppercase text-muted-foreground"
            >
              Order notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-2 w-full border border-border bg-transparent p-4 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>

          <fieldset className="sm:col-span-2 space-y-3 border-t border-border pt-6">
            <legend className="eyebrow text-muted-foreground">Stay in touch</legend>
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input type="checkbox" name="marketingOptIn" className="mt-1 accent-walnut" />
              Email me order updates and new Kayra releases.
            </label>
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input type="checkbox" name="whatsappOptIn" className="mt-1 accent-walnut" />
              Send my order and shipping updates on WhatsApp.
            </label>
          </fieldset>

          {error && (
            <p role="alert" className="sm:col-span-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Placing order…" : "Place order"}
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Payment is confirmed and verified on our servers before dispatch. Questions? Write to{" "}
              {BRAND.email}.
            </p>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="eyebrow text-muted-foreground">Order summary</h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {cart.resolved.map((line) => (
              <li key={line.sku} className="flex gap-4 py-5">
                <img
                  src={line.product.image}
                  alt=""
                  loading="lazy"
                  className="h-20 w-16 shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg">{line.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {line.size} · Qty {line.quantity}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(line.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-serif text-xl">
              <dt>Total</dt>
              <dd>{formatPrice(cart.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
