"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { getProductBySlug, getCategoryBySlug, getProductsByCategory, getVendorById, getReviewsByProduct, formatPrice, getProductEmoji } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/shared/ProductCard";
import ReviewCard from "@/components/shared/ReviewCard";
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, Store } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const product = getProductBySlug(slug);
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!product) notFound();

  const vendor = getVendorById(product.vendorId);
  const category = getCategoryBySlug(product.category.toLowerCase().replace(/\s+/g, "-"));
  const productReviews = getReviewsByProduct(product.id);
  const related = getProductsByCategory(product.category.toLowerCase().replace(/\s+/g, "-"))
    .filter(p => p.id !== product.id)
    .slice(0, 4);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product as any);
    }
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/categories/${category.slug}`} className="hover:text-primary transition-colors">{category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-primary-light to-white rounded-2xl flex items-center justify-center relative">
            <span className="text-[10rem] md:text-[14rem]">{getProductEmoji(product.category)}</span>
            {product.discount && (
              <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="inline-block text-xs font-medium text-primary bg-primary-light px-3 py-1 rounded-full mb-3 hover:bg-primary hover:text-white transition-colors"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm font-medium text-white bg-accent px-2.5 py-0.5 rounded-lg">
                  Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-muted leading-relaxed">{product.description}</p>

          {product.specifications.length > 0 && (
            <div className="border border-border rounded-xl divide-y divide-border">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex items-center px-4 py-2.5 text-sm">
                  <span className="text-muted w-1/3">{spec.key}</span>
                  <span className="text-foreground font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted">Unit:</span>
              <span className="font-medium text-foreground">{product.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted">Stock:</span>
              {product.inStock ? (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  In Stock
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          {product.inStock && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-muted hover:text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-muted hover:text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted">
                  Total: <span className="font-semibold text-foreground">{formatPrice(product.price * quantity)}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-none bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleItem(product as any)}
                  className={`px-4 py-3.5 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                    wishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-border text-muted hover:text-red-500 hover:border-red-200"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              </div>
            </>
          )}

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="border border-border rounded-xl p-3">
              <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
              <span className="text-muted">Free shipping</span>
            </div>
            <div className="border border-border rounded-xl p-3">
              <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-1" />
              <span className="text-muted">1 year warranty</span>
            </div>
            <div className="border border-border rounded-xl p-3">
              <RotateCcw className="w-5 h-5 text-primary mx-auto mb-1" />
              <span className="text-muted">30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {vendor && (
        <section className="mt-12 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Seller Information</h2>
          <Link href={`/vendor/${vendor.id}`} className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center text-3xl">
              {vendor.logo}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{vendor.shopName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span>{vendor.rating}</span>
                <span>·</span>
                <span>{vendor.totalSales.toLocaleString()} sales</span>
                <span>·</span>
                <span>{vendor.followers.toLocaleString()} followers</span>
              </div>
              <p className="text-sm text-muted mt-1 line-clamp-1">{vendor.description}</p>
            </div>
            <Store className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          </Link>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Customer Reviews ({productReviews.length})</h2>
        </div>
        {productReviews.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            {productReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} showVendor />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
