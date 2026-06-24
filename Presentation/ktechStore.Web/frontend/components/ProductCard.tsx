"use client";

import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-8">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {getProductEmoji(product.categoryId)}
        </span>
        {product.discount && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-muted hover:text-primary hover:bg-primary-light transition-all opacity-0 group-hover:opacity-100"
          aria-label="Add to cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
            <span className="bg-muted text-white text-sm font-medium px-4 py-1.5 rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted mb-1">{product.unit}</div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-accent" : "text-border"}`}
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-muted ml-1">({product.reviewCount})</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function getProductEmoji(categoryId: number): string {
  const emojis: Record<number, string> = {
    1: "🍌", 2: "🥛", 3: "🍗", 4: "🥖", 5: "🧃", 6: "🍪", 7: "🍚", 8: "🧴",
  };
  return emojis[categoryId] || "🛒";
}
