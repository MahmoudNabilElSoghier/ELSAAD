import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Lazy connect only when a database is configured — the platform must boot
    // (and fall back to shared mock data) without DATABASE_URL during dev.
    if (process.env.DATABASE_URL) {
      await this.$connect();
      return;
    }
    console.warn("[prisma] DATABASE_URL missing — DB disabled, mock fallback active");
  }

  async onModuleDestroy() {
    if (process.env.DATABASE_URL) {
      await this.$disconnect();
    }
  }
}
