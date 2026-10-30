import { categories } from "@/lib/content";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Bike, Wrench, Shield, Compass } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const icons = [Bike, Compass, Wrench, Shield];

export function Categories() {
  return (
    <section id="categories" className="py-20 md:py-28 bg-bg scroll-mt-20">
      <Container size="xl">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              أقسامنا ومنتجاتنا
            </h2>
            <p className="text-muted text-lg">
              تخوّل في تشكيلتنا الواسعة من الدراجات الجديدة والمستعملة وقطع الغيار الأصلية
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = icons[index % icons.length];
            return (
              <FadeIn key={category.id} delay={Math.min(index * 0.05, 0.3)} className="h-full">
                {/* TODO: landing categories have no slug mapping to product
                    part-category slugs (the products page filters by
                    ?cat=<partCategory.slug>) — link to the full catalog until a
                    real mapping exists. */}
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
                      <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                      <p className="text-muted text-sm leading-relaxed mb-6">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-accent text-sm font-semibold">
                      <span>متاح في الفروع</span>
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
