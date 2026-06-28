'use client';

import { useActionState } from 'react';
import { KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { changeAdminPassword } from '@/lib/admin-actions';

const inputCls =
  'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864]/25 focus:border-[#2D3864] focus:bg-white transition-all bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]';
const labelCls = 'block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest';

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(changeAdminPassword, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <Lock size={15} className="text-red-500" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">كلمة سر اللوحة</p>
          <p className="text-gray-400 text-[11px]">غيّر كلمة الدخول إلى لوحة التحكم</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className={labelCls}>كلمة المرور الحالية</label>
          <input type="password" name="current_password" required className={inputCls} placeholder="••••••••" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>كلمة المرور الجديدة</label>
            <input type="password" name="new_password" required minLength={6} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelCls}>تأكيد الجديدة</label>
            <input type="password" name="confirm_password" required minLength={6} className={inputCls} placeholder="••••••••" />
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
            تم تغيير كلمة المرور — استخدمها في الدخول القادم
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-60 shadow-sm text-sm"
        >
          <KeyRound size={15} />
          {isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
        </button>
      </div>
    </form>
  );
}
