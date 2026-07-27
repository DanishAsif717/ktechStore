import vendorsData from "@/data/vendors.json";
import type { Vendor } from "@/types";

const vendors: Vendor[] = vendorsData as Vendor[];

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchVendors(): Promise<Vendor[]> {
  await delay(200);
  return vendors;
}

export async function fetchVendorById(id: string): Promise<Vendor | undefined> {
  await delay(100);
  return vendors.find(v => v.id === id);
}

export async function fetchVendorsByCategory(categoryName: string): Promise<Vendor[]> {
  await delay(100);
  return vendors.filter(v =>
    v.categories.some(c => c.toLowerCase() === categoryName.toLowerCase())
  );
}

export async function searchVendors(query: string): Promise<Vendor[]> {
  await delay(200);
  const q = query.toLowerCase();
  return vendors.filter(v =>
    v.shopName.toLowerCase().includes(q) ||
    v.description.toLowerCase().includes(q) ||
    v.categories.some(c => c.toLowerCase().includes(q))
  );
}
