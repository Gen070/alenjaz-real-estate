import { createAdminClient } from '@/lib/supabase-admin';
import type { SiteSetting } from '@/lib/supabase';
import { SettingsForm } from './_components/SettingsForm';
import { PasswordForm } from './_components/PasswordForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const admin = createAdminClient();
  const { data } = await admin.from('site_settings').select('*');

  const settings: Record<string, string> = {};
  ((data ?? []) as SiteSetting[]).forEach((row) => {
    settings[row.key] = row.value;
  });

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 text-sm mt-1">
          تعديل بيانات التواصل والتراخيص — تُحدَّث فوراً على الموقع
        </p>
      </div>
      <SettingsForm settings={settings} />
      <div className="mt-6">
        <PasswordForm />
      </div>
    </div>
  );
}
