import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands, getPartCategories } from "@elsaad/api-client";

export const metadata: Metadata = {
  title: "منتج جديد | السعد للدراجات النارية",
};

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    getBrands(),
    getPartCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
        >
          <span aria-hidden="true">←</span> العودة للمنتجات
        </Link>
        <h1 className="text-2xl font-extrabold text-white">منتج جديد</h1>
      </div>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
