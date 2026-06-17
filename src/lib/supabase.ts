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
