"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/lib/mock-data";
import { CheckCircle, Upload, Plus, X } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    discountPrice: "",
    stock: "In Stock",
    description: "",
  });

  const updateForm = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addSpec = () => setSpecs(prev => [...prev, { key: "", value: "" }]);
  const removeSpec = (i: number) => setSpecs(prev => prev.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    setSpecs(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Product Added!</h1>
        <p className="text-muted mb-6">Your product has been added and is now live in your store.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => { setDone(false); setForm({ name: "", category: "", subcategory: "", price: "", discountPrice: "", stock: "In Stock", description: "" }); setSpecs([]); }}
            className="bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Add Another
          </button>
          <button
            onClick={() => router.push("/vendor/dashboard/products")}
            className="border border-border text-foreground font-medium px-6 py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors"
          >
            View Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
        <p className="text-muted text-sm mt-1">List a new product in your store</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => updateForm("name", e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => updateForm("category", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Subcategory</label>
              <input
                type="text"
                value={form.subcategory}
                onChange={e => updateForm("subcategory", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="e.g. Fruits, Dresses"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => updateForm("price", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Discount Price (optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discountPrice}
                onChange={e => updateForm("discountPrice", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Stock Status</label>
            <select
              value={form.stock}
              onChange={e => updateForm("stock", e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => updateForm("description", e.target.value)}
              rows={4}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Images</label>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-6 h-6 text-muted mb-2" />
              <span className="text-sm text-muted">Click to upload images</span>
              <span className="text-xs text-muted mt-1">PNG, JPG up to 5MB</span>
              <input type="file" className="hidden" multiple accept="image/*" />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Specifications</label>
              <button
                type="button"
                onClick={addSpec}
                className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Row
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={e => updateSpec(i, "key", e.target.value)}
                    className="flex-1 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Key (e.g. Material)"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={e => updateSpec(i, "value", e.target.value)}
                    className="flex-1 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Value (e.g. Cotton)"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={submitting || !form.name || !form.category || !form.price}
              className="bg-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {submitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
