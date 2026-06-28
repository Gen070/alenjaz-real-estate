'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, MessageSquare, Settings, CalendarClock } from 'lucide-react';

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
      { href: '/admin/appointments', label: 'المواعيد', icon: CalendarClock, exact: false, badge: 'appointments' },
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
    <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-4 mb-1.5 text-white/25 text-[10px] font-semibold uppercase tracking-widest select-none">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon, exact, badge }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
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
                      ? 'bg-[#C9A84C] text-[#2D3864]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {count > 0 && (
                    <span
                      className={`absolute left-3 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1 ${
                        isActive ? 'bg-[#2D3864] text-white' : 'bg-red-500 text-white'
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
