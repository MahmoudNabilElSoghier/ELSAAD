import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getBrandBySlug } from "@elsaad/api-client";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "ماركة غير موجودة | السعد للدراجات النارية" };
  return {
    title: `${brand.nameAr ?? brand.name} | الماركات | السعد للدراجات النارية`,
    description:
      brand.description ??
      `موديلات وقطع غيار ${brand.nameAr ?? brand.name} المتوفرة في السعد للدراجات النارية.`,
  };
}

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const models = brand.models ?? [];
  const grouped = new Map<string, typeof models>();
  for (const model of models) {
    const list = grouped.get(model.category) ?? [];
    list.push(model);
    grouped.set(model.category, list);
  }

  return (
    <main id="main-content" className="flex-1 py-12 md:py-16">
      <Container>
        <Link
          href="/brands"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-accent hover:underline"
        >
          <span aria-hidden="true">←</span> كل الماركات
        </Link>

        <header className="mb-10 flex flex-wrap items-start gap-5">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-strong/15 text-3xl font-extrabold text-accent"
            aria-hidden="true"
          >
            {(brand.nameAr ?? brand.name).charAt(0)}
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-fg">
              {brand.nameAr ?? brand.name}
            </h1>
            <p className="mt-1 text-muted" dir="ltr">
              {brand.name}
            </p>
            {brand.description && (
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                {brand.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              <span>{nf.format(models.length)} موديل</span>
              <span>{nf.format(brand._count?.products ?? 0)} قطعة غيار</span>
              <Link
                href={`/products?brand=${brand.slug}`}
                className="font-semibold text-accent hover:underline"
              >
                عرض قطع الغيار ←
              </Link>
            </div>
          </div>
        </header>

        {models.length === 0 ? (
          <p className="rounded-xl border border-border bg-card px-4 py-12 text-center text-muted">
            موديلات هذه الماركة هتظهر هنا قريبًا.
          </p>
        ) : (
          <div className="space-y-10">
            {[...grouped.entries()].map(([category, list]) => (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h2
                  id={`cat-${category}`}
                  className="mb-4 border-b border-border pb-3 text-xl font-bold text-fg"
                >
                  {category}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((model) => (
                    <li key={model.id}>
                      <Link
                        href={`/brands/${brand.slug}/${model.slug}`}
                        className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
                      >
                        <div>
                          <h3 className="font-bold text-fg group-hover:text-accent">
                            {model.nameAr ?? model.name}
                          </h3>
                          <p className="text-sm text-muted" dir="ltr">
                            {model.name}
                          </p>
                        </div>
                        <div className="mt-auto flex flex-wrap gap-2 text-xs">
                          {model.engineCc && (
                            <span className="rounded-full bg-bg px-2.5 py-1 text-muted">
                              {nf.format(model.engineCc)} سي سي
                            </span>
                          )}
                          {model.yearFrom && (
                            <span className="rounded-full bg-bg px-2.5 py-1 text-muted">
                              من {nf.format(model.yearFrom)}
                            </span>
                          )}
                          <span className="rounded-full bg-bg px-2.5 py-1 text-muted">
                            {nf.format(model._count?.compatibilities ?? 0)} قطعة متوافقة
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
