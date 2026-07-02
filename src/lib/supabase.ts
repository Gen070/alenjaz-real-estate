import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Property = {
  id: number;
  property_code: string | null;
  title: string;
  description: string | null;
  location: string | null;
  city: string | null;
  district: string | null;
  price: string | null;
  type: string | null;
  category: string | null;
  usage: string | null;
  beds: number;
  baths: number;
  area: string | null;
  image: string | null;
  gallery: string[];
  features: string[];
  details: { label: string; value: string }[];
  status: string;
  is_published: boolean;
  created_at: string;
};

export type SiteSetting = {
  key: string;
  value: string;
};

export type Message = {
  id: number;
  name: string;
  phone: string;
  request_type: string | null;
  details: string | null;
  is_read: boolean;
  created_at: string;
};

export type Appointment = {
  id: number;
  client_name: string;
  client_phone: string;
  property_id: number | null;
  property_title: string | null;
  appointment_date: string;
  appointment_time: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type Client = {
  id: number;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  client_type: string; // مالك / مؤجر / مستأجر / مشتري
  national_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type ClientProperty = {
  id: number;
  client_id: number;
  property_id: number;
  relation_type: string; // ملك / إدارة / تأجير
  created_at: string;
};
