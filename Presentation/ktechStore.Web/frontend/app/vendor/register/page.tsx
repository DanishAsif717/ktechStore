"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Store, Phone, ChevronLeft, ChevronRight } from "lucide-react";

type Step = "business" | "contact" | "review";

export default function VendorRegisterPage() {
    const [step, setStep] = useState<Step>("business");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        shopName: "",
        description: "",
        email: "",
        phone: "",
    });

    const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: "business", label: "Business Info", icon: <Store className="w-4 h-4" /> },
        { key: "contact", label: "Contact Info", icon: <Phone className="w-4 h-4" /> },
        { key: "review", label: "Review & Submit", icon: <CheckCircle className="w-4 h-4" /> },
    ];

    const currentIndex = steps.findIndex(s => s.key === step);

    const canProceed = () => {
        switch (step) {
            case "business": return form.shopName.length > 0;
            case "contact": return form.email.length > 0 && form.phone.length > 0;
            case "review": return true;
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/vendor-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shopName: form.shopName,
                    email: form.email,
                    contactPhone: form.phone,
                    businessDescription: form.description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit application");
            }

            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
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
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${i <= currentIndex ? "bg-primary text-white" : "bg-gray-100 text-muted"
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
                            <label className="block text-sm font-medium text-foreground mb-1">Store Description</label>
                            <textarea
                                value={form.description}
                                onChange={e => updateForm("description", e.target.value)}
                                rows={4}
                                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
                                placeholder="Tell customers about your store..."
                            />
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
                                    <span className="text-muted">Email</span>
                                    <p className="font-medium text-foreground">{form.email || "—"}</p>
                                </div>
                                <div>
                                    <span className="text-muted">Phone</span>
                                    <p className="font-medium text-foreground">{form.phone || "—"}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-muted">Description</span>
                                    <p className="font-medium text-foreground">{form.description || "—"}</p>
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}
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