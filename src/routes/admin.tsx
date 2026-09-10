import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { adminUpdateShipment, getOrderStats, listOrders } from "@/lib/admin.functions";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Kayra Perfumes" }, { name: "robots", content: "noindex" }],
  }),
  component: Admin,
});

type OrderItem = { product_name: string; size: string; quantity: number };

type Order = {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total: number;
  advance_amount: number;
  payment_status: string;
  fulfilment_status: string;
  payment_provider: string;
  tracking_number: string | null;
  courier: string | null;
  created_at: string;
  order_items: OrderItem[];
};

type Stats = {
  today: { orders: number; revenue: number };
  month: { orders: number; revenue: number };
  year: { orders: number; revenue: number };
};

const paymentColors: Record<string, string> = {
  paid: "text-green-700 bg-green-50",
  partial: "text-blue-700 bg-blue-50",
  pending: "text-amber-700 bg-amber-50",
  failed: "text-red-700 bg-red-50",
  refunded: "text-slate-700 bg-slate-100",
};

function StatCard({ label, orders, revenue }: { label: string; orders: number; revenue: number }) {
  return (
    <div className="border border-border p-5">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-3 font-serif text-2xl">{formatPrice(revenue)}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {orders} order{orders === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function ShipmentForm({
  order,
  password,
  onDone,
}: {
  order: Order;
  password: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<"packed" | "shipped" | "delivered" | "cancelled">("shipped");
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number ?? "");
  const [courier, setCourier] = useState(order.courier ?? "");
  const [markPaid, setMarkPaid] = useState(order.payment_status !== "paid");
  const update = useServerFn(adminUpdateShipment);

  const remaining = order.total - order.advance_amount;

  const mutation = useMutation({
    mutationFn: () =>
      update({
        data: { password, orderRef: order.order_ref, status, trackingNumber, courier, markPaid },
      }),
    onSuccess: onDone,
  });

  return (
    <tr className="border-b border-border/60 bg-muted/30">
      <td colSpan={9} className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="mt-1 h-10 border border-border bg-background px-2 text-sm"
            >
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">Tracking number</label>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-1 h-10 border border-border bg-background px-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">Courier</label>
            <input
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="mt-1 h-10 border border-border bg-background px-2 text-sm"
            />
          </div>
          {order.payment_status !== "paid" && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={markPaid}
                onChange={(e) => setMarkPaid(e.target.checked)}
                className="accent-walnut"
              />
              Mark payment received {remaining > 0 ? `(${formatPrice(remaining)} in cash)` : ""}
            </label>
          )}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="h-10 bg-foreground px-4 text-xs uppercase tracking-[0.14em] text-background"
          >
            {mutation.isPending ? "Saving…" : "Save & notify"}
          </button>
          {mutation.isError && <p className="text-xs text-destructive">Failed — try again.</p>}
        </div>
      </td>
    </tr>
  );
}

function Admin() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [editingRef, setEditingRef] = useState<string | null>(null);
  const fetchOrders = useServerFn(listOrders);
  const fetchStats = useServerFn(getOrderStats);

  const ordersQuery = useMutation({
    mutationFn: () => fetchOrders({ data: { password } }),
    onSuccess: () => setUnlocked(true),
  });
  const statsQuery = useMutation({
    mutationFn: () => fetchStats({ data: { password } }),
  });

  const refreshAll = () => {
    ordersQuery.mutate();
    statsQuery.mutate();
  };

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm px-5 py-40 text-center">
        <h1 className="display-lg mb-8">Admin</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            refreshAll();
          }}
          className="space-y-4"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-foreground"
            autoFocus
          />
          <button
            type="submit"
            disabled={ordersQuery.isPending}
            className="h-12 w-full bg-foreground text-background text-sm uppercase tracking-[0.16em]"
          >
            {ordersQuery.isPending ? "Checking…" : "Unlock"}
          </button>
          {ordersQuery.isError && (
            <p className="text-sm text-destructive">Wrong password, or something went wrong.</p>
          )}
        </form>
      </div>
    );
  }

  const orders = (ordersQuery.data ?? []) as Order[];
  const stats = statsQuery.data as Stats | undefined;

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
      <div className="flex items-center justify-between">
        <h1 className="display-lg">Orders</h1>
        <button onClick={refreshAll} className="eyebrow border-b border-foreground pb-1">
          Refresh
        </button>
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Today" orders={stats.today.orders} revenue={stats.today.revenue} />
          <StatCard label="This month" orders={stats.month.orders} revenue={stats.month.revenue} />
          <StatCard label="This year" orders={stats.year.orders} revenue={stats.year.revenue} />
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Revenue counts fully-paid orders only. COD advances show as "partial" until you mark cash
        received.
      </p>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.1em] text-muted-foreground">
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Address</th>
              <th className="py-3 pr-4">Items</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Payment</th>
              <th className="py-3 pr-4">Fulfilment</th>
              <th className="py-3 pr-4">Tracking</th>
              <th className="py-3 pr-4">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <>
                <tr key={o.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4">
                    <div>{o.order_ref}</div>
                    <div className="text-xs text-muted-foreground">{o.payment_provider}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="py-3 pr-4 max-w-[200px] text-xs text-muted-foreground">
                    {o.address}, {o.city}, {o.state} {o.pincode}
                  </td>
                  <td className="py-3 pr-4 max-w-[220px] text-xs text-muted-foreground">
                    {(o.order_items ?? [])
                      .map((i) => `${i.product_name} (${i.size}) ×${i.quantity}`)
                      .join(", ")}
                  </td>
                  <td className="py-3 pr-4">
                    {formatPrice(o.total)}
                    {o.advance_amount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(o.advance_amount)} advance
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`rounded px-2 py-1 text-xs ${paymentColors[o.payment_status] ?? ""}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 capitalize">{o.fulfilment_status}</td>
                  <td className="py-3 pr-4">
                    {o.tracking_number
                      ? `${o.tracking_number}${o.courier ? ` (${o.courier})` : ""}`
                      : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("en-IN")}
                    </div>
                    <button
                      onClick={() => setEditingRef(editingRef === o.order_ref ? null : o.order_ref)}
                      className="mt-1 text-xs underline"
                    >
                      {editingRef === o.order_ref ? "Cancel" : "Update"}
                    </button>
                  </td>
                </tr>
                {editingRef === o.order_ref && (
                  <ShipmentForm
                    order={o}
                    password={password}
                    onDone={() => {
                      setEditingRef(null);
                      refreshAll();
                    }}
                  />
                )}
              </>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}