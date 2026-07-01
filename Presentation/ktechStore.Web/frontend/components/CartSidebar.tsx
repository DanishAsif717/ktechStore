"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductEmoji } from "@/lib/mock-data";
import { X, ShoppingBag } from "lucide-react";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-muted hover:text-foreground transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-border mb-4" />
                <p className="text-muted font-medium">Your cart is empty</p>
                <p className="text-sm text-muted mt-1">Add some products to get started!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map(item => (
                  <li key={item.product.id} className="flex gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{getProductEmoji(item.product.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-primary font-semibold mt-0.5">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary transition-colors text-sm"
                          aria-label="Decrease quantity"
                        >-</button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary transition-colors text-sm"
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-lg font-bold text-foreground">{formatPrice(getSubtotal())}</span>
              </div>
              <p className="text-xs text-muted">Shipping & taxes calculated at checkout</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full text-center border-2 border-border text-foreground font-medium py-3 rounded-xl hover:border-primary hover:text-primary transition-colors"
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
