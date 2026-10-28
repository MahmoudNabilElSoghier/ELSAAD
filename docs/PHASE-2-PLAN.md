# Phase 2 — E-commerce + ERP Foundation Plan

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
- [ ] Prisma schema with ContactMessage model
- [ ] Postgres database provisioned (Neon or Vercel Postgres)
- [ ] Prisma client instantiated (lib/db.ts singleton pattern)
- [ ] POST /api/contact writes to DB (replace console.log)
- [ ] Simple read endpoint /api/contact/list (protected, admin-only)
- [ ] Migration committed + documented in README

## Phase 2B — Product catalog (Week 3-4)
- [ ] Product, Category schemas
- [ ] Seed data script
- [ ] /products page reading from DB
- [ ] /products/[slug] detail page
- [ ] Admin CRUD (simple form-based, no fancy UI yet)

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
