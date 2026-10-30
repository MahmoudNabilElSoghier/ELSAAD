import { categories } from "@/lib/content";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Bike, Wrench, Shield, Compass } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const icons = [Bike, Compass, Wrench, Shield];

export function Categories() {
  const t = useTranslations("categories");

  return (
    <section id="categories" className="py-20 md:py-28 bg-bg scroll-mt-20">
      <Container size="xl">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {t("title")}
            </h2>
            <p className="text-muted text-lg">
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = icons[index % icons.length];
            return (
              <FadeIn key={category.id} delay={Math.min(index * 0.05, 0.3)} className="h-full">
                <Link
                  href="/products"
                  className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <Card
                    hover
                    padding="lg"
                    className="flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{t(`items.${category.id}.title`)}</h3>
                      <p className="text-muted text-sm leading-relaxed mb-6">
                        {t(`items.${category.id}.description`)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-accent text-sm font-semibold">
                      <span>{t("cta")}</span>
                      <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
