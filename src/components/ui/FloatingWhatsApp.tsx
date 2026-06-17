'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface UserContact {
  name: string;
  whatsapp: string;
}

interface Props {
  users: UserContact[];
}

export function FloatingWhatsApp({ users }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDisplay = (num: string) => {
    const clean = num.replace(/^966/, '0');
    return clean.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 mb-2"
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h4 className="font-bold text-[var(--color-navy)]">تواصل معنا</h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {users.map((user) => (
                <a
                  key={user.name}
                  href={`https://wa.me/${user.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-[#25D366]/10 transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500" dir="ltr">{formatDisplay(user.whatsapp)}</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:scale-105 hover:shadow-xl transition-all"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
      </button>
    </div>
  );
}
