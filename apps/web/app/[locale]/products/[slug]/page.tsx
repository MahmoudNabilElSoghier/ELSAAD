import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { company } from "@/lib/config";
import { getProductByCode, totalStock } from "@elsaad/api-client";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByCode(slug);
  if (!product) return { title: "قطعة غير موجودة | السعد للدراجات النارية" };
  return {
    title: `${product.name} | قطع الغيار | السعد للدراجات النارية`,
    description:
      product.description ??
      `${product.name} — كود ${product.code}${product.oemCode ? `، كود OEM ${product.oemCode}` : ""}. متاح في فروع السعد للدراجات النارية.`,
  };
}

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductByCode(slug);
  if (!product) notFound();

  const stock = totalStock(product);
  const waText = `مرحبًا، عايز أستفسر عن قطعة "${product.name}" (كود ${product.code}) على موقع السعد للدراجات النارية.`;
  const waHref = `${company.whatsappUrl}?text=${encodeURIComponent(waText)}`;

  return (
    <main id="main-content" className="flex-1 py-12 md:py-16">
      <Container>
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-accent hover:underline"
        >
          <span aria-hidden="true">←</span> كل قطع الغيار
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-card px-3 py-1 font-mono text-xs text-muted" dir="ltr">
                  {product.code}
                </span>
                {product.oemCode && (
                  <span className="rounded-full bg-card px-3 py-1 text-xs text-muted">
                    OEM:{" "}
                    <span dir="ltr">{product.oemCode}</span>
                  </span>
                )}
                <span className="rounded-full bg-card px-3 py-1 text-xs text-muted">
                  {product.unitOfMeasure}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-fg">
                {product.name}
              </h1>
              {product.nameEn && (
                <p className="text-muted" dir="ltr">
                  {product.nameEn}
                </p>
              )}
              {(product.brand || product.partCategory) && (
                <p className="text-sm text-muted">
                  {[product.brand?.nameAr, product.partCategory?.nameAr]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>

            {product.description && (
              <section aria-labelledby="product-desc">
                <h2 id="product-desc" className="mb-2 text-xl font-bold text-fg">
                  الوصف
                </h2>
                <p className="leading-relaxed text-muted">{product.description}</p>
              </section>
            )}

            {product.compatibilities && product.compatibilities.length > 0 && (
              <section aria-labelledby="product-fit">
                <h2 id="product-fit" className="mb-3 text-xl font-bold text-fg">
                  يركب على
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {product.compatibilities.map((compat) => (
                    <li key={compat.id}>
                      {compat.model && compat.model.brand ? (
                        <Link
                          href={`/brands/${compat.model.brand.slug}/${compat.model.slug}`}
                          className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm text-fg transition-colors hover:border-accent"
                        >
                          {compat.model.brand.nameAr} {compat.model.nameAr ?? compat.model.name}
                        </Link>
                      ) : (
                        <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm text-muted">
                          {compat.model?.name ?? "موديل"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="product-stock">
              <h2 id="product-stock" className="mb-3 text-xl font-bold text-fg">
                التوفر حسب الفرع
              </h2>
              {!product.inventory || product.inventory.length === 0 ? (
                <p className="rounded-xl border border-border bg-card px-4 py-6 text-muted">
                  لا توجد كميات مسجلة حاليًا — تواصل معنا للتوفر أو الطلب مسبقًا.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted">
                        <th className="px-4 py-3 font-medium">الفرع</th>
                        <th className="px-4 py-3 font-medium">الكمية</th>
                        <th className="px-4 py-3 font-medium">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.inventory.map((row) => (
                        <tr key={row.id} className="border-b border-border/50 last:border-0">
                          <td className="px-4 py-3 text-fg">
                            {row.branch?.nameAr ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-fg">
                            {nf.format(row.quantity)}
                          </td>
                          <td className="px-4 py-3">
                            {row.quantity <= 0 ? (
                              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
                                غير متوفر
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                                متوفر
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm text-muted">سعر التجزئة</p>
              <p className="mt-1 text-3xl font-extrabold text-fg">
                {product.retailPrice != null
                  ? `${nf.format(product.retailPrice)} ج.م`
                  : "عند التواصل"}
              </p>
              <p className="mt-1 text-xs text-muted">
                لا يشمل ض.ق.م ({nf.format(Number(product.taxRate) * 100)}%)
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    stock > 0 ? "bg-emerald-400" : "bg-red-400"
                  }`}
                  aria-hidden="true"
                />
                <span className={stock > 0 ? "text-fg" : "text-red-400"}>
                  {stock > 0
                    ? `متوفر — ${nf.format(stock)} ${product.unitOfMeasure} في الفروع`
                    : "غير متوفر حاليًا"}
                </span>
              </div>

              {/* TODO(Phase 2D): role-based pricing (retail/wholesale/vip per the
                  logged-in customer) — reason: needs customer auth first. */}
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-strong px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-strong/90"
              >
                استعلم على واتساب
              </a>
              <p className="mt-3 text-center text-xs text-muted">
                أو زر أقرب فرع من{" "}
                <Link href="/#branches" className="text-accent hover:underline">
                  الفروع
                </Link>
              </p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-card px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </Container>
    </main>
  );
}
