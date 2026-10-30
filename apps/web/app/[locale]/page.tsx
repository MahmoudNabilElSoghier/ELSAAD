import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Categories } from "@/components/landing/Categories";
import { WhyUs } from "@/components/landing/WhyUs";
import { Brands } from "@/components/landing/Brands";
import { Gallery } from "@/components/landing/Gallery";
import { Testimonials } from "@/components/landing/Testimonials";
import { Branches } from "@/components/landing/Branches";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Categories />
        <WhyUs />
        <Brands />
        <Gallery />
        <Testimonials />
        <Branches />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
