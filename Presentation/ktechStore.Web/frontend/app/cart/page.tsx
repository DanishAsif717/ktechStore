"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, getVendorById, getProductEmoji } from "@/lib/mock-data";
import { useState, useMemo } from "react";
import { Trash2, Minus, Plus, Store } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();

  const groupedByVendor = useMemo(() => {
    const groups: Record<string, typeof items> = {};
    items.forEach(item => {
      const vId = item.product.vendorId;
      if (!groups[vId]) groups[vId] = [];
      groups[vId].push(item);
    });
    return groups;
  }, [items]);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState type="cart" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted mt-1">{items.length} {items.length === 1 ? "item" : "items"} from {Object.keys(groupedByVendor).length} vendor(s)</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-muted hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(groupedByVendor).map(([vendorId, vendorItems]) => {
            const vendor = getVendorById(vendorId);
            const vendorTotal = vendorItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
            return (
              <div key={vendorId} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-border flex items-center justify-between">
                  <Link
                    href={`/vendor/${vendorId}`}
                    className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <Store className="w-4 h-4 text-primary" />
                    {vendor?.shopName || "Unknown Vendor"}
                  </Link>
                  <span className="text-sm text-muted">{vendorItems.length} item(s)</span>
                </div>
                <div className="divide-y divide-border">
                  {vendorItems.map(item => (
                    <div key={item.product.id} className="p-4 flex gap-4">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="w-20 h-20 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-3xl">{getProductEmoji(item.product.category)}</span>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted mt-0.5">{item.product.unit}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-foreground">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-muted hover:text-red-500 transition-colors"
                              aria-label="Remove"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-border text-right">
                  <span className="text-sm text-muted">Vendor subtotal: </span>
                  <span className="font-semibold text-foreground">{formatPrice(vendorTotal)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span className="text-foreground">Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors mt-6"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="block w-full text-center text-muted font-medium py-3 rounded-xl hover:text-primary transition-colors mt-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
