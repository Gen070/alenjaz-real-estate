import Link from 'next/link';
import {
  Building2,
  MessageSquare,
  CalendarDays,
  Plus,
  ArrowLeft,
  Eye,
  Inbox,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import type { Message, Appointment } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminDashboard() {
  const admin = createAdminClient();
  // خوادم Vercel تعمل بتوقيت UTC دائماً — يجب حساب "اليوم" بتوقيت الرياض صراحةً
  // وإلا فإن "اليوم" يتغيّر بفارق ساعات عن اليوم الفعلي في السعودية (خصوصاً بين ٠٠:٠٠–٠٣:٠٠ بتوقيت الرياض).
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date());

  const [
    { count: totalProps },
    { count: publishedProps },
    { data: statusRows },
    { count: unreadMsgs },
    { count: totalMsgs },
    { count: todayAppts },
    { count: totalAppts },
    { count: totalClients },
    { data: recentMsgs },
    { data: upcomingAppts },
  ] = await Promise.all([
    admin.from('properties').select('*', { count: 'exact', head: true }),
    admin.from('properties').select('*', { count: 'exact', head: true }).eq('is_published', true),
    admin.from('properties').select('status'),
    admin.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    admin.from('messages').select('*', { count: 'exact', head: true }),
    admin.from('appointments').select('*', { count: 'exact', head: true })
      .eq('appointment_date', today).eq('status', 'مجدول'),
    admin.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'مجدول'),
    admin.from('clients').select('*', { count: 'exact', head: true }),
    admin.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
    admin.from('appointments').select('*').eq('status', 'مجدول')
      .gte('appointment_date', today).order('appointment_date').order('appointment_time').limit(4),
  ]);

  const statuses = (statusRows ?? []).map((r: { status: string }) => r.status);
  const total         = totalProps  ?? 0;
  const availableCount = statuses.filter((s) => s === 'متاح').length;
  const soldCount      = statuses.filter((s) => s === 'مباع').length;
  const rentedCount    = statuses.filter((s) => s === 'مؤجر').length;

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="p-8">

      {/* ── Welcome ──────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-400 text-sm mt-0.5">مرحباً — الإنجاز للعقار · مكة المكرمة</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/clients"
            className="flex items-center gap-1.5 border border-[#2D3864]/25 text-[#2D3864] text-sm px-4 py-2 rounded-xl hover:bg-[#2D3864] hover:text-white transition-colors"
          >
            <Plus size={14} />عميل جديد
          </Link>
          <Link
            href="/admin/appointments"
            className="flex items-center gap-1.5 border border-[#2D3864]/25 text-[#2D3864] text-sm px-4 py-2 rounded-xl hover:bg-[#2D3864] hover:text-white transition-colors"
          >
            <Plus size={14} />موعد جديد
          </Link>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-1.5 bg-[#2D3864] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#1a2340] transition-colors"
          >
            <Plus size={14} />إضافة عقار
          </Link>
        </div>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────── */}
      {/* Grid: wide properties card (col-span-2) + 3 narrow cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

        {/* Wide: Properties card */}
        <Link href="/admin/properties" className="col-span-2">
          <div className="h-full bg-gradient-to-br from-[#2D3864] to-[#1a2340] rounded-2xl p-6 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">إجمالي العقارات</p>
                <p className="text-5xl font-black mt-1 tabular-nums">{total}</p>
                <p className="text-white/40 text-xs mt-1">{publishedProps ?? 0} منشور للزوار</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Building2 size={22} className="text-[#C9A84C]" />
              </div>
            </div>

            {/* Status breakdown bars */}
            <div className="space-y-2">
              {[
                { label: 'متاح',  count: availableCount, pct: pct(availableCount), color: 'bg-emerald-400' },
                { label: 'مباع',  count: soldCount,      pct: pct(soldCount),      color: 'bg-[#C9A84C]' },
                { label: 'مؤجر',  count: rentedCount,    pct: pct(rentedCount),    color: 'bg-sky-400'   },
              ].map(({ label, count, pct: p, color }) => (
                <div key={label} className="flex items-center gap-3 text-xs">
                  <span className="text-white/50 w-7 text-right shrink-0">{label}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${p}%` }} />
                  </div>
                  <span className="text-white/70 tabular-nums w-5 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Unread messages */}
        <Link href="/admin/messages">
          <div className="h-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-orange-500" />
              </div>
              {(unreadMsgs ?? 0) > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold leading-none">
                  جديد
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-gray-900 tabular-nums">{unreadMsgs ?? 0}</p>
            <p className="text-gray-700 text-sm font-medium mt-0.5">طلبات جديدة</p>
            <p className="text-gray-400 text-xs mt-1">{totalMsgs ?? 0} إجمالاً</p>
          </div>
        </Link>

        {/* Today appointments */}
        <Link href="/admin/appointments">
          <div className="h-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                <CalendarDays size={20} className="text-[#C9A84C]" />
              </div>
              {(todayAppts ?? 0) > 0 && (
                <span className="text-[10px] bg-[#C9A84C] text-[#2D3864] px-2 py-0.5 rounded-full font-bold leading-none">
                  اليوم
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-gray-900 tabular-nums">{todayAppts ?? 0}</p>
            <p className="text-gray-700 text-sm font-medium mt-0.5">مواعيد اليوم</p>
            <p className="text-gray-400 text-xs mt-1">{totalAppts ?? 0} مجدّل</p>
          </div>
        </Link>

        {/* Clients */}
        <Link href="/admin/clients">
          <div className="h-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-sky-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 tabular-nums">{totalClients ?? 0}</p>
            <p className="text-gray-700 text-sm font-medium mt-0.5">العملاء</p>
            <p className="text-gray-400 text-xs mt-1">ملاك ومؤجرين ومستأجرين</p>
          </div>
        </Link>
      </div>

      {/* ── Two panels ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Recent Messages (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <MessageSquare size={15} className="text-[#2D3864]" />
              آخر الطلبات
            </h2>
            <Link href="/admin/messages"
              className="text-xs text-[#2D3864] hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft size={12} />
            </Link>
          </div>

          {!recentMsgs?.length ? (
            <div className="p-12 text-center text-gray-400">
              <Inbox size={32} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">لا توجد رسائل حتى الآن</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(recentMsgs as Message[]).map((msg) => (
                <div key={msg.id}
                  className={`px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors ${!msg.is_read ? 'bg-orange-50/40' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-[#DEF4FC] flex items-center justify-center shrink-0 font-bold text-[#2D3864] text-sm">
                    {msg.name?.charAt(0) ?? '؟'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
                      {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />}
                    </div>
                    <p className="text-gray-400 text-xs truncate">
                      {msg.request_type ?? ''} · {msg.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-300 text-xs hidden sm:block">
                      {new Date(msg.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    </span>
                    <Link href="/admin/messages"
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#2D3864] hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                      <Eye size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <CalendarDays size={15} className="text-[#C9A84C]" />
              مواعيد قادمة
            </h2>
            <Link href="/admin/appointments"
              className="text-xs text-[#2D3864] hover:underline flex items-center gap-1">
              التقويم <ArrowLeft size={12} />
            </Link>
          </div>

          {!upcomingAppts?.length ? (
            <div className="p-10 text-center text-gray-400">
              <CalendarDays size={32} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">لا توجد مواعيد قادمة</p>
              <Link href="/admin/appointments"
                className="mt-3 inline-block text-xs text-[#2D3864] hover:underline">
                فتح التقويم
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(upcomingAppts as Appointment[]).map((appt) => {
                const isToday = appt.appointment_date === today;
                const d = new Date(appt.appointment_date + 'T12:00:00');
                return (
                  <div key={appt.id}
                    className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/60 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-center ${isToday ? 'bg-[#C9A84C] text-[#2D3864]' : 'bg-gray-100 text-gray-600'}`}>
                      <span className="text-[9px] font-semibold leading-none">
                        {d.toLocaleDateString('ar-SA', { month: 'short' })}
                      </span>
                      <span className="text-base font-black leading-tight">{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{appt.client_name}</p>
                      <p className="text-gray-400 text-xs" dir="ltr">{appt.client_phone}</p>
                      {appt.property_title && (
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{appt.property_title}</p>
                      )}
                    </div>
                    {appt.appointment_time && (
                      <div className="shrink-0 text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        <span dir="ltr">{appt.appointment_time.slice(0, 5)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick stats footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <TrendingUp size={12} className="text-[#C9A84C]" />
              <span>{totalAppts ?? 0} موعد مجدّل إجمالاً</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
