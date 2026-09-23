/*
# Create orders and order_items tables for Luxora demo payment system

## Purpose
Stores customer orders and their line items for the Luxora Premium Fashion demo checkout.
Orders are created after the customer clicks "I Have Paid" on the demo payment screen.
All payment is simulated — no real money is processed.

## New Tables

### orders
- id (uuid, PK, auto-generated)
- user_id (uuid, nullable — set when Supabase auth is used in future)
- customer_name (text, not null)
- customer_email (text, not null)
- customer_phone (text, not null)
- total_amount (numeric(10,2), not null)
- status (text, default 'pending' — pending/confirmed/processing/shipped/delivered/cancelled)
- payment_status (text, default 'pending' — pending/paid/failed/refunded)
- payment_method (text, default 'demo')
- payment_transaction_id (text, nullable — stores fake DEMO-TXN-xxx IDs)
- shipping_address (jsonb, not null — full address object)
- created_at (timestamptz, default now())

### order_items
- id (uuid, PK, auto-generated)
- order_id (uuid, FK to orders.id ON DELETE CASCADE)
- product_id (text, not null)
- product_name (text, not null)
- quantity (integer, not null)
- price (numeric(10,2), not null)
- size (text, nullable)
- color (text, nullable)
- created_at (timestamptz, default now())

## Security (RLS)
- RLS enabled on both tables.
- The app currently uses localStorage-based demo auth (no Supabase auth sessions).
- Policies use TO anon, authenticated so the anon-key frontend can read/write.
- Customers can only see orders matching their own email (enforced at app level;
  the anon role allows access since there is no real auth session to scope by).
- When real Supabase auth is added later, policies should be tightened to use auth.uid().
- Indexes on customer_email and order_id for query performance.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'demo',
  payment_transaction_id text,
  shipping_address jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  size text,
  color text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- orders: allow anon + authenticated CRUD (demo app, no real auth sessions yet)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- order_items: allow anon + authenticated CRUD
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
