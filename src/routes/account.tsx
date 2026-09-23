import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  User,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/lux/Button";
import { EmptyState } from "@/components/lux/States";
import { Modal } from "@/components/lux/Modal";
import { useStore, type Address } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { formatPrice, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getMyOrders, type OrderWithItems } from "@/services/orders";
import { getProduct } from "@/data/products";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

type Tab = "profile" | "orders" | "wishlist" | "addresses";

function AccountPage() {
  const { user, logout, orders, addresses, saveAddress, removeAddress, wishlist, hydrated } =
    useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [supabaseOrders, setSupabaseOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addrModal, setAddrModal] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setOrdersLoading(true);
    (async () => {
      try {
        const result = await getMyOrders(user.email);
        if (!cancelled) {
          setSupabaseOrders(result);
          setOrdersLoading(false);
        }
      } catch {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.email]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <div className="skeleton h-8 w-48 rounded-sm" />
        <div className="mt-8 skeleton h-64 w-full rounded-md" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <EmptyState
          icon={<User size={22} />}
          title="You're not signed in"
          description="Sign in to view your orders, wishlist and saved addresses."
          action={
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="solid" shape="rounded" size="md">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" shape="rounded" size="md">
                  Create account
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast("You've been signed out");
    navigate({ to: "/" });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      toast("Please fill all required fields", "error");
      return;
    }
    const addr: Address = {
      id: `addr-${Date.now()}`,
      label: addrForm.label || "Address",
      line1: addrForm.line1,
      city: addrForm.city,
      state: addrForm.state,
      pincode: addrForm.pincode,
      phone: addrForm.phone || user.phone || "",
    };
    saveAddress(addr);
    setAddrForm({ label: "", line1: "", city: "", state: "", pincode: "", phone: "" });
    setAddrModal(false);
    toast("Address saved");
  };

  const TABS: Array<{ key: Tab; label: string; icon: typeof Package }> = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "My Orders", icon: Package },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "addresses", label: "Addresses", icon: MapPin },
  ];

  const inputClass =
    "w-full rounded-md border border-border bg-background px-4 py-2.5 text-[13px] placeholder:text-muted focus:outline-none focus:border-foreground/30";

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Account</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Hello, {user.name}</h1>
        <p className="mt-2 text-[14px] text-muted">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-[13px] transition-colors",
                  tab === t.key
                    ? "bg-foreground text-background"
                    : "text-foreground/80 hover:bg-stone",
                )}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-[13px] text-destructive transition-colors hover:bg-destructive/5"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </aside>

        <div className="lg:col-span-3">
          {tab === "profile" && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="font-display text-xl">Profile Information</h2>
              <dl className="mt-5 space-y-4">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted">Name</dt>
                  <dd className="text-foreground">{user.name}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted">Email</dt>
                  <dd className="text-foreground">{user.email}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted">Phone</dt>
                  <dd className="text-foreground">{user.phone ?? "Not set"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Member since</dt>
                  <dd className="text-foreground">2026</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="mb-5 font-display text-xl">My Orders</h2>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16 text-muted">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="ml-2 text-[13px]">Loading your orders…</span>
                </div>
              ) : supabaseOrders.length === 0 && orders.length === 0 ? (
                <EmptyState
                  icon={<Package size={22} />}
                  title="No orders yet"
                  description="When you place an order, it will appear here."
                  action={
                    <Link to="/shop">
                      <Button variant="solid" shape="rounded" size="md">
                        Start shopping
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {/* Supabase orders (primary source) */}
                  {supabaseOrders.map((sOrder) => (
                    <div key={sOrder.id} className="rounded-lg border border-border bg-surface p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-medium">
                            Order #{sOrder.id.length > 12 ? sOrder.id.slice(0, 8) + "…" : sOrder.id}
                          </p>
                          <p className="text-[12px] text-muted">
                            {formatDate(sOrder.created_at)} · {sOrder.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[15px] font-medium">{formatPrice(Number(sOrder.total_amount))}</p>
                          <p className="text-[11px] text-muted">{sOrder.payment_method}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        {sOrder.order_items.slice(0, 4).map((item) => {
                          const product = getProduct(item.product_id);
                          return product ? (
                            <img
                              key={`${item.product_id}-${item.size}-${item.color}`}
                              src={product.images[0]}
                              alt={item.product_name}
                              className="h-14 w-12 rounded-md object-cover"
                            />
                          ) : null;
                        })}
                        {sOrder.order_items.length > 4 && (
                          <div className="grid h-14 w-12 place-items-center rounded-md bg-stone text-[11px] text-muted">
                            +{sOrder.order_items.length - 4}
                          </div>
                        )}
                      </div>
                      <Link
                        to="/order-success"
                        search={{ id: sOrder.id }}
                        className="mt-4 inline-flex items-center gap-1 text-[13px] text-muted hover:text-foreground"
                      >
                        View details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  ))}
                  {/* Legacy localStorage orders (not in Supabase) */}
                  {orders
                    .filter((o) => !supabaseOrders.some((s) => s.id === o.id))
                    .map((order) => (
                    <div key={order.id} className="rounded-lg border border-border bg-surface p-5 opacity-70">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-medium">Order #{order.id}</p>
                          <p className="text-[12px] text-muted">
                            {formatDate(order.placedAt)} · {order.status}
                          </p>
                        </div>
                        <p className="text-[15px] font-medium">{formatPrice(order.total)}</p>
                      </div>
                      <div className="mt-4 flex gap-3">
                        {order.items.slice(0, 4).map((item) => (
                          <img
                            key={`${item.productId}-${item.size}-${item.color}`}
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-12 rounded-md object-cover"
                          />
                        ))}
                      </div>
                      <Link
                        to="/order-success"
                        search={{ id: order.id }}
                        className="mt-4 inline-flex items-center gap-1 text-[13px] text-muted hover:text-foreground"
                      >
                        View details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="mb-5 font-display text-xl">Wishlist</h2>
              {wishlist.length === 0 ? (
                <EmptyState
                  icon={<Heart size={22} />}
                  title="No saved items"
                  description="Tap the heart icon on any product to save it here."
                  action={
                    <Link to="/shop">
                      <Button variant="solid" shape="rounded" size="md">
                        Browse products
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <Link
                  to="/wishlist"
                  className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-foreground"
                >
                  View full wishlist
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl">Saved Addresses</h2>
                <Button
                  variant="outline"
                  shape="rounded"
                  size="sm"
                  onClick={() => setAddrModal(true)}
                >
                  <Plus size={14} />
                  Add address
                </Button>
              </div>
              {addresses.length === 0 ? (
                <EmptyState
                  icon={<MapPin size={22} />}
                  title="No saved addresses"
                  description="Add an address to speed up future checkouts."
                  action={
                    <Button
                      variant="solid"
                      shape="rounded"
                      size="md"
                      onClick={() => setAddrModal(true)}
                    >
                      Add address
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="rounded-lg border border-border bg-surface p-5">
                      <div className="flex items-start justify-between">
                        <p className="text-[13px] font-medium">{addr.label}</p>
                        <button
                          onClick={() => {
                            removeAddress(addr.id);
                            toast("Address removed", "info");
                          }}
                          className="text-muted hover:text-destructive"
                          aria-label="Remove address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="mt-2 text-[13px] text-foreground/80">{addr.line1}</p>
                      <p className="text-[13px] text-foreground/80">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="mt-1 text-[12px] text-muted">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal open={addrModal} onClose={() => setAddrModal(false)} title="Add Address">
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div>
            <label className="text-[12px] text-muted">Label</label>
            <input
              value={addrForm.label}
              onChange={(e) => setAddrForm((p) => ({ ...p, label: e.target.value }))}
              className={inputClass}
              placeholder="Home, Office…"
            />
          </div>
          <div>
            <label className="text-[12px] text-muted">Address *</label>
            <input
              value={addrForm.line1}
              onChange={(e) => setAddrForm((p) => ({ ...p, line1: e.target.value }))}
              className={inputClass}
              placeholder="House no, street, area"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-muted">City *</label>
              <input
                value={addrForm.city}
                onChange={(e) => setAddrForm((p) => ({ ...p, city: e.target.value }))}
                className={inputClass}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="text-[12px] text-muted">State *</label>
              <input
                value={addrForm.state}
                onChange={(e) => setAddrForm((p) => ({ ...p, state: e.target.value }))}
                className={inputClass}
                placeholder="Maharashtra"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-muted">Pincode *</label>
              <input
                value={addrForm.pincode}
                onChange={(e) => setAddrForm((p) => ({ ...p, pincode: e.target.value }))}
                className={inputClass}
                placeholder="400001"
              />
            </div>
            <div>
              <label className="text-[12px] text-muted">Phone</label>
              <input
                value={addrForm.phone}
                onChange={(e) => setAddrForm((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
                placeholder="9876543210"
              />
            </div>
          </div>
          <Button type="submit" variant="solid" shape="rounded" block>
            Save Address
          </Button>
        </form>
      </Modal>
    </div>
  );
}
