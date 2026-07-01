"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice, getVendorById, getProductEmoji } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showVendor?: boolean;
}

export default function ProductCard({ product, showVendor = false }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const vendor = getVendorById(product.vendorId);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product as any);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product as any);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-8">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {getProductEmoji(product.category)}
        </span>
        {product.discount && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "text-red-500 fill-red-500" : "text-muted"}`} />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-9 h-9 bg-primary rounded-full shadow-md flex items-center justify-center text-white hover:bg-primary-dark transition-all opacity-0 group-hover:opacity-100"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
            <span className="bg-muted text-white text-sm font-medium px-4 py-1.5 rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted mb-1">{product.unit}</div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-border"}`}
            />
          ))}
          <span className="text-[11px] text-muted ml-1">({product.reviewCount})</span>
        </div>
        {showVendor && vendor && (
          <p className="text-xs text-muted mt-1.5">
            by <span className="text-primary font-medium">{vendor.shopName}</span>
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
