# ELSAAD — السعد للدراجات النارية

Landing page and future ERP system for ELSAAD Motorcycle.

## Tech Stack
- Next.js 15.5 (App Router) + React 19 + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma (planned)
- Node API Routes

## Status
🚧 Phase 1 — Landing Page (in progress)
- [ ] Project scaffold
- [ ] Landing page sections
- [ ] Contact form
- [ ] Deploy

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

## Known Issues

`npm audit` reports 2 vulnerabilities (1 high, 1 moderate) as of 2026-10-27. No code action now — scheduled for the next minor-upgrade checkpoint.

- **postcss <= 8.5.22** (high) — advisories against the copy bundled inside `next` (`node_modules/next/node_modules/postcss`):
  - XSS via unescaped `</style>` in CSS stringify output — GHSA-qx2v-qp2m-jg93
  - Arbitrary file read / information disclosure via attacker-controlled `sourceMappingURL` — GHSA-6g55-p6wh-862q
  - Incomplete fix of GHSA-6g55-p6wh-862q — GHSA-fxqj-rqcc-2cmp
  - Path traversal in previous source map auto-loading — GHSA-r28c-9q8g-f849
- **next 9.3.4-canary.0 – 16.3.0-preview.10** (moderate) — depends on the vulnerable bundled postcss (build-time dependency).
- ⚠️ Do **not** run `npm audit fix --force`: the only offered fix installs `next@16.4.3`, which is a breaking change (project is pinned to Next 15.5).

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
