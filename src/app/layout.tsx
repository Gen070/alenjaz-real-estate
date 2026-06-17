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

export const metadata: Metadata = {
  title: "الإنجاز للعقار",
  description: "خيارك الأول لنشر وإدارة إعلاناتك العقارية",
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
