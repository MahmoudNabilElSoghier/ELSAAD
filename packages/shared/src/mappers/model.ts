import type { Prisma } from "@prisma/client";
import type { MachineModel } from "../types/model";
import { fromPrismaCompatibility, type ProductCompatibilityRow } from "./product";

export type MachineModelRow = Prisma.MachineModelGetPayload<{}> & {
  compatibilities?: ProductCompatibilityRow[];
};

export function fromPrismaModel(row: MachineModelRow): MachineModel {
  return {
    ...row,
    compatibilities: row.compatibilities?.map(fromPrismaCompatibility),
  };
}
