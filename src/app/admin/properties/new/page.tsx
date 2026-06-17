import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { createProperty } from '@/lib/admin-actions';
import { PropertyForm } from '../_components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/properties"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#2D3864] hover:border-[#2D3864] transition-colors shadow-sm"
        >
          <ArrowRight size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus size={22} className="text-[#2D3864]" />
            إضافة عقار جديد
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">أملأ التفاصيل ثم اضغط إضافة العقار</p>
        </div>
      </div>

      <PropertyForm action={createProperty} mode="create" />
    </div>
  );
}
