'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { properties } from '@/data/properties';
import { Bed, Bath, Square, MapPin, CheckCircle2, Phone } from 'lucide-react';

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const property = properties.find((p) => p.id.toString() === resolvedParams.id);
  const [activeImage, setActiveImage] = useState(property?.image || '');

  if (!property) {
    notFound();
  }

  const phoneNumber = '9665444666760';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=مرحباً، أستفسر عن العقار: ${property.title} (رقم المرجع: ${property.id})`;

  return (
    <main className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            
            {/* Right Column - Images */}
            <div className="flex flex-col gap-4">
              <div className="w-full h-80 md:h-[450px] rounded-2xl overflow-hidden relative">
                <img 
                  src={activeImage} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-[var(--color-gold)] text-[var(--color-navy)] font-bold px-4 py-1.5 rounded-full shadow-md text-sm">
                    {property.category}
                  </span>
                  <span className="bg-white text-[var(--color-navy)] font-bold px-4 py-1.5 rounded-full shadow-md text-sm">
                    {property.type}
                  </span>
                </div>
              </div>
              
              {/* Gallery Thumbnails */}
              {property.gallery && property.gallery.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {property.gallery.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[var(--color-gold)] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Left Column - Details */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-navy)] mb-4 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex items-center text-gray-500 text-lg mb-6">
                <MapPin size={20} className="ml-2 text-[var(--color-gold)]" />
                {property.location}
              </div>

              <div className="text-3xl font-black text-[var(--color-navy)] mb-8 bg-gray-50 p-4 rounded-xl inline-block border border-gray-100">
                {property.price}
              </div>

              {/* Main Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Bed size={24} className="mb-2 text-[var(--color-gold)]" />
                  <span className="font-bold text-gray-700">{property.beds} غرف</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Bath size={24} className="mb-2 text-[var(--color-gold)]" />
                  <span className="font-bold text-gray-700">{property.baths} حمامات</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Square size={24} className="mb-2 text-[var(--color-gold)]" />
                  <span className="font-bold text-gray-700">{property.area}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[var(--color-navy)] mb-4">وصف العقار</h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Additional Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[var(--color-navy)] mb-4">مميزات إضافية</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-600">
                        <CheckCircle2 size={18} className="ml-2 text-[var(--color-gold)]" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-colors shadow-lg shadow-[#25D366]/30"
                >
                  <Phone size={24} />
                  تواصل عبر واتساب
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
