import { company } from "@/lib/config";
import type {
  Brand,
  Branch,
  Category,
  ContactFormContent,
  Feature,
  FooterContent,
  GalleryImage,
  HeroContent,
  NavItem,
  PageMeta,
  SiteContent,
  Testimonial,
  TrustBarItem,
} from "@/types";

// Hash links use "/#id" (not "#id") so they land on the homepage when clicked
// from other routes (/products, /brands, ...).
export const navigation: NavItem[] = [
  { label: "الرئيسية", href: "/#home" },
  { label: "الموديلات", href: "/#categories" },
  { label: "قطع الغيار", href: "/products" },
  { label: "الماركات", href: "/brands" },
  { label: "الفروع", href: "/#branches" },
  { label: "تواصل", href: "/#contact" },
];

export const hero: HeroContent = {
  headline: "قوة الأداء، أصل القطع، ثقة السعد",
  subheadline:
    "أكثر من 35 سنة في عالم الدراجات النارية — بنوفر لك دراجات جديدة ومستعملة، قطع غيار أصلية، وخدمة صيانة موثوقة في كل فروعنا.",
  ctaPrimary: "شوف الموديلات",
  ctaSecondary: "كلمنا على واتساب",
};

export const trustBar: TrustBarItem[] = [
  { value: "35+", label: "سنة خبرة" },
  { value: "12", label: "فرع" },
  { value: "20+", label: "ماركة عالمية" },
  { value: "10K+", label: "عميل" },
];

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

export const whyUs: Feature[] = [
  {
    id: "warranty",
    title: "ضمان معتمد",
    description: "ضمان رسمي على كل دراجة وقطعة أصلية",
  },
  {
    id: "maintenance",
    title: "صيانة دورية",
    description: "فريق صيانة متخصص في كل فرع",
  },
  {
    id: "installments",
    title: "تقسيط مريح",
    description: "خطط تقسيط مرنة تناسب ميزانيتك",
  },
  {
    id: "delivery",
    title: "توصيل سريع",
    description: "توصيل لكل المحافظات خلال 48 ساعة",
  },
  {
    id: "genuine-parts",
    title: "قطع أصلية",
    description: "قطع غيار أصلية 100% من موردين معتمدين",
  },
  {
    id: "support",
    title: "خدمة عملاء",
    description: "دعم فني على مدار الساعة طول أيام الأسبوع",
  },
];

/* TODO: verify actual brands carried by client, replace list */
export const brands: Brand[] = [
  { name: "Honda" },
  { name: "Yamaha" },
  { name: "Suzuki" },
  { name: "Kawasaki" },
  { name: "BMW Motorrad" },
  { name: "KTM" },
  { name: "Ducati" },
  { name: "Harley-Davidson" },
];

/* TODO: replace with real photos */
export const gallery: GalleryImage[] = [
  { id: "gallery-1", src: "/gallery/placeholder-1.jpg", alt: "" },
  { id: "gallery-2", src: "/gallery/placeholder-2.jpg", alt: "" },
  { id: "gallery-3", src: "/gallery/placeholder-3.jpg", alt: "" },
  { id: "gallery-4", src: "/gallery/placeholder-4.jpg", alt: "" },
  { id: "gallery-5", src: "/gallery/placeholder-5.jpg", alt: "" },
  { id: "gallery-6", src: "/gallery/placeholder-6.jpg", alt: "" },
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

/* TODO: replace with real addresses, phones, hours from client */
export const branches: Branch[] = [
  {
    id: "cairo",
    name: "فرع القاهرة - المهندسين",
    address: company.address,
    phone: company.phone,
    hours: "السبت - الخميس: 10 ص - 10 م",
  },
  {
    id: "giza",
    name: "فرع الجيزة",
    address: "شارع الهرم، الجيزة",
    phone: "01000000001",
    hours: "السبت - الخميس: 10 ص - 10 م",
  },
  {
    id: "alex",
    name: "فرع الإسكندرية",
    address: "شارع سموحة، الإسكندرية",
    phone: "01000000002",
    hours: "السبت - الخميس: 10 ص - 10 م",
  },
];

export const contactForm: ContactFormContent = {
  title: "تواصل معنا",
  subtitle: "ابعتلنا رسالة وهنرد عليك في أقرب وقت",
  fields: {
    name: { label: "الاسم الكامل", placeholder: "اكتب اسمك" },
    phone: { label: "رقم الموبايل", placeholder: "01XXXXXXXXX" },
    message: { label: "رسالتك", placeholder: "اكتب رسالتك هنا..." },
  },
  submitButton: "إرسال",
  successMessage: "تم استلام رسالتك — هنرد عليك قريباً",
  errorMessage: "حدث خطأ — حاول مرة أخرى",
};

/* TODO: replace with real social links */
export const footer: FooterContent = {
  tagline: "السعد للدراجات النارية — شريكك الموثوق منذ 1990",
  social: {
    facebook: "https://facebook.com/elsaad",
    instagram: "https://instagram.com/elsaad",
    whatsapp: company.whatsappUrl,
    youtube: "https://youtube.com/@elsaad",
  },
  copyright: "© 2025 السعد للدراجات النارية. جميع الحقوق محفوظة.",
};

export const meta: PageMeta = {
  title: "السعد للدراجات النارية | ELSAAD Motorcycle",
  description:
    "أكثر من 35 سنة خبرة في الدراجات النارية وقطع الغيار الأصلية. 12 فرع في مصر. ضمان، تقسيط، صيانة، وتوصيل لكل المحافظات.",
  keywords: [
    "دراجات نارية",
    "موتوسيكلات",
    "قطع غيار",
    "السعد",
    "ELSAAD",
    "motorcycle",
    "Egypt",
  ],
};

export const content: SiteContent = {
  navigation,
  hero,
  trustBar,
  categories,
  whyUs,
  brands,
  gallery,
  testimonials,
  branches,
  contactForm,
  footer,
};
