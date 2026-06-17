import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'الإنجاز للعقار',
    short_name: 'الإنجاز للعقار',
    description: 'منصة عرض العقارات في مكة المكرمة',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2D3864',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
