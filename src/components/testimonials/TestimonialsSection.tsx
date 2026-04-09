import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { api } from '../../lib/api';
import type { Testimonial } from '../../types';

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => { api.getTestimonials().then(setItems).catch(() => {}); }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-r-4 border-[#8B7355] pr-5 mb-12">
          <h2 className="text-3xl font-black text-stone-900 mb-1">صدای مشارکت‌کنندگان</h2>
          <p className="text-stone-500">تجربه کسانی که در این مسیر قدم گذاشتند</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-3xl border border-[#6B5E3B]/10 shadow-sm flex flex-col gap-4">
              <Quote className="w-8 h-8 text-[#C2A56B]" />
              <p className="text-[#1F3D2B] text-sm leading-relaxed flex-1">«{t.text}»</p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-9 h-9 rounded-full bg-[#8B7355] flex items-center justify-center text-white font-black text-sm">
                  {t.name ? t.name[0] : '؟'}
                </div>
                <span className="text-sm font-bold text-[#6B5E3B]">{t.name || 'ناشناس'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
