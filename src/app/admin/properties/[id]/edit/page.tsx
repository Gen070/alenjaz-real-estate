import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import { updateProperty } from '@/lib/admin-actions';
import { PropertyForm } from '../../_components/PropertyForm';
import type { Property } from '@/lib/supabase';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const admin = createAdminClient();
  const { data } = await admin
    .from('properties')
    .select('*')
    .eq('id', numId)
    .maybeSingle();

  if (!data) notFound();

  const property = data as Property;
  const updateWithId = updateProperty.bind(null, numId);

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/properties"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#2D3864] hover:border-[#2D3864] transition-colors shadow-sm"
        >
          <ArrowRight size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pencil size={20} className="text-[#2D3864]" />
            تعديل العقار
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{property.title}</p>
        </div>
      </div>

      <PropertyForm action={updateWithId} property={property} mode="edit" />
    </div>
  );
}
