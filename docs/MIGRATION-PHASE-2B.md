# Phase 2B → Monorepo Migration Record

Scope: migrate the Next.js 15 monolith into a turbo + pnpm monorepo
(`apps/web`, `apps/api`, `packages/*`), port all services to NestJS modules,
add MinIO storage + a Document model, and wire the web app to the API —
**without changing any product behavior** (Phase 1 landing page, Phase 2B
schema/services/UI preserved exactly).

Rules kept throughout: no pushes, no history rewrite, build+lint green before
every commit, no `prisma migrate/db push/generate` (no `DATABASE_URL`),
no new business features.

## Phase → Commit Map (47 commits, `origin/main..main`)

| Phase | Commit(s) | What |
|-------|-----------|------|
| 2B pre-migration | `fc8cfa8`…`e171e52` (24) | schema expansion, service layer, mock fallback, admin shell + 8 pages, catalog pages, Excel migration |
| 0 — pre-flight | `3c4c9ee` (part) | pnpm workspace, turbo, `@elsaad/config`, toolchain check (8/8) |
| 1 — workspace scaffold | `3c4c9ee` | root scripts, eslint/prettier/tsconfig presets, gitignore |
| 2 — move web | `c5d6052`, `747fd6f`, `a974792` | `git mv` Next app → `apps/web`; recursive `**/.next/` gitignore fixes |
| 3 — shared package | `44db6dd` | schemas/types/mock/content → `@elsaad/shared` (type-only cycles, content split only where names don't collide) |
| 4 — API scaffold | `916c15e` | NestJS 10 app; `prisma/`, `scripts/`, `data/` relocated to `apps/api`; root tsconfig removed |
| 5 — API modules | `39ea421`…`af0556a` + `9fa70a4` | ZodValidationPipe, withDb, AdminApiKeyGuard, prisma-errors, then brands, categories, models, products, branches, employees, inventory, orders; DI fix |
| 6 — api-client | `a5e92e4`, `abed7f8`, `d29af65` | `@elsaad/api-client`, 14 pages rewired, dead `lib/services/` deleted |
| 7 — storage | `62f4ef8` | compose (postgres/redis/minio), storage module (minio/local), `test:storage` |
| 8 — documents | `1bd54f0` | `Document` model + enums, upload/list/download/soft-delete/purge/WORM endpoints, seed samples |
| 9 — docs | (this phase) | README rewrite, ARCHITECTURE, this record |
| 10 — final | (final phase) | full verification + report |

## Key Decisions & Deviations

- **turbo 2** (`"tasks"` key) instead of the turbo-1 `"pipeline"` file —
  turbo 2 rejects v1 syntax.
- **`.npmrc` `node-linker=hoisted`** — flat `node_modules` so the Prisma
  runtime, root eslint config and cross-package TS-source imports resolve.
- **NestJS 10 + `@nestjs/swagger ^8`** — swagger v10 does not exist; 8.x is
  the Nest-10 line.
- **ZodValidationPipe over class-validator** — `class-validator`/
  `class-transformer` remain installed but unused (flagged).
- **Content types split**: only `Category`/`Testimonial` moved to shared
  (`Brand`/`Branch` collide between content and domain); the rest stay in
  `apps/web/types/index.ts`.
- **`tsx` DI**: esbuild emits no `emitDecoratorMetadata`, so all 16+
  constructors use explicit `@Inject(Class)`; `PrismaService` wraps a lazily
  constructed `PrismaClient` so the app boots with neither `DATABASE_URL` nor
  `prisma generate`.
- **Storage module lives at `apps/api/src/storage/`** (flat, matching the
  other modules) rather than `src/modules/storage/`.
- **Express route order**: `GET :id/download` is declared before
  `GET :entityType/:entityId` (both are two-segment routes).

## Verification Evidence (runtime smokes, mock mode)

- **Reads through the stack**: `/`, `/products`, `/brands`, `/admin`,
  `/brands/sym`, `/brands/sym/fiddle-125`, `/products?page=2`,
  `/products/SYM-FLT-001` all **200** with API-sourced data; missing routes
  404 as before.
- **API**: health ok; brands/products/categories/inventory/orders/endpoints
  return mock data; unknown slug → 404; writes without/with wrong key → 403;
  with key → 201; Swagger `/api/docs-json` lists every path incl. all six
  `/api/documents*` routes.
- **Storage**: `test:storage` PASSED (local put/URL/read-back/delete);
  minio mode prints `SKIPPED` (exit 0) while Docker is down; file serving
  200, missing → 404, path traversal → 404.
- **Documents**: upload (multipart) → local object written → presigned-style
  local URL fetch 200 → soft delete ⇒ download 404 (file retained) →
  `immutable` +30 d recorded → `purge` removes object + row; 403 without
  key; 400 for `text/html` upload.
- **Gates**: `pnpm build` + `pnpm lint` green before every one of the 47
  commits; `prisma validate` + `prisma format` green (dummy-URL trick).

## Flags & Deferred Items

1. Admin form submissions still **log only** (Phase 2B behavior); the guarded
   write endpoints exist but are not wired to the UI.
2. `REDIS_URL` is provisioned by compose but not consumed by any code.
3. Local storage driver cannot enforce WORM (`setRetention` no-op).
4. Upload orphan on DB-insert failure after storage put (compensating
   cleanup is a TODO).
5. Seed writes sample document objects only for `STORAGE_DRIVER=local`.
6. `class-validator`/`class-transformer` deps unused.
7. npm audit: 7 advisories unchanged (never `audit fix --force`).
8. Prisma client types in this environment are stale/placeholder (generate is
   forbidden here); real `generate` is a post-sprint activation step.

## Post-Sprint Activation Steps (ordered)

1. `docker compose up -d` (postgres/minio as needed).
2. Set `apps/api/.env`: `DATABASE_URL`, `ADMIN_API_KEY`, `STORAGE_DRIVER=minio`
   (or leave `local`), `MINIO_*`.
3. `pnpm --filter @elsaad/api exec prisma generate`
4. `pnpm --filter @elsaad/api db:push`
5. `pnpm --filter @elsaad/api db:seed`
6. `pnpm --filter @elsaad/api test:storage` (verifies MinIO round-trip)
7. `pnpm dev` → web :3000, API :4000/api (Swagger `/api/docs`).
8. Set `NEXT_PUBLIC_API_URL` for the web app in any deployed environment.

Push (when explicitly approved):

```bash
git push -u origin main
```

## History Preservation

This branch was **never pushed**, never force-pushed, never rewritten, and
never amended. All 47 commits are atomic, each preceded by a green
build+lint gate.
