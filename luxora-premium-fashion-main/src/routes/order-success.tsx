import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleCheck as CheckCircle2, Package, Truck, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/lux/Button";
import { EmptyState } from "@/components/lux/States";
import { useStore } from "@/store/store";
import { formatPrice, formatDate } from "@/lib/format";

export const Route = createFileRoute("/order-success")({
  component: OrderSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) ?? "",
  }),
});

function OrderSuccessPage() {
  const { id } = Route.useSearch() as { id: string };
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
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
          Order #{order.id}
        </p>
      </div>

      {/* Delivery info */}
      <div className="rise mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: "200ms" }}>
        {[
          { icon: Calendar, label: "Order date", value: formatDate(order.placedAt) },
          { icon: Truck, label: "Delivery", value: formatDate(order.estimatedDelivery) },
          { icon: Package, label: "Status", value: order.status },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface p-5 text-center">
            <item.icon size={18} className="mx-auto text-primary" />
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted">{item.label}</p>
            <p className="mt-1 text-[13px] font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="rise mt-8 rounded-lg border border-border bg-surface p-6" style={{ animationDelay: "250ms" }}>
        <h2 className="mb-4 font-display text-lg">Items in this order</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
              <img src={item.image} alt={item.name} className="h-16 w-14 rounded-md object-cover" />
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
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted">Discount</span>
              <span className="text-success">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-[15px] font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="rise mt-6 rounded-lg border border-border bg-surface p-6" style={{ animationDelay: "300ms" }}>
        <h2 className="mb-2 font-display text-lg">Shipping to</h2>
        <p className="text-[13px] text-foreground/80">{order.address.line1}</p>
        <p className="text-[13px] text-foreground/80">
          {order.address.city}, {order.address.state} — {order.address.pincode}
        </p>
        <p className="text-[13px] text-muted">Phone: {order.address.phone}</p>
      </div>

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
