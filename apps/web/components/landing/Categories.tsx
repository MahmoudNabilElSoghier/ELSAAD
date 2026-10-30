import { categories } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Bike, Wrench, Shield, Compass } from "lucide-react";
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
                <Card
                  hover
                  padding="lg"
                  className="flex flex-col justify-between group h-full"
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
                  <div className="text-accent text-sm font-semibold">
                    <span>متاح في الفروع</span>
                  </div>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
