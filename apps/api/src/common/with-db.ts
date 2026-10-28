import type { PrismaClient } from "@prisma/client";
import type { PrismaService } from "../prisma/prisma.service";

export interface DbResult<T> {
  data: T;
  isMock: boolean;
}

// Single access point for all DB-backed services (API port of the web
// lib/services/withDb pattern):
// 1. No DATABASE_URL → fallback served immediately, DB never queried (mock phase).
// 2. DATABASE_URL set but client not generated / DB unreachable → error caught,
//    logged, fallback served so the API never crashes.
// TODO(Phase 7+): decide whether query errors should fail the request once
// DATABASE_URL is real — reason: silent fallback can mask DB outages.
export async function withDb<T>(
  prisma: PrismaService,
  run: (db: PrismaClient) => Promise<T>,
  fallback: () => Promise<T> | T,
): Promise<DbResult<T>> {
  if (!process.env.DATABASE_URL) {
    return { data: await fallback(), isMock: true };
  }
  try {
    // prisma.get() constructs the client lazily — if `prisma generate` has not
    // run yet the constructor throws, which is caught here and served the
    // mock fallback instead of crashing the request (or app boot).
    return { data: await run(prisma.get()), isMock: false };
  } catch (error) {
    console.error("[api] DB unavailable, serving mock fallback:", error);
    return { data: await fallback(), isMock: true };
  }
}
