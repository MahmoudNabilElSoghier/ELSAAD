# ELSAAD — Motorcycle Parts ERP + Catalog

## Project Summary
ELSAAD (السعد للدراجات النارية) — 35-year motorcycle dealership and parts
supplier in Egypt. Phase 1 landing page, Phase 2B catalog/admin foundation,
and the turbo+pnpm monorepo migration are complete. Active work: Sprint 2D
(auth → admin write wiring → deploy prep).

## Tech Stack
- Turborepo + pnpm 9 workspaces, Node 24, `.npmrc` `node-linker=hoisted`
- `apps/web` — Next.js 15.5 (App Router) + React 19 + Tailwind v4, RTL-native
  (`dir="rtl"`), UI at :3000
- `apps/api` — NestJS 10 + Prisma 6 + Swagger 8, port 4000, base path `/api`
  (built to a single esbuild bundle, `pnpm start` = `node dist/main.js`)
- `packages/shared` — `@elsaad/shared`: zod schemas, domain types, mock data,
  landing content, Prisma→domain mappers
- `packages/api-client` — `@elsaad/api-client`: typed fetch client used by web
- Local Docker stack: postgres 16 (:5434), redis 7 (:6380), minio (:9010/:9011)
- Auth (Sprint 2D): JWT RS256 (node:crypto, no extra deps) + rotating refresh
  tokens; `x-admin-api-key` remains a dual-auth alternative for scripts/CI

## Critical File Access Rules
1. Never scan the whole repository or recurse into `node_modules`, `.next`, or `.git`.
2. To read files, use targeted paths.
3. To list directories, list specific folders only.

## Security Rules
1. Never read, use, or reference credentials from OS credential stores, env vars,
   or secret managers without explicit permission.
2. Never print, log, or transmit secrets/API keys (mask keys, show length only).

## Project Rules
- Conventional commits (`feat`/`fix`/`chore`/`docs(scope): message`).
- Build + lint must pass before every commit (`pnpm build && pnpm lint`).
- Work on `main`; never push unless explicitly approved.
- Stop on the first failure, report, wait for instructions.
- Do not touch Phase 1 landing components.
- Do not touch native PostgreSQL 17 (port 5432) or the ChronicleX stack
  (5433/6379/9000-9001).
- Workflow is `prisma db push` (no migrate history). Do not run
  `prisma migrate`.
- Arabic strings: landing content in `packages/shared/src/content.ts`, site
  copy in `apps/web/lib/content.ts`; company data in `apps/web/lib/config.ts`.

## Current State & Next Steps
- Done: Phase 1 landing; Phase 2B schema + admin + catalog; monorepo
  migration; Prisma db:push + seed (real JSON data); storage/documents
  (MinIO + WORM + smoke tests); Decimal/JsonValue mappers; esbuild dist start.
- Active — Sprint 2D: A1 auth schema/bootstrap → A2 JWT module (rotation +
  reuse detection + rate limit) → A3 login UI + middleware → B1-B3 write-endpoint
  gaps + admin form wiring → C1-C2 deploy configs + docs.
- Deferred: Phase 2C cart/checkout; Phase 2E (password reset, session UI,
  auth unit tests, Redis-backed rate limit, stock movements, orders admin).

## Do-NOT List
- Do not push to `main`.
- Do not touch Phase 1 landing components.
- Do not add unauthorized dependencies (approved so far: `framer-motion`,
  `react-hook-form`, `zod`, `lucide-react`, `sonner`, plus workspace tooling;
  auth uses node:crypto only).
- Do not expose `/admin` publicly before Sprint 2D auth lands.
