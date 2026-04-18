import { useLang } from '../../lib/LangContext';
import { t } from '../../lib/i18n';

const AYAH_MOTIV = `«مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ»`;

export function MotivationSection() {
  const { lang } = useLang();

  const cards = [
    { title: t(lang, 'motivCard1Title'), text: t(lang, 'motivCard1Text') },
    { title: t(lang, 'motivCard2Title'), text: t(lang, 'motivCard2Text') },
    { title: t(lang, 'motivCard3Title'), text: t(lang, 'motivCard3Text') },
  ];

  return (
    <section className="py-20 bg-stone-900">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <p
            className="text-3xl md:text-4xl text-[#F5E6C8] leading-loose"
            dir="rtl"
            style={{ fontFamily: '"me_quran", serif' }}
          >
            {AYAH_MOTIV}
          </p>
          <p className="text-[#D2B48C] text-sm font-bold">{t(lang, 'motivationAyahRef')}</p>
        </div>

        <div className="h-px bg-[#D2B48C]/20 w-1/3 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {cards.map(item => (
            <div key={item.title} className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="font-black text-[#D2B48C] text-lg mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
