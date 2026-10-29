import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// scrypt password hashing (Sprint 2D) — node:crypto only, no extra dependency.
// Stored format: `scrypt:<N>:<saltB64>:<hashB64>` so N can change per-hash.

const DEFAULT_N = 16384;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("base64");
  const hash = scryptSync(password, salt, KEY_LENGTH, { N: DEFAULT_N }).toString("base64");
  return `scrypt:${DEFAULT_N}:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1]);
  const salt = parts[2];
  const expected = Buffer.from(parts[3], "base64");
  if (!Number.isInteger(n) || n <= 0 || expected.length === 0) return false;
  const actual = scryptSync(password, salt, expected.length, { N: n });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
