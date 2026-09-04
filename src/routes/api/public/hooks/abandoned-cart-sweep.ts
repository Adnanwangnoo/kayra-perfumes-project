import { createFileRoute } from "@tanstack/react-router";

/**
 * Abandoned-cart sweep — triggered on a schedule by Vercel Cron (see
 * vercel.json). Vercel automatically sends
 * `Authorization: Bearer <CRON_SECRET>` to cron-triggered routes, and
 * auto-provisions CRON_SECRET as a project environment variable — you don't
 * need to set it yourself.
 */
export const Route = createFileRoute("/api/public/hooks/abandoned-cart-sweep")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env["CRON_SECRET"];
        const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!secret || !provided || provided !== secret) {
          return new Response("unauthorized", { status: 401 });
        }

        const { sweepAbandonedCarts } = await import("@/lib/orders.server");
        const result = await sweepAbandonedCarts();
        return Response.json(result);
      },
    },
  },
});