// Landing content subsets shared between apps/web and the prisma seed.
// Why they live here: seed runs from apps/api after the monorepo migration and
// must not import apps/web (its "@/..." path aliases only resolve inside the
// web app). apps/web/lib/content.ts re-exports these names, so landing
// components stay untouched.

import type { Category, Testimonial } from "./types/content";

export const categories: Category[] = [
  {
    id: "new-motorcycles",
    title: "دراجات جديدة",
    description: "أحدث الموديلات من أفضل الماركات العالمية بضمان رسمي",
  },
  {
    id: "used-motorcycles",
    title: "دراجات مستعملة",
    description: "دراجات مفحوصة بالكامل وبضمان وحالة ممتازة",
  },
  {
    id: "spare-parts",
    title: "قطع غيار",
    description: "قطع أصلية معتمدة لكل الماركات والموديلات",
  },
  {
    id: "accessories",
    title: "إكسسوارات",
    description: "كل ما تحتاجه لدراجتك — خوذات، ملابس، ومعدات حماية",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "أحمد محمود",
    role: "عميل",
    text: "اشتريت دراجتي من فرع السعد — خدمة ممتازة، قطع الغيار متوفرة، والصيانة دقيقة. أنصح بيهم.",
  },
  {
    id: 2,
    name: "محمد سعيد",
    role: "تاجر قطع غيار",
    text: "أفضل مكان لقطع غيار الدراجات في مصر — أصلي، أسعار مناسبة، وتعامل محترم من أول يوم.",
  },
  {
    id: 3,
    name: "كريم عبد الله",
    role: "عميل دائم",
    text: "بتعامل معاهم من 5 سنين — ثقة ومصداقية في كل صفقة. مفيش مرة اشتكيت من حاجة.",
  },
];
