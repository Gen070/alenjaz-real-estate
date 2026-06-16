import React from 'react';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-white border-t border-zinc-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-navy)] mb-4">تواصل معنا</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">نحن هنا لمساعدتك في جميع احتياجاتك العقارية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left - Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-8">بياناتنا</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-navy)] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[var(--color-navy)] mb-1">الموقع</h4>
                    <p className="text-gray-600 leading-relaxed">مكة المكرمة، المملكة العربية السعودية</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-navy)] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[var(--color-navy)] mb-2">أرقام التواصل</h4>
                    <div className="space-y-2">
                      <a href="tel:0544666760" className="block text-gray-600 hover:text-[var(--color-navy)] transition-colors font-medium" dir="ltr">
                        0544666760
                      </a>
                      <a href="tel:0507007604" className="block text-gray-600 hover:text-[var(--color-navy)] transition-colors font-medium" dir="ltr">
                        0507007604
                      </a>
                      <a href="tel:05550330103" className="block text-gray-600 hover:text-[var(--color-navy)] transition-colors font-medium" dir="ltr">
                        05550330103
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <a
                  href="https://wa.me/966544666760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex h-14 items-center justify-center rounded-2xl bg-[#25D366] px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#20bd5a] hover:shadow-xl gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </div>

          {/* Right - Map */}
          <div className="w-full h-[450px] bg-zinc-100 rounded-3xl overflow-hidden shadow-lg border border-zinc-200">
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
