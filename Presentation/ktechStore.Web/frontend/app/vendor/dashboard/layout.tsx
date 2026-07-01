"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, PlusCircle, ShoppingBag, DollarSign, Settings, Star, LogOut, Store, ChevronLeft, Menu, X
} from "lucide-react";

const sidebarLinks = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/dashboard/products", label: "My Products", icon: Package },
  { href: "/vendor/dashboard/add-product", label: "Add Product", icon: PlusCircle },
  { href: "/vendor/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/vendor/dashboard/earnings", label: "Earnings", icon: DollarSign },
  { href: "/vendor/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/vendor/dashboard/settings", label: "Store Settings", icon: Settings },
];

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/vendor/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 flex">
      <aside className={`fixed lg:sticky top-16 lg:top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-border z-30 transform transition-transform duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-2xl">
              {user.vendor.logo}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.vendor.shopName}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-border pt-2 mt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <button
              onClick={() => { logout(); router.push("/vendor/login"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-white sticky top-16 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted hover:text-foreground">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Vendor Dashboard</span>
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
