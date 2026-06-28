import Link from 'next/link';
import {
  Building2,
  MessageSquare,
  CalendarClock,
  Home,
  Plus,
  ArrowLeft,
  Eye,
  Inbox,
  Clock,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import type { Message, Appointment } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminDashboard() {
  const admin = createAdminClient();
  const today = new Date().toISOString().split('T')[0];

  const [
    { count: totalProps },
    { count: publishedProps },
    { data: statusRows },
    { count: unreadMsgs },
    { count: todayAppts },
    { data: recentMsgs },
    { data: upcomingAppts },
  ] = await Promise.all([
    admin.from('properties').select('*', { count: 'exact', head: true }),
    admin.from('properties').select('*', { count: 'exact', head: true }).eq('is_published', true),
    admin.from('properties').select('status'),
    admin.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    admin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', today)
      .eq('status', 'مجدول'),
    admin.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
    admin
      .from('appointments')
      .select('*')
      .eq('status', 'مجدول')
      .gte('appointment_date', today)
      .order('appointment_date')
      .order('appointment_time')
      .limit(5),
  ]);

  const statuses = (statusRows ?? []).map((r: { status: string }) => r.status);
  const availableCount = statuses.filter((s) => s === 'متاح').length;
  const soldCount = statuses.filter((s) => s === 'مباع').length;
  const rentedCount = statuses.filter((s) => s === 'مؤجر').length;

  const kpiCards = [
    {
      label: 'إجمالي العقارات',
      value: totalProps ?? 0,
      icon: Building2,
      bg: 'bg-[#2D3864]',
      href: '/admin/properties',
      sub: `${publishedProps ?? 0} منشور للزوار`,
    },
    {
      label: 'متاح للبيع أو الإيجار',
      value: availableCount,
      icon: Home,
      bg: 'bg-emerald-600',
      href: '/admin/properties',
      sub: `${soldCount} مباع · ${rentedCount} مؤجر`,
    },
    {
      label: 'طلبات جديدة',
      value: unreadMsgs ?? 0,
      icon: MessageSquare,
      bg: 'bg-orange-500',
      href: '/admin/messages',
      sub: 'لم تُقرأ بعد',
    },
    {
      label: 'مواعيد اليوم',
      value: todayAppts ?? 0,
      icon: CalendarClock,
      bg: 'bg-[#C9A84C]',
      href: '/admin/appointments',
      sub: 'موعد مجدول',
    },
  ];

  return (
    <div className="p-8">
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-400 text-sm mt-0.5">مرحباً بك — الإنجاز للعقار</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/appointments"
            className="flex items-center gap-1.5 border border-[#2D3864]/30 text-[#2D3864] text-sm px-4 py-2 rounded-xl hover:bg-[#2D3864] hover:text-white transition-colors"
          >
            <Plus size={14} />
            موعد جديد
          </Link>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-1.5 bg-[#2D3864] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#1e2a4a] transition-colors"
          >
            <Plus size={14} />
            إضافة عقار
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map(({ label, value, icon: Icon, bg, href, sub }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-3xl font-black text-gray-900 mb-0.5 tabular-nums">{value}</p>
              <p className="text-gray-700 text-sm font-medium leading-snug">{label}</p>
              <p className="text-gray-400 text-xs mt-1">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Messages — 3 cols */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <MessageSquare size={15} className="text-[#2D3864]" />
              آخر الطلبات
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-[#2D3864] hover:underline flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft size={12} />
            </Link>
          </div>

          {!recentMsgs?.length ? (
            <div className="p-12 text-center text-gray-400">
              <Inbox size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">لا توجد رسائل حتى الآن</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(recentMsgs as Message[]).map((msg) => (
                <div
                  key={msg.id}
                  className={`px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors ${
                    !msg.is_read ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#DEF4FC] flex items-center justify-center shrink-0 font-bold text-[#2D3864] text-sm">
                    {msg.name?.charAt(0) ?? '؟'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
                      {!msg.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs truncate">
                      {msg.request_type ?? ''} · {msg.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-300 text-xs hidden sm:block">
                      {new Date(msg.created_at).toLocaleDateString('ar-SA', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <Link
                      href="/admin/messages"
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#2D3864] hover:text-white flex items-center justify-center text-gray-400 transition-colors"
                    >
                      <Eye size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments — 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <CalendarClock size={15} className="text-[#C9A84C]" />
              مواعيد قادمة
            </h2>
            <Link
              href="/admin/appointments"
              className="text-xs text-[#2D3864] hover:underline flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft size={12} />
            </Link>
          </div>

          {!upcomingAppts?.length ? (
            <div className="p-10 text-center text-gray-400">
              <CalendarClock size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">لا توجد مواعيد قادمة</p>
              <Link
                href="/admin/appointments"
                className="mt-3 inline-block text-xs text-[#2D3864] hover:underline"
              >
                إضافة موعد
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(upcomingAppts as Appointment[]).map((appt) => {
                const isToday = appt.appointment_date === today;
                const d = new Date(appt.appointment_date + 'T12:00:00');
                return (
                  <div
                    key={appt.id}
                    className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Date badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-center ${
                        isToday ? 'bg-[#C9A84C] text-[#2D3864]' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className="text-[9px] font-semibold leading-none uppercase">
                        {d.toLocaleDateString('ar-SA', { month: 'short' })}
                      </span>
                      <span className="text-base font-black leading-tight">{d.getDate()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{appt.client_name}</p>
                      <p className="text-gray-400 text-xs" dir="ltr">
                        {appt.client_phone}
                      </p>
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
        </div>
      </div>
    </div>
  );
}
