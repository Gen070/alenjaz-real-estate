import type { Metadata } from 'next';
import { AdminLayoutWrapper } from './_components/AdminLayoutWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'لوحة التحكم — الإنجاز للعقار',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let unreadCount = 0;

  try {
    const { createAdminClient } = await import('@/lib/supabase-admin');
    const admin = createAdminClient();
    const { count } = await admin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    unreadCount = count ?? 0;
  } catch {
    // Graceful fallback if SUPABASE_SERVICE_ROLE_KEY not configured
  }

  return <AdminLayoutWrapper unreadCount={unreadCount}>{children}</AdminLayoutWrapper>;
}
