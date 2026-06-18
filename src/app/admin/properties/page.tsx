import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import type { Property } from '@/lib/supabase';
import { PropertiesTableClient } from './_components/PropertiesTableClient';

export const revalidate = 0;

export default async function AdminPropertiesPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  const properties = (data ?? []) as Property[];

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

      <PropertiesTableClient properties={properties} />
    </div>
  );
}
