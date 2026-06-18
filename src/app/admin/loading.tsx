import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-[#2D3864]">
      <Loader2 size={36} className="animate-spin" />
      <p className="text-sm text-gray-500 font-medium">جاري التحميل...</p>
    </div>
  );
}
