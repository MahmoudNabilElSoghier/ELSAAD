import { brands } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

export function Brands() {
  return (
    <section className="py-20 md:py-28 bg-bg">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            الماركات العالمية المعتمدة
          </h2>
          <p className="text-muted text-lg">
            نوفر قطع غيار ودراجات أصلية من أشهر الماركات العالمية الموثوقة
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {brands.map((brand, index) => (
            <Card
              key={index}
              padding="md"
              className="bg-card/55 border-border flex items-center justify-center h-24 text-center hover:border-accent/40 transition-colors"
            >
              <span className="font-bold text-lg md:text-xl text-white tracking-wide">
                {brand.name}
              </span>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
