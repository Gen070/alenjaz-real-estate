import { Header } from "@/components/landing/Header";
import { HeroSection, type HeroOffer } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { CitiesSection } from "@/components/landing/CitiesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ContactFormSection } from "@/components/landing/ContactFormSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { getProperties, getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

export default async function Home() {
  const [properties, settings] = await Promise.all([
    getProperties(),
    getSiteSettings(),
  ]);

  const cityImages = {
    riyadh: settings.city_riyadh_image || undefined,
    jeddah: settings.city_jeddah_image || undefined,
    madinah: settings.city_madinah_image || undefined,
  };

  // آخر العقارات المنشورة (التي لها صورة) لعرضها في بنر الهيرو
  const heroOffers: HeroOffer[] = properties
    .filter((p) => p.image)
    .slice(0, 5)
    .map((p) => ({
      image: p.image as string,
      title: p.title,
      price: p.price ?? "",
      location: p.location ?? "",
    }));

  return (
    <main className="min-h-screen flex flex-col font-sans bg-gray-50 overflow-hidden relative">
      <Header />
      <HeroSection offers={heroOffers} />
      <ServicesSection />
      <FeaturesSection />
      <CitiesSection images={cityImages} />
      <ContactFormSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
