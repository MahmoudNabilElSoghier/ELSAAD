import { whyUs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Wrench, CreditCard, Truck, Award, Headphones } from "lucide-react";

const icons = [ShieldCheck, Wrench, CreditCard, Truck, Award, Headphones];

export function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-card border-y border-border">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            لماذا يختارنا العملاء؟
          </h2>
          <p className="text-muted text-lg">
            نلتزم بتقديم أعلى معايير الجودة والخدمة لضمان رضاك الكامل على مدار الساعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyUs.map((feature, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card key={feature.id} padding="lg" className="bg-bg/50 border-border">
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
