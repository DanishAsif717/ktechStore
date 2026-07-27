import type { ProductApiResponse } from "@/types/api";

const baseUrl = typeof window !== "undefined"
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.INTERNAL_API_URL;

export async function fetchProductsFromApi(): Promise<ProductApiResponse[]> {
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductFromApi(id: number): Promise<ProductApiResponse> {
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}