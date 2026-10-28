import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { getBrands } from "@/lib/services/brands";
import { getPartCategories } from "@/lib/services/categories";
import { getProducts, totalStock } from "@/lib/services/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "قطع الغيار | السعد للدراجات النارية",
  description:
    "كتالوج قطع الغيار الأصلية — فلاتر، كابلات، بوجيهات، سلاسل وأكثر لكل ماركات الدراجات النارية.",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

const selectClass =
  "rounded-lg border border-border bg-card px-4 py-3 text-white focus:border-accent focus:outline-none";

function stockBadge(stock: number, reorderLevel: number) {
  if (stock <= 0) return { label: "غير متوفر", classes: "bg-red-500/15 text-red-400" };
  if (stock <= reorderLevel)
    return { label: "كمية محدودة", classes: "bg-amber-500/15 text-amber-400" };
  return { label: "متوفر", classes: "bg-emerald-500/15 text-emerald-400" };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string; cat?: string; page?: string }>;
}) {
  const { q = "", brand = "", cat = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  const [result, brands, categories] = await Promise.all([
    getProducts({
      q: q || undefined,
      brandSlug: brand || undefined,
      categorySlug: cat || undefined,
      page: pageNum,
      pageSize: 12,
    }),
    getBrands(),
    getPartCategories(),
  ]);

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (brand) params.set("brand", brand);
    if (cat) params.set("cat", cat);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <main id="main-content" className="flex-1 py-12 md:py-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">قطع الغيار</h1>
          <p className="mt-2 text-muted">
            {nf.format(result.total)} قطعة — ابحث بالاسم أو الكود أو حسب الماركة والتصنيف.
          </p>
        </div>

        <form
          action="/products"
          method="get"
          className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_auto_auto_auto]"
        >
          <Input
            label="بحث"
            name="q"
            defaultValue={q}
            placeholder="اسم القطعة أو الكود"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-brand" className="text-sm font-medium text-white">
              الماركة
            </label>
            <select
              id="filter-brand"
              name="brand"
              defaultValue={brand}
              className={selectClass}
            >
              <option value="">كل الماركات</option>
              {brands.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.nameAr ?? item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-cat" className="text-sm font-medium text-white">
              التصنيف
            </label>
            <select
              id="filter-cat"
              name="cat"
              defaultValue={cat}
              className={selectClass}
            >
              <option value="">كل التصنيفات</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.parentId ? "└ " : ""}
                  {item.nameAr ?? item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="secondary" className="w-full md:w-auto">
              تطبيق
            </Button>
          </div>
        </form>

        {result.items.length === 0 ? (
          <p className="rounded-xl border border-border bg-card px-4 py-12 text-center text-muted">
            لا توجد قطع مطابقة لبحثك — جرّب كلمة تانية أو غيّر الفلاتر.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((product) => {
              const stock = totalStock(product);
              const badge = stockBadge(stock, product.reorderLevel);
              return (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.code}`}
                    className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs text-muted" dir="ltr">
                        {product.code}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <h2 className="font-bold text-white group-hover:text-accent">
                      {product.name}
                    </h2>
                    <p className="text-sm text-muted">
                      {[product.brand?.nameAr, product.partCategory?.nameAr]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <p className="text-lg font-extrabold text-white">
                        {product.retailPrice != null
                          ? `${nf.format(product.retailPrice)} ج.م`
                          : "عند التواصل"}
                      </p>
                      <span className="text-sm font-semibold text-accent">
                        التفاصيل
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {result.totalPages > 1 && (
          <nav
            aria-label="صفحات المنتجات"
            className="mt-8 flex items-center justify-between text-sm"
          >
            <Link
              href={pageHref(result.page - 1)}
              aria-disabled={result.page <= 1}
              className={`rounded-lg border border-border px-4 py-2 font-semibold ${
                result.page <= 1
                  ? "pointer-events-none opacity-40"
                  : "text-white hover:border-accent"
              }`}
            >
              السابق
            </Link>
            <span className="text-muted">
              صفحة {nf.format(result.page)} من {nf.format(result.totalPages)}
            </span>
            <Link
              href={pageHref(result.page + 1)}
              aria-disabled={result.page >= result.totalPages}
              className={`rounded-lg border border-border px-4 py-2 font-semibold ${
                result.page >= result.totalPages
                  ? "pointer-events-none opacity-40"
                  : "text-white hover:border-accent"
              }`}
            >
              التالي
            </Link>
          </nav>
        )}

        <p className="mt-6 text-xs text-muted">
          الأسعار لا تشمل ضريبة القيمة المضافة (تُضاف عند الفاتورة).
        </p>
      </Container>
    </main>
  );
}
