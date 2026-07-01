"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Store, Upload, ChevronLeft, ChevronRight, Building2, Phone, Banknote } from "lucide-react";
import { categories } from "@/lib/mock-data";

type Step = "business" | "contact" | "payment" | "review";

export default function VendorRegisterPage() {
  const router = useRouter();
  const { registerVendor } = useAuth();
  const [step, setStep] = useState<Step>("business");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    category: "",
    description: "",
    logo: null as File | null,
    banner: null as File | null,
    email: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });

  const updateForm = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "business", label: "Business Info", icon: <Store className="w-4 h-4" /> },
    { key: "contact", label: "Contact Info", icon: <Phone className="w-4 h-4" /> },
    { key: "payment", label: "Payment Info", icon: <Banknote className="w-4 h-4" /> },
    { key: "review", label: "Review & Submit", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const currentIndex = steps.findIndex(s => s.key === step);

  const canProceed = () => {
    switch (step) {
      case "business": return form.shopName.length > 0 && form.category.length > 0;
      case "contact": return form.email.length > 0 && form.phone.length > 0;
      case "payment": return form.bankName.length > 0 && form.accountNumber.length > 0;
      case "review": return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await registerVendor({
      shopName: form.shopName,
      categories: [form.category],
      description: form.description,
      email: form.email,
      phone: form.phone,
      address: form.address,
    });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
        <p className="text-muted mb-4">
          Thank you for applying! Your vendor application is now pending review. We&apos;ll notify you once it&apos;s approved.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <p className="font-medium">Pending Approval</p>
          <p className="mt-1">Our team will review your application within 24-48 hours. You&apos;ll receive an email confirmation.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground">Become a Vendor</h1>
        <p className="text-muted mt-2">Set up your store and start selling on KTechMarket</p>
      </div>

      <div className="flex items-center justify-center mb-10">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i <= currentIndex ? "bg-primary text-white" : "bg-gray-100 text-muted"
            }`}>
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${i < currentIndex ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        {step === "business" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Business Information</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Shop Name *</label>
              <input
                type="text"
                value={form.shopName}
                onChange={e => updateForm("shopName", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="My Awesome Store"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Primary Category *</label>
              <select
                value={form.category}
                onChange={e => updateForm("category", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Store Description</label>
              <textarea
                value={form.description}
                onChange={e => updateForm("description", e.target.value)}
                rows={4}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
                placeholder="Tell customers about your store..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Store Logo</label>
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-5 h-5 text-muted mb-1" />
                  <span className="text-xs text-muted">Upload logo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => updateForm("logo", e.target.files?.[0] || null)} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Store Banner</label>
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-5 h-5 text-muted mb-1" />
                  <span className="text-xs text-muted">Upload banner</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => updateForm("banner", e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === "contact" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => updateForm("email", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="store@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => updateForm("phone", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Business Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => updateForm("address", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="123 Business St, City, State ZIP"
              />
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Payment Information</h2>
            <p className="text-sm text-muted">This is where we&apos;ll send your earnings. Demo UI only — no real data collected.</p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bank Name *</label>
              <input
                type="text"
                value={form.bankName}
                onChange={e => updateForm("bankName", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="Bank of America"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Number *</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={e => updateForm("accountNumber", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Routing Number</label>
              <input
                type="text"
                value={form.routingNumber}
                onChange={e => updateForm("routingNumber", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="021000021"
              />
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Review & Submit</h2>
            <p className="text-sm text-muted">Please review your information before submitting.</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Shop Name</span>
                  <p className="font-medium text-foreground">{form.shopName || "—"}</p>
                </div>
                <div>
                  <span className="text-muted">Category</span>
                  <p className="font-medium text-foreground">{form.category || "—"}</p>
                </div>
                <div>
                  <span className="text-muted">Email</span>
                  <p className="font-medium text-foreground">{form.email || "—"}</p>
                </div>
                <div>
                  <span className="text-muted">Phone</span>
                  <p className="font-medium text-foreground">{form.phone || "—"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted">Address</span>
                  <p className="font-medium text-foreground">{form.address || "—"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted">Bank</span>
                  <p className="font-medium text-foreground">{form.bankName || "—"}</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-medium">📋 Note</p>
              <p className="mt-1">By submitting, you agree to our terms and conditions. Your application will be reviewed by our team.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={() => {
              if (currentIndex > 0) setStep(steps[currentIndex - 1].key);
            }}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          {step === "review" ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1].key);
              }}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
