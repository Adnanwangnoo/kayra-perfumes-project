/**
 * Order notifications — email + WhatsApp.
 *
 * Every message is triggered from the server-side order workflow only, is
 * recorded in `notifications` (unique per order+channel+template, so a repeated
 * webhook never sends twice), and requires consent:
 *   - email: transactional order mail always goes to the buyer's own address;
 *            marketing mail requires marketing_opt_in.
 *   - WhatsApp: only when whatsapp_opt_in is true.
 *
 * Providers are swappable: EMAIL_API_KEY (Resend-compatible) and
 * WHATSAPP_API_KEY + WHATSAPP_PHONE_NUMBER_ID (WhatsApp Cloud API). When a
 * provider is not configured the notification is logged as `skipped` — the
 * order flow never fails because messaging is down.
 */

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type NotificationTemplate =
  | "order_placed"
  | "payment_confirmed"
  | "payment_failed"
  | "order_shipped"
  | "order_delivered";

export type OrderRecord = {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  whatsapp_opt_in: boolean;
  tracking_number?: string | null;
  courier?: string | null;
};

const rupees = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

const BRAND_NAME = "Kayra Perfumes";
const SUPPORT_EMAIL = "kayraperfumes@gmail.com";

function copy(template: NotificationTemplate, order: OrderRecord) {
  const first = order.customer_name.split(" ")[0] ?? "there";
  const tracking =
    order.tracking_number
      ? ` Tracking: ${order.tracking_number}${order.courier ? ` (${order.courier})` : ""}.`
      : "";

  switch (template) {
    case "order_placed":
      return {
        subject: `We've received your order ${order.order_ref}`,
        body: `Hi ${first}, thank you for choosing ${BRAND_NAME}. Your order ${order.order_ref} for ${rupees(order.total)} has been received and is awaiting payment confirmation. We'll write again the moment it's confirmed.`,
      };
    case "payment_confirmed":
      return {
        subject: `Payment confirmed — order ${order.order_ref}`,
        body: `Hi ${first}, your payment of ${rupees(order.total)} for order ${order.order_ref} is confirmed. It is being hand-packed in Srinagar and will be dispatched within two working days.`,
      };
    case "payment_failed":
      return {
        subject: `Payment couldn't be completed — order ${order.order_ref}`,
        body: `Hi ${first}, your payment for order ${order.order_ref} didn't go through, so nothing has been charged. Your bag is still saved — you can retry the payment, or reply to this message and we'll help. Support: ${SUPPORT_EMAIL}.`,
      };
    case "order_shipped":
      return {
        subject: `Your Kayra order ${order.order_ref} has shipped`,
        body: `Hi ${first}, order ${order.order_ref} is on its way.${tracking} Thank you for wearing Kayra.`,
      };
    case "order_delivered":
      return {
        subject: `Delivered — order ${order.order_ref}`,
        body: `Hi ${first}, order ${order.order_ref} has been delivered. We'd love to know how it wears on you — just reply to this message.`,
      };
  }
}

async function sendEmail(to: string, subject: string, body: string) {
  const apiKey = process.env["EMAIL_API_KEY"];
  const from = process.env["EMAIL_FROM"] ?? `${BRAND_NAME} <orders@kayraperfumes.com>`;
  if (!apiKey) return { state: "skipped" as const, error: "EMAIL_API_KEY not configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: `${body}\n\n— ${BRAND_NAME}, Srinagar\n${SUPPORT_EMAIL}`,
    }),
  });
  if (!res.ok) {
    return { state: "failed" as const, error: `email_provider_${res.status}` };
  }
  return { state: "sent" as const };
}

async function sendWhatsApp(to: string, body: string) {
  const apiKey = process.env["WHATSAPP_API_KEY"];
  const phoneNumberId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  if (!apiKey || !phoneNumberId) {
    return { state: "skipped" as const, error: "WhatsApp API not configured" };
  }

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/[^\d]/g, ""),
      type: "text",
      text: { body },
    }),
  });
  if (!res.ok) return { state: "failed" as const, error: `whatsapp_provider_${res.status}` };
  return { state: "sent" as const };
}

/** Claims the (order, channel, template) slot. Returns false if already claimed. */
async function claim(
  orderId: string,
  channel: "email" | "whatsapp",
  template: NotificationTemplate,
  recipient: string,
) {
  const { data, error } = await supabaseAdmin
    .from("notifications")
    .insert({ order_id: orderId, channel, template, recipient })
    .select("id")
    .maybeSingle();
  if (error || !data) return null;
  return data.id;
}

async function finish(id: string, state: "sent" | "failed" | "skipped", error?: string) {
  await supabaseAdmin
    .from("notifications")
    .update({ state, error: error ?? null })
    .eq("id", id);
}

/**
 * Dispatch order notifications. Never throws — messaging failures are logged,
 * not surfaced to the customer, and are safe to retry.
 */
export async function notifyOrder(order: OrderRecord, template: NotificationTemplate) {
  const { subject, body } = copy(template, order);

  const emailId = await claim(order.id, "email", template, order.customer_email);
  if (emailId) {
    try {
      const result = await sendEmail(order.customer_email, subject, body);
      await finish(emailId, result.state, "error" in result ? result.error : undefined);
    } catch (err) {
      await finish(emailId, "failed", err instanceof Error ? err.message : "email_error");
    }
  }

  if (order.whatsapp_opt_in) {
    const waId = await claim(order.id, "whatsapp", template, order.customer_phone);
    if (waId) {
      try {
        const result = await sendWhatsApp(order.customer_phone, body);
        await finish(waId, result.state, "error" in result ? result.error : undefined);
      } catch (err) {
        await finish(waId, "failed", err instanceof Error ? err.message : "whatsapp_error");
      }
    }
  }
}
