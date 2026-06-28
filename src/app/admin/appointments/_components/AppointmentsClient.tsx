'use client';

import { useState, useMemo, useEffect, useActionState, useTransition, useCallback } from 'react';
import type { Appointment, Property } from '@/lib/supabase';
import {
  upsertAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/lib/admin-actions';
import {
  Plus,
  Search,
  CalendarClock,
  Trash2,
  CheckCircle2,
  XCircle,
  Pencil,
  X,
  User,
  Phone,
  Building2,
  Calendar,
  Clock,
  StickyNote,
  CalendarX,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'الكل' | 'مجدول' | 'مكتمل' | 'ملغي';

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  مجدول: { bg: 'bg-amber-50', text: 'text-amber-700' },
  مكتمل: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  ملغي:  { bg: 'bg-red-50',    text: 'text-red-600'    },
};

// ── Appointment Modal ─────────────────────────────────────────────────────────
function AppointmentModal({
  open,
  onClose,
  editing,
  properties,
}: {
  open: boolean;
  onClose: () => void;
  editing: Appointment | null;
  properties: Pick<Property, 'id' | 'title'>[];
}) {
  const [state, action, isPending] = useActionState(upsertAppointment, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" dir="rtl">
        {/* Header */}
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

        {/* Form */}
        <form action={action} className="px-6 py-5 space-y-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-2 gap-3">
            {/* Client Name */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <User size={11} />
                اسم العميل <span className="text-red-400">*</span>
              </label>
              <input
                name="client_name"
                required
                defaultValue={editing?.client_name ?? ''}
                placeholder="محمد عبدالله"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
              />
            </div>

            {/* Client Phone */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Phone size={11} />
                رقم الجوال <span className="text-red-400">*</span>
              </label>
              <input
                name="client_phone"
                required
                dir="ltr"
                defaultValue={editing?.client_phone ?? ''}
                placeholder="05xxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
              />
            </div>

            {/* Property */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Building2 size={11} />
                العقار (اختياري)
              </label>
              <select
                name="property_id"
                defaultValue={editing?.property_id ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
              >
                <option value="">— اختر عقاراً (اختياري) —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Calendar size={11} />
                تاريخ الموعد <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="appointment_date"
                required
                defaultValue={editing?.appointment_date ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Clock size={11} />
                الوقت (اختياري)
              </label>
              <input
                type="time"
                name="appointment_time"
                defaultValue={editing?.appointment_time?.slice(0, 5) ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <StickyNote size={11} />
                ملاحظات (اختياري)
              </label>
              <textarea
                name="notes"
                rows={2}
                defaultValue={editing?.notes ?? ''}
                placeholder="أي ملاحظات عن الموعد أو العميل..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all resize-none"
              />
            </div>
          </div>

          {state.error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-[#2D3864] text-white text-sm rounded-xl hover:bg-[#1e2a4a] disabled:opacity-60 transition-colors flex items-center gap-2"
            >
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

// ── Main Client Component ─────────────────────────────────────────────────────
export function AppointmentsClient({
  appointments,
  properties,
}: {
  appointments: Appointment[];
  properties: Pick<Property, 'id' | 'title'>[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];
  const tabs: Tab[] = ['الكل', 'مجدول', 'مكتمل', 'ملغي'];

  const tabCounts = useMemo(
    () => ({
      الكل: appointments.length,
      مجدول: appointments.filter((a) => a.status === 'مجدول').length,
      مكتمل: appointments.filter((a) => a.status === 'مكتمل').length,
      ملغي: appointments.filter((a) => a.status === 'ملغي').length,
    }),
    [appointments],
  );

  const filtered = useMemo(() => {
    let list = appointments;
    if (activeTab !== 'الكل') list = list.filter((a) => a.status === activeTab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.client_name.toLowerCase().includes(q) ||
          a.client_phone.includes(q) ||
          (a.property_title ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [appointments, activeTab, search]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(appt: Appointment) {
    setEditing(appt);
    setModalOpen(true);
  }

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarClock size={22} className="text-[#C9A84C]" />
            المواعيد
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{appointments.length} موعد إجمالاً</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#2D3864] text-white text-sm px-4 py-2.5 rounded-xl hover:bg-[#1e2a4a] transition-colors"
        >
          <Plus size={16} />
          موعد جديد
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        {/* Status Tabs */}
        <div className="flex border-b border-gray-100 px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#2D3864] text-[#2D3864]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 tabular-nums ${
                  activeTab === tab ? 'bg-[#2D3864] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم العميل أو رقم جواله..."
              className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <CalendarX size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">لا توجد مواعيد{activeTab !== 'الكل' ? ` بحالة "${activeTab}"` : ''}</p>
          {activeTab === 'الكل' && appointments.length === 0 && (
            <button
              onClick={openAdd}
              className="mt-4 text-sm text-[#2D3864] hover:underline"
            >
              إضافة أول موعد
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                    التاريخ والوقت
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                    العميل
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 hidden md:table-cell">
                    العقار
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                    الحالة
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((appt) => {
                  const style = STATUS_STYLE[appt.status] ?? STATUS_STYLE['مجدول'];
                  const isToday = appt.appointment_date === today;
                  const isPast = appt.appointment_date < today && appt.status === 'مجدول';
                  const d = new Date(appt.appointment_date + 'T12:00:00');

                  return (
                    <tr
                      key={appt.id}
                      className={`hover:bg-gray-50/60 transition-colors ${isPast ? 'opacity-70' : ''}`}
                    >
                      {/* Date/Time */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-center ${
                              isToday
                                ? 'bg-[#C9A84C] text-[#2D3864]'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span className="text-[9px] font-semibold leading-none">
                              {d.toLocaleDateString('ar-SA', { month: 'short' })}
                            </span>
                            <span className="text-sm font-black leading-tight">{d.getDate()}</span>
                          </div>
                          <div>
                            {isToday && (
                              <span className="text-[10px] text-amber-600 font-bold block">
                                اليوم
                              </span>
                            )}
                            {isPast && (
                              <span className="text-[10px] text-red-400 font-medium block">
                                متأخر
                              </span>
                            )}
                            {appt.appointment_time && (
                              <p
                                className="text-gray-400 text-xs flex items-center gap-1"
                                dir="ltr"
                              >
                                <Clock size={10} />
                                {appt.appointment_time.slice(0, 5)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{appt.client_name}</p>
                        <a
                          href={`tel:${appt.client_phone}`}
                          className="text-gray-400 text-xs hover:text-[#2D3864] transition-colors"
                          dir="ltr"
                        >
                          {appt.client_phone}
                        </a>
                        {appt.notes && (
                          <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[180px]" title={appt.notes}>
                            {appt.notes}
                          </p>
                        )}
                      </td>

                      {/* Property */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {appt.property_title ? (
                          <span className="text-gray-600 text-xs">{appt.property_title}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`${style.bg} ${style.text} text-xs font-medium px-2.5 py-1 rounded-full`}
                        >
                          {appt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        {deletingId === appt.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-red-600 font-medium">حذف؟</span>
                            <button
                              onClick={() =>
                                startTransition(async () => {
                                  await deleteAppointment(appt.id);
                                  setDeletingId(null);
                                })
                              }
                              disabled={isPending}
                              className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
                            >
                              نعم
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              لا
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {/* Edit */}
                            <button
                              onClick={() => openEdit(appt)}
                              title="تعديل"
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#2D3864] hover:text-white text-gray-500 flex items-center justify-center transition-colors"
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Mark done */}
                            {appt.status === 'مجدول' && (
                              <button
                                onClick={() =>
                                  startTransition(async () => {
                                    await updateAppointmentStatus(appt.id, 'مكتمل');
                                  })
                                }
                                disabled={isPending}
                                title="تم الموعد"
                                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 flex items-center justify-center transition-colors disabled:opacity-60"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}

                            {/* Cancel */}
                            {appt.status === 'مجدول' && (
                              <button
                                onClick={() =>
                                  startTransition(async () => {
                                    await updateAppointmentStatus(appt.id, 'ملغي');
                                  })
                                }
                                disabled={isPending}
                                title="إلغاء الموعد"
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-400 flex items-center justify-center transition-colors disabled:opacity-60"
                              >
                                <XCircle size={14} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => setDeletingId(appt.id)}
                              title="حذف"
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white text-gray-400 flex items-center justify-center transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <AppointmentModal
        open={modalOpen}
        onClose={closeModal}
        editing={editing}
        properties={properties}
      />
    </div>
  );
}
