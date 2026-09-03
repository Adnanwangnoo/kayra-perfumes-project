import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderSchema = z.object({
  lines: z
    .array(z.object({ sku: z.string().min(2).max(32), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(20),
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    phone: z.string().trim().min(8).max(20),
    address: z.string().trim().min(5).max(240),
    city: z.string().trim().min(2).max(60),
    state: z.string().trim().min(2).max(60),
    pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
    notes: z.string().trim().max(400).optional(),
    marketingOptIn: z.boolean(),
    whatsappOptIn: z.boolean(),
  }),
});

const verifySchema = z.object({
  orderRef: z.string().trim().min(6).max(40),
  providerOrderId: z.string().trim().min(4).max(80),
  providerPaymentId: z.string().trim().min(4).max(80),
  signature: z.string().trim().min(16).max(256),
});

const failureSchema = z.object({
  orderRef: z.string().trim().min(6).max(40),
  reason: z.string().trim().max(200).default("cancelled_by_customer"),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { createOrder } = await import("./orders.server");
    return createOrder(data);
  });

/** Server-side payment verification. The browser's word is never enough. */
export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const { verifyCheckoutPayment } = await import("./orders.server");
    return verifyCheckoutPayment(data);
  });

/** Records an abandoned or dismissed payment so the order can be recovered. */
export const reportPaymentFailure = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => failureSchema.parse(data))
  .handler(async ({ data }) => {
    const { markOrderFailedByRef } = await import("./orders.server");
    await markOrderFailedByRef(data.orderRef, data.reason);
    return { ok: true };
  });
