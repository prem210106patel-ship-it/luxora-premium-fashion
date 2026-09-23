import { supabase } from "@/lib/supabase";

export interface OrderRow {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  payment_transaction_id: string | null;
  shipping_address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  created_at: string;
}

export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  payment_transaction_id: string;
  shipping_address: OrderRow["shipping_address"];
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    size: string | null;
    color: string | null;
  }>;
}

function generateDemoTransactionId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DEMO-TXN-${suffix}`;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderWithItems> {
  const transactionId = input.payment_transaction_id || generateDemoTransactionId();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      total_amount: input.total_amount,
      status: "pending",
      payment_status: "paid",
      payment_method: input.payment_method,
      payment_transaction_id: transactionId,
      shipping_address: input.shipping_address,
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  if (!order) {
    throw new Error("Failed to create order: no data returned");
  }

  const itemRows = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
    size: item.size,
    color: item.color,
  }));

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .insert(itemRows)
    .select();

  if (itemsError) {
    throw new Error(`Order created but failed to save items: ${itemsError.message}`);
  }

  return { ...(order as OrderRow), order_items: (items ?? []) as OrderItemRow[] };
}

export async function getMyOrders(email: string): Promise<OrderWithItems[]> {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load orders: ${error.message}`);
  }

  if (!orders || orders.length === 0) return [];

  const orderIds = orders.map((o) => o.id);

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    throw new Error(`Failed to load order items: ${itemsError.message}`);
  }

  return (orders as OrderRow[]).map((order) => ({
    ...order,
    order_items: (items as OrderItemRow[]).filter((item) => item.order_id === order.id),
  }));
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load order: ${error.message}`);
  }

  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  if (itemsError) {
    throw new Error(`Failed to load order items: ${itemsError.message}`);
  }

  return { ...(order as OrderRow), order_items: (items ?? []) as OrderItemRow[] };
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load orders: ${error.message}`);
  }

  if (!orders || orders.length === 0) return [];

  const orderIds = orders.map((o) => o.id);

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    throw new Error(`Failed to load order items: ${itemsError.message}`);
  }

  return (orders as OrderRow[]).map((order) => ({
    ...order,
    order_items: (items as OrderItemRow[]).filter((item) => item.order_id === order.id),
  }));
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }
}

export { generateDemoTransactionId };
