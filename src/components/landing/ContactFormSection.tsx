'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitMessage } from '@/lib/queries';

export function ContactFormSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState('أبحث عن عقار للشراء');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      await submitMessage({
        name: name.trim(),
        phone: phone.trim(),
        request_type: requestType,
        details: details.trim() || undefined,
      });
      setStatus('success');
      setName('');
      setPhone('');
      setDetails('');
      setRequestType('أبحث عن عقار للشراء');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">

          {/* Right Side - Info */}
          <div className="w-full md:w-5/12 bg-[var(--color-navy)] text-white p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent rounded-full opacity-50 pointer-events-none" />
            <h3 className="text-3xl font-extrabold mb-4 relative z-10">تبحث عن عقار أو ترغب في عرض عقارك؟</h3>
            <p className="text-blue-100 mb-8 relative z-10 leading-relaxed text-lg">
              فريقنا مستعد لتلبية جميع احتياجاتك العقارية. اترك بياناتك وسنقوم بالتواصل معك في أقرب وقت ممكن.
            </p>
          </div>

          {/* Left Side - Form */}
          <div className="w-full md:w-7/12 p-10">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2 flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">الاسم الكريم</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div className="w-full sm:w-1/2 flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">رقم الجوال</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all"
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">نوع الطلب</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all appearance-none"
                >
                  <option>أبحث عن عقار للشراء</option>
                  <option>أبحث عن عقار للإيجار</option>
                  <option>أرغب في عرض عقاري</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">تفاصيل الطلب (اختياري)</label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-navy)] transition-all resize-none"
                  placeholder="اكتب تفاصيل طلبك هنا..."
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">
                  <CheckCircle size={20} />
                  <span className="font-bold">تم استلام طلبك بنجاح. سنتواصل معك قريباً.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
                  <AlertCircle size={20} />
                  <span className="font-bold">حدث خطأ. حاول مرة أخرى أو تواصل عبر الواتساب.</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
                className="bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-lg py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
