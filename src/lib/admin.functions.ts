import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const authSchema = z.object({ password: z.string().min(1) });

function checkPassword(password: string) {
  const secret = process.env["ADMIN_SECRET"];
  return Boolean(secret) && password === secret;
}

/** Lists recent orders with full contact/address details for the admin page. */
export const listOrders = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => authSchema.parse(data))
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) throw new Error("unauthorized");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_ref, customer_name, customer_email, customer_phone, address, city, state, pincode, total, payment_status, fulfilment_status, payment_provider, tracking_number, courier, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error("fetch_failed");
    return orders;
  });

type Bucket = { orders: number; revenue: number };

/** Order-count and revenue totals for today / this month / this year. */
export const getOrderStats = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => authSchema.parse(data))
  .handler(async ({ data }): Promise<{ today: Bucket; month: Bucket; year: Bucket }> => {
    if (!checkPassword(data.password)) throw new Error("unauthorized");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select("total, payment_status, created_at")
      .gte("created_at", startOfYear.toISOString())
      .limit(5000);

    if (error) throw new Error("fetch_failed");

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const bucket = (since: Date): Bucket => {
      const within = (rows ?? []).filter((o) => new Date(o.created_at) >= since);
      const revenue = within
        .filter((o) => o.payment_status === "paid")
        .reduce((sum, o) => sum + o.total, 0);
      return { orders: within.length, revenue };
    };

    return { today: bucket(startOfDay), month: bucket(startOfMonth), year: bucket(startOfYear) };
  });

const shipmentSchema = z.object({
  password: z.string().min(1),
  orderRef: z.string().trim().min(6).max(40),
  status: z.enum(["packed", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().trim().max(60).optional(),
  courier: z.string().trim().max(60).optional(),
});

/** Updates fulfilment status from the admin page — same effect as the shipment webhook. */
export const adminUpdateShipment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => shipmentSchema.parse(data))
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) throw new Error("unauthorized");

    const { updateShipment } = await import("@/lib/orders.server");
    return updateShipment({
      orderRef: data.orderRef,
      status: data.status,
      trackingNumber: data.trackingNumber,
      courier: data.courier,
    });
  });