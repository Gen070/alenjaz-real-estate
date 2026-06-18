'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Search, Plus } from 'lucide-react';
import type { Property } from '@/lib/supabase';
import { PropertyActions } from './PropertyActions';

const statusColor: Record<string, string> = {
  متاح: 'bg-emerald-100 text-emerald-700',
  مباع: 'bg-red-100 text-red-700',
  مؤجر: 'bg-orange-100 text-orange-700',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864] transition-all bg-gray-50 text-sm';

export function PropertiesTableClient({ properties }: { properties: Property[] }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('الكل');
  const [status, setStatus] = useState('الكل');

  const filtered = useMemo(() => {
    const q = search.trim();
    return properties.filter((p) => {
      const matchesSearch =
        q === ''
          ? true
          : (p.title ?? '').includes(q) ||
            (p.property_code ?? '').toLowerCase().includes(q.toLowerCase()) ||
            (p.location ?? '').includes(q);
      const matchesType = type === 'الكل' ? true : p.type === type;
      const matchesStatus = status === 'الكل' ? true : p.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, search, type, status]);

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
        <Building2 size={48} className="mx-auto mb-4 opacity-30" />
        <p className="font-medium">لا توجد عقارات بعد</p>
        <Link
          href="/admin/properties/new"
          className="mt-4 inline-flex items-center gap-2 text-[#2D3864] font-semibold hover:underline text-sm"
        >
          <Plus size={16} /> أضف أول عقار
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* شريط البحث والفلاتر */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، رقم العقار، المدينة أو المنطقة..."
            className={`${inputCls} pr-10`}
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
          <option value="الكل">كل الأنواع</option>
          <option value="للبيع">للبيع</option>
          <option value="للإيجار">للإيجار</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          <option value="الكل">كل الحالات</option>
          <option value="متاح">متاح</option>
          <option value="مباع">مباع</option>
          <option value="مؤجر">مؤجر</option>
        </select>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">لا توجد نتائج مطابقة للبحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 w-16">الصورة</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600">العنوان</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 hidden md:table-cell">تاريخ الإضافة</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 hidden md:table-cell">الموقع</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 hidden lg:table-cell">النوع</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600">الحالة</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {prop.image ? (
                          <Image src={prop.image} alt={prop.title} fill sizes="48px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Building2 size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 line-clamp-1">{prop.title}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell whitespace-nowrap">
                      {formatDate(prop.created_at)}
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">
                      {prop.location ?? '—'}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="bg-[#DEF4FC] text-[#2D3864] text-xs px-2 py-1 rounded-lg font-medium">
                        {prop.type ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          statusColor[prop.status] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <PropertyActions id={prop.id} title={prop.title} isPublished={prop.is_published} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
