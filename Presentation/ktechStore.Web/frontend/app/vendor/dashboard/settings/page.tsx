"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { CheckCircle, Upload } from "lucide-react";

export default function VendorSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    shopName: user?.vendor.shopName || "",
    description: user?.vendor.description || "",
    email: user?.vendor.email || "",
    phone: user?.vendor.phone || "",
    address: user?.vendor.address || "",
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Store Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your store information</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Store Logo</label>
              <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <span className="text-3xl mb-1">{user.vendor.logo}</span>
                <span className="text-xs text-muted">Change logo</span>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Store Banner</label>
              <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-5 h-5 text-muted mb-1" />
                <span className="text-xs text-muted">Upload banner</span>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Shop Name</label>
            <input
              type="text"
              value={form.shopName}
              onChange={e => setForm(prev => ({ ...prev, shopName: e.target.value }))}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Business Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-4">
            <button
              type="submit"
              className="bg-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Save Changes
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Changes saved!
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
