# ELSAAD Motorcycle Landing Page

## Project Summary
ELSAAD Motorcycle (السعد للدراجات النارية) landing page represents Phase 1 of an upcoming ERP and e-commerce system built for a 35-year established motorcycle dealership and parts supplier in Egypt.

## Tech Stack
- Next.js 15.5.28 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (@theme inline in `app/globals.css`, no `tailwind.config.ts`)
- PostCSS via `@tailwindcss/postcss`
- ESLint 9 flat config
- Node 24, npm

## Critical File Access Rules
1. Never scan the whole repository or recurse into `node_modules`, `.next`, or `.git`.
2. To read files, use targeted paths (e.g., `@lib/content.ts`).
3. To list directories, list specific folders only.

## Security Rules
1. Never read, use, or reference credentials from OS credential stores, env vars, or secret managers without explicit permission.
2. Never print, log, or transmit secrets/API keys.

## Project Rules
- RTL native: `<html dir="rtl" lang="ar">` in `app/layout.tsx`.
- All Arabic strings in `/lib/content.ts` — zero hardcoded Arabic in components.
- All company data in `/lib/config.ts`.
- Types in `/types/index.ts`.
- Conventional commits: `feat`/`fix`/`chore`/`docs(scope): message`.
- Build and lint must pass (`npm run build && npm run lint`).
- Hard stop after each chunk — commit, report, wait for approval.

## Current State & Next Steps
- **Done:** Project scaffold, TypeScript types (`/types/index.ts`), company config (`/lib/config.ts`), Arabic content (`/lib/content.ts`), UI components (`/components/ui/`), Tailwind tokens, layout shell, Header, and Hero.
- **Next:** Step D components (Categories, Why Us, Brands, Gallery, Testimonials, Branches, Contact, Footer).

## Do-NOT List
- Do not touch `/app/api`.
- Do not touch `/components/ui` unless fixing a verified bug (report if so).
- Do not start Step D without explicit user approval.
- Do not push to `main`.
- Do not add unauthorized dependencies (approved: `framer-motion`, `react-hook-form`, `zod`, `lucide-react`, `sonner`).
