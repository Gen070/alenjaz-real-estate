import { MessageSquare, Inbox, MailOpen, Mail, Trash2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import { markMessageRead, deleteMessage } from '@/lib/admin-actions';
import type { Message } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  const messages = (data ?? []) as Message[];
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={22} className="text-[#2D3864]" />
          الرسائل
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length} رسالة إجمالاً
          {unread > 0 && (
            <span className="mr-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {unread} جديدة
            </span>
          )}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Inbox size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">لا توجد رسائل حتى الآن</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 hover:bg-gray-50/60 transition-colors ${
                  !msg.is_read ? 'bg-blue-50/30 border-r-4 border-r-[#2D3864]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#DEF4FC] flex items-center justify-center shrink-0 font-bold text-[#2D3864] text-lg mt-0.5">
                    {msg.name?.charAt(0) ?? '؟'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-gray-900">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          جديد
                        </span>
                      )}
                      {msg.request_type && (
                        <span className="bg-[#DEF4FC] text-[#2D3864] text-xs px-2 py-0.5 rounded-full font-medium">
                          {msg.request_type}
                        </span>
                      )}
                    </div>
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-[#2D3864] font-semibold text-sm hover:underline"
                      dir="ltr"
                    >
                      {msg.phone}
                    </a>
                    {msg.details && (
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed bg-gray-50 rounded-xl p-3">
                        {msg.details}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(msg.created_at).toLocaleDateString('ar-SA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      —{' '}
                      {new Date(msg.created_at).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <form
                      action={async () => {
                        'use server';
                        await markMessageRead(msg.id, !msg.is_read);
                      }}
                    >
                      <button
                        type="submit"
                        title={msg.is_read ? 'وضع علامة غير مقروء' : 'وضع علامة مقروء'}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          msg.is_read
                            ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        {msg.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        'use server';
                        await deleteMessage(msg.id);
                      }}
                    >
                      <button
                        type="submit"
                        title="حذف الرسالة"
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
