"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Vendor } from "@/types";

interface AuthUser {
  id: string;
  email: string;
  shopName: string;
  vendor: Vendor;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerVendor: (data: Partial<Vendor>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_CREDENTIALS = { email: "vendor@ktech.com", password: "password123" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ktech-auth");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      const mockVendor: AuthUser = {
        id: "v1",
        email: "vendor@ktech.com",
        shopName: "Fresh Harvest Market",
        vendor: {
          id: "v1",
          shopName: "Fresh Harvest Market",
          logo: "🌾",
          banner: "from-green-600 to-green-800",
          description: "Farm-to-table fresh groceries and organic produce.",
          categories: ["Grocery", "Organic Foods", "Dairy"],
          rating: 4.7,
          totalProducts: 42,
          totalSales: 15230,
          joinedDate: "2024-01-15",
          status: "approved",
          email: "vendor@ktech.com",
          phone: "+1 (555) 100-2000",
          address: "123 Farm Road, Green Valley, GV 54321",
          followers: 2840,
        },
      };
      setUser(mockVendor);
      localStorage.setItem("ktech-auth", JSON.stringify(mockVendor));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ktech-auth");
  };

  const registerVendor = async (data: Partial<Vendor>): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1500));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, registerVendor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
