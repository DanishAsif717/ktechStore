"use client";

import { useAuth } from "@/context/AuthContext";
import { getOrdersByVendor, formatPrice } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { ShoppingBag, PackageSearch } from "lucide-react";

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) setOrders(getOrdersByVendor(user.vendor.id));
  }, [user]);

  if (!user) return null;

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted text-sm mt-1">Manage your incoming orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <PackageSearch className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-muted font-medium">No orders yet</p>
          <p className="text-sm text-muted mt-1">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{order.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1">{order.date} · {order.customerName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-foreground outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.name} × {item.quantity}</span>
                    <span className="text-muted">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 mt-2 text-xs text-muted">
                Ship to: {order.shippingAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
