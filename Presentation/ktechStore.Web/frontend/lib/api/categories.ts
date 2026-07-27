import type { CategoryApiResponse } from "@/types/api";

const baseUrl = typeof window !== "undefined"
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.INTERNAL_API_URL;

export async function fetchCategoriesFromApi(): Promise<CategoryApiResponse[]> {
  const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchCategoryFromApi(id: number): Promise<CategoryApiResponse> {
  const res = await fetch(`${baseUrl}/api/categories/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}
