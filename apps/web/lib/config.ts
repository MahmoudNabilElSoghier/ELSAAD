import type { CompanyConfig } from "@/types";

// TODO: replace with real number from client before launch
const WHATSAPP_NUMBER = "201000000000";

export const company: CompanyConfig = {
  name: "السعد للدراجات النارية",
  nameEn: "ELSAAD Motorcycle",
  tagline: "شريكك الموثوق في عالم الدراجات النارية",
  established: 1990,
  yearsInBusiness: 35,
  branchesCount: 12,
  brandsCount: 20,
  // TODO: replace with real number from client before launch
  phone: "01000000000",
  phoneDisplay: "0100 000 0000",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  // TODO: replace with real number from client before launch
  email: "info@elsaadmotorcycle.com",
  address: "شارع جامعة الدول العربية، المهندسين، الجيزة",
};
