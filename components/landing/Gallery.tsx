import { gallery } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Image as ImageIcon } from "lucide-react";

export function Gallery() {
  return (
    <section className="py-20 md:py-28 bg-card border-y border-border">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            معرض الصور
          </h2>
          <p className="text-muted text-lg">
            لمحات من معارضنا، موديلاتنا، ومراكز الصيانة المنتشرة في أنحاء الجمهورية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <Card
              key={item.id}
              padding="none"
              className="overflow-hidden bg-bg border-border group relative aspect-[4/3] flex items-center justify-center"
            >
              {/* Placeholder graphic until real photos are provided */}
              <div className="absolute inset-0 bg-gradient-to-br from-bg to-card flex flex-col items-center justify-center p-6 text-center group-hover:scale-105 transition-transform duration-300">
                <ImageIcon className="w-12 h-12 text-muted mb-3 group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium text-muted">
                  السعد للدراجات النارية
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
