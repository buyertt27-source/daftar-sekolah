import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Instagram,
  Video,
  Youtube,
  ShieldCheck,
  Star,
  Award,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { STORE_INFO } from '../data/dimsumData';

interface Slide1PortfolioProps {
  onGoNext: () => void;
}

interface SocialCard {
  id: string;
  name: string;
  tag: string;
  url: string;
  icon: 'whatsapp' | 'instagram' | 'tiktok' | 'youtube';
  colorBorder: string;
  bgGlow: string;
  iconColor: string;
  description: string;
  badge: string;
}

const SOCIAL_ITEMS: SocialCard[] = [
  {
    id: 'wa',
    name: 'WhatsApp',
    tag: '+62 838-6294-9796',
    url: 'https://wa.me/6283862949796?text=Halo%20Dimsum%20Istimewa,%20saya%20ingin%20tanya%20produk',
    icon: 'whatsapp',
    colorBorder: 'border-emerald-400/50 hover:border-emerald-500',
    bgGlow: 'bg-emerald-500/10 text-emerald-600',
    iconColor: 'text-emerald-600',
    description: 'Order cepat 24 jam',
    badge: 'Fast Respon',
  },
  {
    id: 'ig',
    name: 'Instagram',
    tag: '@dimsumistimewa.id',
    url: 'https://instagram.com',
    icon: 'instagram',
    colorBorder: 'border-pink-400/50 hover:border-pink-500',
    bgGlow: 'bg-pink-500/10 text-pink-600',
    iconColor: 'text-pink-600',
    description: '35.4K Followers',
    badge: 'Katalog Visual',
  },
  {
    id: 'tt',
    name: 'TikTok',
    tag: '@dimsumistimewa',
    url: 'https://tiktok.com',
    icon: 'tiktok',
    colorBorder: 'border-cyan-400/50 hover:border-cyan-500',
    bgGlow: 'bg-cyan-500/10 text-cyan-600',
    iconColor: 'text-cyan-600',
    description: '128.5K Likes',
    badge: 'Video Mukbang',
  },
  {
    id: 'yt',
    name: 'YouTube',
    tag: 'Dimsum Istimewa TV',
    url: 'https://youtube.com',
    icon: 'youtube',
    colorBorder: 'border-orange-400/50 hover:border-orange-500',
    bgGlow: 'bg-orange-500/10 text-orange-600',
    iconColor: 'text-orange-600',
    description: 'Resep & Tips',
    badge: 'Official Media',
  },
];

export default function Slide1Portfolio({ onGoNext }: Slide1PortfolioProps) {
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const lastTapRef = useRef<{ [key: string]: number }>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const renderIcon = (type: SocialCard['icon']) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />;
      case 'instagram':
        return <Instagram className="w-7 h-7 sm:w-8 sm:h-8" />;
      case 'tiktok':
        return <Video className="w-7 h-7 sm:w-8 sm:h-8" />;
      case 'youtube':
        return <Youtube className="w-7 h-7 sm:w-8 sm:h-8" />;
    }
  };

  // Double click / Double tap handler
  const handleItemInteraction = (item: SocialCard) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[item.id] || 0;
    const isDoubleTap = now - lastTap < 450; // Within 450ms is double tap

    if (isDoubleTap) {
      // Double tap confirmed! Open URL
      lastTapRef.current[item.id] = 0;
      setActiveNotice(null);
      window.open(item.url, '_blank');
    } else {
      // Single tap: record time and prompt user to tap once more
      lastTapRef.current[item.id] = now;
      setActiveNotice(`Ketuk 1x lagi untuk buka ${item.name}`);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setActiveNotice(null);
      }, 1800);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto relative z-10 select-none overflow-hidden text-slate-900">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pt-2"
      >
        {/* Halal & Official Badge */}
        <div className="inline-flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-sky-200 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-sky-700 font-bold">100% Halal & Higienis</span>
          <span className="text-slate-300">•</span>
          <span className="text-orange-600 font-bold">Daging Asli Ayam & Udang</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-sky-600 bg-clip-text text-transparent">
            {STORE_INFO.name}
          </span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto font-medium">
          {STORE_INFO.tagline}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-2.5 mt-2.5">
          <div className="flex items-center gap-1 liquid-glass-orange px-2.5 py-1 rounded-lg text-xs font-bold text-orange-700">
            <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{STORE_INFO.rating}</span>
          </div>
          <div className="liquid-glass px-2.5 py-1 rounded-lg text-xs text-slate-700 font-semibold border border-slate-200">
            {STORE_INFO.reviewCount}
          </div>
          <div className="liquid-glass-blue px-2.5 py-1 rounded-lg text-xs text-sky-700 font-bold flex items-center gap-1">
            <Award className="w-3 h-3 text-sky-600" />
            <span>{STORE_INFO.soldCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Main 2x2 Square Grid (`::`) as requested by user */}
      <div className="my-auto w-full px-1">
        <div className="text-center mb-2">
          <span className="inline-block text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white/70 px-2.5 py-0.5 rounded-full border border-slate-200">
            Kanal Resmi (Klik 2x Untuk Membuka)
          </span>
        </div>

        {/* The 4 square boxes in a 2x2 square pattern `::` */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs sm:max-w-sm mx-auto">
          {SOCIAL_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              id={`portfolio-square-${item.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * idx, duration: 0.4 }}
              onClick={() => handleItemInteraction(item)}
              onDoubleClick={() => {
                // Direct desktop double click
                window.open(item.url, '_blank');
              }}
              className={`aspect-square rounded-2xl liquid-glass p-3 sm:p-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md border-2 ${item.colorBorder} relative overflow-hidden group`}
            >
              {/* Subtle background glow */}
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

              {/* Top Badge */}
              <div className="w-full flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/90 shadow-xs border border-slate-200/80 text-slate-700">
                  {item.badge}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>

              {/* Icon in Circular/Rounded Container */}
              <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${item.bgGlow} shadow-inner transition-transform group-hover:scale-110`}>
                {renderIcon(item.icon)}
              </div>

              {/* Title & Tag */}
              <div className="w-full">
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                  {item.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {item.description}
                </p>
                <div className="mt-1 text-[9px] text-sky-600 font-semibold group-hover:underline">
                  Klik 2x Buka
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Double Tap Toast Notification */}
        <div className="h-6 flex items-center justify-center mt-2">
          <AnimatePresence>
            {activeNotice && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="bg-slate-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                <span>{activeNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Hint to Slide Down to Reviews */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-1 pb-1"
      >
        <button
          id="btn-go-to-reviews"
          onClick={onGoNext}
          className="liquid-glass-accent w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-slate-900 font-extrabold text-xs sm:text-sm hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-md border border-orange-300/60"
        >
          <span className="text-orange-700">Lihat Ulasan Pembeli Bintang 5</span>
          <ChevronDown className="w-4 h-4 text-orange-600 animate-bounce" />
        </button>
        <p className="text-[10px] text-slate-500 mt-1">
          Geser ke bawah untuk melihat testimoni pembeli & rincian pesanan
        </p>
      </motion.div>
    </div>
  );
}
