'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

const bgImages = [
  '/images/hero-riyadh.jpg',
  '/images/bg-side-1.jpg',
  '/images/bg-side-2.jpg'
];

const newOffers = [
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'فيلا فاخرة للبيع',
    price: '2,500,000 ر.س',
    location: 'الرياض، الياسمين'
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'مكتب تجاري واسع',
    price: '60,000 ر.س / سنوياً',
    location: 'جدة، الشاطئ'
  },
  {
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d966ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'شقة فاخرة مطلة على البحر',
    price: '85,000 ر.س / سنوياً',
    location: 'جدة، الكورنيش'
  }
];

export function HeroSection() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);

  // Background Slideshow Effect
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000);
    return () => clearInterval(bgTimer);
  }, []);

  // Box Slideshow Effect
  useEffect(() => {
    const boxTimer = setInterval(() => {
      setCurrentBoxIndex((prev) => (prev + 1) % newOffers.length);
    }, 5000);
    return () => clearInterval(boxTimer);
  }, []);

  const currentOffer = newOffers[currentBoxIndex];

  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-[#0a0a0a] overflow-hidden" dir="rtl">

      {/* 1. Main Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-left md:bg-center"
          style={{ backgroundImage: `url('${bgImages[currentBgIndex]}')` }}
        />
      </AnimatePresence>

      {/* 2. Gradient Overlay (Dark on right, transparent on left) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/30" />

      {/* 3. Islamic Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')",
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="w-full max-w-[98%] mx-auto px-4 lg:px-8 relative z-10 py-20">

        {/* Small "حياكم الله" in the top right area, moved down and left per user request */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-12 right-12 lg:top-24 lg:right-23"
        >
          <span
            className="text-white/95 font-extrabold text-3xl md:text-4xl lg:text-5xl drop-shadow-xl tracking-wide"
          >
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 pb-24">
          
          {/* Right Text Content */}
          <div className="text-right lg:col-span-7">
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8 inline-block"
            >
              <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center overflow-hidden p-2">
                <Image
                  src="/logo.jpeg"
                  alt="الإنجاز للعقار"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl"
            >
              الإنجاز للعقار
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-white/95 leading-[1.8] drop-shadow-lg font-bold max-w-2xl"
            >
              بوابة الإنجاز للعقار منصة تجمع لك أفضل الفرص والعروض العقارية في مكان واحد، تختصر عليك عناء البحث والمشاوير، وتجعل تجربة البيع والشراء أو الإيجار موثوقة، سريعة، وسهلة. خيارك الأمثل لجميع احتياجاتك العقارية.
            </motion.p>
          </div>

          {/* Left Animated Property Box */}
          <div className="relative h-[400px] md:h-[550px] w-full flex items-center justify-center lg:justify-end lg:col-span-5">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-md h-[90%] bg-white/10 backdrop-blur-md rounded-[3rem] shadow-2xl p-4 overflow-hidden border border-white/20"
            >
              <div className="w-full h-full bg-gray-100 rounded-[2rem] overflow-hidden relative shadow-inner">

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentBoxIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${currentOffer.image}')` }}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent" />

                {/* Floating Price Tag */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`price-${currentBoxIndex}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg text-[#0B4A5D] font-black text-lg flex items-center gap-2"
                    dir="ltr"
                  >
                    {currentOffer.price}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 w-full p-8 text-white relative z-10 text-right">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-3 border border-white/30">
                    عروض جديدة
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${currentBoxIndex}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-3xl font-bold mb-2">{currentOffer.title}</h3>
                      <p className="flex items-center justify-end gap-2 text-gray-200">
                        {currentOffer.location} <MapPin size={18} />
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
