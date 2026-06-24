import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Share2, Info, FileText } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { PropertyGallery } from './_components/PropertyGallery';
import { getPropertyById, getSiteSettings } from '@/lib/queries';

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: 'العقار غير موجود' };
  }

  const parts = [
    property.title,
    property.type,
    property.location ? `في ${property.location}` : '',
  ].filter(Boolean);
  const title = parts.join(' — ');

  const description =
    property.description?.slice(0, 160) ||
    `${property.title}${property.location ? ` في ${property.location}` : ''} — ${property.price ?? ''}. تواصل مع الإنجاز للعقار.`;

  return {
    title,
    description,
    alternates: { canonical: `/property/${property.id}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/property/${property.id}`,
      images: property.image ? [{ url: property.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: property.image ? [property.image] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, settings] = await Promise.all([
    getPropertyById(id),
    getSiteSettings(),
  ]);

  if (!property) {
    notFound();
  }

  const msgText = encodeURIComponent(
    `مرحباً، أود الاستفسار عن العقار رقم (${property.property_code ?? property.id}): ${property.title}`
  );

  const users = [
    {
      name: settings.user1_name || 'المبيعات الرئيسية',
      phone: settings.user1_phone || settings.phone_1 || '0544666760',
      whatsapp: settings.user1_whatsapp || settings.whatsapp || '966544666760',
    },
    {
      name: settings.user2_name || 'الدعم الفني',
      phone: settings.user2_phone || settings.phone_2 || '0507007604',
      whatsapp: settings.user2_whatsapp || (settings.phone_2 ? `966${settings.phone_2.replace(/^0/, '')}` : '966507007604'),
    },
  ].filter(u => u.phone && u.whatsapp);

  const images = property.gallery && property.gallery.length > 0
    ? property.gallery
    : (property.image ? [property.image] : []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description ?? undefined,
    url: `https://alenjaz-real-estate.vercel.app/property/${property.id}`,
    image: images.length ? images : undefined,
    ...(property.location ? { address: { '@type': 'PostalAddress', addressLocality: property.location } } : {}),
    ...(property.area ? { floorSize: { '@type': 'QuantitativeValue', value: property.area } } : {}),
    ...(property.beds ? { numberOfRooms: property.beds } : {}),
    provider: { '@type': 'RealEstateAgent', name: 'الإنجاز للعقار' },
  };

  return (
    <main className="min-h-screen flex flex-col font-sans bg-gray-50 text-right" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Link href="/" className="hover:text-[var(--color-navy)] transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-[var(--color-navy)] transition-colors">العقارات</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{property.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-gray-600 hover:text-blue-500 hover:bg-blue-50 border border-gray-200 transition-colors">
              <Share2 size={18} />
              <span className="hidden sm:inline">مشاركة</span>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <PropertyGallery images={images} title={property.title} />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8 text-right">

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <h1 className="text-3xl font-bold text-[var(--color-navy)] leading-tight">{property.title}</h1>
              </div>
              {property.location && (
                <p className="flex items-center gap-2 text-gray-500 mb-8 text-lg">
                  <MapPin size={20} className="text-[var(--color-navy)]" />
                  {property.location}
                </p>
              )}

              {/* Details Table */}
              {property.details && property.details.length > 0 && (
                <div className="border border-gray-100 rounded-2xl overflow-hidden mb-8">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Info size={20} className="text-[var(--color-navy)]" />
                    <h3 className="font-bold text-[var(--color-navy)] text-lg">التفاصيل</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {property.details.map((detail, index) => (
                      <div
                        key={index}
                        className={`flex items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'md:border-l md:border-l-gray-100' : ''
                        }`}
                      >
                        <span className="text-gray-500 font-medium w-2/5">{detail.label}</span>
                        <span className="font-bold text-gray-900 w-3/5 text-right">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <FileText size={20} className="text-[var(--color-navy)]" />
                    <h3 className="font-bold text-[var(--color-navy)] text-lg">الوصف</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-loose text-lg whitespace-pre-line text-right">
                      {property.description}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-28">

              {property.property_code && (
                <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <p className="text-gray-500 mb-2">رقم العقار</p>
                  <p className="text-xl font-bold text-gray-900" dir="ltr">{property.property_code}</p>
                </div>
              )}

              {property.price && (
                <div className="mb-6 text-center">
                  <p className="text-gray-500 mb-2">السعر</p>
                  <div className="flex items-center justify-center gap-2 text-[var(--color-navy)]">
                    <span className="text-4xl font-black">{property.price}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 mb-3 text-center">{user.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${user.whatsapp}?text=${msgText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-3 py-3 rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Phone size={16} />
                        واتساب
                      </a>
                      <a
                        href={`tel:${user.phone}`}
                        className="bg-white text-[var(--color-navy)] px-3 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 border-2 border-[var(--color-navy)] transition-colors flex items-center justify-center gap-2"
                      >
                        <Phone size={16} />
                        اتصال
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
