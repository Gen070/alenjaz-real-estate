import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center font-sans bg-gray-50 px-6 text-center"
      dir="rtl"
    >
      <div className="text-7xl font-black text-[#2D3864]">٤٠٤</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">الصفحة غير موجودة</h1>
      <p className="mt-2 text-gray-500 max-w-md">
        عذراً، الصفحة أو العقار الذي تبحث عنه غير متوفر أو تم حذفه.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#2D3864] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#3e4a7a] transition-colors shadow-sm"
        >
          <Home size={18} />
          الصفحة الرئيسية
        </Link>
        <Link
          href="/properties"
          className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#2D3864] font-bold px-6 py-3 rounded-xl hover:border-[#2D3864] transition-colors"
        >
          <Search size={18} />
          تصفّح العقارات
        </Link>
      </div>
    </main>
  );
}
