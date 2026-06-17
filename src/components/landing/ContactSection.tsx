import React from 'react';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { getSiteSettings } from '@/lib/queries';

export async function ContactSection() {
  const settings = await getSiteSettings();

  const locationText = settings.location_text ?? 'مكة المكرمة، المملكة العربية السعودية';

  const users = [
    {
      name: settings.user1_name || 'المبيعات الرئيسية',
      phone: settings.user1_phone || settings.phone_1 || '0544666760',
      whatsapp: settings.user1_whatsapp || settings.whatsapp || '966544666760',
    },
    {
      name: settings.user2_name || 'الدعم الفني',
      phone: settings.user2_phone || settings.phone_2 || '0507007604',
      whatsapp: settings.user2_whatsapp || (settings.phone_2 ? `966${settings.phone_2.replace(/^0/, '')}` : '966507007604'),
    },
  ];

  return (
    <section id="contact" className="py-24 bg-white border-t border-zinc-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-navy)] mb-4">تواصل معنا</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">نحن هنا لمساعدتك في جميع احتياجاتك العقارية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left - Contact Info */}
          <div className="space-y-6">

            {/* Location */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-navy)] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-0.5">الموقع</p>
                <p className="font-bold text-[var(--color-navy)] text-base">{locationText}</p>
              </div>
            </div>

            {/* Users contact cards */}
            {users.map((user) => (
              <div key={user.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-navy)] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-[var(--color-navy)] text-base">{user.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/${user.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#20bd5a] transition-colors text-sm shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    واتساب
                  </a>
                  <a
                    href={`tel:${user.phone}`}
                    className="flex items-center justify-center gap-2 bg-white text-[var(--color-navy)] font-bold py-3 px-4 rounded-xl border-2 border-[var(--color-navy)] hover:bg-blue-50 transition-colors text-sm"
                    dir="ltr"
                  >
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </a>
                </div>
              </div>
            ))}

          </div>

          {/* Right - Map */}
          <div className="w-full h-[480px] bg-zinc-100 rounded-3xl overflow-hidden shadow-lg border border-zinc-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4564.111208180004!2d39.69663800000001!3d21.615338299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c1f5e0a6381a0b%3A0x5ac310abe1d011f2!2z2YXZg9iq2Kgg2KfZhNin2YbYrNin2LIg2YTZhNiu2K_Zhdin2Kog2KfZhNi52KfZhdip!5e1!3m2!1sar!2ssa!4v1781573270293!5m2!1sar!2ssa"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
