# API Routes & Frontend Hooks Audit

Frontend uses `baseURL = /api` (e.g. `http://localhost:5000/api`). All paths below are relative to that.

---

## ✅ PROPER & INTEGRATED (Backend route + Hook + Used in app)

| Backend API Route | Method | Frontend Hook | Hook Method | Used In Page(s) |
|-------------------|--------|---------------|-------------|-----------------|
| **Payment** | | | | |
| `/api/stripe-config` | GET | `useStripeCheckout` | `fetchStripeConfig()` | `checkout.page.tsx` |
| `/api/payment/create-payment-intent` | POST | `useStripeCheckout` | `createPaymentIntent(amount, metadata)` | `checkout.page.tsx` |
| **Stripe Settings (Admin)** | | | | |
| `/api/admin/stripe-settings` | GET | `useStripeSettings` | `fetchSettings()` | `stripeSettings.page.tsx` |
| `/api/admin/stripe-settings` | PUT | `useStripeSettings` | `updateSettings(payload)` | `stripeSettings.page.tsx` |
| `/api/admin/stripe-settings/test` | POST | `useStripeSettings` | `testConnection()` | `stripeSettings.page.tsx` |
| **Admin Auth** | | | | |
| `/api/admin/login` | POST | `useAdminAuth` | `login(email, password)` | `login.page.tsx` |
| **Admin Orders** | | | | |
| `/api/admin/orders` | GET | `useAdminOrders` | `fetchOrders(filters?)` | `adminOrders.page.tsx` |
| `/api/admin/orders/:id` | GET | `useAdminOrders` | `fetchOrderDetails(id)` | `adminOrderDetail.page.tsx` |
| **QR** | | | | |
| `/api/v1/qr/generate` | POST | `useQrApi` | `generateQRCode()` | `qrscaner.page.tsx` |
| `/api/v1/qr/validate/:code` | GET | `useUploadApi` | `validateQRCode(code)` | `upload.tsx` |
| **Upload** | | | | |
| `/api/v1/upload/check/:code` | GET | `useQrApi` | `checkUpload(code)` | `qrscaner.page.tsx` |
| `/api/v1/upload/upload` | POST | `useUploadApi` | `uploadImage(code, file)` | `upload.tsx` |
| `/api/v1/upload/image/:code` | GET | `useQrApi` | `buildImageUrl(code)` (URL only) | Used where image is displayed |
| **Health** | | | | |
| `/health` | GET | `useQrApi` / `useUploadApi` | `checkBackendHealth()` | Uses `backendDomain/health` (no /api) |

---

## ⚠️ BACKEND EXISTS — NO FRONTEND HOOK (not integrated)

| Backend API Route | Method | Purpose | Hook? | Note |
|-------------------|--------|---------|-------|------|
| `/api/admin/dashboard/stats` | GET | Dashboard statistics | ❌ No | Admin dashboard could use this |
| `/api/admin/settings/profile` | PUT | Update admin profile | ❌ No | Admin settings page could use |
| `/api/admin/settings/password` | PUT | Change admin password | ❌ No | Admin settings could use |
| `/api/admin/settings/site` | PUT | Update site settings | ❌ No | Admin settings could use |
| `/api/v1/qr/details/:code` | GET | QR details | ❌ No | useQrApi has no `getQRDetails` |
| `/api/products/create` | POST | Create product | ❌ No | No product admin hook |
| `/api/products/all` | GET | Get all products | ❌ No | UI uses local `productOptions` |

---

## Summary

- **Integrated:** 14 routes (payment, Stripe settings, admin login, admin orders, QR generate/validate, upload check/upload/image, health).
- **Not integrated:** 7 routes (admin dashboard stats, admin profile/password/site settings, QR details, product create/all).

All payment, checkout, Stripe settings, admin orders, admin login, QR flow, and upload flow are **proper and integrated** with hooks on the frontend.
