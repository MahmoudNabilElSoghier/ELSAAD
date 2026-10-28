import { ConflictException, NotFoundException } from "@nestjs/common";

// Maps Prisma client error codes to HTTP domain errors.
// Any other error is re-thrown untouched so unexpected failures still surface.
export function toDomainError(error: unknown): never {
  const code = (error as { code?: string } | null)?.code;
  if (code === "P2002") {
    throw new ConflictException("A record with the same unique value already exists");
  }
  if (code === "P2003") {
    throw new ConflictException("Record is referenced by other data and cannot be removed");
  }
  if (code === "P2025") {
    throw new NotFoundException("Record not found");
  }
  throw error;
}
