# ELSAAD — السعد للدراجات النارية

Landing page and future ERP system for ELSAAD Motorcycle.

## Tech Stack
- Next.js 15.5 (App Router) + React 19 + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma 6 (schema committed, DB not yet provisioned)
- Node API Routes

## Status
✅ Phase 1 — Landing Page (complete; awaiting production deploy)
✅ Phase 2 Foundation (Phases A–I) — schema, services, admin dashboard,
public catalog, Excel/CSV migration, JSON-or-mock seed
🚧 Phase 2C — Cart + checkout (next)

## Roadmap
- Phase 2 — E-commerce
- Phase 3 — ERP (inventory, spare parts, orders)

## Phase 2 Planning

See [`docs/PHASE-2-PLAN.md`](docs/PHASE-2-PLAN.md) for the detailed
phase-by-phase plan, and [`docs/PHASE-2-SCHEMA.prisma`](docs/PHASE-2-SCHEMA.prisma)
for the proposed database schema (draft — not yet applied).

- [`docs/PHASE-2-DECISIONS.md`](docs/PHASE-2-DECISIONS.md) — 5 open
  schema questions with trade-offs and recommendations.

The [client assets checklist](docs/CLIENT-ASSETS-CHECKLIST.md) tracks what
content we still need from ELSAAD before launch.

The 5 open schema questions have been resolved with the recommended
options (1B + 2C + 3C + 4B + 5A) and are applied in the active schema
[`prisma/schema.prisma`](prisma/schema.prisma). The draft
`docs/PHASE-2-SCHEMA.prisma` is kept as the historical reference.
Still pending: accountant confirmation on VAT treatment (decision 4).

## Database (Phase 2A)

The Prisma schema is committed and validated, but **no database is
provisioned yet** — do not run migrations until `DATABASE_URL` exists
(Vercel Postgres / Neon / Supabase).

Once you have a connection string (`.env.local`, see `.env.example`):

    npm run db:push     # create tables + generate Prisma client
    npm run db:seed     # idempotent seed (prisma/data JSON or demo mock + landing content)
    npm run db:studio   # optional data browser

Until `DATABASE_URL` is set, the contact API validates and logs to the
console without touching a database — the deployed site is unaffected.

## Data Migration (Excel → DB)

Import real product sheets (Excel `.xlsx`/`.xls` or CSV, Arabic or English
headers):

1. Drop files into `data/` — see `data/example.csv` for the expected
   columns (`code,name,name_en,brand,category,oem_code,price,wholesale_price,cost_price,stock,description`).
   Arabic headers (`كود`, `اسم`, `سعر`, `المخزون`, …) and partial columns work too.
2. `npm run db:migrate-excel` — parses every sheet in `data/` and writes
   `prisma/data/{brands,categories,models,products,branches}.json`.
   Categories come from an Arabic keyword regex (فلتر، زيت، بوجيه، إطار، …)
   with a raw-category fallback; brand comes from the `brand` column or the
   file-name prefix (`SYM_قطع-غيار.xlsx` → `SYM`).
3. `npm run db:push` then `npm run db:seed` — the seed prefers
   `prisma/data/*.json` per model and falls back to the built-in demo
   catalog (`lib/mock`) when a file is absent.

Notes:
- Products are keyed by `code`, branches by `slug`, brands by `slug` —
  re-runs are idempotent upserts.
- Excel `stock` becomes the first branch's inventory quantity and
  overrides demo inventory rows for the same code.
- `prisma/data/*.json` is generated output and is **not committed**
  (delete it to fall back to demo data).
- `xlsx` is a dev-only dependency; it added 1 high advisory
  (SheetJS prototype pollution/ReDoS) to `npm audit` — dev tooling only,
  never shipped to the browser.

## Admin Dashboard

Routes under `/admin` (RTL sidebar layout):

| Route | Purpose |
|-------|---------|
| `/admin` | Stats cards + recent orders |
| `/admin/products` | Searchable list, low-stock flags; `/new` + `/[id]/edit` forms |
| `/admin/categories` | Two-level category tree manager |
| `/admin/brands` | Brand list + add form |
| `/admin/employees` | Roster grouped by role |
| `/admin/branches` | Branch cards (hours, WhatsApp links) |
| `/admin/inventory` | Per-branch stock table with editable quantities |

- **No auth yet** (Phase 2D) — do not expose publicly until next-auth lands.
- Runs on mock/seeded data until `DATABASE_URL` is set; mock mode shows a
  "معاينة بيانات تجريبية" badge.
- Forms validate (zod) and currently log saves — authenticated write APIs
  are TODO Phase 2D.
- All admin routes carry `noindex` metadata.

## Known Issues

⚠️ Contact form requires `RESEND_API_KEY` + `CONTACT_EMAIL_TO` env vars to actually deliver messages. Without them, submissions return success but are logged only. Configure before public launch.

Rate limiting on `/api/contact` is in-memory per-instance. On Vercel serverless, the counter resets on cold start. Sufficient to stop casual bots, not sophisticated attacks. Upgrade to Vercel KV / Upstash Redis if abuse becomes a problem.

`npm audit` reports 7 vulnerabilities (5 high, 2 moderate) as of 2026-10-28. No code action now — scheduled for the next minor-upgrade checkpoint. The 2nd moderate is `@next/third-parties` merely propagating the known `next` advisory below. The 7th (xlsx) is dev-only, added by the Excel migration script.

- **postcss <= 8.5.22** (high) — advisories against the copy bundled inside `next` (`node_modules/next/node_modules/postcss`):
  - XSS via unescaped `</style>` in CSS stringify output — GHSA-qx2v-qp2m-jg93
  - Arbitrary file read / information disclosure via attacker-controlled `sourceMappingURL` — GHSA-6g55-p6wh-862q
  - Incomplete fix of GHSA-6g55-p6wh-862q — GHSA-fxqj-rqcc-2cmp
  - Path traversal in previous source map auto-loading — GHSA-r28c-9q8g-f849
- **next 9.3.4-canary.0 – 16.3.0-preview.10** (moderate) — depends on the vulnerable bundled postcss (build-time dependency).
- **deepmerge-ts < 8.0.0** (high) — GHSA-ggr8-5vv4-36mx, stack exhaustion on deeply nested object graphs. Transitive via `prisma` CLI → `@prisma/config`; dev-time tooling only, not shipped in the Next.js runtime, and only reachable through malicious config input we do not accept. npm's proposed fix is `prisma@7.10.1` (major bump) — deferred to Phase 2B when `db push`/`generate` can be validated against a real database.
- **xlsx <= 0.18.5** (high) — SheetJS prototype pollution + ReDoS advisories. Dev-only (Excel migration script), never bundled into the app. npm's registry copy is behind the vendor's fixed releases; revisit if the script ever processes untrusted sheets.
- ⚠️ Do **not** run `npm audit fix --force`: the only offered fix installs `next@16.4.3` and `prisma@7.10.1`, both breaking changes (project is pinned to Next 15.5 and Prisma 6).

## Development

### Setup
    npm install
    npm run dev

Open http://localhost:3000

### Scripts
- npm run dev — dev server
- npm run build — production build
- npm run start — serve production build
- npm run lint — eslint
- npm run db:push — create DB tables from prisma/schema.prisma (needs DATABASE_URL)
- npm run db:seed — idempotent seed (prisma/data JSON or lib/mock fallback + lib/content.ts landing)
- npm run db:migrate-excel — parse data/*.{xlsx,xls,csv} → prisma/data/*.json
- npm run db:studio — Prisma data browser

### Editing content
- Company info → lib/config.ts
- Site copy → lib/content.ts
- Form validation → lib/schemas/contact.ts

### Docs
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS v4: https://tailwindcss.com/docs

---

Contact
ELSAAD Motorcycle — [add contact info]
