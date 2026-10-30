import Link from "next/link";
import { hero } from "@/lib/content";
import { company } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden scroll-mt-20"
    >
      {/* BackgroundImage placeholder */}
      <div className="absolute inset-0 bg-gradient-to-l from-bg via-bg/70 to-bg/30">
        {/* TODO: replace with next/image of motorcycle hero shot */}
      </div>

      {/* Radial accent overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(230,57,70,0.15),transparent_60%)]" />

      <Container size="xl" className="relative z-10 py-20 md:py-32">
        <div className="max-w-2xl text-center md:text-right">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-8 max-w-xl">
            {hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 justify-center sm:justify-start">
            <Button variant="primary" size="lg" asChild>
              <Link href="#categories">{hero.ctaPrimary}</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hero.ctaSecondary}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
