import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getBrands } from "@/lib/services/brands";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الماركات | السعد للدراجات النارية",
  description:
    "ماركات الدراجات النارية وقطع غيارها المتوفرة في السعد — SYM، Kymco، Haojue وغيرها.",
};

const nf = new Intl.NumberFormat("ar-EG-u-nu-latn");

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <main id="main-content" className="flex-1 py-12 md:py-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">الماركات</h1>
          <p className="mt-2 text-muted">
            {nf.format(brands.length)} ماركة — اختار ماركتك لتشوف الموديلات وقطع غيارها.
          </p>
        </div>

        {brands.length === 0 ? (
          <p className="rounded-xl border border-border bg-card px-4 py-12 text-center text-muted">
            الماركات هتظهر هنا قريبًا.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((brand) => (
              <li key={brand.id}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group flex h-full flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-strong/15 text-2xl font-extrabold text-accent"
                    aria-hidden="true"
                  >
                    {(brand.nameAr ?? brand.name).charAt(0)}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-accent">
                      {brand.nameAr ?? brand.name}
                    </h2>
                    <p className="text-sm text-muted" dir="ltr">
                      {brand.name}
                    </p>
                  </div>
                  <div className="mt-auto flex gap-4 pt-2 text-sm text-muted">
                    <span>{nf.format(brand._count?.models ?? 0)} موديل</span>
                    <span>{nf.format(brand._count?.products ?? 0)} قطعة غيار</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
