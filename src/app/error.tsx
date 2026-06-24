"use client";

import { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center font-sans bg-gray-50 px-6 text-center"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-gray-900">حدث خطأ غير متوقع</h1>
      <p className="mt-2 text-gray-500 max-w-md">
        نعتذر عن ذلك. حاول إعادة المحاولة، وإن استمرت المشكلة عُد للصفحة الرئيسية.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-[#2D3864] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#3e4a7a] transition-colors shadow-sm"
        >
          <RotateCcw size={18} />
          إعادة المحاولة
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#2D3864] font-bold px-6 py-3 rounded-xl hover:border-[#2D3864] transition-colors"
        >
          <Home size={18} />
          الصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
