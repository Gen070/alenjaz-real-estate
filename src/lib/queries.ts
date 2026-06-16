import { supabase, Property, SiteSetting } from './supabase';

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return (data ?? []) as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', numericId)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }
  return data as Property | null;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }

  const map: Record<string, string> = {};
  ((data ?? []) as SiteSetting[]).forEach((row) => {
    map[row.key] = row.value;
  });
  return map;
}

export async function submitMessage(payload: {
  name: string;
  phone: string;
  request_type?: string;
  details?: string;
}) {
  const { error } = await supabase.from('messages').insert([payload]);
  if (error) {
    console.error('Error submitting message:', error);
    throw error;
  }
}
