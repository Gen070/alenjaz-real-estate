import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import type { Property } from '@/lib/supabase';
import { PropertyActions } from './_components/PropertyActions';

export const revalidate = 0;

export default async function AdminPropertiesPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  const properties = (data ?? []) as Property[];

  const statusColor: Record<string, string> = {
    متاح: 'bg-emerald-100 text-emerald-700',
    مباع: 'bg-red-100 text-red-700',
    مؤجر: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={22} className="text-[#2D3864]" />
            العقارات
          </h1>
          <p className="text-gray-500 text-sm mt-1">إجمالي {properties.length} عقار</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#2D3864] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#3e4a7a] transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          إضافة عقار
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">لا توجد عقارات بعد</p>
            <Link
              href="/admin/properties/new"
              className="mt-4 inline-flex items-center gap-2 text-[#2D3864] font-semibold hover:underline text-sm"
            >
              <Plus size={16} /> أضف أول عقار
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 w-16">الصورة</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600">العنوان</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 hidden md:table-cell">الموقع</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 hidden lg:table-cell">النوع</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600">الحالة</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {prop.image ? (
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Building2 size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 line-clamp-1">{prop.title}</p>
                      {prop.property_code && (
                        <p className="text-gray-400 text-xs" dir="ltr">{prop.property_code}</p>
                      )}
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
                      <PropertyActions
                        id={prop.id}
                        title={prop.title}
                        isPublished={prop.is_published}
                      />
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
