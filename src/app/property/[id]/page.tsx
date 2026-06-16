import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Share2, Info, FileText, Map as MapIcon } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getPropertyById, getSiteSettings } from '@/lib/queries';

export const revalidate = 60;

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, settings] = await Promise.all([
    getPropertyById(id),
    getSiteSettings(),
  ]);

  if (!property) {
    notFound();
  }

  const whatsappNumber = settings.whatsapp ?? '966544666760';
  const callNumber = settings.phone_1 ?? '0544666760';
  const whatsappMessage = encodeURIComponent(
    `مرحباً، أود الاستفسار عن العقار رقم (${property.property_code ?? property.id}): ${property.title}`
  );

  const images = property.gallery && property.gallery.length > 0
    ? property.gallery
    : (property.image ? [property.image] : []);

  return (
    <main className="min-h-screen flex flex-col font-sans bg-gray-50 text-right" dir="rtl">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] sm:h-[500px]">
          <div className="md:col-span-3 h-full rounded-2xl overflow-hidden relative group bg-gray-200">
            {images[0] && (
              <img src={images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            )}
            {property.status && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-[var(--color-navy)] shadow-sm">
                {property.status}
              </div>
            )}
            {property.usage && (
              <div className="absolute top-4 right-20 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-gray-700 shadow-sm">
                {property.usage}
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-2xl overflow-hidden relative bg-gray-200 flex items-center justify-center border border-gray-200">
              <MapIcon size={40} className="text-gray-400 mb-2" />
              <span className="absolute bottom-4 text-sm font-medium text-gray-600">عرض على الخريطة</span>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative group bg-gray-200">
              {images[1] && (
                <>
                  <img src={images[1]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors">
                    <span className="text-white font-bold text-lg">+ صور</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

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

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                >
                  <Phone size={24} />
                  تواصل عبر الواتساب
                </a>
                <a
                  href={`tel:${callNumber}`}
                  className="w-full bg-white text-[var(--color-navy)] px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 border-2 border-[var(--color-navy)] transition-colors flex items-center justify-center gap-3"
                >
                  <Phone size={24} />
                  اتصال مباشر
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <img src="/logo.jpeg" alt="الإنجاز للعقار" className="w-16 h-16 object-contain rounded-full border border-gray-100" />
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-navy)]">الإنجاز للعقار</p>
                    <p className="text-sm text-gray-500">معلن عقاري معتمد</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
