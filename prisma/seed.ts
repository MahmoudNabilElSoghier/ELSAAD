/**
 * Idempotent seed script.
 *
 * Source of truth for Arabic content is lib/content.ts — do not duplicate
 * copy here. Upserts make re-runs safe (categories/branches keyed by slug,
 * testimonials matched by name+text).
 *
 * Requires: DATABASE_URL set and schema pushed (`npm run db:push`).
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { branches, categories, testimonials } from "@/lib/content";

const prisma = new PrismaClient();

async function main() {
  for (const [index, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.id },
      update: {
        title: category.title,
        description: category.description,
        order: index,
      },
      create: {
        slug: category.id,
        title: category.title,
        description: category.description,
        order: index,
      },
    });
  }

  for (const [index, branch] of branches.entries()) {
    await prisma.branch.upsert({
      where: { slug: branch.id },
      update: {
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        hours: branch.hours,
        order: index,
      },
      create: {
        slug: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        hours: branch.hours,
        order: index,
      },
    });
  }

  // Testimonial has no natural unique key in the schema; match on the
  // full name+text pair to keep the seed idempotent.
  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name, text: testimonial.text },
      select: { id: true },
    });
    if (!existing) {
      await prisma.testimonial.create({
        data: {
          name: testimonial.name,
          role: testimonial.role,
          text: testimonial.text,
          published: true,
        },
      });
    }
  }

  console.log("Seed complete:", {
    categories: categories.length,
    branches: branches.length,
    testimonials: testimonials.length,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
