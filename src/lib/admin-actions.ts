'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from './supabase-admin';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAdmin(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const password = formData.get('password') as string;
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!expected || !secret) {
    return { error: 'متغيرات البيئة (ADMIN_PASSWORD / ADMIN_SESSION_SECRET) غير مضبوطة' };
  }

  if (!password || password !== expected) {
    return { error: 'كلمة المرور غير صحيحة' };
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
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
