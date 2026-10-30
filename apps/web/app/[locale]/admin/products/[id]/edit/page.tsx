import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands, getPartCategories, getProductById } from "@elsaad/api-client";

export const metadata: Metadata = {
  title: "تعديل منتج | السعد للدراجات النارية",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands, categories] = await Promise.all([
    getProductById(id),
    getBrands(),
    getPartCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
        >
          <span aria-hidden="true">←</span> العودة للمنتجات
        </Link>
        <h1 className="text-2xl font-extrabold text-fg">تعديل المنتج</h1>
        <span className="font-mono text-sm text-muted" dir="ltr">
          {product.code}
        </span>
      </div>
      <ProductForm product={product} brands={brands} categories={categories} />
    </div>
  );
}
