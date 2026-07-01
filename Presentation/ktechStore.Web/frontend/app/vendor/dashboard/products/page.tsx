"use client";

import { useAuth } from "@/context/AuthContext";
import { getProductsByVendor, formatPrice, getProductEmoji } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, PlusCircle, Edit2, Trash2 } from "lucide-react";

type SortField = "name" | "price" | "rating";
type SortDir = "asc" | "desc";

export default function VendorProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    if (user) setProducts(getProductsByVendor(user.vendor.id));
  }, [user]);

  if (!user) return null;

  const sorted = [...products].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "price") return (a.price - b.price) * mul;
    if (sortField === "rating") return (a.rating - b.rating) * mul;
    return a.name.localeCompare(b.name) * mul;
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Products</h1>
          <p className="text-muted text-sm mt-1">{products.length} products</p>
        </div>
        <Link
          href="/vendor/dashboard/add-product"
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Package className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-muted font-medium">No products yet</p>
          <p className="text-sm text-muted mt-1">Add your first product to start selling!</p>
          <Link
            href="/vendor/dashboard/add-product"
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors mt-4"
          >
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-muted">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-muted cursor-pointer" onClick={() => toggleSort("name")}>
                    Name <SortIcon field="name" />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted cursor-pointer" onClick={() => toggleSort("price")}>
                    Price <SortIcon field="price" />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-muted cursor-pointer" onClick={() => toggleSort("rating")}>
                    Rating <SortIcon field="rating" />
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center text-xl">
                        {getProductEmoji(product.category)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted">{product.subcategory}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted line-through ml-1">{formatPrice(product.originalPrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.inStock ? (
                        <span className="text-green-600 bg-green-50 text-xs font-medium px-2 py-0.5 rounded-full">In Stock</span>
                      ) : (
                        <span className="text-red-500 bg-red-50 text-xs font-medium px-2 py-0.5 rounded-full">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{product.rating} ★</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
