# ELSAAD — Architecture

Current state after the Phase 2B → monorepo migration (turbo + pnpm).

## Topology

```
                         ┌──────────────────────────────┐
  browser  ── :3000 ──▶  │  apps/web  (Next.js 15)      │
                         │  pages are force-dynamic     │
                         └──────────────┬───────────────┘
                                        │  @elsaad/api-client
                                        │  fetch(GET) → { data, isMock }
                                        ▼
                         ┌──────────────────────────────┐
                         │  apps/api  (NestJS 10)       │
                         │  global prefix: /api         │
                         │  Swagger: /api/docs          │
                         │  AdminApiKeyGuard on writes  │
                         └───────┬──────────────┬───────┘
                                 │              │
                    withDb() ────┘              └──── StorageService
                    ┌─────────────┐             ┌──────────────────────┐
                    │ Prisma 6    │             │ driver: minio | local│
                    │ PostgreSQL  │             │ minio → signed URLs, │
                    │ (optional)  │             │   COMPLIANCE WORM    │
                    └─────────────┘             │ local → ./uploads +  │
                          │                     │   /storage/local/*   │
                          ▼                     └──────────────────────┘
                    no DATABASE_URL
                    → mock fallback
                    (isMock: true)
```

## Repository Layout

| Path | Package | Role |
|------|---------|------|
| `apps/web` | `@elsaad/web` | Next.js UI (landing, catalog, admin) |
| `apps/api` | `@elsaad/api` | NestJS REST API, Prisma schema + scripts |
| `packages/shared` | `@elsaad/shared` | zod schemas, domain types, mock data, landing content, pure utils (`totalStock`, `isLowStock`) — TypeScript source, no build step |
| `packages/api-client` | `@elsaad/api-client` | typed fetch wrapper + endpoint functions; the only way the web app talks to the API |
| `packages/config` | `@elsaad/config` | shared `tsconfig`/eslint/prettier presets |

Build orchestration: turbo (`build`/`lint`/`dev` task graph in `turbo.json`).
`apps/web` compiles the TS-source packages through `transpilePackages`.

## Request Flow (reads)

1. A page imports e.g. `getProducts` from `@elsaad/api-client`.
2. The client `fetch`es `${NEXT_PUBLIC_API_URL}/products…` with `cache: no-store`.
3. The NestJS controller validates inputs (`ZodValidationPipe` + zod) and
   delegates to the service.
4. The service calls `withDb(prisma, run, fallback)`:
   - no `DATABASE_URL` → mock data immediately (`isMock: true`);
   - DB reachable → Prisma query (`isMock: false`);
   - Prisma/query error → logged + mock fallback (never crashes the request).
5. Every response is `{ data: T, isMock: boolean }`; the client unwraps
   `data` so call sites keep the old local-service shapes.
6. Lookup endpoints answer HTTP 404 for missing rows; `apiGetOrNull`
   maps 404 back to `null` so page-level `if (!x) notFound()` checks still work.

## Auth (temporary, Decision 1B)

- No User model yet. All write endpoints (POST/PUT/DELETE, uploads, purge)
  are protected by `AdminApiKeyGuard`: the `x-admin-api-key` header must
  equal the `ADMIN_API_KEY` env var (timing-safe compare), otherwise 403.
  Unconfigured key ⇒ 403 (safe default).
- `@elsaad/api-client` attaches the key only for mutating calls and only
  server-side (`ADMIN_API_KEY`, never a `NEXT_PUBLIC_*` variable).
- Admin **forms in the web UI still only log** their payloads — connecting
  them to the guarded endpoints is deliberately deferred (Phase 2B state).

## Storage & Documents

`StorageService` (global module, `src/storage/`) selects a provider from
`STORAGE_DRIVER`:

- **minio** — `S3Client` with `forcePathStyle`; bucket auto-created with
  object lock enabled; `putObject`/`setRetention` support COMPLIANCE
  retention; downloads are presigned URLs (default 300 s TTL).
- **local** — files under `STORAGE_UPLOAD_DIR` (path-traversal guarded,
  write-once), served read-only by `GET /api/storage/local/*`;
  `setRetention` is a no-op (TODO: real WORM needs minio).

Documents module (`src/documents/`): upload (multipart ≤50 MB, PDF/JPEG/PNG/
WebP), list by `entityType/entityId`, presigned download, soft delete
(`status=DELETED`), `purge` (storage delete + DB row; 409 while WORM
retention blocks the storage delete), `makeImmutable` (retroactive
COMPLIANCE retention on minio).

Keys are always fresh: `entityType/entityId/<uuid>-<slugified-name>` — a key
is never reused for different content.

## Conventions

- **Response envelope** `{ data, isMock }` from every service; controllers
  throw `NotFoundException`/`ConflictException` *outside* `withDb` (its
  catch-all would otherwise swallow them into the mock fallback).
- **Swagger** decorators (`@ApiTags/@ApiOperation/@ApiParam/…`) on every
  controller; admin routes document the `x-admin-api-key` header; uploads use
  `@ApiConsumes("multipart/form-data")` + binary `@ApiBody` schema.
- **Validation** is zod-only through `ZodValidationPipe` (class-validator is
  installed but unused — flagged).
- **DI**: tsx/esbuild does not emit `emitDecoratorMetadata`, so every
  constructor parameter uses an explicit `@Inject(Class)` — required for
  `pnpm dev`, harmless for compiled runs.
- **Mocks** carry a `/* MOCK DATA */` header; every intentional gap is
  written as `// TODO: reason — …`.
- **Prisma client**: constructed lazily (`PrismaService.get()` inside
  `withDb`'s try/catch) so the app boots without `prisma generate`.
- **Never run** `prisma migrate/db push/generate` without an explicit
  go-ahead (no `DATABASE_URL` in this environment).

## Ports & Processes

| Process | Port | Start |
|---------|------|-------|
| apps/web (next dev) | 3000 | `pnpm dev` |
| apps/api (tsx watch) | 4000 | `pnpm dev` |
| postgres / redis / minio | 5432 / 6379 / 9000+9001 | `docker compose up -d` |
