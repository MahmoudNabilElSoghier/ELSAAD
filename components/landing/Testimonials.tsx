import { testimonials } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-bg">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            آراء عملائنا
          </h2>
          <p className="text-muted text-lg">
            ثقة أكثر من 35 عاماً تتحدث عنها آراء عملائنا الكرام في كل مكان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Card key={item.id} padding="lg" className="bg-card border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-accent/30 mb-2" />
                <p className="text-muted text-base leading-relaxed mb-6">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <div className="font-bold text-white">{item.name}</div>
                <div className="text-sm text-muted">{item.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
