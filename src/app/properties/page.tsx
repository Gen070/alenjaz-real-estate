import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getProperties } from '@/lib/queries';
import { PropertiesClient } from './_components/PropertiesClient';

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <Header />

      {/* Top Banner */}
      <div className="bg-[var(--color-navy)] text-white py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')",
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">العروض العقارية</h1>
          <p className="text-blue-100 text-lg">تصفح أحدث العقارات المتوفرة للبيع والإيجار</p>
        </div>
      </div>

      <PropertiesClient properties={properties} />

      <Footer />
    </main>
  );
}
