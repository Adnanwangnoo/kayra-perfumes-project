import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Fulfilment endpoint — used by Kayra's own operations tooling to move an order
 * to packed / shipped / delivered, which triggers the customer's email and
 * (if opted in) WhatsApp shipment updates.
 *
 * Requires the ADMIN_SECRET bearer token; unauthenticated callers get 401.
 */
const schema = z.object({
  orderRef: z.string().trim().min(6).max(40),
  status: z.enum(["packed", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().trim().max(60).optional(),
  courier: z.string().trim().max(60).optional(),
});

export const Route = createFileRoute("/api/public/hooks/shipment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const adminSecret = process.env["ADMIN_SECRET"];
        const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!adminSecret || !provided || provided !== adminSecret) {
          return new Response("unauthorized", { status: 401 });
        }

        let parsed;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return new Response("invalid payload", { status: 400 });
        }

        const { updateShipment } = await import("@/lib/orders.server");
        const result = await updateShipment(parsed);
        return Response.json(result, { status: result.ok ? 200 : 404 });
      },
    },
  },
});
