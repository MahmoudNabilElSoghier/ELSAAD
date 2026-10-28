import type { MachineModel } from "./model";
import type { Product } from "./product";
import type { Dateish } from "./common";

export interface Brand {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  order: number;
  createdAt: Dateish;
  updatedAt: Dateish;
  models?: MachineModel[];
  products?: Product[];
  _count?: { models: number; products: number };
}
