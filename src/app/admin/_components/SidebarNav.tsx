'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, MessageSquare, Settings } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'العقارات', icon: Building2, exact: false },
  { href: '/admin/messages', label: 'الرسائل', icon: MessageSquare, exact: false },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings, exact: false },
];

export function SidebarNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative ${
              isActive
                ? 'bg-[#C9A84C] text-[#2D3864]'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'الرسائل' && unreadCount > 0 && (
              <span
                className={`absolute left-3 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${
                  isActive ? 'bg-[#2D3864] text-white' : 'bg-red-500 text-white'
                }`}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
