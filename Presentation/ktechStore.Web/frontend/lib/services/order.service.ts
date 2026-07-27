import ordersData from "@/data/orders.json";
import type { Order, VendorDashboardStats } from "@/types";
import { fetchProductsByVendor } from "./product.service";

const orders: Order[] = ordersData as Order[];

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchOrdersByVendor(vendorId: string): Promise<Order[]> {
  await delay(200);
  return orders.filter(o => o.vendorId === vendorId);
}

export async function fetchVendorStats(vendorId: string): Promise<VendorDashboardStats> {
  await delay(300);
  const vendorOrders = orders.filter(o => o.vendorId === vendorId);
  const vendorProducts = await fetchProductsByVendor(vendorId);
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
