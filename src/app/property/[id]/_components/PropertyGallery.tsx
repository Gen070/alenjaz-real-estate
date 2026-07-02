'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Map as MapIcon } from 'lucide-react';

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const hasImages = images.length > 0;
  const multiple = images.length > 1;

  // التالي فعلياً (يتقدّم في المصفوفة) — الزر الأيمن
  const next = () => setCurrent((c) => (c + 1) % images.length);
  // السابق فعلياً (يرجع في المصفوفة) — الزر الأيسر
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  const arrowCls =
    'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md shadow-lg flex items-center justify-center text-[var(--color-navy)] hover:bg-white hover:scale-105 transition-all z-20';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] sm:h-[500px]">
      {/* Main image */}
      <div className="md:col-span-3 h-full rounded-2xl overflow-hidden relative group bg-gray-200">
        {hasImages ? (
          // كل الصور تُحمَّل مسبقاً وتُبدَّل بتلاشي بصري بدل الطلب من الشبكة عند كل ضغطة —
          // يمنع التأخير الملحوظ عند التنقل بين الصور.
          images.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              className={`object-cover transition-opacity duration-300 ${
                i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              priority={i === 0}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            لا توجد صور
          </div>
        )}

        {multiple && (
          <>
            {/* التالي — على اليمين */}
            <button type="button" onClick={next} aria-label="الصورة التالية" className={`${arrowCls} right-3`}>
              <ChevronRight size={22} />
            </button>
            {/* السابق — على اليسار */}
            <button type="button" onClick={prev} aria-label="الصورة السابقة" className={`${arrowCls} left-3`}>
              <ChevronLeft size={22} />
            </button>
            {/* العدّاد */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur z-20"
              dir="ltr"
            >
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Side column */}
      <div className="hidden md:flex flex-col gap-4 h-full">
        <div className="flex-1 rounded-2xl overflow-hidden relative bg-gray-200 flex flex-col items-center justify-center border border-gray-200">
          <MapIcon size={40} className="text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">عرض على الخريطة</span>
        </div>
        {multiple && (
          <button
            type="button"
            onClick={next}
            className="flex-1 rounded-2xl overflow-hidden relative group bg-gray-200 block"
            aria-label="الصورة التالية"
          >
            <Image
              src={images[(current + 1) % images.length]}
              alt={title}
              fill
              sizes="25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/30 transition-colors">
              <span className="text-white font-bold text-lg">+ صور</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
