<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Modifications Log

## Overview

Completed a full migration from `mock-data.ts` to a **centralized async service layer** that calls the real .NET API (`https://localhost:7073/api/products`, `/api/categories`). Every page and component in the app now fetches **Products and Categories** dynamically from the API through `hooks → services → API layer → mappers`. Vendor, Order, and Review data still comes from JSON files but is accessed via the same service pattern for consistency.

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│              UI Components / Pages (all use hooks)       │
│  app/page.tsx, app/products/page.tsx, Navbar, Footer... │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                          │
│  useProducts() / useCategories() / useProduct() / ...   │
│  (handles loading / error / data states)                │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Service Layer (lib/services/)            │
│  product.service.ts  /  category.service.ts             │
│  vendor.service.ts   /  order.service.ts                │
│  review.service.ts                                      │
│  (async — orchestrates API / JSON + mapping)           │
└──────┬──────────────────────────────┬───────────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐          ┌─────────────────────┐
│  lib/api/*.ts │          │  lib/mappers/*.ts    │
│  (fetch to   │          │  DTO → domain types  │
│  .NET API)   │          │                      │
└──────┬───────┘          └─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  .NET Backend API   │
│  localhost:7073     │
│  /api/products      │
│  /api/categories    │
└─────────────────────┘
```

**For Vendors, Orders, Reviews** (no API endpoints yet):
```
Service → JSON files (data/vendors.json, orders.json, reviews.json)
```

## Files Created

### `lib/utils.ts`
Pure formatting utilities extracted from `mock-data.ts`:
- `formatPrice`, `getProductEmoji`, `getCategoryEmoji`, `generateOrderId`

### `lib/services/vendor.service.ts`
Async service for vendor operations using `vendors.json`:
- `fetchVendors()`, `fetchVendorById(id)`, `fetchVendorsByCategory(name)`, `searchVendors(query)`

### `lib/services/order.service.ts`
Async service for order operations using `orders.json`:
- `fetchOrdersByVendor(vendorId)`, `fetchVendorStats(vendorId)`

### `lib/services/review.service.ts`
Async service for review operations using `reviews.json`:
- `fetchReviewsByProduct(productId)`

## Files Modified

### API Layer
| File | Change |
|---|---|
| `lib/api/products.ts` | Fixed `baseUrl` — now uses `NEXT_PUBLIC_API_URL` on client, `INTERNAL_API_URL` on server (was broken client-side). Added `fetchProductFromApi(id)`. |
| `lib/api/categories.ts` | **Created** — `fetchCategoriesFromApi()`, `fetchCategoryFromApi(id)` |

### Services
| File | Change |
|---|---|
| `lib/services/product.service.ts` | Uses real API (`fetchProductsFromApi` + `mapApiProductToProduct`). No mock-data. |
| `lib/services/category.service.ts` | Uses real API (`fetchCategoriesFromApi` + `mapApiCategoryToCategory`). No mock-data. |
| `lib/services/index.ts` | Exports all services (product, category, vendor, order, review) |

### Hooks
| File | Change |
|---|---|
| `hooks/useProducts.ts` | Calls `fetchProducts()` from service layer |
| `hooks/useCategories.ts` | Calls `fetchCategories()` from service layer |
| `hooks/useProduct.ts` | **New** — fetches single product by slug |
| `hooks/useCategory.ts` | **New** — fetches single category by slug |

### Pages (all converted to client components that use hooks/services)
| File | Key Changes |
|---|---|
| `app/page.tsx` | Converted to `"use client"`. Uses `useProducts()`, `useCategories()`, `fetchVendors()`. |
| `app/products/page.tsx` | Removed all `mock-data` imports. Subcategories derived via `useMemo`. |
| `app/products/[id]/page.tsx` | Uses `useProduct()` hook + service calls for vendor/category/reviews/related. |
| `app/categories/page.tsx` | Uses `useCategories()` hook with loading/error states. |
| `app/categories/[slug]/page.tsx` | Uses `useCategory()`, `useProducts()`, `fetchVendorsByCategory()`. |
| `app/search/page.tsx` | Uses `searchProducts()`, `searchVendors()` from services with loading/error. |
| `app/cart/page.tsx` | Uses `fetchVendorById()` async + `formatPrice`/`getProductEmoji` from utils. |
| `app/checkout/page.tsx` | Same pattern — async vendor fetching + utils. |
| `app/vendor/[vendorId]/page.tsx` | Uses `fetchVendorById()`, `fetchProductsByVendor()` from services. |
| `app/vendor/register/page.tsx` | Uses `useCategories()` hook. |
| `app/vendor/dashboard/*` (6 pages) | All use async service calls instead of sync mock-data functions. |

### Components
| File | Key Changes |
|---|---|
| `components/shared/Navbar.tsx` | Uses `useCategories()` hook + `useMemo` for `allCategories`. |
| `components/shared/Footer.tsx` | Converted to `"use client"`, uses `useCategories()`. |
| `components/shared/ProductCard.tsx` | Async vendor fetch via `useEffect` + `fetchVendorById()`. |
| `components/shared/CategoryCard.tsx` | Uses `getCategoryEmoji` from `@/lib/utils`. |
| `components/CartSidebar.tsx` | Uses `formatPrice`/`getProductEmoji` from `@/lib/utils`. |

### Mappers
| File | Change |
|---|---|
| `lib/mappers/category-mapper.ts` | Uses `getCategoryEmoji` from `@/lib/utils` instead of `@/lib/mock-data`. |

## Cleanup Status
- **`lib/mock-data.ts`** — No longer imported by any file. Ready for deletion once utility functions are confirmed.
- **`lib/data.ts`** — Legacy file, no imports exist. Can be deleted.

## Next Steps

1. **Run the .NET backend** — Ensure `https://localhost:7073` serves `GET /api/products` and `GET /api/categories`.

2. **Verify every page** — Start the dev server and smoke-test:
   - `/` — homepage products, categories, deals, vendors
   - `/products` — listing, filtering, sorting
   - `/products/[id]` — detail, vendor info, reviews, related
   - `/categories` — grid with loading/error states
   - `/categories/[slug]` — filters, vendors, subcategories
   - `/search?q=...` — async search results
   - `/cart`, `/checkout` — async vendor display
   - All vendor dashboard pages

3. **Add vendor/order/review API endpoints** — When the .NET API adds endpoints for vendors, orders, and reviews, switch their services (in `lib/services/vendor.service.ts`, `order.service.ts`, `review.service.ts`) from JSON files to `fetch()` calls — no pages or hooks need changes.

4. **Cleanup** — Delete `lib/mock-data.ts` and `lib/data.ts` after verifying no remaining imports.
