import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { api } from '../../lib/api';
import type { Testimonial } from '../../types';
import { useLang } from '../../lib/LangContext';
import { t } from '../../lib/i18n';

export function TestimonialsSection() {
  const { lang } = useLang();
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => { api.getTestimonials().then(setItems).catch(() => {}); }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-r-4 border-[#8B7355] pr-5 mb-12">
          <h2 className="text-3xl font-black text-stone-900 mb-1">{t(lang, 'testimonialsTitle')}</h2>
          <p className="text-stone-500">{t(lang, 'testimonialsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-[#6B5E3B]/10 shadow-sm flex flex-col gap-4">
              <Quote className="w-8 h-8 text-[#C2A56B]" />
              <p className="text-[#1F3D2B] text-sm leading-relaxed flex-1">«{item.text}»</p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-9 h-9 rounded-full bg-[#8B7355] flex items-center justify-center text-white font-black text-sm">
                  {item.name ? item.name[0] : '؟'}
                </div>
                <span className="text-sm font-bold text-[#6B5E3B]">{item.name || t(lang, 'anonymous')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
