'use client';

import React, { useState } from 'react';
import type { Property } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Square, ArrowLeft, Search, MapPin, SlidersHorizontal, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PropertiesClient({ properties }: { properties: Property[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('الجميع');
  const [propertyType, setPropertyType] = useState('الجميع');
  const [city, setCity] = useState('الجميع');
  const [neighborhood, setNeighborhood] = useState('');
  const [sortBy, setSortBy] = useState('الأحدث');

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch = (prop.title ?? '').includes(searchTerm);
    const matchesCategory = category === 'الجميع' ? true : prop.category === category;
    const matchesType = propertyType === 'الجميع' ? true : prop.type === propertyType;
    const matchesCity = city === 'الجميع' ? true : (prop.location ?? '').includes(city);
    const matchesNeighborhood = neighborhood === '' ? true : (prop.location ?? '').includes(neighborhood);
    return matchesSearch && matchesCategory && matchesType && matchesCity && matchesNeighborhood;
  });

  const num = (v: string | null | undefined) => parseInt((v ?? '0').replace(/\D/g, '') || '0', 10);

  if (sortBy === 'الأرخص') {
    filteredProperties.sort((a, b) => num(a.price) - num(b.price));
  } else if (sortBy === 'الأغلى') {
    filteredProperties.sort((a, b) => num(b.price) - num(a.price));
  } else if (sortBy === 'المساحة الأكبر') {
    filteredProperties.sort((a, b) => num(b.area) - num(a.area));
  } else {
    filteredProperties.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return (
    <>
      {/* Filter / Search Bar Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end border border-gray-100">
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm font-semibold mb-2 flex items-center gap-2">
              <MapPin size={16} /> المدينة
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all appearance-none"
            >
              <option value="الجميع">كل المدن</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
              <option value="مكة">مكة المكرمة</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-sm font-semibold mb-2 flex items-center gap-2">
              <MapPin size={16} /> الحي
            </label>
            <input
              type="text"
              placeholder="اسم الحي..."
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-sm font-semibold mb-2 flex items-center gap-2">
              <Home size={16} /> نوع العقار
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all appearance-none"
            >
              <option value="الجميع">جميع العقارات</option>
              <option value="فلل">فلل</option>
              <option value="شقق">شقق</option>
              <option value="أراضي">أراضي</option>
              <option value="مكاتب">مكاتب</option>
              <option value="تجاري">تجاري</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-sm font-semibold mb-2 flex items-center gap-2">
              <SlidersHorizontal size={16} /> التصنيف
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all appearance-none"
            >
              <option value="الجميع">الكل</option>
              <option value="للبيع">للبيع</option>
              <option value="للإيجار">للإيجار</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-sm font-semibold mb-2 flex items-center gap-2">
              <Search size={16} /> كلمة دلالية
            </label>
            <input
              type="text"
              placeholder="ابحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all"
            />
          </div>

          <button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[#d4a849] font-bold py-3 px-6 rounded-xl transition-all shadow-md h-[50px] flex items-center justify-center">
            بحث
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-6 flex justify-between items-center text-gray-500">
          <p className="font-medium">
            تم العثور على <span className="font-bold text-[var(--color-navy)]">{filteredProperties.length}</span> عقارات
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold hidden sm:inline">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all text-sm font-medium"
            >
              <option value="الأحدث">الأحدث</option>
              <option value="الأرخص">الأرخص</option>
              <option value="الأغلى">الأغلى</option>
              <option value="المساحة الأكبر">المساحة الأكبر</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProperties.map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group flex flex-col h-full cursor-pointer"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  {prop.image ? (
                    <Image
                      src={prop.image}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                    <span className="text-[var(--color-navy)] font-bold text-xs">{prop.type}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-[var(--color-gold)]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                    <span className="text-[var(--color-navy)] font-bold text-xs">{prop.category}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <Link href={`/property/${prop.id}`}>
                    <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2 line-clamp-1 group-hover:text-[var(--color-gold)] transition-colors hover:underline">
                      {prop.title}
                    </h3>
                  </Link>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={16} className="ml-1 text-gray-400" />
                    {prop.location}
                  </div>

                  <div className="h-px w-full bg-gray-100 mb-4" />

                  <div className="grid grid-cols-3 gap-2 text-gray-500 text-sm mb-4">
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
                      <Bed size={18} className="mb-1 text-[var(--color-navy)]" />
                      <span className="font-medium">{prop.beds} غرف</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
                      <Bath size={18} className="mb-1 text-[var(--color-navy)]" />
                      <span className="font-medium">{prop.baths} حمام</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
                      <Square size={18} className="mb-1 text-[var(--color-navy)]" />
                      <span className="font-medium">{prop.area}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-end pt-2">
                    <Link href={`/property/${prop.id}`}>
                      <button className="w-10 h-10 bg-gray-50 hover:bg-[var(--color-navy)] hover:text-white rounded-full flex items-center justify-center transition-colors text-gray-600">
                        <ArrowLeft size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProperties.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              <p className="text-xl">عذراً، لا توجد عقارات تطابق بحثك حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
