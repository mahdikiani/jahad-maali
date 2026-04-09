import type { Campaign } from '../../types';

interface FinalCTAProps {
  campaigns: Campaign[];
  onDonate: (campaign: Campaign) => void;
}

export function FinalCTA({ campaigns, onDonate }: FinalCTAProps) {
  const active = campaigns.filter(c => c.status === 'active');

  return (
    <section className="py-24 bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
          الان اقدام کن
        </h2>
        <p className="text-white/55 text-lg leading-relaxed">
          هر لحظه تأخیر، یک خانواده بیشتر در انتظار می‌ماند. جهاد با مال، همین لحظه است.
        </p>

        {/* Campaign picker */}
        {active.length > 0 && (
          <div className="space-y-3">
            {active.map(c => (
              <button key={c.id} onClick={() => onDonate(c)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#8B7355]/40 transition-all group text-right">
                <div>
                  <p className="font-bold text-white text-sm">{c.title}</p>
                  <p className="text-stone-500 text-xs mt-0.5">
                    {c.current_amount.toLocaleString('fa-IR')} از {c.target_amount.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <span className="px-4 py-2 bg-[#8B7355] text-white rounded-xl text-sm font-bold group-hover:bg-[#705D45] transition-colors shrink-0 mr-4">
                  کمک کن
                </span>
              </button>
            ))}
          </div>
        )}

        <p
          className="text-xl text-[#D2B48C]/50"
          dir="rtl"
          style={{ fontFamily: '"me_quran", serif' }}
        >
          «وَأَنفِقُوا فِي سَبِيلِ اللَّهِ»
        </p>
      </div>
    </section>
  );
}
