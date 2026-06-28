import { createAdminClient } from '@/lib/supabase-admin';
import type { Appointment, Property } from '@/lib/supabase';
import { AppointmentsClient } from './_components/AppointmentsClient';

export const revalidate = 0;

export default async function AdminAppointmentsPage() {
  const admin = createAdminClient();

  const [{ data: appointments }, { data: properties }] = await Promise.all([
    admin
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false })
      .order('appointment_time'),
    admin
      .from('properties')
      .select('id, title')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <AppointmentsClient
      appointments={(appointments ?? []) as Appointment[]}
      properties={(properties ?? []) as Pick<Property, 'id' | 'title'>[]}
    />
  );
}
