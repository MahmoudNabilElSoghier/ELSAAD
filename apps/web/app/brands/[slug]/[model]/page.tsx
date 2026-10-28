import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getModelBySlug } from "@/lib/services/models";
import { totalStock } from "@/lib/services/products";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string; model: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, model: modelSlug } = await params;
  const bikeModel = await getModelBySlug(slug, modelSlug);
  if (!bikeModel) return { title: "موديل غير موجود | السعد للدراجات النارية" };
  const label = `${bikeModel.nameAr ?? bikeModel.name}${bikeModel.brand ? ` ${bikeModel.brand.nameAr ?? bikeModel.brand.name}` : ""}`;
  return {
    title: `${label} | قطع غيار | السعد للدراجات النارية`,
    description:
      bikeModel.description ??
      `قطع غيار متوافقة مع ${label} — متاحة في فروع السعد للدراجات النارية.`,
  };
}

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug, model: modelSlug } = await params;
  const bikeModel = await getModelBySlug(slug, modelSlug);
  if (!bikeModel) notFound();

  const brand = bikeModel.brand;
  const products = (bikeModel.compatibilities ?? [])
    .flatMap((compat) => compat.product ?? [])
    .filter((product) => product.active && !product.deletedAt);

  return (
    <main id="main-content" className="flex-1 py-12 md:py-16">
      <Container>
        <nav aria-label="مسار التنقل" className="mb-6 flex flex-wrap gap-2 text-sm">
          <Link href="/brands" className="text-accent hover:underline">
            الماركات
          </Link>
          <span className="text-muted" aria-hidden="true">
            /
          </span>
          <Link href={`/brands/${slug}`} className="text-accent hover:underline">
            {brand?.nameAr ?? brand?.name ?? slug}
          </Link>
          <span className="text-muted" aria-hidden="true">
            /
          </span>
          <span className="text-muted">{bikeModel.nameAr ?? bikeModel.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {bikeModel.nameAr ?? bikeModel.name}
          </h1>
          <p className="mt-1 text-muted" dir="ltr">
            {bikeModel.name}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-card px-4 py-1.5 text-muted">
              {bikeModel.category}
            </span>
            {bikeModel.engineCc && (
              <span className="rounded-full bg-card px-4 py-1.5 text-muted">
                {nf.format(bikeModel.engineCc)} سي سي
              </span>
            )}
            {bikeModel.yearFrom && (
              <span className="rounded-full bg-card px-4 py-1.5 text-muted">
                {bikeModel.yearTo
                  ? `${nf.format(bikeModel.yearFrom)} - ${nf.format(bikeModel.yearTo)}`
                  : `من ${nf.format(bikeModel.yearFrom)}`}
              </span>
            )}
            {brand && (
              <span className="rounded-full bg-card px-4 py-1.5 text-muted">
                {brand.nameAr ?? brand.name}
              </span>
            )}
          </div>
          {bikeModel.description && (
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              {bikeModel.description}
            </p>
          )}
        </header>

        <section aria-labelledby="compatible-parts">
          <h2 id="compatible-parts" className="mb-4 border-b border-border pb-3 text-xl font-bold text-white">
            قطع الغيار المتوافقة
          </h2>
          {products.length === 0 ? (
            <p className="rounded-xl border border-border bg-card px-4 py-12 text-center text-muted">
              لا توجد قطع مسجلة لهذا الموديل بعد —{" "}
              <Link href="/#contact" className="text-accent hover:underline">
                كلمنا
              </Link>{" "}
              وهنوفّرها لك.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const stock = totalStock(product);
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
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            stock > 0
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {stock > 0 ? "متوفر" : "غير متوفر"}
                        </span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-accent">
                        {product.name}
                      </h3>
                      <p className="mt-auto text-lg font-extrabold text-white">
                        {product.retailPrice != null
                          ? `${nf.format(product.retailPrice)} ج.م`
                          : "عند التواصل"}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </Container>
    </main>
  );
}
