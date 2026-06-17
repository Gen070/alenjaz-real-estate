'use client';

import { useActionState } from 'react';
import { loginAdmin } from '@/lib/admin-actions';
import { Lock, Building2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, { error: null });

  return (
    <main
      className="min-h-screen flex items-center justify-center font-sans"
      style={{ background: 'linear-gradient(135deg, #2D3864 0%, #1a2240 100%)' }}
      dir="rtl"
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2D3864] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="text-[#C9A84C]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#2D3864]">لوحة التحكم</h1>
          <p className="text-gray-400 text-sm mt-1">الإنجاز للعقار</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                autoFocus
                className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 focus:ring-[#2D3864] transition-all bg-gray-50 text-base"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          {state.error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#2D3864] text-white py-3 rounded-xl font-bold hover:bg-[#3e4a7a] transition-colors disabled:opacity-60 text-base shadow-md"
          >
            {isPending ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </main>
  );
}
