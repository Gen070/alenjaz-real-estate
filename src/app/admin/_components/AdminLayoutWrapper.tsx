'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, LogOut, ExternalLink, Plus } from 'lucide-react';
import { logoutAdmin } from '@/lib/admin-actions';
import { SidebarNav } from './SidebarNav';

interface Props {
  children: React.ReactNode;
  unreadCount: number;
  todayAppointments: number;
}

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/properties': 'العقارات',
  '/admin/properties/new': 'إضافة عقار',
  '/admin/appointments': 'المواعيد',
  '/admin/messages': 'الطلبات',
  '/admin/settings': 'الإعدادات',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes('/edit')) return 'تعديل عقار';
  if (pathname.startsWith('/admin/properties')) return 'العقارات';
  if (pathname.startsWith('/admin/appointments')) return 'المواعيد';
  return 'لوحة التحكم';
}

export function AdminLayoutWrapper({ children, unreadCount, todayAppointments }: Props) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const pageTitle = getPageTitle(pathname);
  const isRoot = pathname === '/admin';

  return (
    <div className="min-h-screen flex font-sans" dir="rtl">
      {/* ─── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-64 bg-[#2D3864] text-white flex flex-col fixed right-0 top-0 h-full z-20 shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center shrink-0 shadow">
              <Building2 size={20} className="text-[#2D3864]" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">الإنجاز للعقار</p>
              <p className="text-white/40 text-xs">لوحة الإدارة</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <SidebarNav unreadCount={unreadCount} todayAppointments={todayAppointments} />

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <ExternalLink size={16} />
            <span>عرض الموقع</span>
          </a>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
            >
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ─── Main ────────────────────────────────────────────── */}
      <main className="flex-1 mr-64 bg-gray-50 min-h-screen flex flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            {!isRoot && (
              <>
                <Link href="/admin" className="text-gray-400 hover:text-[#2D3864] transition-colors">
                  الرئيسية
                </Link>
                <span className="text-gray-300 select-none">/</span>
              </>
            )}
            <span className="text-[#2D3864] font-semibold">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/appointments"
              className="hidden sm:flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:border-[#C9A84C] hover:text-[#2D3864] transition-colors"
            >
              <Plus size={12} />
              موعد
            </Link>
            <Link
              href="/admin/properties/new"
              className="hidden sm:flex items-center gap-1.5 bg-[#2D3864] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#1e2a4a] transition-colors"
            >
              <Plus size={12} />
              عقار
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
