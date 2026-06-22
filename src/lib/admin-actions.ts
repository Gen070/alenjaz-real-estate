'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from './supabase-admin';
import {
  createSessionToken,
  secureEquals,
  hashSecret,
  verifyAgainstHash,
  SESSION_MAX_AGE_SECONDS,
} from './admin-session';

// ─── Auth ─────────────────────────────────────────────────────────────────────

// يتحقق من كلمة سر اللوحة: المخزّنة في قاعدة البيانات أولاً، وإلا المتغيّر البيئي.
async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('admin_auth')
      .select('password_hash')
      .eq('id', 1)
      .maybeSingle();
    if (data?.password_hash) {
      return verifyAgainstHash(password, data.password_hash as string);
    }
  } catch {
    // قاعدة البيانات غير متاحة — نسقط للمتغيّر البيئي
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return secureEquals(password, expected);
}

export async function loginAdmin(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const password = formData.get('password') as string;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    return { error: 'متغيّر البيئة ADMIN_SESSION_SECRET غير مضبوط' };
  }

  if (!(await verifyAdminPassword(password))) {
    return { error: 'كلمة المرور غير صحيحة' };
  }

  const token = await createSessionToken(secret);
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

// ─── Image Upload Helper ──────────────────────────────────────────────────────

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const admin = createAdminClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = await file.arrayBuffer();

  const { error } = await admin.storage
    .from('property-images')
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) {
    console.error('Storage upload error:', error.message);
    return null;
  }

  const { data } = admin.storage.from('property-images').getPublicUrl(path);
  return data.publicUrl;
}

// ─── Properties ───────────────────────────────────────────────────────────────

type PropertyActionState = { error: string | null; success: boolean };

export async function createProperty(
  prevState: PropertyActionState,
  formData: FormData
): Promise<PropertyActionState> {
  try {
    const admin = createAdminClient();

    const imageFile = formData.get('image_file') as File;
    const imageUrl = (formData.get('image_url') as string) || null;
    let finalImage = imageUrl;
    if (imageFile?.size > 0) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) finalImage = uploaded;
    }

    const galleryFiles = formData.getAll('gallery_files') as File[];
    const galleryExisting = JSON.parse(
      (formData.get('gallery_existing') as string) || '[]'
    ) as string[];
    const uploadedGallery: string[] = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadImage(file);
        if (url) uploadedGallery.push(url);
      }
    }
    const gallery = [...galleryExisting, ...uploadedGallery];

    const details = JSON.parse((formData.get('details_json') as string) || '[]');
    const features = ((formData.get('features_text') as string) || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const { error } = await admin.from('properties').insert([
      {
        property_code: (formData.get('property_code') as string) || null,
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || null,
        location: (formData.get('location') as string) || null,
        price: (formData.get('price') as string) || null,
        type: (formData.get('type') as string) || null,
        category: (formData.get('category') as string) || null,
        usage: (formData.get('usage') as string) || null,
        beds: parseInt((formData.get('beds') as string) || '0') || 0,
        baths: parseInt((formData.get('baths') as string) || '0') || 0,
        area: (formData.get('area') as string) || null,
        image: finalImage,
        gallery,
        features,
        details,
        status: (formData.get('status') as string) || 'متاح',
        is_published: formData.get('is_published') === 'true',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    revalidatePath('/admin/properties');
    revalidatePath('/');
    revalidatePath('/properties');
    return { error: null, success: true };
  } catch (err) {
    console.error('createProperty error:', err);
    return { error: 'حدث خطأ أثناء إضافة العقار', success: false };
  }
}

export async function updateProperty(
  id: number,
  prevState: PropertyActionState,
  formData: FormData
): Promise<PropertyActionState> {
  try {
    const admin = createAdminClient();

    const imageFile = formData.get('image_file') as File;
    const imageUrl = (formData.get('image_url') as string) || null;
    let finalImage = imageUrl;
    if (imageFile?.size > 0) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) finalImage = uploaded;
    }

    const galleryFiles = formData.getAll('gallery_files') as File[];
    const galleryExisting = JSON.parse(
      (formData.get('gallery_existing') as string) || '[]'
    ) as string[];
    const uploadedGallery: string[] = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadImage(file);
        if (url) uploadedGallery.push(url);
      }
    }
    const gallery = [...galleryExisting, ...uploadedGallery];

    const details = JSON.parse((formData.get('details_json') as string) || '[]');
    const features = ((formData.get('features_text') as string) || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const { error } = await admin
      .from('properties')
      .update({
        property_code: (formData.get('property_code') as string) || null,
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || null,
        location: (formData.get('location') as string) || null,
        price: (formData.get('price') as string) || null,
        type: (formData.get('type') as string) || null,
        category: (formData.get('category') as string) || null,
        usage: (formData.get('usage') as string) || null,
        beds: parseInt((formData.get('beds') as string) || '0') || 0,
        baths: parseInt((formData.get('baths') as string) || '0') || 0,
        area: (formData.get('area') as string) || null,
        image: finalImage,
        gallery,
        features,
        details,
        status: (formData.get('status') as string) || 'متاح',
        is_published: formData.get('is_published') === 'true',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${id}/edit`);
    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath(`/property/${id}`);
    return { error: null, success: true };
  } catch (err) {
    console.error('updateProperty error:', err);
    return { error: 'حدث خطأ أثناء تحديث العقار', success: false };
  }
}

export async function deleteProperty(id: number): Promise<void> {
  const admin = createAdminClient();
  await admin.from('properties').delete().eq('id', id);
  revalidatePath('/admin/properties');
  revalidatePath('/');
  revalidatePath('/properties');
}

export async function togglePublish(id: number, current: boolean): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from('properties')
    .update({ is_published: !current, updated_at: new Date().toISOString() })
    .eq('id', id);
  revalidatePath('/admin/properties');
  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath(`/property/${id}`);
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function markMessageRead(id: number, isRead: boolean): Promise<void> {
  const admin = createAdminClient();
  await admin.from('messages').update({ is_read: isRead }).eq('id', id);
  revalidatePath('/admin/messages');
  revalidatePath('/admin');
}

export async function deleteMessage(id: number): Promise<void> {
  const admin = createAdminClient();
  await admin.from('messages').delete().eq('id', id);
  revalidatePath('/admin/messages');
  revalidatePath('/admin');
}

// ─── Settings ─────────────────────────────────────────────────────────────────

type SettingsActionState = { error: string | null; success: boolean };

export async function updateSettings(
  prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  try {
    const admin = createAdminClient();

    const keys = [
      'phone_1',
      'phone_2',
      'phone_3',
      'phone_4',
      'whatsapp',
      'location_text',
      'license_fal_url',
      'license_marouf_url',
      'license_sbc_url',
      'user1_name',
      'user1_phone',
      'user1_whatsapp',
      'user2_name',
      'user2_phone',
      'user2_whatsapp',
    ];

    const upserts = keys.map((key) => ({
      key,
      value: (formData.get(key) as string) ?? '',
    }));

    const { error } = await admin
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' });

    if (error) throw error;

    revalidatePath('/admin/settings');
    revalidatePath('/');
    revalidatePath('/properties');
    return { error: null, success: true };
  } catch (err) {
    console.error('updateSettings error:', err);
    return { error: 'حدث خطأ أثناء حفظ الإعدادات', success: false };
  }
}

// ─── تغيير كلمة سر اللوحة ─────────────────────────────────────────────────────

export async function changeAdminPassword(
  prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  try {
    const current = formData.get('current_password') as string;
    const next = formData.get('new_password') as string;
    const confirm = formData.get('confirm_password') as string;

    if (!next || next.length < 6) {
      return { error: 'كلمة المرور الجديدة قصيرة (6 أحرف على الأقل)', success: false };
    }
    if (next !== confirm) {
      return { error: 'كلمتا المرور غير متطابقتين', success: false };
    }
    if (!(await verifyAdminPassword(current))) {
      return { error: 'كلمة المرور الحالية غير صحيحة', success: false };
    }

    const admin = createAdminClient();
    const hash = await hashSecret(next);
    const { error } = await admin
      .from('admin_auth')
      .upsert(
        { id: 1, password_hash: hash, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (error) throw error;

    return { error: null, success: true };
  } catch (err) {
    console.error('changeAdminPassword error:', err);
    return { error: 'حدث خطأ أثناء تغيير كلمة المرور', success: false };
  }
}
