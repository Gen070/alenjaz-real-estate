'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import Link from 'next/link';
import { getProperties } from '@/lib/queries';
import type { Property } from '@/lib/supabase';

const categories = ['جميع العقارات', 'فلل', 'شقق', 'أراضي', 'مكاتب', 'تجاري'];

export function FeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('جميع العقارات');
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties().then((data) => setProperties(data.slice(0, 6)));
  }, []);

  const filteredProperties = properties.filter(prop =>
    activeCategory === 'جميع العقارات' ? true : prop.category === activeCategory
  );

  return (
    <section id="properties" className="py-24 bg-white relative">
      
      {/* Decorative Faint Ribbons (From User Feedback) */}
      
      {/* Right Ribbon (Riyadh & Jeddah mixture) */}
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 lg:w-64 pointer-events-none opacity-30 z-0 hidden md:flex flex-col overflow-hidden">
        <div className="w-full h-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-riyadh.jpg')" }} />
        <div className="w-full h-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-side-1.jpg')" }} />
        <div className="w-full h-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-side-2.jpg')" }} />
        {/* Fades to white towards the center of the page */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white" />
      </div>
      
      {/* Left Ribbon (Riyadh & Jeddah mixture) */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 lg:w-64 pointer-events-none opacity-30 z-0 hidden md:flex flex-col overflow-hidden">
        <div className="w-full h-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-side-2.jpg')" }} />
        <div className="w-full h-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-riyadh.jpg')" }} />
        <div className="w-full h-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-side-1.jpg')" }} />
        {/* Fades to white towards the center of the page */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[var(--color-navy)] mb-4"
          >
            العروض العقارية
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg"
          >
            تصفح أحدث العقارات المتوفرة للبيع والإيجار
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-12 justify-start md:justify-center" dir="rtl">
          <div className="flex whitespace-nowrap px-4 md:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-4 text-lg font-bold transition-colors relative ${
                  activeCategory === category 
                    ? 'text-[var(--color-navy)]' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {category}
                {activeCategory === category && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-navy)] rounded-t-lg"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property) => (
              <Link href={`/property/${property.id}`} key={property.id} className="block group">
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                {/* Image Box */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-[var(--color-navy)] shadow-sm">
                    {property.type}
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-0" />
                  {property.image ? (
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col flex-grow text-right">
                  <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2 line-clamp-1 group-hover:text-[var(--color-gold)] transition-colors">{property.title}</h3>
                  <p className="flex items-center gap-2 text-gray-500 mb-4 justify-end">
                    <span>{property.location}</span>
                    <MapPin size={16} className="text-[var(--color-navy)]" />
                  </p>
                  
                  {/* Features */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex flex-col items-center gap-1">
                      <Square size={20} className="text-gray-400 group-hover:text-[var(--color-navy)] transition-colors" />
                      <span className="text-sm font-medium">{property.area}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Bath size={20} className="text-gray-400 group-hover:text-[var(--color-navy)] transition-colors" />
                      <span className="text-sm font-medium">{property.baths} حمام</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Bed size={20} className="text-gray-400 group-hover:text-[var(--color-navy)] transition-colors" />
                      <span className="text-sm font-medium">{property.beds} غرف</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-12">
          <Link href="/properties" className="inline-block bg-[var(--color-lightblue)] text-[var(--color-navy)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-navy)] hover:text-white transition-colors">
            عرض جميع العقارات
          </Link>
        </div>
      </div>
    </section>
  );
}
