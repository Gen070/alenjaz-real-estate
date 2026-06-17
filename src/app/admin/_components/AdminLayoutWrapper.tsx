'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, LogOut, ExternalLink } from 'lucide-react';
import { logoutAdmin } from '@/lib/admin-actions';
import { SidebarNav } from './SidebarNav';

interface Props {
  children: React.ReactNode;
  unreadCount: number;
}

export function AdminLayoutWrapper({ children, unreadCount }: Props) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex font-sans" dir="rtl">
      {/* ─── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-64 bg-[#2D3864] text-white flex flex-col fixed right-0 top-0 h-full z-20 shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center shrink-0 shadow">
              <Building2 size={20} className="text-[#2D3864]" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">الإنجاز للعقار</p>
              <p className="text-white/40 text-xs">لوحة التحكم</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <SidebarNav unreadCount={unreadCount} />

        {/* Bottom actions */}
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

      {/* ─── Main content ──────────────────────────────────────── */}
      <main className="flex-1 mr-64 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
