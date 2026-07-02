'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, LogOut, ExternalLink, Bell, Search, Plus, ChevronLeft } from 'lucide-react';
import { logoutAdmin } from '@/lib/admin-actions';
import { SidebarNav } from './SidebarNav';

interface Props {
  children: React.ReactNode;
  unreadCount: number;
  todayAppointments: number;
}

const PAGE_TITLES: Record<string, string> = {
  '/admin':                   'لوحة التحكم',
  '/admin/properties':        'العقارات',
  '/admin/properties/new':    'إضافة عقار',
  '/admin/appointments':      'التقويم',
  '/admin/clients':           'العملاء',
  '/admin/messages':          'الطلبات',
  '/admin/settings':          'الإعدادات',
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes('/edit')) return 'تعديل عقار';
  if (pathname.startsWith('/admin/properties')) return 'العقارات';
  if (pathname.startsWith('/admin/appointments')) return 'التقويم';
  if (pathname.startsWith('/admin/clients')) return 'العملاء';
  return 'لوحة التحكم';
}

export function AdminLayoutWrapper({ children, unreadCount, todayAppointments }: Props) {
  const pathname  = usePathname();

  if (pathname === '/admin/login') return <>{children}</>;

  const pageTitle = getPageTitle(pathname);
  const isRoot    = pathname === '/admin';

  return (
    <div className="min-h-screen flex font-sans" dir="rtl">

      {/* ═══ Sidebar ════════════════════════════════════════════ */}
      <aside className="w-64 bg-[#1a2340] text-white flex flex-col fixed right-0 top-0 h-full z-20 shrink-0">
        {/* Top brand accent line */}
        <div className="h-1 bg-gradient-to-l from-[#C9A84C] via-[#e8c060] to-[#C9A84C] shrink-0" />

        {/* Logo */}
        <div className="p-5 border-b border-white/[0.07]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <div className="absolute inset-0 bg-[#C9A84C] rounded-xl blur-md opacity-30" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-[#C9A84C] to-[#e8c060] rounded-xl flex items-center justify-center shadow-md">
                <Building2 size={20} className="text-[#1a2340]" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-white">الإنجاز للعقار</p>
              <p className="text-white/35 text-xs mt-0.5">لوحة الإدارة</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <SidebarNav unreadCount={unreadCount} todayAppointments={todayAppointments} />

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.07] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all text-sm"
          >
            <ExternalLink size={15} />
            <span>عرض الموقع</span>
          </a>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
            >
              <LogOut size={15} />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ═══ Main ════════════════════════════════════════════════ */}
      <main className="flex-1 mr-64 bg-[#f5f6fa] min-h-screen flex flex-col">

        {/* ── Top Header ──────────────────────────────────────── */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200/70 px-6 h-14 flex items-center justify-between shrink-0">

          {/* RIGHT: user + bell (first DOM child = right in RTL) */}
          <div className="flex items-center gap-3">
            {/* User avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D3864] to-[#4a5a8c] flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
                إ
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">الإنجاز للعقار</p>
                <p className="text-[11px] text-gray-400 mt-0.5">مدير النظام</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-200" />

            {/* Notification bell */}
            <Link
              href="/admin/messages"
              className="relative w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              title={`${unreadCount} طلبات غير مقروءة`}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>

          {/* LEFT: search + breadcrumb (second DOM child = left in RTL) */}
          <div className="flex items-center gap-3">
            {/* Decorative search */}
            <button className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-400 hover:bg-gray-100 transition-colors w-44">
              <Search size={13} />
              <span className="text-xs flex-1 text-right">بحث سريع...</span>
              <kbd className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>

            {/* Quick add buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                href="/admin/clients"
                className="flex items-center gap-1 border border-gray-200 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg hover:border-[#C9A84C] hover:text-[#2D3864] transition-colors"
              >
                <Plus size={11} />عميل
              </Link>
              <Link
                href="/admin/appointments"
                className="flex items-center gap-1 border border-gray-200 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg hover:border-[#C9A84C] hover:text-[#2D3864] transition-colors"
              >
                <Plus size={11} />موعد
              </Link>
              <Link
                href="/admin/properties/new"
                className="flex items-center gap-1 bg-[#2D3864] text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-[#1a2340] transition-colors"
              >
                <Plus size={11} />عقار
              </Link>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-sm">
              {!isRoot && (
                <>
                  <Link href="/admin" className="text-gray-400 hover:text-[#2D3864] transition-colors text-xs">
                    الرئيسية
                  </Link>
                  <ChevronLeft size={13} className="text-gray-300" />
                </>
              )}
              <span className="font-semibold text-[#1a2340] text-sm">{pageTitle}</span>
            </div>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────── */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
