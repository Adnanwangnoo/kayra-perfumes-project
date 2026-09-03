/**
 * Payment provider abstraction.
 *
 * The app never talks to a payment SDK directly — it talks to this interface,
 * so Razorpay (or any other provider) can be swapped by adding one adapter and
 * changing PAYMENT_PROVIDER. All secrets are read inside handlers on the
 * server; nothing here is ever bundled to the browser.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export type OrderLineInput = {
  sku: string;
  quantity: number;
};

export type PaymentOrder = {
  provider: string;
  /** Kayra's own order reference, shown to the customer. */
  orderRef: string;
  /** Provider-side order id, if the provider has been configured. */
  providerOrderId: string | null;
  amount: number;
  currency: "INR";
  status: "created" | "requires_configuration";
  /** Publishable client key, safe to send to the browser. */
  publicKey: string | null;
};

export interface PaymentProvider {
  readonly name: string;
  isConfigured(): boolean;
  createOrder(input: { orderRef: string; amount: number }): Promise<PaymentOrder>;
  /** Verifies the checkout handoff signature (order_id|payment_id). */
  verifyCheckoutSignature(input: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): boolean;
  /** Verifies a webhook body against the provider's webhook secret. */
  verifyWebhookSignature(input: { payload: string; signature: string | null }): boolean;
  fetchPayment?(paymentId: string): Promise<{ status: string; orderId: string | null } | null>;
}

export function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Manual / pay-on-confirmation fallback. Used until a live provider is
 * configured so checkout keeps working end to end without fake payments.
 */
const manualProvider: PaymentProvider = {
  name: "manual",
  isConfigured: () => true,
  async createOrder({ orderRef, amount }) {
    return {
      provider: "manual",
      orderRef,
      providerOrderId: null,
      amount,
      currency: "INR",
      status: "requires_configuration",
      publicKey: null,
    };
  },
  verifyCheckoutSignature: () => false,
  verifyWebhookSignature: () => false,
};

const razorpayProvider: PaymentProvider = {
  name: "razorpay",
  isConfigured: () =>
    Boolean(process.env["RAZORPAY_KEY_ID"] && process.env["RAZORPAY_KEY_SECRET"]),

  async createOrder({ orderRef, amount }) {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keyId || !keySecret) return manualProvider.createOrder({ orderRef, amount });

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: orderRef,
        notes: { orderRef },
      }),
    });
    if (!res.ok) throw new Error("payment_order_failed");
    const data = (await res.json()) as { id: string };

    return {
      provider: "razorpay",
      orderRef,
      providerOrderId: data.id,
      amount,
      currency: "INR",
      status: "created",
      publicKey: keyId,
    };
  },

  verifyCheckoutSignature({ providerOrderId, providerPaymentId, signature }) {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keySecret || !signature) return false;
    const expected = createHmac("sha256", keySecret)
      .update(`${providerOrderId}|${providerPaymentId}`)
      .digest("hex");
    return safeEqualHex(expected, signature);
  },

  verifyWebhookSignature({ payload, signature }) {
    const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
    if (!secret || !signature) return false;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    return safeEqualHex(expected, signature);
  },

  async fetchPayment(paymentId: string) {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keyId || !keySecret) return null;
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { status: string; order_id?: string };
    return { status: data.status, orderId: data.order_id ?? null };
  },
};

export function getPaymentProvider(): PaymentProvider {
  const configured = (process.env["PAYMENT_PROVIDER"] ?? "razorpay").toLowerCase();
  if (configured === "razorpay" && razorpayProvider.isConfigured()) return razorpayProvider;
  return manualProvider;
}

export function getProviderByName(name: string): PaymentProvider {
  return name === "razorpay" ? razorpayProvider : manualProvider;
}
