/**
 * Browser-side checkout handoff.
 *
 * Only publishable data (the provider order id and public key) crosses to the
 * browser. The result of this handoff is NEVER trusted on its own — the caller
 * must verify it server-side before treating an order as paid.
 */

export type ProviderCheckoutInput = {
  provider: string;
  providerOrderId: string;
  publicKey: string;
  amount: number;
  orderRef: string;
  customer: { name: string; email: string; phone: string };
};

export type ProviderCheckoutResult =
  | { outcome: "completed"; providerPaymentId: string; providerOrderId: string; signature: string }
  | { outcome: "dismissed" }
  | { outcome: "failed"; reason: string };

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset["loaded"] === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script_error")));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset["loaded"] = "true";
      resolve();
    });
    script.addEventListener("error", () => reject(new Error("script_error")));
    document.head.appendChild(script);
  });
}

export async function openProviderCheckout(
  input: ProviderCheckoutInput,
): Promise<ProviderCheckoutResult> {
  if (input.provider !== "razorpay") return { outcome: "failed", reason: "unsupported_provider" };

  try {
    await loadScript(SCRIPT_SRC);
  } catch {
    return { outcome: "failed", reason: "checkout_script_unavailable" };
  }

  const Razorpay = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;
  if (!Razorpay) return { outcome: "failed", reason: "checkout_unavailable" };

  return new Promise<ProviderCheckoutResult>((resolve) => {
    let settled = false;
    const settle = (result: ProviderCheckoutResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const instance = new Razorpay({
      key: input.publicKey,
      order_id: input.providerOrderId,
      amount: input.amount,
      currency: "INR",
      name: "Kayra Perfumes",
      description: `Order ${input.orderRef}`,
      prefill: {
        name: input.customer.name,
        email: input.customer.email,
        contact: input.customer.phone,
      },
      theme: { color: "#0f0d0b" },
      handler: (response: RazorpayHandlerResponse) =>
        settle({
          outcome: "completed",
          providerPaymentId: response.razorpay_payment_id,
          providerOrderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        }),
      modal: { ondismiss: () => settle({ outcome: "dismissed" }) },
    });

    instance.open();
  });
}
