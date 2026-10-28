import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";

// Decision 1B: admin writes must never ship unauthenticated. Every mutating
// endpoint is guarded by ADMIN_API_KEY (env) compared against the
// x-admin-api-key header with a timing-safe equality check. If ADMIN_API_KEY
// is not configured, writes are rejected outright (safe default).
// The key value is never logged.
@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ADMIN_API_KEY;
    if (!expected) {
      throw new ForbiddenException(
        "Admin API key is not configured — set ADMIN_API_KEY to enable write endpoints",
      );
    }
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const provided = request.headers["x-admin-api-key"];
    const key = Array.isArray(provided) ? provided[0] : provided;
    if (!key) {
      throw new ForbiddenException("Missing x-admin-api-key header");
    }
    const a = Buffer.from(key);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new ForbiddenException("Invalid admin API key");
    }
    return true;
  }
}
