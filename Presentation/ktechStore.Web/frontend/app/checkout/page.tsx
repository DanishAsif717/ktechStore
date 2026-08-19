"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductEmoji, generateOrderId } from "@/lib/utils";
import { fetchVendorById } from "@/lib/services/vendor.service";
import { useState, useMemo, useEffect } from "react";
import { Store, CreditCard, CheckCircle, Package } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import type { Vendor } from "@/types";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderGroupId, setOrderGroupId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Record<string, Vendor | null>>({});

  const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
  });

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const ids = [...new Set(items.map(i => i.product.vendorId))];
    Promise.all(ids.map(id => fetchVendorById(id).then(v => ({ id, vendor: v ?? null }))))
      .then(results => {
        const map: Record<string, Vendor | null> = {};
        results.forEach(r => { map[r.id] = r.vendor; });
        setVendors(map);
      });
  }, [items]);

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

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          type="cart"
          title="Nothing to Checkout"
          message="Your cart is empty. Add some products first."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted mb-2">Thank you for your purchase. Your order has been placed and the vendors have been notified.</p>
          <p className="text-sm font-medium text-primary mb-8">Order #{orderGroupId}</p>
          <div className="space-y-3 text-left bg-gray-50 rounded-xl p-4 mb-8">
            <p className="text-sm font-semibold text-foreground">Order Summary</p>
            {Object.entries(groupedByVendor).map(([vendorId, vendorItems]) => {
              const vendor = vendors[vendorId];
              const vTotal = vendorItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
              return (
                <div key={vendorId} className="text-sm text-muted flex justify-between">
                  <span>{vendor?.shopName} ({vendorItems.length} items)</span>
                  <span className="font-medium text-foreground">{formatPrice(vTotal)}</span>
                </div>
              );
            })}
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
              <span>Total (Cash on Delivery)</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
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
   const canPlaceOrder = () => {
        return (
            form.firstName.trim().length > 0 &&
            form.email.trim().length > 0 &&
            form.phone.trim().length > 0 &&
            form.street.trim().length > 0 &&
            form.city.trim().length > 0
        );
    };
   const handlePlaceOrder = async () => {
        // 🔥 NAYA: validation check
        if (!canPlaceOrder()) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: `${form.firstName} ${form.lastName}`.trim(),
                    customerEmail: form.email,
                    customerPhone: form.phone,
                    shippingAddress: `${form.street}, ${form.city} ${form.zip}`.trim(),
                    items: items.map(i => ({
                        productId: i.product.id,
                        quantity: i.quantity,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to place order");
            }

            setOrderGroupId(data.orderGroupId);

            clearCart();
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }; 

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
              {[
                // { name: "Credit Card", icon: CreditCard },
                { name: "Cash on Delivery", icon: Package },
              ].map(({ name, icon: Icon }) => (
                <label key={name} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" className="text-primary focus:ring-primary" defaultChecked={name === "Cash on Delivery"} />
                  <Icon className="w-5 h-5 text-muted" />
                  <span className="text-sm font-medium text-foreground">{name}</span>
                </label>
              ))}
            </div>
            </div>
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                    {error}
                </div>
            )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

          <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
            {Object.entries(groupedByVendor).map(([vendorId, vendorItems]) => {
              const vendor = vendors[vendorId];
              const vTotal = vendorItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
              return (
                <div key={vendorId} className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Store className="w-3.5 h-3.5 text-primary" />
                    {vendor?.shopName}
                  </div>
                  {vendorItems.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 py-1.5">
                       <div className="w-8 h-8 bg-primary-light rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                                src={item.product.images}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                            />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-medium text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="text-right text-xs text-muted mt-1 pt-1 border-t border-border">
                    Subtotal: <span className="font-medium text-foreground">{formatPrice(vTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>       
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total(COD)</span>
              <span className="font-bold text-lg text-primary">{formatPrice(total * 1.08)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors mt-6 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
