import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, ChevronDown, Flame, ShieldCheck } from 'lucide-react';
import { APP_IMAGES } from '../assets/images';
import { STORE_INFO } from '../data/dimsumData';

interface OpeningIntroProps {
  onStart: () => void;
}

export default function OpeningIntro({ onStart }: OpeningIntroProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Allow Enter/Space/ArrowDown to proceed
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        handleProceed();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleProceed = () => {
    setIsOpen(false);
    onStart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="opening-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-5 bg-slate-50/95 backdrop-blur-2xl text-slate-900 select-none overflow-hidden"
        >
          {/* Ambient bright blue & bright orange glowing background spheres */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.35, 0.2],
                x: [-20, 20, -20],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-orange-400/30 rounded-full blur-[90px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.18, 0.3, 0.18],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-sky-400/25 rounded-full blur-[80px]"
            />
          </div>

          {/* Top Bar / Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full flex items-center justify-between max-w-md pt-2 z-10"
          >
            <div className="flex items-center gap-2 liquid-glass-pill px-3.5 py-1.5 rounded-full border border-sky-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold tracking-wider text-sky-800 uppercase">
                Dapur Buka • Siap Kirim
              </span>
            </div>
            <div className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs text-orange-800 font-bold flex items-center gap-1.5 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>100% Halal</span>
            </div>
          </motion.div>

          {/* Central Hero Visual & Title */}
          <div className="flex flex-col items-center text-center max-w-sm my-auto relative z-10 w-full">
            {/* Visual Steaming Dimsum Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7, type: 'spring', bounce: 0.35 }}
              className="relative mb-5"
            >
              {/* Outer Glowing Ring */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2.5 liquid-glass-accent relative flex items-center justify-center border-2 border-orange-300/80 shadow-xl">
                {/* Floating Steam effects */}
                <motion.div
                  animate={{ y: [-10, -40], opacity: [0, 0.8, 0], scale: [0.8, 1.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute -top-4 text-orange-500 flex gap-2 pointer-events-none"
                >
                  <Flame className="w-5 h-5 text-orange-500" />
                  <Flame className="w-4 h-4 text-amber-400" />
                </motion.div>

                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md relative">
                  <img
                    src={APP_IMAGES.dimsumPlatter}
                    alt="Dimsum Istimewa Hangat"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Promo Floating Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', bounce: 0.5 }}
                className="absolute -bottom-2 -right-2 liquid-glass px-3 py-1.5 rounded-full flex items-center gap-1.5 border-2 border-orange-400 shadow-md"
              >
                <span className="text-[11px] font-bold text-orange-700 uppercase tracking-tight">Hanya</span>
                <span className="text-sm font-black text-slate-900">Rp 3.500</span>
                <span className="text-[10px] text-slate-500 font-semibold">/pcs</span>
              </motion.div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="space-y-1.5"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-sky-600 bg-clip-text text-transparent">
                  {STORE_INFO.name}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium px-2">
                Racikan daging ayam fillet & udang laut segar asli. Kulit tipis lembut, isian padat kenyal, gurih lumer di setiap gigitan.
              </p>
            </motion.div>

            {/* Highlights Tag Cloud */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-1.5 mt-3"
            >
              <span className="text-[11px] px-2.5 py-1 rounded-full liquid-glass-orange text-orange-800 font-bold border border-orange-200">
                ✓ Daging Ayam & Udang Asli
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full liquid-glass-blue text-sky-800 font-bold border border-sky-200">
                ✓ Halal & Higienis
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full liquid-glass text-slate-800 font-bold border border-slate-200">
                ✓ Saus Chili Oil Khas
              </span>
            </motion.div>
          </div>

          {/* Action CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full max-w-sm pb-4 flex flex-col items-center gap-2.5 relative z-10"
          >
            <button
              id="btn-opening-start"
              onClick={handleProceed}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-sky-600 text-white font-extrabold text-sm sm:text-base shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-white/60"
            >
              <Utensils className="w-5 h-5 text-white" />
              <span>Buka Menu & Portofolio Toko</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Ketuk untuk masuk ke toko</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-orange-600" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
