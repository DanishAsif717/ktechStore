import vendorsData from "@/data/vendors.json";
import productsData from "@/data/products.json";
import ordersData from "@/data/orders.json";
import reviewsData from "@/data/reviews.json";
import type { Vendor, Product, Category, Review, Order, VendorDashboardStats } from "@/types";

export const vendors: Vendor[] = vendorsData as Vendor[];
export const products: Product[] = productsData as Product[];
export const orders: Order[] = ordersData as Order[];
export const reviews: Review[] = reviewsData as Review[];

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find(v => v.id === id);
}

export function getProductsByVendor(vendorId: string): Product[] {
  return products.filter(p => p.vendorId === vendorId);
}

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}

export function getDiscountedProducts(): Product[] {
  return products.filter(p => p.discount && p.discount > 0);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => {
    const cat = categories.find(c => c.slug === categorySlug);
    return cat ? p.category === cat.name : false;
  });
}

export function getVendorsByCategory(categoryName: string): Vendor[] {
  return vendors.filter(v => v.categories.some(c => c.toLowerCase() === categoryName.toLowerCase()));
}

export function getReviewsByProduct(productId: number): Review[] {
  return reviews.filter(r => r.productId === productId);
}

export function getOrdersByVendor(vendorId: string): Order[] {
  return orders.filter(o => o.vendorId === vendorId);
}

export function getVendorStats(vendorId: string): VendorDashboardStats {
  const vendorOrders = getOrdersByVendor(vendorId);
  const vendorProducts = getProductsByVendor(vendorId);
  const totalSales = vendorOrders.reduce((sum, o) => sum + o.total, 0);
  const avgRating = vendorProducts.length > 0
    ? vendorProducts.reduce((sum, p) => sum + p.rating, 0) / vendorProducts.length
    : 0;

  const monthlyMap: Record<string, number> = {};
  vendorOrders.forEach(o => {
    const month = o.date.substring(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + o.total;
  });
  const monthlyEarnings = Object.entries(monthlyMap).map(([month, amount]) => ({
    month,
    amount: Math.round(amount * 100) / 100,
  })).sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalSales: Math.round(totalSales * 100) / 100,
    totalOrders: vendorOrders.length,
    totalProducts: vendorProducts.length,
    rating: Math.round(avgRating * 10) / 10,
    monthlyEarnings,
  };
}

export const categories: Category[] = [
  { id: 1, name: "Grocery", slug: "grocery", description: "Fresh groceries, fruits, vegetables, dairy & more", image: "🥬", productCount: products.filter(p => p.category === "Grocery").length, icon: "🛒" },
  { id: 2, name: "Clothes", slug: "clothes", description: "Fashion, apparel, shoes & accessories", image: "👕", productCount: products.filter(p => p.category === "Clothes").length, icon: "👗" },
  { id: 3, name: "Car Parts", slug: "car-parts", description: "Auto parts, accessories & maintenance", image: "🔧", productCount: products.filter(p => p.category === "Car Parts").length, icon: "🚗" },
  { id: 4, name: "Electronics", slug: "electronics", description: "Gadgets, wearables & tech accessories", image: "⚡", productCount: products.filter(p => p.category === "Electronics").length, icon: "📱" },
  { id: 5, name: "Home & Kitchen", slug: "home-kitchen", description: "Furniture, decor, cookware & home essentials", image: "🏠", productCount: products.filter(p => p.category === "Home & Kitchen").length, icon: "🏡" },
  { id: 6, name: "Sports", slug: "sports", description: "Sports equipment, activewear & fitness gear", image: "💪", productCount: products.filter(p => p.category === "Sports").length, icon: "⚽" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getCategoryById(id: number): Category | undefined {
  return categories.find(c => c.id === id);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  products.forEach(p => cats.add(p.category));
  return Array.from(cats).sort();
}

export function getAllSubcategories(category?: string): string[] {
  const subs = new Set<string>();
  products
    .filter(p => !category || p.category === category)
    .forEach(p => subs.add(p.subcategory));
  return Array.from(subs).sort();
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function searchVendors(query: string): Vendor[] {
  const q = query.toLowerCase();
  return vendors.filter(v =>
    v.shopName.toLowerCase().includes(q) ||
    v.description.toLowerCase().includes(q) ||
    v.categories.some(c => c.toLowerCase().includes(q))
  );
}

export function getProductEmoji(category: string): string {
  const map: Record<string, string> = {
    "Grocery": "🍌",
    "Clothes": "👕",
    "Car Parts": "🔧",
    "Electronics": "⚡",
    "Home & Kitchen": "🏠",
    "Sports": "💪",
  };
  return map[category] || "🛒";
}

export function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    "grocery": "🥬",
    "clothes": "👕",
    "car-parts": "🔧",
    "electronics": "⚡",
    "home-kitchen": "🏠",
    "sports": "💪",
  };
  return map[slug] || "🛒";
}

export function generateOrderId(): string {
  return `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
