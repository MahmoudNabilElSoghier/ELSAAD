import { randomUUID } from "node:crypto";

const sanitize = (segment: string): string =>
  segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "x";

export function slugifyFileName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const base = dot > 0 ? fileName.slice(0, dot) : fileName;
  const ext = dot > 0 ? fileName.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  const slug = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "file"}${ext}`;
}

// Every upload gets a fresh key (UUID) so a key is never reused for different
// content — required for WORM/immutable semantics and safe retries.
export function buildDocumentKey(input: {
  entityType: string;
  entityId: string;
  fileName: string;
}): string {
  return `${sanitize(input.entityType)}/${sanitize(input.entityId)}/${randomUUID()}-${slugifyFileName(input.fileName)}`;
}
