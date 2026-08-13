import type { Category } from "@/types";
import { fetchCategoriesFromApi, fetchCategoryFromApi } from "@/lib/api/categories";
import { mapApiCategoryToCategory } from "@/lib/mappers/category-mapper";

export async function fetchCategories(): Promise<Category[]> {
  const apiCategories = await fetchCategoriesFromApi();
  return apiCategories.map(mapApiCategoryToCategory);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await fetchCategories();
    const data = categories.find(c => c.slug === slug) ?? null;
    return data;
}

export async function fetchCategoryById(id: number): Promise<Category | null> {
  try {
    const apiCategory = await fetchCategoryFromApi(id);
    return mapApiCategoryToCategory(apiCategory);
  } catch {
    return null;
  }
}
