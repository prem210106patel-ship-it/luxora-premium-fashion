import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { getProduct, type Product } from "@/data/products";

export interface CartLine {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface WishlistEntry {
  productId: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  id: string;
  placedAt: string;
  items: Array<CartLine & { name: string; price: number; image: string }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address;
  deliveryMethod: string;
  paymentMethod: string;
  estimatedDelivery: string;
  status: string;
}

export interface Account {
  name: string;
  email: string;
  phone?: string;
}

interface StoreValue {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateQuantity: (line: CartLine, quantity: number) => void;
  removeFromCart: (line: CartLine) => void;
  clearCart: () => void;
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  user: Account | null;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, phone?: string) => void;
  logout: () => void;
  addresses: Address[];
  saveAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  orders: Order[];
  placeOrder: (order: Order) => void;
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const sameLine = (a: CartLine, b: CartLine) =>
  a.productId === b.productId && a.size === b.size && a.color === b.color;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart, cartHydrated] = useLocalStorage<CartLine[]>("luxora.cart", []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>("luxora.wishlist", []);
  const [user, setUser] = useLocalStorage<Account | null>("luxora.user", null);
  const [addresses, setAddresses] = useLocalStorage<Address[]>("luxora.addresses", []);
  const [orders, setOrders] = useLocalStorage<Order[]>("luxora.orders", []);

  const addToCart = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      setCart((current) => {
        const line: CartLine = { productId: product.id, size, color, quantity };
        const existing = current.find((c) => sameLine(c, line));
        if (existing) {
          return current.map((c) =>
            sameLine(c, line) ? { ...c, quantity: c.quantity + quantity } : c,
          );
        }
        return [...current, line];
      });
    },
    [setCart],
  );

  const updateQuantity = useCallback(
    (line: CartLine, quantity: number) => {
      setCart((current) =>
        quantity <= 0
          ? current.filter((c) => !sameLine(c, line))
          : current.map((c) => (sameLine(c, line) ? { ...c, quantity } : c)),
      );
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (line: CartLine) => setCart((current) => current.filter((c) => !sameLine(c, line))),
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWishlist = useCallback(
    (id: string) => {
      let added = false;
      setWishlist((current) => {
        if (current.includes(id)) return current.filter((w) => w !== id);
        added = true;
        return [...current, id];
      });
      return !wishlist.includes(id) || added;
    },
    [setWishlist, wishlist],
  );

  const removeFromWishlist = useCallback(
    (id: string) => setWishlist((current) => current.filter((w) => w !== id)),
    [setWishlist],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, line) => {
        const product = getProduct(line.productId);
        return product ? sum + product.price * line.quantity : sum;
      }, 0),
    [cart],
  );

  const value: StoreValue = {
    cart,
    cartCount: cart.reduce((n, line) => n + line.quantity, 0),
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    wishlist,
    isWishlisted: (id) => wishlist.includes(id),
    toggleWishlist,
    removeFromWishlist,
    user,
    login: (email, name) =>
      setUser({ name: name ?? email.split("@")[0] ?? "Guest", email }),
    register: (name, email, phone) =>
      setUser(phone ? { name, email, phone } : { name, email }),
    logout: () => setUser(null),
    addresses,
    saveAddress: (address) =>
      setAddresses((current) => {
        const exists = current.some((a) => a.id === address.id);
        return exists ? current.map((a) => (a.id === address.id ? address : a)) : [...current, address];
      }),
    removeAddress: (id) => setAddresses((current) => current.filter((a) => a.id !== id)),
    orders,
    placeOrder: (order) => setOrders((current) => [order, ...current]),
    hydrated: cartHydrated,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
