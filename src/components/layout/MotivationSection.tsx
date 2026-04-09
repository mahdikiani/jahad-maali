export function MotivationSection() {
  return (
    <section className="py-20 bg-stone-900">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <p
            className="text-3xl md:text-4xl text-[#F5E6C8] leading-loose"
            dir="rtl"
            style={{ fontFamily: '"me_quran", serif' }}
          >
            «مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ»
          </p>
          <p className="text-[#D2B48C] text-sm font-bold">سوره بقره — آیه ۲۶۱</p>
        </div>

        <div className="h-px bg-[#D2B48C]/20 w-1/3 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {[
            { title: 'صدقه جاریه', text: 'هر کمکی که می‌کنید، حتی پس از شما نیز ثواب آن جاری است.' },
            { title: 'جهاد با مال', text: 'خداوند مجاهدان با مال را بر خانه‌نشینان برتری داده است.' },
            { title: 'شفافیت کامل', text: 'هر ریال کمک شما با گزارش مستند به مصرف می‌رسد.' },
          ].map(item => (
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
