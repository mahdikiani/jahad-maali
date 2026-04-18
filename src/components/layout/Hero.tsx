import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../../lib/LangContext';
import { t } from '../../lib/i18n';

const AYAH = `لَا يَسْتَوِي الْقَاعِدُونَ مِنَ الْمُؤْمِنِينَ غَيْرُ أُولِي الضَّرَرِ وَالْمُجَاهِدُونَ فِي سَبِيلِ اللَّهِ بِأَمْوَالِهِمْ وَأَنفُسِهِمْ ۚ فَضَّلَ اللَّهُ الْمُجَاهِدِينَ بِأَمْوَالِهِمْ وَأَنفُسِهِمْ عَلَى الْقَاعِدِينَ دَرَجَةً ۚ وَكُلًّا وَعَدَ اللَّهُ الْحُسْنَىٰ ۚ وَفَضَّلَ اللَّهُ الْمُجَاهِدِينَ عَلَى الْقَاعِدِينَ أَجْرًا عَظِيمًا ﴿٩٥﴾`;

const BG_VIDEO = 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4';

interface HeroProps {
  onScrollDown: () => void;
}

export function Hero({ onScrollDown }: HeroProps) {
  const { lang } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const timer = setTimeout(() => { video.src = BG_VIDEO; video.load(); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { v: t(lang, 'heroStat1Value'), l: t(lang, 'heroStat1Label') },
    { v: t(lang, 'heroStat2Value'), l: t(lang, 'heroStat2Label') },
    { v: t(lang, 'heroStat3Value'), l: t(lang, 'heroStat3Label') },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-950 py-20">
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-25' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950/85" />
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#D2B48C 0,#D2B48C 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center space-y-10">
        {/* Ayah — always Arabic */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="p-8 rounded-[40px] border border-[#D2B48C]/20 bg-white/5 backdrop-blur-md"
        >
          <p dir="rtl" className="text-[#F5E6C8] leading-loose text-xl md:text-2xl" style={{ fontFamily: '"me_quran", serif' }}>
            {AYAH}
          </p>
          <div className="my-5 h-px w-1/3 mx-auto bg-[#D2B48C]/25" />
          <p className="text-white/50 text-sm leading-relaxed italic">
            {t(lang, 'heroAyahTranslation')}
          </p>
          <p className="mt-3 text-[#D2B48C] text-xs font-bold tracking-wide">{t(lang, 'heroAyahRef')}</p>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white tracking-tight">
            {t(lang, 'heroTitle')}<br />
            <span className="text-[#D2B48C]">{t(lang, 'heroTitleHighlight')}</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            {t(lang, 'heroSubtitle')}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <button
            onClick={onScrollDown}
            className="px-10 py-4 bg-[#8B7355] text-white rounded-2xl font-black text-lg hover:bg-[#705D45] transition-all shadow-lg shadow-[#8B7355]/30"
          >
            {t(lang, 'heroCta')}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
        >
          {stats.map(s => (
            <div key={s.l} className="py-4 px-2 bg-white/5 rounded-2xl border border-white/10 text-center">
              <p className="text-2xl font-black text-[#D2B48C]">{s.v}</p>
              <p className="text-xs text-white/40 mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.button
        onClick={onScrollDown}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
}
