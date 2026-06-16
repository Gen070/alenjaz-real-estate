'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ChevronDown, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'العروض العقارية', href: '/properties', hasDropdown: true },
  { label: 'تواصل معنا', href: '/#contact', hasDropdown: true },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 relative flex flex-col font-sans shadow-sm">
      {/* Islamic Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')",
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Top Thin Bar - desktop only */}
      <div className="w-full border-b border-gray-100 bg-white/60 relative z-10 hidden md:block">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-[0.8rem] text-gray-600 font-medium">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#0B4A5D]" />
              <span>مكة المكرمة</span>
            </div>
            {mounted && (
              <>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#0B4A5D]" />
                  <span>{time.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#0B4A5D]" />
                  <span>{time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </>
            )}
          </div>
          <div></div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[95%] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 relative z-10 flex items-center justify-between">

        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.jpeg" alt="شعار الانجاز للعقار" className="w-11 h-11 md:w-14 md:h-14 object-contain rounded-full border border-gray-100 shadow-sm" />
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-extrabold text-[#0B4A5D] tracking-wide leading-tight">الإنجاز للعقار</h1>
              <span className="text-[9px] md:text-[10px] text-gray-500 tracking-wider font-bold">ALENJAZ REAL ESTATE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[0.95rem] text-[#111] font-bold">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[#0B4A5D] transition-colors flex items-center gap-1">
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} className="text-gray-400" />}
              </Link>
            ))}
          </nav>
        </div>

        {/* Hamburger Button - mobile only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-[#0B4A5D] border border-gray-200"
          aria-label="القائمة"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative z-20 bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-[95%] mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-[#111] font-bold text-base hover:bg-gray-50 hover:text-[#0B4A5D] transition-colors"
              >
                <span>{link.label}</span>
                {link.hasDropdown && <ChevronDown size={16} className="text-gray-400" />}
              </Link>
            ))}
            {/* Mobile contact info */}
            <div className="mt-3 pt-3 border-t border-gray-100 px-4 flex flex-col gap-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#0B4A5D]" />
                <span>مكة المكرمة</span>
              </div>
              {mounted && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#0B4A5D]" />
                  <span>{time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
