"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/data";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-2">Nothing to Checkout</h1>
          <p className="text-muted mb-8">Your cart is empty. Add some products first.</p>
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

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted mb-2">Thank you for your purchase. Your order confirmation has been sent to your email.</p>
          <p className="text-sm text-muted mb-8">Order #KT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                <input type="text" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                <input type="text" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input type="tel" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Street Address</label>
                <input type="text" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="123 Main Street" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">City</label>
                <input type="text" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="New York" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">ZIP Code</label>
                <input type="text" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="10001" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
            <div className="space-y-3">
              {["Credit Card", "PayPal", "Cash on Delivery"].map(method => (
                <label key={method} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" className="text-primary focus:ring-primary" defaultChecked={method === "Credit Card"} />
                  <span className="text-sm font-medium text-foreground">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getProductEmoji(item.product.categoryId)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm border-t border-border pt-4">
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
              <span className="text-foreground">{formatPrice(getSubtotal() * 0.08)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-primary">{formatPrice(getSubtotal() * 1.08)}</span>
            </div>
          </div>
          <button
            onClick={() => { clearCart(); setSubmitted(true); }}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors mt-6"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

function getProductEmoji(categoryId: number): string {
  const emojis: Record<number, string> = { 1: "🍌", 2: "🥛", 3: "🍗", 4: "🥖", 5: "🧃", 6: "🍪", 7: "🍚", 8: "🧴" };
  return emojis[categoryId] || "🛒";
}
