import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, CreditCard, Truck, Wallet, Banknote } from "lucide-react";
import { getProduct, coupons } from "@/data/products";
import { Button } from "@/components/lux/Button";
import { EmptyState } from "@/components/lux/States";
import { useStore, type Order, type Address } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const DELIVERY_METHODS = [
  { id: "standard", label: "Standard (3–5 days)", price: 0 },
  { id: "express", label: "Express (1–2 days)", price: 500 },
  { id: "pickup", label: "Store pickup", price: 0 },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
];

function CheckoutPage() {
  const { cart, subtotal, hydrated, placeOrder, clearCart, user, addresses } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [couponCode] = useState("LUXORA10");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const coupon = coupons[couponCode] ?? null;
  const discount = coupon
    ? coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value
    : 0;
  const deliveryPrice = DELIVERY_METHODS.find((d) => d.id === deliveryMethod)?.price ?? 0;
  const shipping = subtotal > 5000 ? 0 : deliveryPrice;
  const total = Math.max(0, subtotal - discount) + shipping;

  const lines = cart
    .map((line) => ({ line, product: getProduct(line.productId) }))
    .filter((entry): entry is { line: typeof entry.line; product: NonNullable<typeof entry.product> } =>
      entry.product !== undefined,
    );

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a 10-digit number";
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Enter a 6-digit pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fill in all required fields", "error");
      return;
    }
    setPlacing(true);

    setTimeout(() => {
      const orderId = `LX-${Date.now().toString().slice(-8)}`;
      const address: Address = {
        id: `addr-${Date.now()}`,
        label: "Shipping",
        line1: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
      };
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + (deliveryMethod === "express" ? 2 : 5));

      const order: Order = {
        id: orderId,
        placedAt: new Date().toISOString(),
        items: lines.map(({ line, product }) => ({
          ...line,
          name: product.name,
          price: product.price,
          image: product.images[0],
        })),
        subtotal,
        discount,
        shipping,
        total,
        address,
        deliveryMethod: DELIVERY_METHODS.find((d) => d.id === deliveryMethod)?.label ?? "Standard",
        paymentMethod: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label ?? "Card",
        estimatedDelivery: estimatedDelivery.toISOString(),
        status: "Confirmed",
      };

      placeOrder(order);
      clearCart();
      setPlacing(false);
      navigate({ to: "/order-success", search: { id: orderId } });
    }, 1200);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <div className="skeleton h-8 w-48 rounded-sm" />
        <div className="mt-8 skeleton h-96 w-full rounded-md" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <EmptyState
          icon={<Truck size={22} />}
          title="Nothing to check out"
          description="Your bag is empty. Add some items before proceeding to checkout."
          action={
            <Link to="/shop">
              <Button variant="solid" shape="rounded">Browse products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-md border bg-background px-4 py-2.5 text-[13px] placeholder:text-muted focus:outline-none",
      errors[field] ? "border-destructive" : "border-border focus:border-foreground/30",
    );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[12px] text-muted">
        <Link to="/cart" className="hover:text-foreground">Bag</Link>
        <ChevronRight size={12} />
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="font-display text-4xl tracking-tight">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: forms */}
        <div className="space-y-8 lg:col-span-2">
          {/* Customer info */}
          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-5 font-display text-xl">Contact Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[12px] text-muted">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={inputClass("email")}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[12px] text-muted">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={inputClass("phone")}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="mt-1 text-[11px] text-destructive">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Shipping address */}
          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-5 font-display text-xl">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[12px] text-muted">First name *</label>
                <input
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  className={inputClass("firstName")}
                  placeholder="Aarav"
                />
                {errors.firstName && <p className="mt-1 text-[11px] text-destructive">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-[12px] text-muted">Last name</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  className={inputClass("lastName")}
                  placeholder="Sharma"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[12px] text-muted">Address *</label>
                <input
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className={inputClass("address")}
                  placeholder="House no, street, area"
                />
                {errors.address && <p className="mt-1 text-[11px] text-destructive">{errors.address}</p>}
              </div>
              <div>
                <label className="text-[12px] text-muted">City *</label>
                <input
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className={inputClass("city")}
                  placeholder="Mumbai"
                />
                {errors.city && <p className="mt-1 text-[11px] text-destructive">{errors.city}</p>}
              </div>
              <div>
                <label className="text-[12px] text-muted">State *</label>
                <input
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                  className={inputClass("state")}
                  placeholder="Maharashtra"
                />
                {errors.state && <p className="mt-1 text-[11px] text-destructive">{errors.state}</p>}
              </div>
              <div>
                <label className="text-[12px] text-muted">Pincode *</label>
                <input
                  value={form.pincode}
                  onChange={(e) => setField("pincode", e.target.value)}
                  className={inputClass("pincode")}
                  placeholder="400001"
                />
                {errors.pincode && <p className="mt-1 text-[11px] text-destructive">{errors.pincode}</p>}
              </div>
            </div>
          </section>

          {/* Delivery method */}
          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-5 font-display text-xl">Delivery Method</h2>
            <div className="space-y-3">
              {DELIVERY_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setDeliveryMethod(method.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-[13px] transition-colors",
                    deliveryMethod === method.id
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-4 place-items-center rounded-full border",
                        deliveryMethod === method.id ? "border-foreground" : "border-border",
                      )}
                    >
                      {deliveryMethod === method.id && <span className="size-2 rounded-full bg-foreground" />}
                    </span>
                    {method.label}
                  </span>
                  <span className="text-muted">
                    {method.price === 0 ? "Free" : formatPrice(method.price)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-5 font-display text-xl">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-[13px] transition-colors",
                    paymentMethod === method.id
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-4 place-items-center rounded-full border",
                      paymentMethod === method.id ? "border-foreground" : "border-border",
                    )}
                  >
                    {paymentMethod === method.id && <span className="size-2 rounded-full bg-foreground" />}
                  </span>
                  <method.icon size={16} className="text-muted" />
                  {method.label}
                </button>
              ))}
            </div>
            {paymentMethod === "card" && (
              <div className="mt-4 space-y-3 rounded-md border border-border bg-background p-4">
                <p className="text-[11px] text-muted">Simulated checkout — no real payment will be processed.</p>
                <input placeholder="Card number" className={inputClass("card")} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM / YY" className={inputClass("exp")} />
                  <input placeholder="CVV" className={inputClass("cvv")} />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-border bg-surface p-6">
            <h2 className="font-display text-xl">Order Summary</h2>

            <div className="mt-5 space-y-3">
              {lines.map(({ line, product }) => (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={product.images[0]} alt={product.name} className="h-16 w-14 rounded-md object-cover" />
                    <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-foreground text-[10px] text-background">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-foreground">{product.name}</p>
                    <p className="text-[11px] text-muted">{line.size} · {line.color}</p>
                  </div>
                  <p className="shrink-0 text-[13px]">{formatPrice(product.price * line.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Discount</span>
                  <span className="text-success">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-[15px] font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="solid"
              shape="rounded"
              size="lg"
              block
              loading={placing}
              className="mt-6"
            >
              {placing ? "Placing order…" : "Place Order"}
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted">
              By placing your order you agree to our terms.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
