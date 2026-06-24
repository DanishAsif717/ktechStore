"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-border mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted mt-1">{items.length} {items.length === 1 ? "item" : "items"} in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-muted hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
              <Link
                href={`/products/${item.product.slug}`}
                className="w-20 h-20 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <span className="text-3xl">{getProductEmoji(item.product.categoryId)}</span>
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
                      aria-label="Decrease"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary transition-colors"
                      aria-label="Increase"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(getSubtotal())}</span>
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
              <span className="font-bold text-lg text-primary">{formatPrice(getSubtotal())}</span>
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

function getProductEmoji(categoryId: number): string {
  const emojis: Record<number, string> = { 1: "🍌", 2: "🥛", 3: "🍗", 4: "🥖", 5: "🧃", 6: "🍪", 7: "🍚", 8: "🧴" };
  return emojis[categoryId] || "🛒";
}
