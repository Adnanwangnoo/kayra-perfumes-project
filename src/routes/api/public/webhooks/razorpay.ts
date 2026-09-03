import { createFileRoute } from "@tanstack/react-router";

/**
 * Razorpay webhook receiver.
 *
 * Security: the raw body is HMAC-verified against RAZORPAY_WEBHOOK_SECRET
 * before anything is read from it, and every event id is recorded once so a
 * replayed or duplicated delivery cannot double-apply.
 */
export const Route = createFileRoute("/api/public/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        const { getProviderByName } = await import("@/lib/payments/provider.server");
        const provider = getProviderByName("razorpay");

        if (!provider.verifyWebhookSignature({ payload: raw, signature })) {
          return new Response("invalid signature", { status: 401 });
        }

        let body: {
          event?: string;
          payload?: {
            payment?: {
              entity?: {
                id?: string;
                order_id?: string;
                error_description?: string;
                error_reason?: string;
              };
            };
            order?: { entity?: { id?: string } };
          };
        };
        try {
          body = JSON.parse(raw);
        } catch {
          return new Response("invalid payload", { status: 400 });
        }

        const eventType = body.event ?? "unknown";
        const eventId =
          request.headers.get("x-razorpay-event-id") ??
          `${eventType}:${body.payload?.payment?.entity?.id ?? body.payload?.order?.entity?.id ?? raw.length}`;

        const { recordWebhook, applyPaymentWebhook } = await import("@/lib/orders.server");

        const isNew = await recordWebhook({
          provider: "razorpay",
          eventId,
          eventType,
          payload: body,
        });
        // Duplicate delivery — acknowledge without re-applying.
        if (!isNew) return Response.json({ ok: true, duplicate: true });

        const payment = body.payload?.payment?.entity;
        await applyPaymentWebhook({
          provider: "razorpay",
          eventType,
          providerOrderId: payment?.order_id ?? body.payload?.order?.entity?.id ?? null,
          providerPaymentId: payment?.id ?? null,
          reason: payment?.error_description ?? payment?.error_reason ?? null,
        });

        return Response.json({ ok: true });
      },
    },
  },
});
