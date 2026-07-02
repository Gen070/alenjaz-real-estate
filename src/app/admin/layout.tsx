import type { Metadata } from 'next';
import { AdminLayoutWrapper } from './_components/AdminLayoutWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'لوحة التحكم — الإنجاز للعقار',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let unreadCount = 0;
  let todayAppointments = 0;

  try {
    const { createAdminClient } = await import('@/lib/supabase-admin');
    const admin = createAdminClient();
    // بتوقيت الرياض صراحةً — خوادم Vercel تعمل بتوقيت UTC ولا تعكس توقيت السعودية
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date());

    const [{ count: msgs }, { count: appts }] = await Promise.all([
      admin.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      admin
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_date', today)
        .eq('status', 'مجدول'),
    ]);

    unreadCount = msgs ?? 0;
    todayAppointments = appts ?? 0;
  } catch {
    // Graceful fallback if env keys not configured
  }

  return (
    <AdminLayoutWrapper unreadCount={unreadCount} todayAppointments={todayAppointments}>
      {children}
    </AdminLayoutWrapper>
  );
}
