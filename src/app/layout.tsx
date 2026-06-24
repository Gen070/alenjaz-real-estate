import type { Metadata } from "next";
import { Tajawal, Almarai } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { getSiteSettings } from "@/lib/queries";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

const SITE_URL = "https://alenjaz-real-estate.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "الإنجاز للعقار — عقارات للبيع والإيجار في مكة المكرمة",
    template: "%s | الإنجاز للعقار",
  },
  description:
    "الإنجاز للعقار — مكتب عقاري في مكة المكرمة لعرض وإدارة العقارات للبيع والإيجار: فلل، شقق، أراضٍ، مكاتب وعقارات تجارية.",
  keywords: [
    "عقارات",
    "عقارات مكة",
    "عقار للبيع",
    "عقار للإيجار",
    "فلل للبيع",
    "شقق للإيجار",
    "أراضي",
    "الإنجاز للعقار",
  ],
  applicationName: "الإنجاز للعقار",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "الإنجاز للعقار",
    title: "الإنجاز للعقار — عقارات للبيع والإيجار في مكة المكرمة",
    description:
      "تصفّح أحدث العقارات للبيع والإيجار في مكة المكرمة مع الإنجاز للعقار.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "الإنجاز للعقار",
    description: "عقارات للبيع والإيجار في مكة المكرمة.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const floatingUsers = [
    {
      name: settings.user1_name || 'المبيعات الرئيسية',
      whatsapp: settings.user1_whatsapp || settings.whatsapp || '966544666760',
    },
    {
      name: settings.user2_name || 'الدعم الفني',
      whatsapp: settings.user2_whatsapp || (settings.phone_2 ? `966${settings.phone_2.replace(/^0/, '')}` : '966507007604'),
    },
  ];

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${almarai.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClientProviders users={floatingUsers}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
