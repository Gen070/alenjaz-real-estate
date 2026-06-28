'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, X, Upload, ImageIcon, Save, ArrowRight,
  Info, LayoutGrid, Star, Eye, EyeOff, Images, Loader2,
} from 'lucide-react';
import type { Property } from '@/lib/supabase';
import { uploadImageDirect, uploadImagesDirect } from '@/lib/upload-client';

type ActionFn = (
  prevState: { error: string | null; success: boolean },
  formData: FormData
) => Promise<{ error: string | null; success: boolean }>;

interface Props {
  action: ActionFn;
  property?: Property;
  mode: 'create' | 'edit';
}

const inputCls =
  'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864]/25 focus:border-[#2D3864] focus:bg-white transition-all bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]';
const labelCls = 'block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest';
const cardCls  = 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden';
const cardHeadCls = 'flex items-center gap-2.5 px-5 py-4 border-b border-gray-100';

// ─── Options ─────────────────────────────────────────────────────────────────
const TYPE_OPTS     = ['للبيع', 'للإيجار', 'للإيجار الموسمي', 'للاستثمار', 'للتنازل'];
const CATEGORY_OPTS = ['فلل', 'شقق', 'أراضي', 'مكاتب', 'محلات تجارية', 'مستودعات', 'عمائر', 'استراحات', 'مزارع', 'فندقي', 'مجمعات'];
const USAGE_OPTS    = ['سكني', 'تجاري', 'مختلط', 'صناعي', 'زراعي', 'ترفيهي'];

// ─── ComboSelect ──────────────────────────────────────────────────────────────
function ComboSelect({
  name,
  options,
  defaultValue,
  hint,
}: {
  name: string;
  options: string[];
  defaultValue?: string | null;
  hint?: string;
}) {
  const initCustom =
    !!defaultValue && !options.includes(defaultValue);
  const [value, setValue]   = useState(defaultValue ?? options[0]);
  const [custom, setCustom] = useState(initCustom);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      {custom ? (
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={hint ?? 'اكتب القيمة...'}
            className={inputCls + ' flex-1'}
          />
          <button
            type="button"
            onClick={() => { setCustom(false); setValue(options[0]); }}
            className="w-10 shrink-0 rounded-xl border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setCustom(true);
              setValue('');
            } else {
              setValue(e.target.value);
            }
          }}
          className={inputCls}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          <option value="__custom__">أخرى (اكتب يدوياً)...</option>
        </select>
      )}
    </div>
  );
}

// ─── GalleryGrid ─────────────────────────────────────────────────────────────
function GalleryGrid({
  urls,
  uploading,
  onRemove,
  onAdd,
}: {
  urls: string[];
  uploading: boolean;
  onRemove: (i: number) => void;
  onAdd: (files: FileList | null) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {urls.map((url, i) => (
        <div
          key={url + i}
          className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`صورة ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
          >
            <X size={11} />
          </button>
        </div>
      ))}
      {/* Add button */}
      <label
        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors group ${
          uploading
            ? 'border-[#2D3864] bg-[#2D3864]/5 cursor-wait'
            : 'border-gray-200 cursor-pointer hover:border-[#2D3864] hover:bg-[#2D3864]/5'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="text-[#2D3864] animate-spin mb-1" />
            <span className="text-[10px] text-[#2D3864]">جاري الرفع...</span>
          </>
        ) : (
          <>
            <Upload size={18} className="text-gray-300 group-hover:text-[#2D3864] transition-colors mb-1" />
            <span className="text-[10px] text-gray-300 group-hover:text-[#2D3864] transition-colors">إضافة</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          className="hidden"
          onChange={(e) => { onAdd(e.target.files); e.target.value = ''; }}
        />
      </label>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PropertyForm({ action, property, mode }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
    success: false,
  });

  const [details, setDetails] = useState<{ label: string; value: string }[]>(
    property?.details ?? []
  );

  // رسالة خطأ رفع الصور (منفصلة عن خطأ الحفظ القادم من الـ action)
  const [uploadError, setUploadError] = useState<string | null>(null);

  // الصورة الرئيسية — تُرفع مباشرةً وتُحفظ كرابط عام
  const [imagePreview, setImagePreview] = useState<string | null>(
    property?.image ?? null
  );
  const [imgUploading, setImgUploading] = useState(false);

  async function handleMainImage(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setImgUploading(true);
    try {
      const url = await uploadImageDirect(file);
      setImagePreview(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'فشل رفع الصورة');
    } finally {
      setImgUploading(false);
    }
  }

  // المعرض — كل العناصر روابط عامة (تُرفع مباشرةً فور الاختيار)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    property?.gallery ?? []
  );
  const [galleryUploading, setGalleryUploading] = useState(false);

  async function handleGalleryAdd(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setGalleryUploading(true);
    try {
      const urls = await uploadImagesDirect(Array.from(files));
      setGalleryUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'فشل رفع بعض الصور');
    } finally {
      setGalleryUploading(false);
    }
  }

  const removeGalleryItem = (idx: number) =>
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx));

  const uploading = imgUploading || galleryUploading;

  const addDetail = () =>
    setDetails((d) => [...d, { label: '', value: '' }]);
  const removeDetail = (i: number) =>
    setDetails((d) => d.filter((_, idx) => idx !== i));
  const updateDetail = (
    i: number,
    field: 'label' | 'value',
    val: string
  ) =>
    setDetails((d) =>
      d.map((row, idx) => (idx === i ? { ...row, [field]: val } : row))
    );

  useEffect(() => {
    if (state.success) {
      router.push('/admin/properties');
      router.refresh();
    }
  }, [state.success, router]);

  // Publish toggle state
  const [published, setPublished] = useState(
    property?.is_published ?? false
  );

  return (
    <form action={formAction}>
      {/* الحقول المخفية — الصور صارت روابط (مرفوعة مباشرةً لـ Supabase) فلا تمرّ ملفات عبر الخادم */}
      <input type="hidden" name="details_json" value={JSON.stringify(details)} />
      <input type="hidden" name="gallery_existing" value={JSON.stringify(galleryUrls)} />
      <input type="hidden" name="image_url" value={imagePreview ?? ''} />
      <input type="hidden" name="is_published" value={published ? 'true' : 'false'} />

      {/* ═══ Two-column layout ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* ── LEFT column ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* المعلومات الأساسية */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-[#2D3864]/10 flex items-center justify-center shrink-0">
                <Info size={15} className="text-[#2D3864]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">المعلومات الأساسية</p>
                <p className="text-gray-400 text-[11px]">البيانات الرئيسية للعقار</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>رقم العقار</label>
                <input
                  name="property_code"
                  defaultValue={property?.property_code ?? ''}
                  placeholder="مثال: AG-0001"
                  className={inputCls}
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  عنوان العقار <span className="text-red-500 mr-0.5">*</span>
                </label>
                <input
                  name="title"
                  required
                  defaultValue={property?.title ?? ''}
                  placeholder="مثال: فيلا راقية في حي الشاطئ"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>الموقع</label>
                <input
                  name="location"
                  defaultValue={property?.location ?? ''}
                  placeholder="المدينة، الحي"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>السعر</label>
                <input
                  name="price"
                  defaultValue={property?.price ?? ''}
                  placeholder="مثال: 1,500,000 ريال"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>الوصف</label>
                <textarea
                  name="description"
                  defaultValue={property?.description ?? ''}
                  rows={4}
                  className={inputCls + ' resize-none'}
                  placeholder="وصف تفصيلي للعقار..."
                />
              </div>
            </div>
          </div>

          {/* التفاصيل */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <LayoutGrid size={15} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">التفاصيل</p>
                <p className="text-gray-400 text-[11px]">نوع العرض، الفئة، المساحة والمزيد</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {/* Row 1: نوع + فئة + استخدام + حالة */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>نوع العرض</label>
                  <ComboSelect name="type" options={TYPE_OPTS} defaultValue={property?.type} hint="مثال: للمزاد" />
                </div>
                <div>
                  <label className={labelCls}>الفئة</label>
                  <ComboSelect name="category" options={CATEGORY_OPTS} defaultValue={property?.category} hint="مثال: دور أرضي" />
                </div>
                <div>
                  <label className={labelCls}>الاستخدام</label>
                  <ComboSelect name="usage" options={USAGE_OPTS} defaultValue={property?.usage} hint="مثال: تعليمي" />
                </div>
                <div>
                  <label className={labelCls}>الحالة</label>
                  <select name="status" defaultValue={property?.status ?? 'متاح'} className={inputCls}>
                    <option value="متاح">متاح</option>
                    <option value="مباع">مباع</option>
                    <option value="مؤجر">مؤجر</option>
                    <option value="محجوز">محجوز</option>
                  </select>
                </div>
              </div>
              {/* Row 2: غرف + حمامات + مساحة */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>عدد الغرف</label>
                  <input name="beds" type="number" min="0" defaultValue={property?.beds ?? 0} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>عدد الحمامات</label>
                  <input name="baths" type="number" min="0" defaultValue={property?.baths ?? 0} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>المساحة</label>
                  <input name="area" defaultValue={property?.area ?? ''} placeholder="مثال: 450 م²" className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          {/* جدول التفاصيل */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Star size={15} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">جدول التفاصيل</p>
                <p className="text-gray-400 text-[11px]">يظهر كجدول في صفحة العقار — مثال: مساحة الأرض → 450 م²</p>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2 mb-4">
                {details.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={row.label}
                      onChange={(e) => updateDetail(i, 'label', e.target.value)}
                      placeholder="التسمية"
                      className={inputCls + ' flex-1'}
                    />
                    <input
                      value={row.value}
                      onChange={(e) => updateDetail(i, 'value', e.target.value)}
                      placeholder="القيمة"
                      className={inputCls + ' flex-1'}
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(i)}
                      className="w-10 shrink-0 rounded-xl border border-gray-200 text-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {details.length === 0 && (
                  <p className="text-gray-300 text-sm py-2">لا توجد تفاصيل — أضف صف</p>
                )}
              </div>
              <button
                type="button"
                onClick={addDetail}
                className="flex items-center gap-2 text-sm text-[#2D3864] border border-[#2D3864]/20 hover:bg-[#2D3864] hover:text-white px-4 py-2 rounded-xl transition-colors"
              >
                <Plus size={14} /> إضافة صف
              </button>
            </div>
          </div>

          {/* المميزات */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <Star size={15} className="text-purple-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">المميزات</p>
                <p className="text-gray-400 text-[11px]">ميزة واحدة في كل سطر</p>
              </div>
            </div>
            <div className="p-5">
              <textarea
                name="features_text"
                rows={5}
                defaultValue={(property?.features ?? []).join('\n')}
                className={inputCls + ' resize-none'}
                placeholder={'مسبح خاص\nحديقة\nموقف سيارات\nغرفة خادمة'}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT column (sidebar) ───────────────────────────────── */}
        <div className="space-y-5">

          {/* الصورة الرئيسية */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                <ImageIcon size={15} className="text-sky-500" />
              </div>
              <p className="font-bold text-gray-900 text-sm">الصورة الرئيسية</p>
            </div>
            <div className="p-4 space-y-3">
              {/* Preview */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                {imgUploading ? (
                  <div className="text-center text-[#2D3864] py-4">
                    <Loader2 size={28} className="mx-auto mb-1.5 animate-spin" />
                    <span className="text-xs">جاري الرفع...</span>
                  </div>
                ) : imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-300 py-4">
                    <ImageIcon size={28} className="mx-auto mb-1.5" />
                    <span className="text-xs">لا توجد صورة رئيسية</span>
                  </div>
                )}
              </div>

              <label
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium w-full ${
                  imgUploading
                    ? 'bg-gray-200 text-gray-400 cursor-wait'
                    : 'bg-[#2D3864] text-white hover:bg-[#1a2340] cursor-pointer'
                }`}
              >
                {imgUploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {imgUploading ? 'جاري الرفع...' : 'رفع صورة من الجهاز'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={imgUploading}
                  className="hidden"
                  onChange={(e) => { handleMainImage(e.target.files?.[0]); e.target.value = ''; }}
                />
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-300 text-xs">رابط</div>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imagePreview ?? ''}
                  onChange={(e) => setImagePreview(e.target.value || null)}
                  className={inputCls + ' pr-12'}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <Images size={15} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">معرض الصور</p>
                <p className="text-gray-400 text-[11px]">
                  {galleryUrls.length > 0
                    ? `${galleryUrls.length} صورة`
                    : 'لا توجد صور'}
                </p>
              </div>
            </div>
            <div className="p-4">
              <GalleryGrid
                urls={galleryUrls}
                uploading={galleryUploading}
                onRemove={removeGalleryItem}
                onAdd={handleGalleryAdd}
              />
              {galleryUrls.length === 0 && !galleryUploading && (
                <p className="text-xs text-gray-300 mt-3 text-center">
                  اضغط الزر لإضافة صور — تقدر تختار أكثر من صورة دفعة واحدة
                </p>
              )}
            </div>
          </div>

          {/* النشر */}
          <div className={cardCls}>
            <div className={cardHeadCls}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${published ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                {published
                  ? <Eye size={15} className="text-emerald-600" />
                  : <EyeOff size={15} className="text-gray-400" />
                }
              </div>
              <p className="font-bold text-gray-900 text-sm">النشر</p>
            </div>
            <div className="p-4">
              <button
                type="button"
                onClick={() => setPublished((v) => !v)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                  published
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Toggle */}
                <div className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${published ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${published ? 'left-5' : 'left-0.5'}`}
                  />
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${published ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {published ? 'منشور على الموقع' : 'مخفي عن الزوار'}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {published
                      ? 'يظهر للزوار في صفحة العروض'
                      : 'محفوظ لكنه غير مرئي'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Submit */}
          {(state.error || uploadError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {uploadError ?? state.error}
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={isPending || uploading}
              className="w-full flex items-center justify-center gap-2 bg-[#2D3864] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#1a2340] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm text-sm"
            >
              {isPending || uploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {uploading
                ? 'جاري رفع الصور...'
                : isPending
                  ? 'جاري الحفظ...'
                  : mode === 'create'
                    ? 'إضافة العقار'
                    : 'حفظ التعديلات'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              <ArrowRight size={15} />
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
