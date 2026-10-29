import { Injectable, Logger } from "@nestjs/common";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly limits = new Map<string, RateLimitEntry>();
  private readonly MAX_FAILS = 5;
  private readonly WINDOW_MS = 5 * 60 * 1000; // 5 minutes

  public isRateLimited(email: string): boolean {
    const key = email.toLowerCase().trim();
    const entry = this.limits.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now > entry.resetAt) {
      this.limits.delete(key);
      return false;
    }

    return entry.count >= this.MAX_FAILS;
  }

  public recordFailure(email: string): void {
    const key = email.toLowerCase().trim();
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetAt) {
      this.limits.set(key, { count: 1, resetAt: now + this.WINDOW_MS });
      return;
    }

    entry.count += 1;
    if (entry.count >= this.MAX_FAILS) {
      this.logger.warn(`[auth] rate limit hit for email ${key} (${entry.count} failures)`);
    }
  }

  public reset(email: string): void {
    const key = email.toLowerCase().trim();
    this.limits.delete(key);
  }
}
