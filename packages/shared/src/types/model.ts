import type { Brand } from "./brand";
import type { ProductCompatibility } from "./product";
import type { Dateish } from "./common";

export interface MachineModel {
  id: string;
  brandId: string;
  brand?: Brand;
  name: string;
  nameAr: string | null;
  slug: string;
  category: string;
  yearFrom: number | null;
  yearTo: number | null;
  engineCc: number | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: Dateish;
  compatibilities?: ProductCompatibility[];
  _count?: { compatibilities: number };
}
