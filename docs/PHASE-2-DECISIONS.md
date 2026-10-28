# Phase 2 — Open Decisions

> **RESOLVED (2026-10-28)** — All five decisions adopted as recommended
> (1B + 2C + 3C + 4B + 5A) and applied in `prisma/schema.prisma`.
> Decision 4 remains pending accountant confirmation on VAT treatment.

---

## Decision 1 — Add `User` model now or defer to Phase 2D?

**Context:** `User` is needed for auth, roles (customer/admin), and
protected admin routes. Phase 2A-2C don't strictly need it if we accept
phone-based guest checkout.

### Option A — Add `User` in Phase 2A
**Pros:**
- Orders can reference a real customer
- Admin CRUD can be role-gated from day 1
- No migration pain later

**Cons:**
- Auth flow (next-auth setup, session, middleware) blocks Phase 2A
- Adds 3-5 days before first DB write
- Risk of over-engineering before we validate the contact form → DB flow

### Option B — Defer `User` to Phase 2D (Week 7-8)
**Pros:**
- Phase 2A completes in ~2 days
- E-commerce launches faster (guest checkout is standard)
- Migration later is trivial (`Order.userId String?` nullable column)

**Cons:**
- Admin routes in 2B-2C need a temporary auth mechanism (basic auth header)
- Slight rework when adding `User`

### Recommended: **Option B**
Ship Phase 2A fast. Add `User` in 2D. Use temporary `ADMIN_API_KEY` env var
for Phase 2B admin endpoints until auth is ready.

**Decision:** [ ] A · [x] B · [ ] Other: ___

---

## Decision 2 — `Order` tied to `User` or phone-based?

**Context:** Depends on Decision 1, but also has its own UX angle.

### Option A — `Order.userId` required (login before purchase)
**Pros:** Clean data model, order history per customer
**Cons:** High friction — most Egyptian e-commerce allows guest checkout

### Option B — Phone-based (guest checkout allowed)
**Pros:** Zero friction, standard for retail
**Cons:** Duplicate customer records, order history requires phone lookup

### Option C — Hybrid: `userId` nullable, phone always required
**Pros:** Best of both — guest checkout by default, logged-in history if user logs in
**Cons:** Slightly more complex queries

### Recommended: **Option C**
Add `userId String?` to Order. Phone always required. If logged in,
populate userId. Guest orders still work.

**Decision:** [ ] A · [ ] B · [x] C · [ ] Other: ___

---

## Decision 3 — Soft delete vs hard delete?

**Context:** Audit trail vs simplicity. ERP-grade systems need audit.

### Option A — Hard delete everywhere
**Pros:** Simplest queries, no wasted storage
**Cons:** Lost data, broken order history if product deleted, no audit
**Disqualifies us from proper ERP later**

### Option B — Soft delete everywhere
**Pros:** Full audit trail
**Cons:** Every query must filter `where: { deletedAt: null }` — error-prone

### Option C — Soft delete on Product + Order only, hard delete on ContactMessage, Testimonial, Branch
**Pros:** Audit where it matters, simplicity where it doesn't
**Cons:** None meaningful

### Recommended: **Option C**
`Product` and `Order` get `deletedAt DateTime?`. Others hard delete.
Add a global Prisma middleware to auto-filter `deletedAt: null` on reads
to avoid forgetting the filter.

**Decision:** [ ] A · [ ] B · [x] C · [ ] Other: ___

---

## Decision 4 — Prices inclusive or exclusive of VAT?

**Context:** Egyptian VAT is 14%. Motorcycles may fall under specific
schedule tax. Client's accounting system likely has an opinion.

### Option A — Prices inclusive (total price shown)
**Pros:** Simple UI, no surprises at checkout
**Cons:** Hard to itemize tax on invoice, breaks if VAT rate changes

### Option B — Prices exclusive (`price` + `taxRate` fields)
**Pros:** Flexible, proper invoicing, works if tax rate changes
**Cons:** UI must show "+14% VAT" or compute total dynamically

### Option C — Store both: `priceExclTax` + `priceInclTax` (denormalized)
**Pros:** Fast queries either way
**Cons:** Two fields to keep in sync, risk of drift

### Recommended: **Option B**
`Product.price Decimal` = price before tax. `Product.taxRate Decimal`
default 0.14. Compute total on order creation. Store computed `taxAmount`
and `total` on Order for audit.

**Decision:** [ ] A · [x] B · [ ] C · [ ] Other: ___

**⚠️ Action needed:** Confirm with ELSAAD's accountant whether sales are
subject to VAT 14% only, or VAT + schedule tax.

---

## Decision 5 — `StockMovement` model now or Phase 3?

**Context:** Every stock change should be auditable. Adding the model
now is cheap; adding it after launch requires backfilling history.

### Option A — Add now (empty model, no UI)
**Pros:**
- Every stock update writes an audit record from day 1
- Phase 3 ERP can display history without backfilling
- 1 file, 1 migration, ~30 minutes work

**Cons:**
- Slightly more code in every stock-changing operation
- Nothing visible to user in Phase 2

### Option B — Defer to Phase 3
**Pros:** Simpler Phase 2 code
**Cons:** All stock changes in Phase 2 have no audit trail. When ERP
starts (Phase 3), we have no historical data. Probably a dealbreaker.

### Recommended: **Option A**
Add `StockMovement` model in Phase 2A. Every `Product.stock` change
must go through a `StockService.adjustStock()` method that writes a
movement row. No UI yet — just the data.

**Decision:** [x] A · [ ] B · [ ] Other: ___

---

## Summary table

| # | Question | Recommended | Decision |
|---|----------|-------------|----------|
| 1 | `User` model timing | Defer to 2D | [x] B |
| 2 | Order↔User linkage | Hybrid (userId nullable) | [x] C |
| 3 | Soft delete scope | Product + Order only | [x] C |
| 4 | VAT pricing | Exclusive + taxRate field | [x] B |
| 5 | `StockMovement` timing | Add now | [x] A |

Decisions applied to the active schema in `prisma/schema.prisma` (Phase 2A).

---

End of docs/PHASE-2-DECISIONS.md
