"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/shared/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
import { Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState type="wishlist" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted mt-1">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-sm text-muted hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map(product => (
          <ProductCard key={product.id} product={product} showVendor />
        ))}
      </div>
    </div>
  );
}
