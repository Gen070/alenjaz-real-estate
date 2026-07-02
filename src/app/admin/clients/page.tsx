import { createAdminClient } from '@/lib/supabase-admin';
import type { Client, ClientProperty, Property } from '@/lib/supabase';
import { ClientsClient } from './_components/ClientsClient';

export const revalidate = 0;

export default async function AdminClientsPage() {
  const admin = createAdminClient();

  const [{ data: clients }, { data: links }, { data: properties }] = await Promise.all([
    admin.from('clients').select('*').order('created_at', { ascending: false }),
    admin.from('client_properties').select('*'),
    admin.from('properties').select('id, title, property_code, location').order('created_at', { ascending: false }),
  ]);

  return (
    <ClientsClient
      clients={(clients ?? []) as Client[]}
      links={(links ?? []) as ClientProperty[]}
      properties={(properties ?? []) as Pick<Property, 'id' | 'title' | 'property_code' | 'location'>[]}
    />
  );
}
