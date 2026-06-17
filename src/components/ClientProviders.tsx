'use client';

import { usePathname } from 'next/navigation';
import { FloatingWhatsApp } from './ui/FloatingWhatsApp';

interface Props {
  children: React.ReactNode;
  whatsappPrimary: string;
  whatsappSecondary: string;
}

export function ClientProviders({ children, whatsappPrimary, whatsappSecondary }: Props) {
  const pathname = usePathname();

  return (
    <>
      {children}
      {!pathname.startsWith('/admin') && (
        <FloatingWhatsApp primaryNumber={whatsappPrimary} secondaryNumber={whatsappSecondary} />
      )}
    </>
  );
}
