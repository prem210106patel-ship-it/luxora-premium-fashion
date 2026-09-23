import { supabase } from "@/lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("popularity", { ascending: false });

  if (error) {
    console.error("Error loading products:", error);
    throw error;
  }

  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading product:", error);
    return null;
  }

  return data;
}