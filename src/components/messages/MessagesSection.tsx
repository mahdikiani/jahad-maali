import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, Star, MessageSquare, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import type { Message, AuthState } from '../../types';
import { useLang } from '../../lib/LangContext';
import { t, formatNumber } from '../../lib/i18n';

interface MessagesSectionProps {
  auth: AuthState;
  onLoginRequired: () => void;
}

export function MessagesSection({ auth, onLoginRequired }: MessagesSectionProps) {
  const { lang } = useLang();
  const [featured, setFeatured] = useState<{ today: Message | null; top: Message[] }>({ today: null, top: [] });
  const [showAll, setShowAll] = useState(false);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [myVotes, setMyVotes] = useState<number[]>([]);
  const [voting, setVoting] = useState<number | null>(null);

  useEffect(() => {
    api.getFeaturedMessages().then(d => setFeatured(d as any)).catch(() => {});
    if (auth.user) api.getMyVotes().then(setMyVotes).catch(() => {});
  }, [auth.user]);

  const loadAll = async () => {
    if (!showAll) {
      const all = await fetch('/api/messages/featured').then(r => r.json()).catch(() => ({ top: [] }));
      setAllMessages(all.top || []);
    }
    setShowAll(v => !v);
  };

  const handleVote = async (msg: Message) => {
    if (!auth.user) return onLoginRequired();
    if (myVotes.includes(msg.id) || voting === msg.id) return;
    setVoting(msg.id);
    try {
      await api.voteMessage(msg.id);
      setMyVotes(v => [...v, msg.id]);
      setFeatured(prev => ({
        today: prev.today?.id === msg.id ? { ...prev.today, vote_count: prev.today.vote_count + 1 } : prev.today,
        top: prev.top.map(m => m.id === msg.id ? { ...m, vote_count: m.vote_count + 1 } : m),
      }));
    } catch {}
    finally { setVoting(null); }
  };

  const messages = showAll ? allMessages : featured.top;

  return (
    <section className="py-20 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-r-4 border-[#8B7355] pr-5 mb-12">
          <h2 className="text-3xl font-black text-white mb-1">{t(lang, 'messagesTitle')}</h2>
          <p className="text-white/50">{t(lang, 'messagesSubtitle')}</p>
        </div>

        {featured.today && (
          <div className="mb-10 p-6 bg-[#8B7355]/10 border border-[#8B7355]/30 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[#D2B48C] fill-current" />
              <span className="text-[#D2B48C] font-bold text-sm">{t(lang, 'todayMessage')}</span>
            </div>
            <MessageCard msg={featured.today} myVotes={myVotes} voting={voting} onVote={handleVote} featured lang={lang} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <MessageCard msg={msg} myVotes={myVotes} voting={voting} onVote={handleVote} lang={lang} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {messages.length === 0 && (
          <p className="text-center text-white/30 py-10">{t(lang, 'noMessages')}</p>
        )}

        <div className="text-center mt-8">
          <button onClick={loadAll}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all text-sm">
            <MessageSquare className="w-4 h-4" />
            {showAll ? t(lang, 'showLess') : t(lang, 'showAll')}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
}

function MessageCard({ msg, myVotes, voting, onVote, featured = false, lang }: {
  msg: Message; myVotes: number[]; voting: number | null;
  onVote: (m: Message) => void; featured?: boolean; lang: any;
}) {
  const voted = myVotes.includes(msg.id);
  return (
    <div className={`p-5 rounded-3xl border flex flex-col gap-3 h-full ${featured ? 'bg-[#8B7355]/10 border-[#8B7355]/30' : 'bg-white/5 border-white/10'}`}>
      <p className="text-white text-sm italic leading-relaxed flex-1">«{msg.text}»</p>
      <div className="flex justify-between items-center pt-3 border-t border-white/10">
        <div>
          <p className="text-white/40 text-xs">{msg.campaign_title || ''}</p>
          <p className="text-[#D2B48C] text-xs font-bold mt-0.5">
            {formatNumber(msg.donation_amount, lang)} {t(lang, 'toman')} — {msg.user_name || t(lang, 'anonymous')}
          </p>
        </div>
        <button onClick={() => onVote(msg)} disabled={voted || voting === msg.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${voted ? 'bg-[#8B7355]/30 text-[#D2B48C] cursor-default' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}>
          <ThumbsUp className="w-3.5 h-3.5" />
          {msg.vote_count}
        </button>
      </div>
    </div>
  );
}
