import type { Product } from "@/types";
import { fetchProductsFromApi, fetchProductFromApi } from "@/lib/api/products";
import { mapApiProductToProduct } from "@/lib/mappers/product-mapper";

export async function fetchProducts(): Promise<Product[]> {
  const apiProducts = await fetchProductsFromApi();
  return apiProducts.map(mapApiProductToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find(p => p.slug === slug) ?? null;
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const apiProduct = await fetchProductFromApi(id);
    return mapApiProductToProduct(apiProduct);
  } catch {
    return null;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter(p => p.isFeatured);
}

export async function fetchDiscountedProducts(): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter(p => p.discount && p.discount > 0);
}

export async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter(p => {
    const slug = p.category.toLowerCase().replace(/\s+/g, "-");
    return slug === categorySlug;
  });
}

export async function fetchProductsByVendor(vendorId: string): Promise<Product[]> {
  const products = await fetchProducts();
  return products.filter(p => p.vendorId === vendorId);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  const products = await fetchProducts();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

export async function fetchSubcategories(category?: string): Promise<string[]> {
  const products = await fetchProducts();
  const subs = new Set<string>();
  products
    .filter(p => !category || p.category === category)
    .forEach(p => subs.add(p.subcategory));
  return Array.from(subs).sort();
}
