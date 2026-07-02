'use client';

import {
  useState,
  useMemo,
  useEffect,
  useActionState,
  useTransition,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import type { Appointment, Property } from '@/lib/supabase';
import {
  upsertAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/lib/admin-actions';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Phone,
  Building2,
  Calendar,
  Clock,
  StickyNote,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  CalendarClock,
  Search,
  AlertTriangle,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS_AR = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر',
];
const DAYS_SHORT = ['أحد','إثن','ثلا','أرب','خمس','جمع','سبت'];
const DAYS_FULL  = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

const STATUS_DOT: Record<string, string> = {
  مجدول: 'bg-amber-400',
  مكتمل: 'bg-emerald-500',
  ملغي:  'bg-red-400',
};
const STATUS_CHIP: Record<string, string> = {
  مجدول: 'bg-amber-100 text-amber-800',
  مكتمل: 'bg-emerald-100 text-emerald-800',
  ملغي:  'bg-red-100 text-red-700',
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isOverdue(appt: Appointment, today: string) {
  return appt.status === 'مجدول' && appt.appointment_date < today;
}

// ── Build calendar cells ──────────────────────────────────────────────────────
function buildCells(year: number, month: number) {
  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow    = firstDay.getDay(); // 0=Sun

  const cells: Array<{ day: number | null; dateStr: string | null }> = [];

  for (let i = 0; i < startDow; i++) cells.push({ day: null, dateStr: null });

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr });
  }

  while (cells.length % 7 !== 0) cells.push({ day: null, dateStr: null });

  return cells;
}

// ── Appointment modal ─────────────────────────────────────────────────────────
function AppointmentModal({
  onClose,
  editing,
  properties,
  defaultDate,
}: {
  onClose: () => void;
  editing: Appointment | null;
  properties: Pick<Property, 'id' | 'title'>[];
  defaultDate: string;
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(upsertAppointment, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose();
    }
  }, [state.success, onClose, router]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" dir="rtl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <CalendarClock size={18} className="text-[#C9A84C]" />
            {editing ? 'تعديل الموعد' : 'موعد جديد'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form action={action} className="px-6 py-5 space-y-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <User size={11} />اسم العميل <span className="text-red-400">*</span>
              </label>
              <input name="client_name" required defaultValue={editing?.client_name ?? ''}
                placeholder="محمد عبدالله"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Phone size={11} />رقم الجوال <span className="text-red-400">*</span>
              </label>
              <input name="client_phone" required dir="ltr" defaultValue={editing?.client_phone ?? ''}
                placeholder="05xxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Building2 size={11} />العقار (اختياري)
              </label>
              <select name="property_id" defaultValue={editing?.property_id ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all">
                <option value="">— اختر عقاراً (اختياري) —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Calendar size={11} />تاريخ الموعد <span className="text-red-400">*</span>
              </label>
              <input type="date" name="appointment_date" required
                defaultValue={editing?.appointment_date ?? defaultDate}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Clock size={11} />الوقت (اختياري)
              </label>
              <input type="time" name="appointment_time"
                defaultValue={editing?.appointment_time?.slice(0, 5) ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <StickyNote size={11} />ملاحظات (اختياري)
              </label>
              <textarea name="notes" rows={2} defaultValue={editing?.notes ?? ''}
                placeholder="أي ملاحظات عن الموعد أو العميل..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all resize-none" />
            </div>
          </div>

          {state.error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              إلغاء
            </button>
            <button type="submit" disabled={isPending}
              className="px-5 py-2 bg-[#2D3864] text-white text-sm rounded-xl hover:bg-[#1e2a4a] disabled:opacity-60 transition-colors flex items-center gap-2">
              {isPending && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {editing ? 'حفظ التعديلات' : 'إضافة الموعد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Appointment card in side panel ────────────────────────────────────────────
function ApptCard({
  appt,
  onEdit,
  onDeleted,
  onStatusChange,
  today,
}: {
  appt: Appointment;
  onEdit: (a: Appointment) => void;
  onDeleted: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  today: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const overdue = isOverdue(appt, today);

  return (
    <div className="p-3.5 hover:bg-gray-50/60 transition-colors">
      <div className="flex items-start gap-2.5">
        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${STATUS_DOT[appt.status] ?? 'bg-gray-300'}`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{appt.client_name}</p>
          <a href={`tel:${appt.client_phone}`} className="text-gray-400 text-xs hover:text-[#2D3864] transition-colors" dir="ltr">
            {appt.client_phone}
          </a>
          {appt.appointment_time && (
            <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
              <Clock size={10} />{appt.appointment_time.slice(0, 5)}
            </p>
          )}
          {appt.property_title && (
            <p className="text-gray-400 text-xs mt-0.5 truncate">{appt.property_title}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_CHIP[appt.status] ?? ''}`}>
              {appt.status}
            </span>
            {overdue && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                <AlertTriangle size={9} />متأخر
              </span>
            )}
          </div>
        </div>
        <button onClick={() => onEdit(appt)}
          className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-[#2D3864] hover:text-white text-gray-400 flex items-center justify-center transition-colors shrink-0 mt-0.5">
          <Pencil size={11} />
        </button>
      </div>

      {/* Actions */}
      {appt.status === 'مجدول' && !confirmDelete && (
        <div className="flex gap-1.5 mt-2.5 pr-5">
          <button onClick={() => startTransition(async () => {
              onStatusChange(appt.id, 'مكتمل');
              await updateAppointmentStatus(appt.id, 'مكتمل');
            })}
            disabled={isPending}
            className="flex-1 text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white py-1.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} />تم
          </button>
          <button onClick={() => startTransition(async () => {
              onStatusChange(appt.id, 'ملغي');
              await updateAppointmentStatus(appt.id, 'ملغي');
            })}
            disabled={isPending}
            className="flex-1 text-xs bg-red-50 text-red-500 hover:bg-red-500 hover:text-white py-1.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-1">
            <XCircle size={12} />إلغاء
          </button>
          <button onClick={() => setConfirmDelete(true)}
            className="w-8 text-xs bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 py-1.5 rounded-lg transition-colors flex items-center justify-center">
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="flex items-center gap-1.5 mt-2.5 pr-5">
          <span className="text-xs text-red-600 font-medium flex-1">حذف الموعد نهائياً؟</span>
          <button onClick={() => { startTransition(async () => { await deleteAppointment(appt.id); onDeleted(appt.id); }); }}
            disabled={isPending}
            className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors">نعم</button>
          <button onClick={() => setConfirmDelete(false)}
            className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-colors">لا</button>
        </div>
      )}
    </div>
  );
}

// ── Main calendar component ───────────────────────────────────────────────────
export function AppointmentsClient({
  appointments,
  properties,
}: {
  appointments: Appointment[];
  properties: Pick<Property, 'id' | 'title'>[];
}) {
  const today         = todayStr();
  const now           = new Date();
  const [curDate, setCurDate]       = useState(now);
  const [selDate, setSelDate]       = useState(today);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Appointment | null>(null);
  const [modalKey, setModalKey]     = useState(0);
  const [localAppts, setLocalAppts] = useState<Appointment[]>(appointments);
  const [query, setQuery]           = useState('');
  const [statusFilter, setStatusFilter] = useState<'الكل' | 'مجدول' | 'مكتمل' | 'ملغي'>('الكل');

  // يُعاد ضبط القائمة المحلية عند وصول بيانات جديدة من الخادم (بعد revalidate/refresh)
  useEffect(() => {
    setLocalAppts(appointments);
  }, [appointments]);

  const year  = curDate.getFullYear();
  const month = curDate.getMonth();

  const cells = useMemo(() => buildCells(year, month), [year, month]);

  const byDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    localAppts
      .filter((a) => statusFilter === 'الكل' || a.status === statusFilter)
      .forEach((a) => {
        (map[a.appointment_date] ??= []).push(a);
      });
    return map;
  }, [localAppts, statusFilter]);

  const selAppts = byDate[selDate] ?? [];

  const counts = useMemo(() => {
    const c = { الكل: localAppts.length, مجدول: 0, مكتمل: 0, ملغي: 0 };
    localAppts.forEach((a) => {
      if (a.status === 'مجدول') c.مجدول++;
      else if (a.status === 'مكتمل') c.مكتمل++;
      else if (a.status === 'ملغي') c.ملغي++;
    });
    return c;
  }, [localAppts]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return localAppts
      .filter((a) => statusFilter === 'الكل' || a.status === statusFilter)
      .filter((a) => a.client_name.toLowerCase().includes(q) || a.client_phone.includes(q))
      .sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));
  }, [query, statusFilter, localAppts]);

  function prevMonth() { setCurDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurDate(new Date(year, month + 1, 1)); }
  function goToday()   { setCurDate(now); setSelDate(today); }

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, []);

  function openAdd(date?: string) {
    if (date) setSelDate(date);
    setEditing(null);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }

  function openEdit(appt: Appointment) {
    setEditing(appt);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }

  function handleDeleted(id: number) {
    setLocalAppts((prev) => prev.filter((a) => a.id !== id));
  }

  function handleStatusChange(id: number, status: string) {
    setLocalAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const selDayDate = new Date(selDate + 'T12:00:00');

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col p-6 gap-0" dir="rtl">
      {/* ─ Header ─ */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={22} className="text-[#C9A84C]" />
            التقويم
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{localAppts.length} موعد مسجّل</p>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو رقم الجوال..."
              className="w-full border border-gray-200 rounded-xl pr-9 pl-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
            />
          </div>
        </div>

        <button
          onClick={() => openAdd(selDate)}
          className="flex items-center gap-2 bg-[#2D3864] text-white text-sm px-4 py-2.5 rounded-xl hover:bg-[#1e2a4a] transition-colors shrink-0"
        >
          <Plus size={16} />موعد جديد
        </button>
      </div>

      {/* ─ Status filter chips ─ */}
      <div className="flex items-center gap-2 mb-5">
        {(['الكل', 'مجدول', 'مكتمل', 'ملغي'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? 'bg-[#2D3864] text-white border-[#2D3864]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#2D3864]/30'
            }`}
          >
            {s} <span className="opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* ─ Body ─ */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Side panel (RIGHT in RTL) */}
        <div className="w-72 shrink-0 flex flex-col gap-4">
          {/* Selected day info — hidden while searching */}
          {!searchResults && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">
                    {DAYS_FULL[selDayDate.getDay()]}
                  </p>
                  <p className="text-4xl font-black text-[#2D3864] leading-none">
                    {selDayDate.getDate()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {MONTHS_AR[selDayDate.getMonth()]} {selDayDate.getFullYear()}
                  </p>
                  {selDate === today && (
                    <span className="inline-block mt-2 text-xs bg-[#C9A84C] text-[#2D3864] font-bold px-2.5 py-0.5 rounded-full">
                      اليوم
                    </span>
                  )}
                </div>
                <button
                  onClick={() => openAdd(selDate)}
                  className="w-10 h-10 rounded-xl bg-[#2D3864] text-white flex items-center justify-center hover:bg-[#1e2a4a] transition-colors shadow-sm"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Appointments for selected day, or search results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 shrink-0">
              <h3 className="text-sm font-bold text-gray-900">
                {searchResults ? 'نتائج البحث' : 'المواعيد'}
                {(searchResults ?? selAppts).length > 0 && (
                  <span className="mr-2 text-xs bg-[#2D3864] text-white px-1.5 py-0.5 rounded-full">
                    {(searchResults ?? selAppts).length}
                  </span>
                )}
              </h3>
            </div>

            {(searchResults ?? selAppts).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <CalendarClock size={28} className="opacity-25 mb-2" />
                <p className="text-sm">لا توجد مواعيد</p>
                {!searchResults && (
                  <button
                    onClick={() => openAdd(selDate)}
                    className="mt-2 text-xs text-[#2D3864] hover:underline"
                  >
                    إضافة موعد
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {(searchResults ?? selAppts).map((appt) => (
                  <ApptCard
                    key={appt.id}
                    appt={appt}
                    today={today}
                    onEdit={openEdit}
                    onDeleted={handleDeleted}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Calendar grid (LEFT in RTL) */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-h-0">
          {/* Month navigation */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <button onClick={prevMonth}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
              <ChevronRight size={18} />
            </button>

            <div className="flex items-center gap-3">
              <h2 className="font-bold text-gray-900 text-lg">
                {MONTHS_AR[month]} {year}
              </h2>
              {(year !== now.getFullYear() || month !== now.getMonth()) && (
                <button onClick={goToday}
                  className="text-xs text-[#2D3864] border border-[#2D3864]/25 px-3 py-1 rounded-lg hover:bg-[#2D3864]/5 transition-colors">
                  اليوم
                </button>
              )}
            </div>

            <button onClick={nextMonth}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 shrink-0">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-400 tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Cells — gap-px trick creates 1px grid lines */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 flex-1 overflow-y-auto">
            {cells.map((cell, i) => {
              if (!cell.day || !cell.dateStr) {
                return <div key={i} className="bg-white/60" />;
              }

              const isToday   = cell.dateStr === today;
              const isSel     = cell.dateStr === selDate;
              const dayAppts  = byDate[cell.dateStr] ?? [];

              return (
                <div
                  key={i}
                  onClick={() => setSelDate(cell.dateStr!)}
                  className={`bg-white p-2 cursor-pointer transition-colors min-h-[80px] ${
                    isSel ? 'ring-2 ring-inset ring-[#2D3864]/30 bg-[#2D3864]/[0.03]' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Day number */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1 transition-colors ${
                      isToday
                        ? 'bg-[#C9A84C] text-[#2D3864]'
                        : isSel
                          ? 'bg-[#2D3864] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cell.day}
                  </div>

                  {/* Appointment chips */}
                  <div className="space-y-0.5">
                    {dayAppts.slice(0, 2).map((appt) => (
                      <div
                        key={appt.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium truncate leading-tight ${STATUS_CHIP[appt.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {appt.appointment_time ? appt.appointment_time.slice(0, 5) + ' ' : ''}
                        {appt.client_name}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <p className="text-[10px] text-gray-400 px-1">
                        +{dayAppts.length - 2} أخرى
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4 shrink-0">
            {Object.entries(STATUS_DOT).map(([status, cls]) => (
              <div key={status} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className={`w-2 h-2 rounded-full ${cls}`} />
                {status}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <AppointmentModal
          key={modalKey}
          onClose={closeModal}
          editing={editing}
          properties={properties}
          defaultDate={selDate}
        />
      )}
    </div>
  );
}
