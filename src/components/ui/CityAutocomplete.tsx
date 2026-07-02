'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { SAUDI_CITIES } from '@/lib/saudi-cities';

interface Props {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  className?: string;
}

// قائمة اقتراح مدن مصمّمة بهوية الموقع — بديل عن <datalist> الأصلية التي تظهر
// بتنسيق نظام التشغيل الافتراضي (أسود في الوضع الداكن) ولا يمكن تنسيقها بـ CSS.
export function CityAutocomplete({ value, onChange, name, placeholder, className }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const query = value.trim();
  const filtered = query
    ? SAUDI_CITIES.filter((c) => c.includes(query))
    : SAUDI_CITIES;

  return (
    <div ref={wrapperRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-30 mt-1.5 w-full max-h-56 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg py-1.5">
          {filtered.map((c) => (
            <button
              type="button"
              key={c}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(c); setOpen(false); }}
              className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2D3864] transition-colors flex items-center gap-2"
            >
              <MapPin size={12} className="text-gray-300 shrink-0" />
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
