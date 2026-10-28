import { trustBar } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

export function TrustBar() {
  return (
    <section className="py-12 bg-card border-y border-border">
      <Container size="xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustBar.map((item, index) => (
            <Card key={index} padding="md" className="border-border/50 bg-bg/40">
              <div className="text-3xl md:text-4xl font-extrabold text-accent mb-2">
                {item.value}
              </div>
              <div className="text-sm md:text-base text-muted font-medium">
                {item.label}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
