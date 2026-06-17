import Link from 'next/link';
import { Building2, CheckCircle, MessageSquare, Inbox, ArrowLeft, Eye } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import type { Message } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminDashboard() {
  const admin = createAdminClient();

  const [
    { count: totalProps },
    { count: publishedProps },
    { count: unreadMsgs },
    { count: totalMsgs },
    { data: recentMsgs },
  ] = await Promise.all([
    admin.from('properties').select('*', { count: 'exact', head: true }),
    admin.from('properties').select('*', { count: 'exact', head: true }).eq('is_published', true),
    admin.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    admin.from('messages').select('*', { count: 'exact', head: true }),
    admin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: 'إجمالي العقارات', value: totalProps ?? 0, icon: Building2, color: 'bg-[#2D3864]', href: '/admin/properties' },
    { label: 'منشورة للزوار', value: publishedProps ?? 0, icon: CheckCircle, color: 'bg-emerald-600', href: '/admin/properties' },
    { label: 'رسائل جديدة', value: unreadMsgs ?? 0, icon: MessageSquare, color: 'bg-red-500', href: '/admin/messages' },
    { label: 'إجمالي الرسائل', value: totalMsgs ?? 0, icon: Inbox, color: 'bg-[#C9A84C]', href: '/admin/messages' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 text-sm mt-1">مرحباً بك في إدارة موقع الإنجاز للعقار</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-[#2D3864]" />
            آخر الرسائل
          </h2>
          <Link
            href="/admin/messages"
            className="text-sm text-[#2D3864] hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft size={14} />
          </Link>
        </div>

        {!recentMsgs || recentMsgs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Inbox size={40} className="mx-auto mb-3 opacity-40" />
            <p>لا توجد رسائل حتى الآن</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(recentMsgs as Message[]).map((msg) => (
              <div
                key={msg.id}
                className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                  !msg.is_read ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#DEF4FC] flex items-center justify-center shrink-0 font-bold text-[#2D3864]">
                  {msg.name?.charAt(0) ?? '؟'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate">
                    {msg.request_type ?? ''} — {msg.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-gray-400 text-xs">
                    {new Date(msg.created_at).toLocaleDateString('ar-SA', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <Link
                    href="/admin/messages"
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#2D3864] hover:text-white flex items-center justify-center text-gray-500 transition-colors"
                  >
                    <Eye size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
