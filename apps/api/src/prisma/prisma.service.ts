import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient | null = null;

  async onModuleInit() {
    // The client is constructed lazily on the first DB-backed call (see
    // common/with-db) so the app boots — and serves mock data — without
    // DATABASE_URL and without `prisma generate` having been run.
    if (!process.env.DATABASE_URL) {
      console.warn("[prisma] DATABASE_URL missing — DB disabled, mock fallback active");
    }
  }

  get(): PrismaClient {
    if (!this.client) {
      this.client = new PrismaClient();
    }
    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.$disconnect().catch(() => undefined);
    }
  }
}
