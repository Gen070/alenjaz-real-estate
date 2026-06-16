'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Megaphone, Handshake } from 'lucide-react';

const services = [
  {
    icon: <Building2 size={32} className="text-[var(--color-gold)]" />,
    title: 'إدارة الأملاك',
    description: 'نقدم حلولاً متكاملة لإدارة عقارك بأعلى كفاءة، تشمل التحصيل والصيانة الدورية للحفاظ على قيمة أصولك.'
  },
  {
    icon: <Megaphone size={32} className="text-[var(--color-gold)]" />,
    title: 'التسويق العقاري',
    description: 'حملات تسويقية احترافية للوصول للمشتري المستهدف في أسرع وقت عبر قنوات رقمية مبتكرة.'
  },
  {
    icon: <Handshake size={32} className="text-[var(--color-gold)]" />,
    title: 'البيع والشراء',
    description: 'تسهيل صفقات البيع والشراء بضمان أعلى درجات الشفافية والموثوقية لحماية حقوق جميع الأطراف.'
  }
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-navy)] mb-4">خدماتنا العقارية</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">نقدم باقة متكاملة من الخدمات العقارية لضمان تجربة استثمارية ناجحة ومريحة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 p-8 rounded-3xl hover:bg-[var(--color-navy)] hover:-translate-y-2 transition-all duration-300 group border border-gray-100"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-white/10 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--color-navy)] group-hover:text-white mb-4 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
