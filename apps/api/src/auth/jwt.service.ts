import { Inject, Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);
  private privateKey: crypto.KeyObject | null = null;
  private publicKey: crypto.KeyObject | null = null;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.loadKeys();
  }

  private loadKeys(): void {
    const keysDir = this.config.get<string>("JWT_KEYS_DIR");
    const privEnv = this.config.get<string>("JWT_PRIVATE_KEY");
    const pubEnv = this.config.get<string>("JWT_PUBLIC_KEY");

    try {
      if (keysDir) {
        const resolvedDir = path.resolve(process.cwd(), keysDir);
        const privPath = path.join(resolvedDir, "private.pem");
        const pubPath = path.join(resolvedDir, "public.pem");
        if (fs.existsSync(privPath) && fs.existsSync(pubPath)) {
          const privPem = fs.readFileSync(privPath, "utf8");
          const pubPem = fs.readFileSync(pubPath, "utf8");
          this.privateKey = crypto.createPrivateKey(privPem);
          this.publicKey = crypto.createPublicKey(pubPem);
          this.logger.log(`Loaded RS256 keys from JWT_KEYS_DIR: ${resolvedDir}`);
          return;
        }
      }

      if (privEnv && pubEnv) {
        const unescapedPriv = privEnv.replace(/\\n/g, "\n");
        const unescapedPub = pubEnv.replace(/\\n/g, "\n");
        this.privateKey = crypto.createPrivateKey(unescapedPriv);
        this.publicKey = crypto.createPublicKey(unescapedPub);
        this.logger.log("Loaded RS256 keys from environment variables");
        return;
      }

      this.logger.warn(
        "No JWT keys configured (JWT_KEYS_DIR or JWT_PRIVATE_KEY/JWT_PUBLIC_KEY unset). Auth endpoints will return 503.",
      );
    } catch (error) {
      this.logger.error("Failed to load RS256 JWT keys", error instanceof Error ? error.stack : error);
    }
  }

  public areKeysLoaded(): boolean {
    return this.privateKey !== null && this.publicKey !== null;
  }

  public parseTtl(ttlStr: string): number {
    const match = ttlStr.trim().match(/^(\d+)([smhd]?)$/);
    if (!match) return 900; // default 15m
    const val = parseInt(match[1], 10);
    const unit = match[2] || "s";
    switch (unit) {
      case "s":
        return val;
      case "m":
        return val * 60;
      case "h":
        return val * 3600;
      case "d":
        return val * 86400;
      default:
        return val;
    }
  }

  public sign(payload: Record<string, unknown>, ttlStr: string): string {
    if (!this.privateKey) {
      throw new ServiceUnavailableException("Authentication service unavailable: JWT keys not configured");
    }

    const now = Math.floor(Date.now() / 1000);
    const ttlSeconds = this.parseTtl(ttlStr);
    const fullPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + ttlSeconds,
    } as JwtPayload;

    const header = { alg: "RS256", typ: "JWT" };
    const headerB64 = this.base64UrlEncode(JSON.stringify(header));
    const payloadB64 = this.base64UrlEncode(JSON.stringify(fullPayload));
    const signingInput = `${headerB64}.${payloadB64}`;

    const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), this.privateKey);
    const signatureB64 = this.base64UrlEncode(signature);

    return `${signingInput}.${signatureB64}`;
  }

  public verify(token: string): JwtPayload {
    if (!this.publicKey) {
      throw new ServiceUnavailableException("Authentication service unavailable: JWT keys not configured");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token structure");
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    let signatureBuf: Buffer;
    try {
      signatureBuf = Buffer.from(this.base64UrlDecodeToBuffer(signatureB64));
    } catch {
      throw new Error("Invalid JWT signature encoding");
    }

    const isValid = crypto.verify(
      "RSA-SHA256",
      Buffer.from(signingInput),
      this.publicKey,
      signatureBuf,
    );

    if (!isValid) {
      throw new Error("Invalid JWT signature");
    }

    let payload: JwtPayload;
    try {
      payload = JSON.parse(this.base64UrlDecode(payloadB64));
    } catch {
      throw new Error("Invalid JWT payload JSON");
    }

    const now = Math.floor(Date.now() / 1000);
    console.log("VERIFYING: now =", now, "exp =", payload.exp, "diff =", payload.exp - now);
    if (payload.exp && payload.exp < now) {
      throw new Error("JWT token expired");
    }

    return payload;
  }

  private base64UrlEncode(str: string | Buffer): string {
    const buf = typeof str === "string" ? Buffer.from(str) : str;
    return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }

  private base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64").toString("utf8");
  }

  private base64UrlDecodeToBuffer(str: string): Buffer {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64");
  }
}
