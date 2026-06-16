import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { CitiesSection } from "@/components/landing/CitiesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ContactFormSection } from "@/components/landing/ContactFormSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans bg-gray-50 overflow-hidden relative">
      <Header />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <CitiesSection />
      <ContactFormSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
