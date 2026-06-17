# مشروع "الإنجاز للعقار" — دليل المتابعة

> هذا الملف هو المرجع الرئيسي لمتابعة المشروع. اقرأه أولاً قبل أي عمل.
> آخر تحديث: 2026-06-17

---

## 1. ملخص المشروع

موقع عقاري للعميل **"الإنجاز للعقار"** (مكتب عقاري في مكة المكرمة) لعرض العقارات للبيع والإيجار، مع لوحة تحكم (Admin) ليدير العميل المحتوى بنفسه بدون تعديل الكود.

- **اللغة:** عربي (RTL)
- **الهوية:** كحلي `#2D3864` (navy) + أزرق فاتح `#DEF4FC` + ذهبي `#C9A84C` (gold)
- **الخط:** Almarai (أساسي) + Tajawal (احتياطي)

### روابط مهمة
| الشيء | الرابط |
|---|---|
| الموقع المباشر | https://alenjaz-real-estate.vercel.app |
| GitHub | https://github.com/Gen070/alenjaz-real-estate |
| Supabase Project | https://supabase.com/dashboard/project/ezjzevoarbdjacrpnucx |
| Vercel Dashboard | https://vercel.com/gen070s-projects/alenjaz-real-estate |

### بيانات التواصل للعميل (الحقيقية)
- جوال: `0544666760` / `0507007604` / `05550330103`
- واتساب: `966544666760`
- الموقع: مكة المكرمة

---

## 2. التقنيات (Tech Stack)

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict, Turbopack)
- **UI:** Tailwind CSS v4 + shadcn/ui + Framer Motion + Lucide icons
- **قاعدة البيانات:** Supabase (PostgreSQL + Storage + RLS)
- **الاستضافة:** Vercel (نشر تلقائي من فرع `main`)
- **مكتبة Supabase:** `@supabase/supabase-js`

### أوامر مهمة
```bash
npm run dev        # تشغيل محلي على localhost:3000
npm run build      # بناء إنتاج
npx tsc --noEmit   # فحص الأنواع
```

---

## 3. ما تم بناؤه حتى الآن ✅

### الواجهة (الصفحة الرئيسية `/`)
ترتيب الأقسام: `Header → Hero → Services → Features(العروض) → Cities → ContactForm → Contact(خريطة) → Footer`
- **Header** — شريط علوي (وقت/تاريخ/موقع) + قائمة + **قائمة هامبرغر للجوال**
- **Hero** — خلفية متحركة (slideshow) + مربع عروض تفاعلي
- **Services** — 3 خدمات (إدارة أملاك، تسويق، بيع وشراء)
- **Features** — شبكة العروض مع فلاتر بالفئة
- **Cities** — الرياض/جدة/المدينة
- **ContactForm** — نموذج "أرسل طلب" (يحفظ في جدول `messages`)
- **Contact** — خريطة مكة + أرقام التواصل الصحيحة
- **Footer** — روابط + أرقام + أيقونات تراخيص (FAL/معروف/SBC — حالياً بدون روابط)

### الصفحات الأخرى
- `/properties` — كل العقارات مع فلاتر (مدينة، حي، نوع، تصنيف، بحث، ترتيب)
- `/property/[id]` — تفاصيل العقار (server-rendered من DB) + جدول التفاصيل الرسمي + أزرار واتساب/اتصال

### قاعدة البيانات والربط
- تم إنشاء 3 جداول في Supabase (انظر القسم 5)
- تم إدخال 8 عقارات تجريبية + إعدادات أولية
- **الموقع يجلب من Supabase** عبر `src/lib/queries.ts`
- نموذج الرسائل يحفظ في DB (تم اختباره ✅)

### البنية التحتية
- الكود على GitHub، النشر التلقائي على Vercel يعمل
- متغيرات البيئة مضافة في Vercel (URL + Anon key)

---

## 4. المهام القادمة 🎯

### المهمة الكبرى التالية: لوحة الأدمن `/admin`
صفحة محمية بكلمة سر، تدير:
- 🏠 **العقارات** — إضافة/تعديل/حذف + رفع صور + تعديل جدول التفاصيل المرن (`details`)
- 📨 **الرسائل** — عرض رسائل العملاء الواردة + وضع علامة مقروء/حذف
- 📞 **الإعدادات** — تعديل أرقام التواصل والنصوص العامة (`site_settings`)
- 🏷️ **التراخيص** — إضافة/تعديل روابط وصور التراخيص بدون كود

> ملاحظة معمارية: عمليات الأدمن (كتابة/تعديل/حذف) يجب أن تتم **من جهة الخادم بالمفتاح السري** (Secret Key) لتجاوز RLS بأمان — لا تُكشف الكتابة للمتصفح.

### تعديلات مؤجلة (متفق عليها)
1. **تعبئة `details`** للعقارات (حالياً فاضي → جدول التفاصيل مخفي) — يُعبّأ من الأدمن
2. **أيقونات التراخيص** — تتدار من الأدمن (روابط/صور)
3. **أرقام الجوال ونص واتساب "دعم فني/مبيعات"** — تعديلها (مؤجل بطلب العميل)
4. **قسم "من نحن"** — غير موجود، يُضاف لو طُلب

---

## 5. هيكل قاعدة البيانات (Supabase)

**Project ID:** `ezjzevoarbdjacrpnucx`
**URL:** `https://ezjzevoarbdjacrpnucx.supabase.co`
**المفاتيح:** في `.env.local` محلياً + Vercel Environment Variables (الـ Anon/Publishable key عام وآمن؛ الـ Secret key لا يُرفع أبداً)

### جدول `properties`
| العمود | النوع | ملاحظة |
|---|---|---|
| id | bigint identity | PK |
| property_code | text | رقم العقار المعروض (AG-0001) |
| title | text | not null |
| description | text | |
| location | text | "المدينة، الحي" |
| price | text | نص (يشمل "ريال") |
| type | text | للبيع / للإيجار |
| category | text | فلل/شقق/أراضي/مكاتب/تجاري |
| usage | text | تجاري / سكني |
| beds, baths | int | |
| area | text | "450 م²" |
| image | text | الصورة الرئيسية |
| gallery | jsonb | مصفوفة روابط صور |
| features | jsonb | مصفوفة مميزات |
| details | jsonb | **مرن** — مصفوفة `{label, value}` للجدول الرسمي |
| status | text | متاح/مباع/مؤجر (افتراضي: متاح) |
| is_published | bool | الزوار يشوفون المنشور فقط |
| created_at, updated_at | timestamptz | |

### جدول `messages` (رسائل نموذج الطلب)
`id, name, phone, request_type, details, is_read (bool), created_at`

### جدول `site_settings` (key/value)
المفاتيح الحالية: `phone_1, phone_2, phone_3, whatsapp, location_text`

### الحماية (RLS) — مفعّلة على الجداول الثلاثة
- `properties`: الزوار SELECT للمنشور فقط (`is_published = true`)
- `site_settings`: الزوار SELECT للكل
- `messages`: الزوار INSERT فقط (لا قراءة)
- **الأدمن:** يعمل server-side بالمفتاح السري (يتجاوز RLS)

---

## 6. ملفات مفتاحية في الكود

| الملف | الدور |
|---|---|
| `src/lib/supabase.ts` | إنشاء client + أنواع `Property`, `SiteSetting` |
| `src/lib/queries.ts` | دوال الجلب: `getProperties`, `getPropertyById`, `getSiteSettings`, `submitMessage` |
| `src/app/page.tsx` | الصفحة الرئيسية |
| `src/app/properties/page.tsx` | صفحة العروض |
| `src/app/property/[id]/page.tsx` | تفاصيل العقار |
| `src/components/landing/*` | كل أقسام الصفحة الرئيسية |
| `src/app/globals.css` | متغيرات الألوان (navy/gold/lightblue) والخط |
| `.env.local` | مفاتيح Supabase (غير مرفوع — محمي بـ gitignore) |

---

## 7. ملاحظات للمتابعة

- **التعديل بعد الرفع:** بيانات (عقارات/أرقام) → من الأدمن فوراً. تصميم/ميزات → تعديل كود ثم `git push` (Vercel ينشر تلقائياً).
- **تحذيرات البناء** (`node >=24`, `node-domexception deprecated`) غير مؤثرة — تُتجاهل.
- يوجد عقار اختبار + رسالة اختبار في DB أُضيفت أثناء الفحص — تُحذف من الأدمن لاحقاً.
- العميل (Gen070) يفضّل تقسيم العمل على جلسات لتقليل استهلاك tokens، وينفّذ خطوات GitHub/Vercel/Supabase بنفسه بإرشاد خطوة بخطوة.
- **لا تطلب من العميل إرسال المفتاح السري أو كلمات السر في الشات.**

---

@AGENTS.md
