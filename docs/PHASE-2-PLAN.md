# Phase 2 — E-commerce + ERP Foundation Plan

> **✅ Prerequisite satisfied (2026-10-28):** all 5 schema decisions are
> resolved (1B + 2C + 3C + 4B + 5A) in
> [`PHASE-2-DECISIONS.md`](PHASE-2-DECISIONS.md) and applied in the
> active schema `prisma/schema.prisma`. Only the VAT/accountant
> confirmation (decision 4) is still outstanding as a non-blocker.

> **✅ Foundation sprint delivered (2026-10-28):** Phases A–I complete —
> 18-model schema, service layer with mock fallback, admin dashboard
> (`/admin/*`), public catalog (`/products`, `/brands`), Excel/CSV →
> `prisma/data/*.json` migration script, JSON-or-mock seed, docs.
> Everything runs in mock mode until `DATABASE_URL` is provisioned
> (2A deliverables that need a live DB remain open). Next: Phase 2C.

## Overview
Phase 1 (landing page) is live. Phase 2 adds database persistence,
e-commerce capability, and prepares for the full ERP system.

## Timeline (proposed)
| Week | Focus |
|------|-------|
| 1-2  | Prisma + Postgres setup, ContactMessage persistence |
| 3-4  | Product catalog (Categories + Products models + admin) |
| 5-6  | Cart + checkout + order flow |
| 7-8  | Auth (next-auth) + admin dashboard skeleton |
| 9-12 | ERP: inventory, spare parts stock, suppliers |

## Phase 2A — Immediate (Week 1-2)
Goal: Make contact form persistent.

Deliverables:
- [x] Prisma schema with ContactMessage model
- [ ] Postgres database provisioned (Neon or Vercel Postgres)
- [x] Prisma client instantiated (lib/db.ts singleton pattern)
- [ ] POST /api/contact writes to DB (replace console.log)
- [ ] Simple read endpoint /api/contact/list (protected, admin-only)
- [x] Migration committed + documented in README

## Phase 2B — Product catalog (Week 3-4)
- [x] Product, Category schemas (PartCategory + full catalog model set)
- [x] Seed data script (JSON from Excel migration or lib/mock fallback)
- [x] /products page reading from DB (services with mock fallback)
- [x] /products/[slug] detail page
- [x] Admin CRUD (simple form-based, no fancy UI yet)

## Phase 2C — Cart + Orders (Week 5-6)
- [ ] Cart (client state — Zustand or localStorage)
- [ ] Order model
- [ ] Checkout API
- [ ] Order confirmation page
- [ ] Email notification (Resend or similar)

## Phase 2D — Auth (Week 7-8)
- [ ] next-auth setup (Credentials or Google)
- [ ] Role system: customer, admin
- [ ] Protected admin routes

## Phase 2E — ERP (Week 9-12)
- [ ] Stock movements
- [ ] Suppliers
- [ ] Purchase orders
- [ ] Reports
- [ ] Password reset via email (Resend), magic link fallback
- [ ] Active sessions list + revoke in user profile (refresh-family design
      already supports it — no UI yet)
- [ ] Jest unit tests for auth module (login, rotation, reuse detection,
      rate-limit) + integration tests. Currently verified via curl matrix only.

## Tech decisions to confirm
1. Hosted Postgres: Vercel Postgres vs Neon vs Supabase
2. Auth provider: next-auth vs Clerk
3. Email: Resend vs SendGrid vs Nodemailer
4. File storage: Vercel Blob vs S3 vs Cloudinary
5. Cart state: Zustand vs Context vs DB-only

## Definition of done for Phase 2
- Contact submissions stored in DB (no more console.log)
- Products managed via admin (even if minimal UI)
- Customers can browse, add to cart, and place orders
- Admin can view and manage orders
- All endpoints validated with Zod
- Deploy to Vercel production with database connected
