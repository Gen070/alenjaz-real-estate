'use client';

import { useActionState, useState } from 'react';
import { Settings, Phone, MapPin, ShieldCheck, CheckCircle2, Users, Building2, Upload, X } from 'lucide-react';
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
        <h2 className="font-bold text-[#2D3864] mb-2 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
          <Phone size={16} />
          أرقام التواصل
        </h2>
        <p className="text-gray-400 text-xs mb-5">تظهر في التذييل وقسم تواصل معنا — أضف ما تحتاجه (حتى 4 أرقام)</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>رقم 1</label>
            <input name="phone_1" defaultValue={settings.phone_1 ?? ''} placeholder="05XXXXXXXX" className={inputCls} dir="ltr" />
          </div>
          <div>
            <label className={labelCls}>رقم 2</label>
            <input name="phone_2" defaultValue={settings.phone_2 ?? ''} placeholder="05XXXXXXXX" className={inputCls} dir="ltr" />
          </div>
          <div>
            <label className={labelCls}>رقم 3 (اختياري)</label>
            <input name="phone_3" defaultValue={settings.phone_3 ?? ''} placeholder="05XXXXXXXX" className={inputCls} dir="ltr" />
          </div>
          <div>
            <label className={labelCls}>رقم 4 (اختياري)</label>
            <input name="phone_4" defaultValue={settings.phone_4 ?? ''} placeholder="05XXXXXXXX" className={inputCls} dir="ltr" />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>رقم الواتساب (مع كود الدولة، بدون +)</label>
          <input name="whatsapp" defaultValue={settings.whatsapp ?? ''} placeholder="966XXXXXXXXX" className={inputCls} dir="ltr" />
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

      {/* المستخدمون */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-2 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
          <Users size={16} />
          المستخدمون (أزرار التواصل)
        </h2>
        <p className="text-gray-400 text-xs mb-5">
          كل مستخدم له زر واتساب + زر اتصال منفصل في صفحة العقار وزر الواتساب العائم
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* مستخدم 1 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
            <p className="font-bold text-[#2D3864] text-sm">المستخدم الأول</p>
            <div>
              <label className={labelCls}>الاسم / المسمى الوظيفي</label>
              <input name="user1_name" defaultValue={settings.user1_name ?? 'المبيعات الرئيسية'} className={inputCls} placeholder="مثال: المبيعات الرئيسية" />
            </div>
            <div>
              <label className={labelCls}>رقم الهاتف</label>
              <input name="user1_phone" defaultValue={settings.user1_phone ?? ''} className={inputCls} placeholder="05XXXXXXXX" dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>رقم الواتساب (مع كود الدولة)</label>
              <input name="user1_whatsapp" defaultValue={settings.user1_whatsapp ?? ''} className={inputCls} placeholder="966XXXXXXXXX" dir="ltr" />
            </div>
          </div>
          {/* مستخدم 2 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
            <p className="font-bold text-[#2D3864] text-sm">المستخدم الثاني</p>
            <div>
              <label className={labelCls}>الاسم / المسمى الوظيفي</label>
              <input name="user2_name" defaultValue={settings.user2_name ?? 'الدعم الفني'} className={inputCls} placeholder="مثال: الدعم الفني" />
            </div>
            <div>
              <label className={labelCls}>رقم الهاتف</label>
              <input name="user2_phone" defaultValue={settings.user2_phone ?? ''} className={inputCls} placeholder="05XXXXXXXX" dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>رقم الواتساب (مع كود الدولة)</label>
              <input name="user2_whatsapp" defaultValue={settings.user2_whatsapp ?? ''} className={inputCls} placeholder="966XXXXXXXXX" dir="ltr" />
            </div>
          </div>
        </div>
      </div>

      {/* صور المدن */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-2 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
          <Building2 size={16} />
          صور المدن
        </h2>
        <p className="text-gray-400 text-xs mb-5">
          الصور الظاهرة في قسم &quot;نغطي أهم مدن المملكة&quot; بالصفحة الرئيسية — ارفعها من جهازك أو الصق رابطاً
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CityImageField cityKey="city_riyadh_image" label="الرياض" defaultUrl={settings.city_riyadh_image ?? ''} />
          <CityImageField cityKey="city_jeddah_image" label="جدة" defaultUrl={settings.city_jeddah_image ?? ''} />
          <CityImageField cityKey="city_madinah_image" label="المدينة المنورة" defaultUrl={settings.city_madinah_image ?? ''} />
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

function CityImageField({
  cityKey,
  label,
  defaultUrl,
}: {
  cityKey: string;
  label: string;
  defaultUrl: string;
}) {
  const [urlValue, setUrlValue] = useState(defaultUrl);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const display = filePreview || urlValue || null;

  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-3">
      <p className="font-bold text-[#2D3864] text-sm text-center">{label}</p>

      <div className="w-full h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        {display ? (
          // معاينة (قد تكون blob محلي) — next/image لا يدعم blob
          // eslint-disable-next-line @next/next/no-img-element
          <img src={display} alt={label} className="w-full h-full object-cover" />
        ) : (
          <Building2 size={28} className="text-gray-300" />
        )}
      </div>

      <label className="flex items-center justify-center gap-2 bg-[#DEF4FC] text-[#2D3864] hover:bg-[#2D3864] hover:text-white px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-colors">
        <Upload size={14} /> رفع من الجهاز
        <input
          type="file"
          name={`${cityKey}_file`}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setFilePreview(URL.createObjectURL(file));
          }}
        />
      </label>

      <input
        name={cityKey}
        value={urlValue}
        onChange={(e) => {
          setUrlValue(e.target.value);
          setFilePreview(null);
        }}
        placeholder="أو رابط صورة"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D3864] bg-white text-xs"
        dir="ltr"
      />

      {display && (
        <button
          type="button"
          onClick={() => {
            setUrlValue('');
            setFilePreview(null);
          }}
          className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1 mx-auto"
        >
          <X size={12} /> إزالة
        </button>
      )}
    </div>
  );
}
