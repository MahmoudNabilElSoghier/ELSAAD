// Prisma Decimal columns deserialize as Decimal objects; JSON.stringify turns
// them into strings ("42.00"), so money must cross the API as plain numbers.

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function toNumberOrZero(value: unknown): number {
  const n = toNumber(value);
  return n === null || Number.isNaN(n) ? 0 : n;
}
