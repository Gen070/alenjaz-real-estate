'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'سنوات الخبرة', value: '+15' },
  { label: 'عقار مدار', value: '+500' },
  { label: 'عميل سعيد', value: '+2000' },
  { label: 'صفقة ناجحة', value: '+1200' }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-[var(--color-navy)] text-white relative overflow-hidden">
      {/* Decorative background */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{ 
          backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')",
          backgroundRepeat: 'repeat',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <h3 className="text-4xl md:text-5xl font-black text-[var(--color-gold)] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stat.value}
              </h3>
              <p className="text-lg md:text-xl font-bold text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
