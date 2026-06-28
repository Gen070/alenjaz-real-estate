'use client';

import { supabase } from './supabase';
import { createImageUploadUrl } from './admin-actions';

/**
 * يرفع صورة واحدة مباشرةً من المتصفح إلى Supabase Storage عبر Signed Upload URL.
 * يتخطّى حدّ Vercel للـ Serverless Function (4.5MB) لأن الملف لا يمرّ عبر الخادم.
 * يُعيد رابط الصورة العام عند النجاح، ويرمي خطأً عند الفشل.
 */
export async function uploadImageDirect(file: File): Promise<string> {
  const res = await createImageUploadUrl(file.name);
  if ('error' in res) throw new Error(res.error);

  const { error } = await supabase.storage
    .from('property-images')
    .uploadToSignedUrl(res.path, res.token, file, {
      contentType: file.type || 'image/jpeg',
    });

  if (error) throw new Error(error.message || 'فشل رفع الصورة');

  const { data } = supabase.storage.from('property-images').getPublicUrl(res.path);
  return data.publicUrl;
}

/** يرفع عدة صور بالتوازي ويُعيد روابطها بالترتيب نفسه. */
export async function uploadImagesDirect(files: File[]): Promise<string[]> {
  return Promise.all(files.map((f) => uploadImageDirect(f)));
}
