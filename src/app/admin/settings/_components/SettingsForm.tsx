'use client';

import { useActionState, useState } from 'react';
import {
  Phone, MapPin, ShieldCheck, CheckCircle2,
  Users, Building2, Upload, X, Save, Link as LinkIcon, Loader2,
} from 'lucide-react';
import { updateSettings } from '@/lib/admin-actions';
import { uploadImageDirect } from '@/lib/upload-client';

const inputCls =
  'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864]/25 focus:border-[#2D3864] focus:bg-white transition-all bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]';
const labelCls = 'block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest';
const cardCls  = 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden';
const cardHeadCls = 'flex items-center gap-2.5 px-5 py-4 border-b border-gray-100';

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction, isPending] = useActionState(updateSettings, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction}>
      {/* ═══ Two-column layout ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

        {/* ── العمود الرئيسي ──────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* أرقام التواصل */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">أرقام التواصل</p>
                <p className="text-gray-400 text-[11px]">تظهر في التذييل وقسم تواصل معنا — حتى 4 أرقام</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n}>
                    <label className={labelCls}>رقم {n}{n > 2 ? ' (اختياري)' : ''}</label>
                    <input
                      name={`phone_${n}`}
                      defaultValue={settings[`phone_${n}`] ?? ''}
                      placeholder="05XXXXXXXX"
                      className={inputCls}
                      dir="ltr"
                    />
                  </div>
                ))}
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
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                <MapPin size={15} className="text-sky-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">الموقع الجغرافي</p>
                <p className="text-gray-400 text-[11px]">يظهر في التذييل وصفحة التواصل</p>
              </div>
            </div>
            <div className="p-5">
              <label className={labelCls}>نص الموقع</label>
              <input
                name="location_text"
                defaultValue={settings.location_text ?? ''}
                placeholder="مكة المكرمة، المملكة العربية السعودية"
                className={inputCls}
              />
            </div>
          </div>

          {/* التراخيص */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <ShieldCheck size={15} className="text-purple-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">روابط التراخيص</p>
                <p className="text-gray-400 text-[11px]">تظهر عند النقر على أيقونات التذييل</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {[
                { name: 'license_fal_url',    label: 'رابط ترخيص فال (FAL)',               placeholder: 'https://eservicesred.rega.gov.sa/...' },
                { name: 'license_marouf_url', label: 'رابط منصة معروف',                   placeholder: 'https://maroof.sa/businesses/...' },
                { name: 'license_sbc_url',    label: 'رابط المركز السعودي للأعمال (SBC)', placeholder: 'https://cr.mc.gov.sa/...' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                      <LinkIcon size={13} className="text-gray-300" />
                    </div>
                    <input
                      name={name}
                      defaultValue={settings[name] ?? ''}
                      placeholder={placeholder}
                      className={inputCls + ' pr-9'}
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback + Save */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> تم حفظ الإعدادات بنجاح
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-[#2D3864] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a2340] transition-colors disabled:opacity-60 shadow-sm text-sm"
          >
            <Save size={16} />
            {isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>

        {/* ── العمود الجانبي ──────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* المستخدمون */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-[#2D3864]/10 flex items-center justify-center shrink-0">
                <Users size={15} className="text-[#2D3864]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">المستخدمون</p>
                <p className="text-gray-400 text-[11px]">أزرار التواصل في صفحة العقار والواتساب العائم</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {[
                { key: 'user1', label: 'المستخدم الأول', defaultName: 'المبيعات الرئيسية', color: 'bg-[#2D3864]' },
                { key: 'user2', label: 'المستخدم الثاني', defaultName: 'الدعم الفني',       color: 'bg-amber-500' },
              ].map(({ key, label, defaultName, color }) => (
                <div key={key} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <div className={`${color} px-4 py-2.5 flex items-center gap-2`}>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                      {key === 'user1' ? '١' : '٢'}
                    </div>
                    <p className="text-white font-bold text-sm">{label}</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className={labelCls}>الاسم / المسمى</label>
                      <input name={`${key}_name`} defaultValue={settings[`${key}_name`] ?? defaultName} className={inputCls} placeholder={defaultName} />
                    </div>
                    <div>
                      <label className={labelCls}>رقم الهاتف</label>
                      <input name={`${key}_phone`} defaultValue={settings[`${key}_phone`] ?? ''} className={inputCls} placeholder="05XXXXXXXX" dir="ltr" />
                    </div>
                    <div>
                      <label className={labelCls}>واتساب (مع كود الدولة)</label>
                      <input name={`${key}_whatsapp`} defaultValue={settings[`${key}_whatsapp`] ?? ''} className={inputCls} placeholder="966XXXXXXXXX" dir="ltr" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* صور المدن */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Building2 size={15} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">صور المدن</p>
                <p className="text-gray-400 text-[11px]">قسم &quot;نغطي أهم مدن المملكة&quot; في الصفحة الرئيسية</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              <CityImageField cityKey="city_riyadh_image"  label="الرياض"         defaultUrl={settings.city_riyadh_image ?? ''} />
              <CityImageField cityKey="city_jeddah_image"  label="جدة"            defaultUrl={settings.city_jeddah_image ?? ''} />
              <CityImageField cityKey="city_madinah_image" label="المدينة المنورة" defaultUrl={settings.city_madinah_image ?? ''} />
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}

// ─── CityImageField ───────────────────────────────────────────────────────────
// الصورة تُرفع مباشرةً إلى Supabase (تتخطّى حدّ Vercel 4.5MB) ويُحفظ رابطها في الحقل.
function CityImageField({ cityKey, label, defaultUrl }: { cityKey: string; label: string; defaultUrl: string }) {
  const [urlValue,  setUrlValue]  = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(false);
    setUploading(true);
    try {
      const url = await uploadImageDirect(file);
      setUrlValue(url);
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="relative w-full h-20 bg-gray-50 flex items-center justify-center">
        {uploading ? (
          <Loader2 size={18} className="text-[#2D3864] animate-spin" />
        ) : urlValue ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urlValue} alt={label} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setUrlValue('')}
              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
            >
              <X size={10} />
            </button>
          </>
        ) : (
          <Building2 size={20} className="text-gray-200" />
        )}
      </div>
      <div className="p-2 border-t border-gray-100 space-y-1.5">
        <p className="font-bold text-gray-700 text-[11px] text-center">{label}</p>
        <input type="hidden" name={cityKey} value={urlValue} />
        <label
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors w-full ${
            uploading
              ? 'bg-gray-200 text-gray-400 cursor-wait'
              : 'bg-[#2D3864] text-white hover:bg-[#1a2340] cursor-pointer'
          }`}
        >
          {uploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
          {uploading ? 'جاري الرفع...' : 'رفع'}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            className="hidden"
            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
          />
        </label>
        <input
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          placeholder="أو رابط..."
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#2D3864]/30 focus:border-[#2D3864] bg-gray-50 text-[10px] placeholder:text-gray-300 transition-all"
          dir="ltr"
        />
        {error && <p className="text-red-500 text-[9px] text-center">فشل الرفع — حاول مجدداً</p>}
      </div>
    </div>
  );
}
