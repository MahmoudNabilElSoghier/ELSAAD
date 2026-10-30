import { branches } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { MapPin, Phone, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function Branches() {
  return (
    <section id="branches" className="py-20 md:py-28 bg-card border-y border-border scroll-mt-20">
      <Container size="xl">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              فروعنا ومراكز الخدمة
            </h2>
            <p className="text-muted text-lg">
              زوروا أقرب فرع إليكم لتتعرفوا على أحدث الموديلات وتحصلوا على أفضل خدمات الصيانة
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id} padding="lg" className="bg-bg/50 border-border flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-accent mb-4">
                  {branch.name}
                </h3>
                <div className="space-y-3 text-sm text-muted">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent shrink-0" />
                    <span dir="ltr">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
