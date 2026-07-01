"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, LogIn, Eye, EyeOff } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.push("/vendor/dashboard");
    } else {
      setError("Invalid credentials. Try: vendor@ktech.com / password123");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Login</h1>
          <p className="text-muted mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              placeholder="vendor@ktech.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors pr-10"
                placeholder="password123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-xs text-muted text-center">
            Demo: vendor@ktech.com / password123
          </p>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have a vendor account?{" "}
          <Link href="/vendor/register" className="text-primary hover:text-primary-dark font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
