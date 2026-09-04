import { supabaseAdmin } from "@/integrations/supabase/client.server";

import { notifyOrder, type NotificationTemplate, type OrderRecord } from "./notifications.server";
import { getPaymentProvider, getProviderByName, type OrderLineInput } from "./payments/provider.server";
import { products } from "./products";

/**
 * Server-side order pricing, persistence and lifecycle.
 *
 * Prices are ALWAYS recomputed here from the catalogue — a client-submitted
 * amount is never trusted. Every state change is written to `order_events` and
 * fans out to email/WhatsApp through the notification layer.
 */

export type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string | undefined;
  marketingOptIn: boolean;
  whatsappOptIn: boolean;
};

const SHIPPING_THRESHOLD = 99900;
const SHIPPING_FLAT = 6900;

export function priceOrder(lines: OrderLineInput[]) {
  const priced = lines.flatMap((line) => {
    const product = products.find((p) => p.variants.some((v) => v.sku === line.sku));
    const variant = product?.variants.find((v) => v.sku === line.sku);
    if (!product || !variant) return [];
    const quantity = Math.max(1, Math.min(Math.trunc(line.quantity), 20));
    return [
      {
        sku: variant.sku,
        name: product.name,
        size: variant.size,
        unitPrice: variant.price,
        quantity,
        lineTotal: variant.price * quantity,
      },
    ];
  });

  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  return { lines: priced, subtotal, shipping, total: subtotal + shipping };
}

const orderRef = () =>
  `KAY-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export async function logOrderEvent(
  orderId: string,
  event: string,
  detail: Record<string, string | number | boolean | null> = {},
) {
  await supabaseAdmin.from("order_events").insert({ order_id: orderId, event, detail });
}

export async function createOrder(input: { lines: OrderLineInput[]; customer: CustomerInput }) {
  const pricing = priceOrder(input.lines);
  if (pricing.lines.length === 0) throw new Error("empty_order");

  const ref = orderRef();
  const provider = getPaymentProvider();

  let payment;
  try {
    payment = await provider.createOrder({ orderRef: ref, amount: pricing.total });
  } catch {
    throw new Error("payment_unavailable");
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_ref: ref,
      customer_name: input.customer.name,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone,
      address: input.customer.address,
      city: input.customer.city,
      state: input.customer.state,
      pincode: input.customer.pincode,
      notes: input.customer.notes ?? null,
      marketing_opt_in: input.customer.marketingOptIn,
      whatsapp_opt_in: input.customer.whatsappOptIn,
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      total: pricing.total,
      payment_provider: payment.provider,
      provider_order_id: payment.providerOrderId,
    })
    .select("*")
    .single();

  if (error || !order) throw new Error("order_persist_failed");

  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
    pricing.lines.map((l) => ({
      order_id: order.id,
      sku: l.sku,
      product_name: l.name,
      size: l.size,
      unit_price: l.unitPrice,
      quantity: l.quantity,
      line_total: l.lineTotal,
    })),
  );
  if (itemsError) throw new Error("order_persist_failed");

  await logOrderEvent(order.id, "order_created", { total: pricing.total });
  await notifyOrder(order as OrderRecord, "order_placed");

  return {
    orderRef: ref,
    pricing,
    payment: {
      provider: payment.provider,
      status: payment.status,
      providerOrderId: payment.providerOrderId,
      publicKey: payment.publicKey,
      amount: pricing.total,
    },
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
    },
  };
}

async function getOrderByRef(ref: string) {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_ref", ref)
    .maybeSingle();
  return data;
}

async function getOrderByProviderOrderId(providerOrderId: string) {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("provider_order_id", providerOrderId)
    .maybeSingle();
  return data;
}

/** Marks an order paid (idempotent) and sends the confirmation messages. */
export async function markOrderPaid(
  orderId: string,
  detail: { providerPaymentId?: string | null; source: string },
) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return null;
  if (order.payment_status === "paid") return order;

  const { data: updated } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "paid",
      fulfilment_status: "confirmed",
      failure_reason: null,
      provider_payment_id: detail.providerPaymentId ?? order.provider_payment_id,
    })
    .eq("id", orderId)
    .select("*")
    .single();

  const fresh = updated ?? order;
  await logOrderEvent(orderId, "payment_confirmed", { source: detail.source });
  await notifyOrder(fresh as OrderRecord, "payment_confirmed");
  return fresh;
}

/** Marks a payment attempt failed. The cart stays recoverable client-side. */
export async function markOrderFailed(
  orderId: string,
  detail: { reason: string; providerPaymentId?: string | null; source: string },
) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!order || order.payment_status === "paid") return order ?? null;

  const { data: updated } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "failed",
      failure_reason: detail.reason.slice(0, 240),
      provider_payment_id: detail.providerPaymentId ?? order.provider_payment_id,
    })
    .eq("id", orderId)
    .select("*")
    .single();

  const fresh = updated ?? order;
  await logOrderEvent(orderId, "payment_failed", { reason: detail.reason, source: detail.source });
  await notifyOrder(fresh as OrderRecord, "payment_failed");
  return fresh;
}

/**
 * Verifies the checkout handoff signature server-side. A browser claiming
 * "payment successful" is never trusted — the signature is recomputed with the
 * provider secret, and the payment is re-fetched from the provider API.
 */
export async function verifyCheckoutPayment(input: {
  orderRef: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}) {
  const order = await getOrderByRef(input.orderRef);
  if (!order) return { ok: false as const, status: "unknown_order" as const };
  if (order.payment_status === "paid") return { ok: true as const, status: "paid" as const };

  const provider = getProviderByName(order.payment_provider);
  const signatureValid = provider.verifyCheckoutSignature({
    providerOrderId: input.providerOrderId,
    providerPaymentId: input.providerPaymentId,
    signature: input.signature,
  });

  if (!signatureValid || order.provider_order_id !== input.providerOrderId) {
    await markOrderFailed(order.id, { reason: "signature_mismatch", source: "checkout" });
    return { ok: false as const, status: "invalid_signature" as const };
  }

  const remote = await provider.fetchPayment?.(input.providerPaymentId);
  if (remote && !["captured", "authorized"].includes(remote.status)) {
    await markOrderFailed(order.id, {
      reason: `provider_status_${remote.status}`,
      providerPaymentId: input.providerPaymentId,
      source: "checkout",
    });
    return { ok: false as const, status: "not_captured" as const };
  }

  await markOrderPaid(order.id, {
    providerPaymentId: input.providerPaymentId,
    source: "checkout",
  });
  return { ok: true as const, status: "paid" as const };
}

/** Records a provider webhook once. Returns false when already seen. */
export async function recordWebhook(input: {
  provider: string;
  eventId: string;
  eventType?: string | null;
  payload: unknown;
}) {
  const { error } = await supabaseAdmin.from("payment_webhooks").insert({
    provider: input.provider,
    event_id: input.eventId,
    event_type: input.eventType ?? null,
    payload: input.payload as never,
  });
  return !error;
}

export async function applyPaymentWebhook(input: {
  provider: string;
  eventType: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  reason?: string | null;
}) {
  if (!input.providerOrderId) return { handled: false as const };
  const order = await getOrderByProviderOrderId(input.providerOrderId);
  if (!order) return { handled: false as const };

  if (input.eventType === "payment.captured" || input.eventType === "order.paid") {
    await markOrderPaid(order.id, {
      providerPaymentId: input.providerPaymentId,
      source: "webhook",
    });
    return { handled: true as const };
  }

  if (input.eventType === "payment.failed") {
    await markOrderFailed(order.id, {
      reason: input.reason ?? "payment_failed",
      providerPaymentId: input.providerPaymentId,
      source: "webhook",
    });
    return { handled: true as const };
  }

  await logOrderEvent(order.id, `webhook_${input.eventType}`, {});
  return { handled: true as const };
}

export type ShipmentUpdate = {
  orderRef: string;
  status: "packed" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string | undefined;
  courier?: string | undefined;
};

/** Fulfilment update — also the trigger for shipment notifications. */
export async function updateShipment(input: ShipmentUpdate) {
  const order = await getOrderByRef(input.orderRef);
  if (!order) return { ok: false as const, status: "unknown_order" as const };

  const { data: updated } = await supabaseAdmin
    .from("orders")
    .update({
      fulfilment_status: input.status,
      tracking_number: input.trackingNumber ?? order.tracking_number,
      courier: input.courier ?? order.courier,
    })
    .eq("id", order.id)
    .select("*")
    .single();

  const fresh = (updated ?? order) as OrderRecord;
  await logOrderEvent(order.id, `order_${input.status}`, {
    trackingNumber: input.trackingNumber ?? null,
    courier: input.courier ?? null,
  });

  const template: NotificationTemplate | null =
    input.status === "shipped"
      ? "order_shipped"
      : input.status === "delivered"
        ? "order_delivered"
        : null;
  if (template) await notifyOrder(fresh, template);

  return { ok: true as const, status: input.status, orderRef: order.order_ref };
}

/** Failure recovery entry point used when the browser reports a dropped payment. */
export async function markOrderFailedByRef(ref: string, reason: string) {
  const order = await getOrderByRef(ref);
  if (!order) return null;
  return markOrderFailed(order.id, { reason, source: "client_report" });
}

/**
 * Abandoned-cart sweep — finds orders left unpaid for a while and sends one
 * "your bag is still waiting" reminder each. Safe to call as often as you
 * like: the notifications table has a unique (order, channel, template)
 * constraint, so notifyOrder() silently skips an order that's already been
 * reminded, no matter how many times this sweep runs.
 */
export async function sweepAbandonedCarts() {
  const remindAfter = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour old
  const ignoreOlderThan = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // don't nag on week-old carts

  const { data: candidates } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("payment_status", "pending")
    .lte("created_at", remindAfter)
    .gte("created_at", ignoreOlderThan);

  if (!candidates?.length) return { swept: 0 };

  for (const order of candidates) {
    await notifyOrder(order as OrderRecord, "abandoned_cart");
  }
  return { swept: candidates.length };
}