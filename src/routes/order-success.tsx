import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CircleCheck as CheckCircle2, Package, Truck, Calendar, ArrowRight, CreditCard, Hash } from "lucide-react";
import { Button } from "@/components/lux/Button";
import { EmptyState } from "@/components/lux/States";
import { useStore } from "@/store/store";
import { formatPrice, formatDate } from "@/lib/format";
import { getOrderById, type OrderWithItems } from "@/services/orders";
import { getProduct } from "@/data/products";

export const Route = createFileRoute("/order-success")({
  component: OrderSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) ?? "",
  }),
});

function OrderSuccessPage() {
  const { id } = Route.useSearch() as { id: string };
  const { orders } = useStore();
  const localOrder = orders.find((o) => o.id === id);

  const [supabaseOrder, setSupabaseOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(!localOrder);

  useEffect(() => {
    if (localOrder) return;
    if (!id) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await getOrderById(id);
        if (!cancelled) {
          setSupabaseOrder(result);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, localOrder]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10">
        <div className="skeleton mx-auto h-16 w-16 rounded-full" />
        <div className="skeleton mx-auto mt-6 h-8 w-48 rounded-sm" />
      </div>
    );
  }

  if (!localOrder && !supabaseOrder) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <EmptyState
          icon={<Package size={22} />}
          title="Order not found"
          description="We couldn't find this order. It may have been placed in a previous session."
          action={
            <Link to="/shop">
              <Button variant="solid" shape="rounded">Continue shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Use local order if available (just placed), otherwise use Supabase data
  const orderDate = localOrder?.placedAt ?? supabaseOrder?.created_at ?? new Date().toISOString();
  const orderId = localOrder?.id ?? supabaseOrder?.id ?? id;
  const orderTotal = localOrder?.total ?? Number(supabaseOrder?.total_amount ?? 0);
  const orderSubtotal = localOrder?.subtotal ?? orderTotal;
  const orderDiscount = localOrder?.discount ?? 0;
  const orderShipping = localOrder?.shipping ?? 0;
  const orderStatus = localOrder?.status ?? supabaseOrder?.status ?? "pending";
  const paymentMethod = localOrder?.paymentMethod ?? (supabaseOrder?.payment_method === "demo" ? "Demo Payment" : supabaseOrder?.payment_method ?? "");
  const transactionId = supabaseOrder?.payment_transaction_id ?? null;
  const shippingAddr = localOrder?.address ?? (supabaseOrder?.shipping_address ? {
    line1: supabaseOrder.shipping_address.line1,
    city: supabaseOrder.shipping_address.city,
    state: supabaseOrder.shipping_address.state,
    pincode: supabaseOrder.shipping_address.pincode,
    phone: supabaseOrder.shipping_address.phone,
  } : null);

  const items = localOrder?.items ?? (supabaseOrder?.order_items ?? []).map((item) => {
    const product = getProduct(item.product_id);
    return {
      productId: item.product_id,
      size: item.size ?? "",
      color: item.color ?? "",
      quantity: item.quantity,
      name: item.product_name,
      price: Number(item.price),
      image: product?.images[0] ?? "",
    };
  });

  const estimatedDelivery = localOrder?.estimatedDelivery ?? new Date(Date.now() + 5 * 86400000).toISOString();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10">
      <div className="text-center">
        <div className="fadein mx-auto grid size-16 place-items-center rounded-full bg-success/10">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h1 className="rise mt-6 font-display text-4xl tracking-tight">Order Confirmed</h1>
        <p className="rise mt-3 text-[15px] text-muted" style={{ animationDelay: "100ms" }}>
          Thank you for your purchase. Your order is being prepared.
        </p>
        <p className="rise mt-4 inline-block rounded-full bg-stone px-5 py-2 text-[13px] font-medium" style={{ animationDelay: "150ms" }}>
          Order #{orderId.length > 12 ? orderId.slice(0, 8) + "…" : orderId}
        </p>
      </div>

      {/* Delivery info */}
      <div className="rise mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: "200ms" }}>
        {[
          { icon: Calendar, label: "Order date", value: formatDate(orderDate) },
          { icon: Truck, label: "Delivery", value: formatDate(estimatedDelivery) },
          { icon: Package, label: "Status", value: orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1) },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface p-5 text-center">
            <item.icon size={18} className="mx-auto text-primary" />
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted">{item.label}</p>
            <p className="mt-1 text-[13px] font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Payment info */}
      {(paymentMethod || transactionId) && (
        <div className="rise mt-6 rounded-lg border border-border bg-surface p-6" style={{ animationDelay: "225ms" }}>
          <h2 className="mb-4 font-display text-lg">Payment Details</h2>
          <div className="space-y-2 text-[13px]">
            {paymentMethod && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <CreditCard size={14} />
                  Payment method
                </span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
            )}
            {transactionId && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Hash size={14} />
                  Transaction ID
                </span>
                <span className="font-mono text-[12px]">{transactionId}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted">Payment status</span>
              <span className="font-medium text-success">Paid</span>
            </div>
          </div>
          {paymentMethod === "Demo Payment" && (
            <p className="mt-3 rounded-md bg-background p-2 text-center text-[11px] text-muted">
              This was a demo payment. No real money was transferred.
            </p>
          )}
        </div>
      )}

      {/* Items */}
      <div className="rise mt-8 rounded-lg border border-border bg-surface p-6" style={{ animationDelay: "250ms" }}>
        <h2 className="mb-4 font-display text-lg">Items in this order</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
              {item.image && (
                <img src={item.image} alt={item.name} className="h-16 w-14 rounded-md object-cover" />
              )}
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium">{item.name}</p>
                  <p className="text-[12px] text-muted">{item.size} · {item.color} · Qty {item.quantity}</p>
                </div>
                <p className="text-[13px]">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-border pt-4 text-[13px]">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(orderSubtotal)}</span>
          </div>
          {orderDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted">Discount</span>
              <span className="text-success">-{formatPrice(orderDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{orderShipping === 0 ? "Free" : formatPrice(orderShipping)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-[15px] font-medium">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {shippingAddr && (
        <div className="rise mt-6 rounded-lg border border-border bg-surface p-6" style={{ animationDelay: "300ms" }}>
          <h2 className="mb-2 font-display text-lg">Shipping to</h2>
          <p className="text-[13px] text-foreground/80">{shippingAddr.line1}</p>
          <p className="text-[13px] text-foreground/80">
            {shippingAddr.city}, {shippingAddr.state} — {shippingAddr.pincode}
          </p>
          <p className="text-[13px] text-muted">Phone: {shippingAddr.phone}</p>
        </div>
      )}

      {/* Actions */}
      <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "350ms" }}>
        <Link to="/account">
          <Button variant="outline" shape="rounded" size="md">
            View my orders
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="solid" shape="rounded" size="md">
            Continue shopping
            <ArrowRight size={15} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
