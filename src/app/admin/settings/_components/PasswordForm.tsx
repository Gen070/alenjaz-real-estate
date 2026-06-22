'use client';

import { useActionState } from 'react';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { changeAdminPassword } from '@/lib/admin-actions';

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864] transition-all bg-gray-50 text-sm';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(changeAdminPassword, {
    error: null,
    success: false,
  });

  return (
    <form
      action={formAction}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4"
    >
      <h2 className="font-bold text-[#2D3864] text-base border-b border-gray-100 pb-3 flex items-center gap-2">
        <KeyRound size={16} />
        كلمة سر اللوحة
      </h2>
      <p className="text-gray-400 text-xs">
        غيّر كلمة سر الدخول إلى لوحة التحكم
      </p>

      <div>
        <label className={labelCls}>كلمة المرور الحالية</label>
        <input type="password" name="current_password" required className={inputCls} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>كلمة المرور الجديدة</label>
          <input type="password" name="new_password" required minLength={6} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>تأكيد الجديدة</label>
          <input type="password" name="confirm_password" required minLength={6} className={inputCls} />
        </div>
      </div>

      {state.error && (
        <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-sm">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          تم تغيير كلمة المرور ✓ — استخدمها في الدخول القادم
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 bg-[#2D3864] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3e4a7a] transition-colors disabled:opacity-60 shadow-sm"
      >
        <KeyRound size={18} />
        {isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
      </button>
    </form>
  );
}
