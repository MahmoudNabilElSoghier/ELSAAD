import type { PrismaClient } from "@prisma/client";

// Single access point for all DB-backed services:
// 1. No DATABASE_URL → fallback() immediately, Prisma never constructed (mock phase).
// 2. DATABASE_URL set but client not generated / DB unreachable → error caught,
//    logged, fallback() served so the UI never crashes.
// TODO(Phase 2D): once DATABASE_URL is real and the client is generated, decide
// whether query errors should still fall back silently or fail the request —
// reason: silent fallback can mask DB outages in production.
export async function withDb<T>(
  run: (db: PrismaClient) => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> {
  if (!process.env.DATABASE_URL) return await fallback();
  try {
    const { db } = await import("@/lib/db");
    return await run(db);
  } catch (error) {
    console.error("[services] DB unavailable, serving fallback data:", error);
    return await fallback();
  }
}
