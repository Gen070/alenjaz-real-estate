'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Send } from 'lucide-react';

interface UserContact {
  name: string;
  whatsapp: string;
}

interface Props {
  users: UserContact[];
}

export function FloatingWhatsApp({ users }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!users.length) return null;

  const formatDisplay = (num: string) => {
    const clean = num.replace(/^966/, '0');
    return clean.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 mb-2 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-l from-[#1a2340] to-[#2D3864] px-5 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">تواصل معنا مباشرة</h4>
                    <p className="text-white/50 text-[11px] mt-0.5">عادةً نرد خلال دقائق</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white hover:bg-white/10 rounded-lg w-7 h-7 flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3">
              {users.map((user) => (
                <div
                  key={user.name}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2D3864] to-[#4a5a8c] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-400" dir="ltr">{formatDisplay(user.whatsapp)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${user.whatsapp}`}
                      className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-[#2D3864] hover:text-white flex items-center justify-center transition-colors"
                      title="اتصال"
                    >
                      <Phone size={14} />
                    </a>
                    <a
                      href={`https://wa.me/${user.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center transition-colors shadow-sm group-hover:scale-105"
                      title="واتساب"
                    >
                      <Send size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="تواصل معنا عبر واتساب"
        className="relative w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:scale-105 hover:shadow-xl transition-all"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-ping motion-reduce:hidden opacity-30" />
        )}
        {isOpen ? <X size={28} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
}
