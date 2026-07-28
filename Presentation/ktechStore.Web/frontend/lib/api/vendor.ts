const baseUrl = typeof window === "undefined" ? process.env.INTERNAL_API_URL : "";

export interface VendorApplicationPayload {
    shopName: string;
    email: string;
    contactPhone: string;
    businessDescription?: string;
}

export async function submitVendorApplication(payload: VendorApplicationPayload) {
    const res = await fetch(`${baseUrl}/api/vendor-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to submit application");
    }

    return data;
}