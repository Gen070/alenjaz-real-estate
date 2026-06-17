'use client';

import { usePathname } from 'next/navigation';
import { FloatingWhatsApp } from './ui/FloatingWhatsApp';

interface UserContact {
  name: string;
  whatsapp: string;
}

interface Props {
  children: React.ReactNode;
  users: UserContact[];
}

export function ClientProviders({ children, users }: Props) {
  const pathname = usePathname();

  return (
    <>
      {children}
      {!pathname.startsWith('/admin') && <FloatingWhatsApp users={users} />}
    </>
  );
}
