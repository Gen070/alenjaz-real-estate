// أداة جلسة الأدمن — رمز موقّع (HMAC-SHA256) بدل تخزين السر الخام في الكوكي.
// متوافقة مع بيئة Edge (proxy) وبيئة Node (Server Actions) لأنها تعتمد فقط على
// Web Crypto + TextEncoder + btoa/atob المتوفرة في الاثنتين.

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecodeToString(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded);
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function sign(payloadB64: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  return base64urlEncode(new Uint8Array(signature));
}

// مقارنة ثابتة الزمن لسلسلتين بنفس الطول (لا تتأثر بموضع أول اختلاف).
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function sha256B64(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return base64urlEncode(new Uint8Array(digest));
}

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // أسبوع

/**
 * مقارنة آمنة لكلمتي سر — تجزّئ المدخلين أولاً فلا يتسرّب الطول، وتقارن ثابتة الزمن.
 */
export async function secureEquals(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256B64(a), sha256B64(b)]);
  return timingSafeEqual(ha, hb);
}

/** يُنتج تجزئة (SHA-256 base64url) لتخزين كلمة سر اللوحة في قاعدة البيانات. */
export async function hashSecret(value: string): Promise<string> {
  return sha256B64(value);
}

/** يقارن قيمة خام بتجزئة مخزّنة، مقارنة ثابتة الزمن. */
export async function verifyAgainstHash(
  value: string,
  hash: string
): Promise<boolean> {
  return timingSafeEqual(await sha256B64(value), hash);
}

/** ينشئ رمز جلسة موقّعاً ينتهي بعد SESSION_MAX_AGE_SECONDS. */
export async function createSessionToken(secret: string): Promise<string> {
  const payload = { exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 };
  const payloadB64 = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

/** يتحقق من توقيع الرمز وصلاحيته. */
export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  const expectedSignature = await sign(payloadB64, secret);
  if (!timingSafeEqual(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(base64urlDecodeToString(payloadB64)) as { exp?: number };
    return typeof payload.exp === 'number' && Date.now() <= payload.exp;
  } catch {
    return false;
  }
}
