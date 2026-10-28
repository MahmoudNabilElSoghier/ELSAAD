// Service-layer types mirroring prisma/schema.prisma (Phase 2 foundation).
// Why local instead of Prisma-generated: model type exports from @prisma/client do
// not exist until `prisma generate` runs, and that requires a real DATABASE_URL
// (not provisioned yet — strict rule: no migrate/db push/generate in this phase).
// TODO(Phase 4+): after `prisma generate`, switch these to Prisma-generated types.
// Note: Prisma Decimal price fields arrive as objects — services convert them to
// plain `number` before returning (see mapProduct/mapOrder) so values survive
// React server → client serialization.

export type Dateish = string | Date;
