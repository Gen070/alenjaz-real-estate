import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 text-[#2D3864]"
      dir="rtl"
    >
      <Loader2 size={40} className="animate-spin" />
      <p className="text-sm text-gray-500 font-medium">جاري التحميل...</p>
    </div>
  );
}
