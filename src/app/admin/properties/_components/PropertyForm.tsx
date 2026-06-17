'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Upload, ImageIcon, Save, ArrowRight } from 'lucide-react';
import type { Property } from '@/lib/supabase';

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
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2D3864] transition-all bg-gray-50 text-sm';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';
const sectionCls = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';

export function PropertyForm({ action, property, mode }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
    success: false,
  });

  // Dynamic details rows
  const [details, setDetails] = useState<{ label: string; value: string }[]>(
    property?.details ?? []
  );

  // Gallery URLs
  const [galleryUrls, setGalleryUrls] = useState<string[]>(property?.gallery ?? []);

  // Main image preview
  const [imagePreview, setImagePreview] = useState<string | null>(property?.image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (state.success) {
      router.push('/admin/properties');
      router.refresh();
    }
  }, [state.success, router]);

  const addDetail = () => setDetails((d) => [...d, { label: '', value: '' }]);
  const removeDetail = (i: number) => setDetails((d) => d.filter((_, idx) => idx !== i));
  const updateDetail = (i: number, field: 'label' | 'value', val: string) =>
    setDetails((d) => d.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const addGalleryUrl = () => setGalleryUrls((u) => [...u, '']);
  const removeGalleryUrl = (i: number) => setGalleryUrls((u) => u.filter((_, idx) => idx !== i));
  const updateGalleryUrl = (i: number, val: string) =>
    setGalleryUrls((u) => u.map((url, idx) => (idx === i ? val : url)));

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields for complex state */}
      <input type="hidden" name="details_json" value={JSON.stringify(details)} />
      <input type="hidden" name="gallery_existing" value={JSON.stringify(galleryUrls.filter(Boolean))} />
      {/* image_url keeps existing URL when no new file is chosen */}
      <input type="hidden" name="image_url" value={imagePreview && !imageFile ? imagePreview : ''} />

      {/* ─── معلومات أساسية ─────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3">
          المعلومات الأساسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="md:col-span-2">
            <label className={labelCls}>
              عنوان العقار <span className="text-red-500">*</span>
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
            <label className={labelCls}>الموقع (المدينة، الحي)</label>
            <input
              name="location"
              defaultValue={property?.location ?? ''}
              placeholder="مثال: مكة المكرمة، العزيزية"
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
          <div className="md:col-span-2">
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

      {/* ─── التفاصيل ────────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3">
          التفاصيل
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>نوع العرض</label>
            <select name="type" defaultValue={property?.type ?? 'للبيع'} className={inputCls}>
              <option value="للبيع">للبيع</option>
              <option value="للإيجار">للإيجار</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>الفئة</label>
            <select name="category" defaultValue={property?.category ?? 'فلل'} className={inputCls}>
              <option value="فلل">فلل</option>
              <option value="شقق">شقق</option>
              <option value="أراضي">أراضي</option>
              <option value="مكاتب">مكاتب</option>
              <option value="تجاري">تجاري</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>الاستخدام</label>
            <select name="usage" defaultValue={property?.usage ?? 'سكني'} className={inputCls}>
              <option value="سكني">سكني</option>
              <option value="تجاري">تجاري</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>الحالة</label>
            <select name="status" defaultValue={property?.status ?? 'متاح'} className={inputCls}>
              <option value="متاح">متاح</option>
              <option value="مباع">مباع</option>
              <option value="مؤجر">مؤجر</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>عدد الغرف</label>
            <input
              name="beds"
              type="number"
              min="0"
              defaultValue={property?.beds ?? 0}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>عدد الحمامات</label>
            <input
              name="baths"
              type="number"
              min="0"
              defaultValue={property?.baths ?? 0}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>المساحة</label>
            <input
              name="area"
              defaultValue={property?.area ?? ''}
              placeholder="مثال: 450 م²"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* ─── الصورة الرئيسية ─────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3">
          الصورة الرئيسية
        </h2>
        <div className="flex gap-6 flex-col sm:flex-row items-start">
          {/* Preview */}
          <div className="w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-300">
                <ImageIcon size={32} className="mx-auto mb-1" />
                <span className="text-xs">لا توجد صورة</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <label className="flex items-center gap-2 bg-[#DEF4FC] text-[#2D3864] hover:bg-[#2D3864] hover:text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-medium text-sm w-fit">
              <Upload size={16} />
              رفع صورة من الجهاز
              <input
                type="file"
                name="image_file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
            <p className="text-gray-400 text-xs">أو أدخل رابط الصورة مباشرة:</p>
            <input
              type="url"
              placeholder="https://..."
              value={imagePreview && !imageFile ? imagePreview : ''}
              onChange={(e) => {
                setImageFile(null);
                setImagePreview(e.target.value || null);
              }}
              className={inputCls}
              dir="ltr"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
              >
                <X size={12} /> حذف الصورة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── معرض الصور ──────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3">
          معرض الصور
        </h2>
        <div className="space-y-2 mb-4">
          {galleryUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={url}
                onChange={(e) => updateGalleryUrl(i, e.target.value)}
                placeholder="https://..."
                className={inputCls}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => removeGalleryUrl(i)}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {galleryUrls.length === 0 && (
            <p className="text-gray-400 text-sm">لا توجد صور في المعرض حتى الآن</p>
          )}
        </div>
        <button
          type="button"
          onClick={addGalleryUrl}
          className="flex items-center gap-2 text-[#2D3864] bg-[#DEF4FC] hover:bg-[#2D3864] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> إضافة رابط صورة
        </button>
        <p className="text-gray-400 text-xs mt-3">
          ارفع الصور عبر لوحة Supabase Storage، ثم الصق الروابط هنا
        </p>
      </div>

      {/* ─── جدول التفاصيل الرسمي ────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-2 text-base border-b border-gray-100 pb-3">
          جدول التفاصيل الرسمي
        </h2>
        <p className="text-gray-400 text-xs mb-5">
          يظهر كجدول في صفحة العقار — مثال: مساحة الأرض → 450 م²
        </p>
        <div className="space-y-2 mb-4">
          {details.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.label}
                onChange={(e) => updateDetail(i, 'label', e.target.value)}
                placeholder="التسمية (مثال: مساحة الأرض)"
                className={inputCls + ' flex-1'}
              />
              <input
                value={row.value}
                onChange={(e) => updateDetail(i, 'value', e.target.value)}
                placeholder="القيمة (مثال: 450 م²)"
                className={inputCls + ' flex-1'}
              />
              <button
                type="button"
                onClick={() => removeDetail(i)}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {details.length === 0 && (
            <p className="text-gray-400 text-sm">لا توجد تفاصيل مضافة بعد</p>
          )}
        </div>
        <button
          type="button"
          onClick={addDetail}
          className="flex items-center gap-2 text-[#2D3864] bg-[#DEF4FC] hover:bg-[#2D3864] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> إضافة صف
        </button>
      </div>

      {/* ─── المميزات ────────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-2 text-base border-b border-gray-100 pb-3">
          المميزات
        </h2>
        <p className="text-gray-400 text-xs mb-4">ميزة واحدة في كل سطر</p>
        <textarea
          name="features_text"
          rows={5}
          defaultValue={(property?.features ?? []).join('\n')}
          className={inputCls + ' resize-none'}
          placeholder={'مسبح خاص\nحديقة\nموقف سيارات\nغرفة خادمة'}
        />
      </div>

      {/* ─── النشر ───────────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className="font-bold text-[#2D3864] mb-5 text-base border-b border-gray-100 pb-3">
          النشر
        </h2>
        <PublishToggle defaultValue={property?.is_published ?? false} />
      </div>

      {/* ─── Errors & Submit ─────────────────────────────────────────── */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-3 pb-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-[#2D3864] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3e4a7a] transition-colors disabled:opacity-60 shadow-sm"
        >
          <Save size={18} />
          {isPending ? 'جاري الحفظ...' : mode === 'create' ? 'إضافة العقار' : 'حفظ التعديلات'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <ArrowRight size={18} />
          إلغاء
        </button>
      </div>
    </form>
  );
}

function PublishToggle({ defaultValue }: { defaultValue: boolean }) {
  const [published, setPublished] = useState(defaultValue);
  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name="is_published" value={published ? 'true' : 'false'} />
      <button
        type="button"
        onClick={() => setPublished((v) => !v)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          published ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
            published ? 'left-6' : 'left-0.5'
          }`}
        />
      </button>
      <div>
        <p className="font-semibold text-sm text-gray-900">
          {published ? 'منشور على الموقع' : 'مخفي عن الزوار'}
        </p>
        <p className="text-gray-400 text-xs">
          {published
            ? 'يظهر العقار في صفحة العروض للزوار'
            : 'العقار محفوظ لكنه غير مرئي للزوار'}
        </p>
      </div>
    </div>
  );
}
