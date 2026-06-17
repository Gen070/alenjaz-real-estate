'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { deleteProperty, togglePublish } from '@/lib/admin-actions';

interface Props {
  id: number;
  title: string;
  isPublished: boolean;
}

export function PropertyActions({ id, title, isPublished }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`هل تريد حذف "${title}"؟ لا يمكن التراجع.`)) return;
    await deleteProperty(id);
    router.refresh();
  };

  const handleToggle = async () => {
    await togglePublish(id, isPublished);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toggle publish */}
      <button
        type="button"
        onClick={handleToggle}
        title={isPublished ? 'إخفاء من الموقع' : 'نشر على الموقع'}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          isPublished
            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
      >
        {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>

      {/* Edit */}
      <Link
        href={`/admin/properties/${id}/edit`}
        className="w-9 h-9 rounded-xl bg-[#DEF4FC] text-[#2D3864] hover:bg-[#2D3864] hover:text-white flex items-center justify-center transition-colors"
        title="تعديل"
      >
        <Pencil size={15} />
      </Link>

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        title="حذف"
        className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
