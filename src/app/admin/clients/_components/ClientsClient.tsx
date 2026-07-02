'use client';

import { useState, useMemo, useEffect, useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Client, ClientProperty, Property } from '@/lib/supabase';
import { upsertClient, deleteClient } from '@/lib/admin-actions';
import {
  Users,
  Plus,
  Search,
  X,
  User,
  Phone,
  MessageCircle,
  Mail,
  IdCard,
  StickyNote,
  Building2,
  Pencil,
  Trash2,
  UserCircle2,
} from 'lucide-react';

type PropertyLite = Pick<Property, 'id' | 'title' | 'property_code' | 'location'>;

const TYPES = ['مالك', 'مؤجر', 'مستأجر', 'مشتري'] as const;

const TYPE_CHIP: Record<string, string> = {
  مالك: 'bg-[#2D3864]/10 text-[#2D3864]',
  مؤجر: 'bg-amber-100 text-amber-800',
  مستأجر: 'bg-emerald-100 text-emerald-700',
  مشتري: 'bg-sky-100 text-sky-700',
};

// ── Modal ──────────────────────────────────────────────────────────────────
function ClientModal({
  onClose,
  editing,
  properties,
  linkedIds,
}: {
  onClose: () => void;
  editing: Client | null;
  properties: PropertyLite[];
  linkedIds: number[];
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(upsertClient, { error: null, success: false });
  const [selected, setSelected] = useState<number[]>(linkedIds);
  const [propQuery, setPropQuery] = useState('');

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose();
    }
  }, [state.success, onClose, router]);

  const filteredProps = useMemo(() => {
    if (!propQuery.trim()) return properties;
    const q = propQuery.trim().toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.property_code?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }, [propQuery, properties]);

  function toggleProp(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <UserCircle2 size={18} className="text-[#C9A84C]" />
            {editing ? 'تعديل بيانات العميل' : 'عميل جديد'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form action={action} className="px-6 py-5 space-y-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <User size={11} />الاسم <span className="text-red-400">*</span>
              </label>
              <input name="name" required defaultValue={editing?.name ?? ''}
                placeholder="اسم العميل"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Users size={11} />التصنيف
              </label>
              <select name="client_type" defaultValue={editing?.client_type ?? 'مالك'}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all">
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Phone size={11} />رقم الجوال <span className="text-red-400">*</span>
              </label>
              <input name="phone" required dir="ltr" defaultValue={editing?.phone ?? ''}
                placeholder="05xxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <MessageCircle size={11} />واتساب (اختياري)
              </label>
              <input name="whatsapp" dir="ltr" defaultValue={editing?.whatsapp ?? ''}
                placeholder="05xxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Mail size={11} />البريد (اختياري)
              </label>
              <input name="email" type="email" dir="ltr" defaultValue={editing?.email ?? ''}
                placeholder="name@example.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <IdCard size={11} />رقم الهوية (اختياري)
              </label>
              <input name="national_id" dir="ltr" defaultValue={editing?.national_id ?? ''}
                placeholder="1xxxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all" />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <StickyNote size={11} />ملاحظات (اختياري)
              </label>
              <textarea name="notes" rows={2} defaultValue={editing?.notes ?? ''}
                placeholder="أي ملاحظات عن العميل..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all resize-none" />
            </div>
          </div>

          {/* Property linking */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <Building2 size={12} />العقارات المرتبطة ({selected.length})
              </label>
              <select name="relation_type" defaultValue="ملك"
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 focus:outline-none">
                <option value="ملك">علاقة: ملك</option>
                <option value="إدارة">علاقة: إدارة</option>
                <option value="تأجير">علاقة: تأجير</option>
              </select>
            </div>
            <div className="relative mb-2">
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={propQuery}
                onChange={(e) => setPropQuery(e.target.value)}
                placeholder="ابحث عن عقار بالاسم أو الرقم..."
                className="w-full border border-gray-200 rounded-lg pr-8 pl-3 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20"
              />
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
              {filteredProps.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">لا توجد عقارات مطابقة</p>
              )}
              {filteredProps.map((p) => (
                <label key={p.id} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="property_ids"
                    value={p.id}
                    checked={selected.includes(p.id)}
                    onChange={() => toggleProp(p.id)}
                    className="accent-[#2D3864]"
                  />
                  <span className="font-medium text-gray-800">{p.title}</span>
                  {p.property_code && <span className="text-gray-400">· {p.property_code}</span>}
                  {p.location && <span className="text-gray-400">· {p.location}</span>}
                </label>
              ))}
            </div>
          </div>

          {state.error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              إلغاء
            </button>
            <button type="submit" disabled={isPending}
              className="px-5 py-2 bg-[#2D3864] text-white text-sm rounded-xl hover:bg-[#1e2a4a] disabled:opacity-60 transition-colors flex items-center gap-2">
              {isPending && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {editing ? 'حفظ التعديلات' : 'إضافة العميل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Client card ────────────────────────────────────────────────────────────
function ClientCard({
  client,
  propertyTitles,
  onEdit,
  onDeleted,
}: {
  client: Client;
  propertyTitles: string[];
  onEdit: (c: Client) => void;
  onDeleted: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2D3864] to-[#4a5a8c] flex items-center justify-center text-white font-bold shrink-0">
            {client.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{client.name}</p>
            <a href={`tel:${client.phone}`} className="text-gray-400 text-xs hover:text-[#2D3864] transition-colors" dir="ltr">
              {client.phone}
            </a>
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${TYPE_CHIP[client.client_type] ?? 'bg-gray-100 text-gray-600'}`}>
          {client.client_type}
        </span>
      </div>

      {propertyTitles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {propertyTitles.slice(0, 3).map((t, i) => (
            <span key={i} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1">
              <Building2 size={9} />{t}
            </span>
          ))}
          {propertyTitles.length > 3 && (
            <span className="text-[10px] text-gray-400 px-1 py-1">+{propertyTitles.length - 3} أخرى</span>
          )}
        </div>
      )}

      {client.notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-2.5 leading-relaxed line-clamp-2">
          {client.notes}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1 mt-auto">
        {client.whatsapp && (
          <a
            href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            title="واتساب"
          >
            <MessageCircle size={14} />
          </a>
        )}
        <button onClick={() => onEdit(client)}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#2D3864] hover:text-white text-gray-500 flex items-center justify-center transition-colors">
          <Pencil size={13} />
        </button>

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors mr-auto">
            <Trash2 size={13} />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 mr-auto">
            <span className="text-[11px] text-red-600 font-medium">حذف نهائياً؟</span>
            <button
              onClick={() => startTransition(async () => { await deleteClient(client.id); onDeleted(client.id); })}
              disabled={isPending}
              className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 disabled:opacity-60"
            >نعم</button>
            <button onClick={() => setConfirmDelete(false)}
              className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200">لا</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export function ClientsClient({
  clients,
  links,
  properties,
}: {
  clients: Client[];
  links: ClientProperty[];
  properties: PropertyLite[];
}) {
  const [localClients, setLocalClients] = useState<Client[]>(clients);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'الكل' | (typeof TYPES)[number]>('الكل');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    setLocalClients(clients);
  }, [clients]);

  const propsById = useMemo(() => {
    const m: Record<number, PropertyLite> = {};
    properties.forEach((p) => (m[p.id] = p));
    return m;
  }, [properties]);

  const linksByClient = useMemo(() => {
    const m: Record<number, number[]> = {};
    links.forEach((l) => {
      (m[l.client_id] ??= []).push(l.property_id);
    });
    return m;
  }, [links]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { الكل: localClients.length };
    TYPES.forEach((t) => (c[t] = 0));
    localClients.forEach((cl) => {
      c[cl.client_type] = (c[cl.client_type] ?? 0) + 1;
    });
    return c;
  }, [localClients]);

  const filtered = useMemo(() => {
    let list = localClients;
    if (typeFilter !== 'الكل') list = list.filter((c) => c.client_type === typeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.national_id ?? '').includes(q)
      );
    }
    return list;
  }, [localClients, typeFilter, query]);

  function openAdd() {
    setEditing(null);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }
  function openEdit(c: Client) {
    setEditing(c);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }
  function handleDeleted(id: number) {
    setLocalClients((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={22} className="text-[#C9A84C]" />
            العملاء
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{localClients.length} عميل مسجّل — ملاك، مؤجرين، مستأجرين ومشترين</p>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم، الجوال، أو رقم الهوية..."
              className="w-full border border-gray-200 rounded-xl pr-9 pl-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D3864]/20 focus:border-[#2D3864] transition-all"
            />
          </div>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#2D3864] text-white text-sm px-4 py-2.5 rounded-xl hover:bg-[#1e2a4a] transition-colors shrink-0"
        >
          <Plus size={16} />عميل جديد
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['الكل', ...TYPES] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              typeFilter === t
                ? 'bg-[#2D3864] text-white border-[#2D3864]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#2D3864]/30'
            }`}
          >
            {t} <span className="opacity-70">({counts[t] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-25" />
          <p className="font-medium">لا يوجد عملاء مطابقون</p>
          <button onClick={openAdd} className="mt-2 text-sm text-[#2D3864] hover:underline">
            إضافة أول عميل
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <ClientCard
              key={c.id}
              client={c}
              propertyTitles={(linksByClient[c.id] ?? []).map((pid) => propsById[pid]?.title).filter(Boolean) as string[]}
              onEdit={openEdit}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ClientModal
          key={modalKey}
          onClose={() => setModalOpen(false)}
          editing={editing}
          properties={properties}
          linkedIds={editing ? linksByClient[editing.id] ?? [] : []}
        />
      )}
    </div>
  );
}
