# ELSAAD — السعد للدراجات النارية

Landing page and future ERP system for ELSAAD Motorcycle.

## Tech Stack
- Next.js 14+ (App Router) + TypeScript
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

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Scripts

```bash
npm run dev     # start development server
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

### Learn More

- [Next.js Docs](https://nextjs.org/docs) — App Router, routing, rendering.
- [Next.js Learn](https://nextjs.org/learn) — interactive Next.js tutorial.
- [Tailwind CSS Docs](https://tailwindcss.com/docs) — utility classes (v4: `@import "tailwindcss"` + `@theme` in `app/globals.css`).

### Deploy

Deploy easily on [Vercel](https://vercel.com/new) (Next.js first-party host), or see the [deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other platforms.

---

Contact
ELSAAD Motorcycle — [add contact info]