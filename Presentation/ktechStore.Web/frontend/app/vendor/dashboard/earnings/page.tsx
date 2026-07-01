"use client";

import { useAuth } from "@/context/AuthContext";
import { getVendorStats, getOrdersByVendor, formatPrice } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function VendorEarningsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setStats(getVendorStats(user.vendor.id));
      setOrders(getOrdersByVendor(user.vendor.id));
    }
  }, [user]);

  if (!user) return null;
  if (!stats) return <div className="text-center py-16 text-muted">Loading...</div>;

  const totalEarnings = stats.totalSales;
  const pendingAmount = orders.filter(o => o.status === "Pending").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="text-muted text-sm mt-1">Track your revenue and payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatPrice(totalEarnings)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Pending Payouts</p>
              <p className="text-2xl font-bold text-accent mt-1">{formatPrice(pendingAmount)}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Orders Fulfilled</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.totalOrders}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Earnings Overview</h2>
        {stats.monthlyEarnings.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-muted">
            <DollarSign className="w-10 h-10 mx-auto mb-2 text-border" />
            <p>No earnings data yet.</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-muted">Order</th>
                <th className="text-left px-6 py-3 font-medium text-muted">Date</th>
                <th className="text-left px-6 py-3 font-medium text-muted">Customer</th>
                <th className="text-left px-6 py-3 font-medium text-muted">Status</th>
                <th className="text-right px-6 py-3 font-medium text-muted">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-foreground">{order.id}</td>
                  <td className="px-6 py-3 text-muted">{order.date}</td>
                  <td className="px-6 py-3 text-foreground">{order.customerName}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-foreground">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
