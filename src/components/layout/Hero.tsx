import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const AYAH = `لَا يَسْتَوِي الْقَاعِدُونَ مِنَ الْمُؤْمِنِينَ غَيْرُ أُولِي الضَّرَرِ وَالْمُجَاهِدُونَ فِي سَبِيلِ اللَّهِ بِأَمْوَالِهِمْ وَأَنفُسِهِمْ ۚ فَضَّلَ اللَّهُ الْمُجَاهِدِينَ بِأَمْوَالِهِمْ وَأَنفُسِهِمْ عَلَى الْقَاعِدِينَ دَرَجَةً ۚ وَكُلًّا وَعَدَ اللَّهُ الْحُسْنَىٰ ۚ وَفَضَّلَ اللَّهُ الْمُجَاهِدِينَ عَلَى الْقَاعِدِينَ أَجْرًا عَظِيمًا ﴿٩٥﴾`;

const TRANSLATION = `مؤمنانی که بدون عذر در خانه نشستند با مجاهدانی که با مال و جان خود در راه خدا جهاد کردند یکسان نیستند. خداوند مجاهدان با مال و جان را بر خانه‌نشینان یک درجه برتری داده؛ و به هر دو گروه وعده نیکو داده؛ و مجاهدان را بر خانه‌نشینان به پاداشی بزرگ برتری بخشیده است.`;

const BG_VIDEO = 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4';

interface HeroProps {
  onScrollDown: () => void;
}

export function Hero({ onScrollDown }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const timer = setTimeout(() => { video.src = BG_VIDEO; video.load(); }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-950 py-20">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-25' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950/85" />
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#D2B48C 0,#D2B48C 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center space-y-10">

        {/* Ayah */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="p-8 rounded-[40px] border border-[#D2B48C]/20 bg-white/5 backdrop-blur-md"
        >
          <p
            dir="rtl"
            className="text-[#F5E6C8] leading-loose text-xl md:text-2xl"
            style={{ fontFamily: '"me_quran", serif' }}
          >
            {AYAH}
          </p>
          <div className="my-5 h-px w-1/3 mx-auto bg-[#D2B48C]/25" />
          <p className="text-white/50 text-sm leading-relaxed italic">
            {TRANSLATION}
          </p>
          <p className="mt-3 text-[#D2B48C] text-xs font-bold tracking-wide">سوره مبارکه نساء — آیه ۹۵</p>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white tracking-tight">
            جهاد با مال،<br />
            <span className="text-[#D2B48C]">فریضه‌ای که خدا برتری داده</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            امروز جبهه مقاومت نیازمند همت شماست. هر ریال انفاق شما، سنگری است که خداوند آن را با پاداشی عظیم پاداش می‌دهد.
          </p>
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onScrollDown}
            className="px-10 py-4 bg-[#8B7355] text-white rounded-2xl font-black text-lg hover:bg-[#705D45] transition-all shadow-lg shadow-[#8B7355]/30"
          >
            مشاهده کمپین‌ها و مشارکت
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
        >
          {[
            { v: '۴+', l: 'کمپین فعال' },
            { v: '۳۴۰+', l: 'مشارکت‌کننده' },
            { v: '۸۰+', l: 'خانواده تحت پوشش' },
          ].map(s => (
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
