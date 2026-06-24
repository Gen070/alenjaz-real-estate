'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface CityImages {
  riyadh?: string;
  jeddah?: string;
  madinah?: string;
}

const FALLBACK = {
  riyadh:
    'https://images.unsplash.com/photo-1578895101408-1a36b834405b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  jeddah:
    'https://images.unsplash.com/photo-1604999333679-b86d54738315?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  madinah:
    'https://images.unsplash.com/photo-1565019011521-b0575cbb57c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

export function CitiesSection({ images }: { images?: CityImages }) {
  const cities = [
    {
      id: 1,
      name: 'الرياض',
      description: 'قلب المملكة النابض بالاستثمارات',
      image: images?.riyadh || FALLBACK.riyadh,
      propertiesCount: 'استكشف العروض',
    },
    {
      id: 2,
      name: 'جدة',
      description: 'عروس البحر الأحمر وواجهة الأعمال',
      image: images?.jeddah || FALLBACK.jeddah,
      propertiesCount: 'استكشف العروض',
    },
    {
      id: 3,
      name: 'المدينة المنورة',
      description: 'طيبة الطيبة وسوق واعد ومتنامي',
      image: images?.madinah || FALLBACK.madinah,
      propertiesCount: 'استكشف العروض',
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-[var(--color-navy)] mb-4"
          >
            نغطي أهم مدن المملكة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            استكشف العقارات والفرص الاستثمارية في الوجهات الأكثر طلباً
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cities.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group rounded-[2rem] overflow-hidden h-[400px] cursor-pointer"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-[var(--color-navy)]/90 transition-colors duration-500" />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-right">
                <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium w-max ms-auto mb-4 border border-white/30">
                  {city.propertiesCount}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{city.name}</h3>
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {city.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
