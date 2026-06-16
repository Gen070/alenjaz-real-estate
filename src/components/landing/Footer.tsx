'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 text-right">
        
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          
          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-navy)] mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/" className="hover:text-[var(--color-navy)]">الرئيسية</Link></li>
                <li><Link href="/properties" className="hover:text-[var(--color-navy)]">العقارات</Link></li>
                <li><Link href="/#contact" className="hover:text-[var(--color-navy)]">تواصل معنا</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--color-navy)] mb-4">تواصل معنا</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <a href="https://wa.me/966544666760" target="_blank" rel="noopener noreferrer" className="flex items-center justify-start gap-2 hover:text-[var(--color-navy)] transition-colors">
                    <Phone size={18} className="text-[var(--color-navy)] ml-2" />
                    <span dir="ltr">0544666760</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/966507007604" target="_blank" rel="noopener noreferrer" className="flex items-center justify-start gap-2 hover:text-[var(--color-navy)] transition-colors">
                    <Phone size={18} className="text-[var(--color-navy)] ml-2" />
                    <span dir="ltr">0507007604</span>
                  </a>
                </li>
                <li className="flex items-center justify-start gap-2">
                  <MapPin size={18} className="text-[var(--color-navy)] ml-2" />
                  <Link href="https://share.google/sDQGq31qy11iuifv0" target="_blank" className="hover:text-[var(--color-navy)]">الموقع على الخريطة</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Licenses Section (From Feedback) */}
          <div className="lg:w-1/3 flex flex-col justify-end lg:items-end">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-right lg:text-left w-full">التراخيص والاعتمادات الرسمية</h3>
            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white border border-gray-200 p-2 rounded-xl hover:border-[#1E40AF] transition-all hover:shadow-md group h-16 w-32">
                {/* Fallback to text if image not found, but we expect user to add /logos/fal.png */}
                <img src="/logos/fal.png" alt="فال FAL" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <span className="hidden font-bold text-gray-700 text-sm">فال FAL</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white border border-gray-200 p-2 rounded-xl hover:border-[#047857] transition-all hover:shadow-md group h-16 w-32">
                <img src="/logos/maroof.png" alt="منصة معروف" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <span className="hidden font-bold text-gray-700 text-sm">منصة معروف</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white border border-gray-200 p-2 rounded-xl hover:border-[#0F172A] transition-all hover:shadow-md group h-16 w-32">
                <img src="/logos/sbc.png" alt="المركز السعودي للأعمال" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <span className="hidden font-bold text-gray-700 text-sm text-center">مركز الأعمال</span>
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-right lg:text-left w-full">
              انقر على الشعار للتحقق من الترخيص
            </p>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="شعار الانجاز للعقار" className="w-10 h-10 object-contain rounded-full border border-gray-100 grayscale opacity-70" />
            <span className="font-bold text-gray-500">الإنجاز للعقار</span>
          </div>
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} الإنجاز للعقار</p>
        </div>
      </div>
    </footer>
  );
}
