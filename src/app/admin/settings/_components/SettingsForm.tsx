'use client';

import { useActionState } from 'react';
import { Settings, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { updateSettings } from '@/lib/admin-actions';

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864] transition-all bg-gray-50 text-sm';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';
const sectionCls = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction, isPending] = useActionState(updateSettings, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="space-y-6">
      {/* أرقام التواصل */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
          <Phone size={16} />
          أرقام التواصل
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>رقم الجوال الأول</label>
            <input
              name="phone_1"
              defaultValue={settings.phone_1 ?? ''}
              placeholder="05XXXXXXXX"
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelCls}>رقم الجوال الثاني</label>
            <input
              name="phone_2"
              defaultValue={settings.phone_2 ?? ''}
              placeholder="05XXXXXXXX"
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelCls}>رقم الجوال الثالث</label>
            <input
              name="phone_3"
              defaultValue={settings.phone_3 ?? ''}
              placeholder="05XXXXXXXX"
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelCls}>رقم الواتساب (مع كود الدولة، بدون +)</label>
            <input
              name="whatsapp"
              defaultValue={settings.whatsapp ?? ''}
              placeholder="966XXXXXXXXX"
              className={inputCls}
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* الموقع */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
          <MapPin size={16} />
          الموقع
        </h2>
        <div>
          <label className={labelCls}>نص الموقع (يظهر في التذييل)</label>
          <input
            name="location_text"
            defaultValue={settings.location_text ?? ''}
            placeholder="مكة المكرمة، المملكة العربية السعودية"
            className={inputCls}
          />
        </div>
      </div>

      {/* التراخيص */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-2 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
          <ShieldCheck size={16} />
          روابط التراخيص
        </h2>
        <p className="text-gray-400 text-xs mb-5">
          أضف روابط التحقق من التراخيص — تظهر عند النقر على أيقونات التذييل
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>رابط ترخيص فال (FAL)</label>
            <input
              name="license_fal_url"
              defaultValue={settings.license_fal_url ?? ''}
              placeholder="https://eservicesred.rega.gov.sa/..."
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelCls}>رابط منصة معروف</label>
            <input
              name="license_marouf_url"
              defaultValue={settings.license_marouf_url ?? ''}
              placeholder="https://maroof.sa/businesses/..."
              className={inputCls}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelCls}>رابط المركز السعودي للأعمال (SBC)</label>
            <input
              name="license_sbc_url"
              defaultValue={settings.license_sbc_url ?? ''}
              placeholder="https://cr.mc.gov.sa/..."
              className={inputCls}
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {state.error && (
        <p className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl text-sm">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          تم حفظ الإعدادات بنجاح ✓
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 bg-[#2D3864] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3e4a7a] transition-colors disabled:opacity-60 shadow-sm"
      >
        <Settings size={18} />
        {isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
      </button>
    </form>
  );
}
