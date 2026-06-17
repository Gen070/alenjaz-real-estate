'use client';

import { usePathname } from 'next/navigation';
import { FloatingWhatsApp } from './ui/FloatingWhatsApp';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {children}
      {!pathname.startsWith('/admin') && <FloatingWhatsApp />}
    </>
  );
}
