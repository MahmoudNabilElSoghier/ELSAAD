// Content-value types shared between apps/web landing content and the
// prisma seed (categories/testimonials arrays live in ../content.ts so
// apps/api can seed without importing apps/web — its "@/..." path aliases
// only resolve inside the web app).
// Note: the remaining site/content types (CompanyConfig, SiteContent, content
// Brand/Branch shapes, ...) intentionally stay in apps/web/types/index.ts —
// they are web-only presentation types and their names (Brand, Branch) collide
// with the service domain types exported from this package's root barrel.

export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
}
