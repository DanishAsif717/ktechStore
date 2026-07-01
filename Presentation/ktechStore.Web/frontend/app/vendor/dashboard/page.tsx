"use client";

import { useAuth } from "@/context/AuthContext";
import { getVendorStats, getOrdersByVendor } from "@/lib/mock-data";
import { DollarSign, ShoppingBag, Package, Star, TrendingUp } from "lucide-react";
import { StatsCardSkeleton } from "@/components/shared/Skeleton";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function VendorDashboardHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setStats(getVendorStats(user.vendor.id));
        setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user) return null;

  if (loading || !stats) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
        <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const cards = [
    { label: "Total Sales", value: `$${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Average Rating", value: stats.rating, icon: Star, color: "text-accent", bg: "bg-orange-100" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back, {user.shopName}! Here&apos;s your store overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Monthly Earnings</h2>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        {stats.monthlyEarnings.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-muted">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 text-border" />
            <p>No earnings data yet. Start selling to see your earnings!</p>
          </div>
        )}
      </div>
    </div>
  );
}
