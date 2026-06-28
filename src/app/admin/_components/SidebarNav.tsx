'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Settings,
  CalendarDays,
} from 'lucide-react';

type BadgeKey = 'messages' | 'appointments' | null;

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact: boolean;
  badge: BadgeKey;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'عام',
    items: [
      { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true, badge: null },
    ],
  },
  {
    label: 'المحتوى',
    items: [
      { href: '/admin/properties', label: 'العقارات', icon: Building2, exact: false, badge: null },
      { href: '/admin/appointments', label: 'التقويم', icon: CalendarDays, exact: false, badge: 'appointments' },
    ],
  },
  {
    label: 'التواصل',
    items: [
      { href: '/admin/messages', label: 'الطلبات', icon: MessageSquare, exact: false, badge: 'messages' },
    ],
  },
  {
    label: 'النظام',
    items: [
      { href: '/admin/settings', label: 'الإعدادات', icon: Settings, exact: false, badge: null },
    ],
  },
];

export function SidebarNav({
  unreadCount,
  todayAppointments,
}: {
  unreadCount: number;
  todayAppointments: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-4 mb-2 text-white/20 text-[10px] font-semibold uppercase tracking-widest select-none">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon, exact, badge }) => {
              const isActive =
                exact ? pathname === href : pathname.startsWith(href);
              const count =
                badge === 'messages'
                  ? unreadCount
                  : badge === 'appointments'
                    ? todayAppointments
                    : 0;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium relative ${
                    isActive
                      ? 'bg-[#C9A84C]/20 text-[#C9A84C] shadow-[inset_0_0_0_1px_rgba(201,168,76,0.3)]'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-[#C9A84C]' : ''} />
                  <span>{label}</span>
                  {count > 0 && (
                    <span
                      className={`absolute left-3 text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 ${
                        isActive
                          ? 'bg-[#C9A84C] text-[#2D3864]'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
