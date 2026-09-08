import { useState, useEffect, useRef, useCallback, type TouchEvent } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Utensils } from 'lucide-react';
import OpeningIntro from './components/OpeningIntro';
import SlideIndicators from './components/SlideIndicators';
import Slide1Portfolio from './components/Slide1Portfolio';
import Slide2Reviews from './components/Slide2Reviews';
import Slide3CatalogOrder from './components/Slide3CatalogOrder';
import { STORE_INFO } from './data/dimsumData';

const TOTAL_SLIDES = 3;

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showOpening, setShowOpening] = useState<boolean>(true);

  const touchStartY = useRef<number | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Transition with resistance: requires deliberate intent and prevents multi-trigger jitter
  const changeSlide = useCallback(
    (targetIndex: number) => {
      if (isTransitioningRef.current) return;
      if (targetIndex < 0 || targetIndex >= TOTAL_SLIDES) return;
      if (targetIndex === currentSlide) return;

      isTransitioningRef.current = true;
      setCurrentSlide(targetIndex);

      // Transition settling time
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 550);
    },
    [currentSlide]
  );

  const handleNextSlide = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      changeSlide(currentSlide + 1);
    }
  }, [changeSlide, currentSlide]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      changeSlide(currentSlide - 1);
    }
  }, [changeSlide, currentSlide]);

  // Touch handlers for mobile swipe with high resistance threshold (cannot be slid accidentally)
  const handleTouchStart = (e: TouchEvent) => {
    if (showOpening) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (showOpening || touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    touchStartY.current = null;

    // Firm threshold: requires a clear > 65px deliberate swipe
    if (Math.abs(deltaY) > 65) {
      if (deltaY > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  // Mouse wheel handler with resistance (prevents slight up/down shifts)
  useEffect(() => {
    let wheelAccumulator = 0;
    let resetTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (showOpening) return;
      // Prevent loose erratic scrolling
      e.preventDefault();

      wheelAccumulator += e.deltaY;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 300);

      // High threshold resistance for smooth solid snap
      if (Math.abs(wheelAccumulator) > 75) {
        if (wheelAccumulator > 0) {
          handleNextSlide();
        } else {
          handlePrevSlide();
        }
        wheelAccumulator = 0;
      }
    };

    const container = document.getElementById('slide-container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [handleNextSlide, handlePrevSlide, showOpening]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showOpening) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide, showOpening]);

  return (
    <div
      id="slide-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 w-full h-[100dvh] bg-[#f8fafc] text-slate-900 overflow-hidden select-none font-sans"
    >
      {/* Background Ambience: White base with Bright Sky Blue & Flame Orange Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: currentSlide === 0 ? [-30, 30] : currentSlide === 1 ? [40, -20] : [-20, 20],
            y: currentSlide === 0 ? [-20, 20] : currentSlide === 1 ? [-30, 30] : [20, -20],
            scale: currentSlide === 1 ? 1.2 : 1,
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-88 h-88 sm:w-[420px] sm:h-[420px] bg-sky-400/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: currentSlide === 1 ? [-30, 30] : [25, -25],
            y: currentSlide === 1 ? [25, -25] : [-25, 25],
            scale: currentSlide === 2 ? 1.25 : 1,
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-24 w-88 h-88 sm:w-[420px] sm:h-[420px] bg-orange-400/22 rounded-full blur-[110px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-300/10 rounded-full blur-[90px]" />
      </div>

      {/* Opening Intro Modal */}
      {showOpening && <OpeningIntro onStart={() => setShowOpening(false)} />}

      {/* Persistent Clean Top Navigation Bar (NO total slide count & NO sound button as requested) */}
      <header className="fixed top-0 inset-x-0 z-40 p-3 sm:px-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 liquid-glass-pill px-3 py-1.5 rounded-full border border-sky-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-black tracking-wider text-slate-900">
            {STORE_INFO.name}
          </span>
          <span className="text-[10px] text-orange-600 font-bold hidden sm:inline">• Rp 3.500/pcs</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Re-play Opening Button */}
          <button
            id="btn-replay-opening"
            onClick={() => setShowOpening(true)}
            title="Buka Opening Animasi"
            className="liquid-glass-pill px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className="w-3 h-3 text-orange-500" />
            <span>Opening</span>
          </button>

          <button
            onClick={() => changeSlide(2)}
            className="liquid-glass-orange px-3 py-1.5 rounded-full text-[11px] font-extrabold text-orange-800 border border-orange-300 flex items-center gap-1 cursor-pointer shadow-xs hover:scale-105 transition-transform"
          >
            <Utensils className="w-3 h-3 text-orange-600" />
            <span>Pesan Dimsum</span>
          </button>
        </div>
      </header>

      {/* Side Slide Navigation Indicators (Minimalist Dots, NO ^ and ↓ buttons) */}
      <SlideIndicators
        currentSlide={currentSlide}
        totalSlides={TOTAL_SLIDES}
        onSelectSlide={(index) => changeSlide(index)}
      />

      {/* Slides Container: Resistant snap per slide */}
      <motion.div
        animate={{ y: `-${currentSlide * 100}dvh` }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full flex flex-col relative z-10"
      >
        {/* Slide 1: Portofolio Toko (2x2 square grid `::`, double-click to open) */}
        <section
          id="slide-1-portfolio"
          className="w-full h-[100dvh] shrink-0 pt-12 pb-3 flex items-center justify-center"
        >
          <Slide1Portfolio onGoNext={() => changeSlide(1)} />
        </section>

        {/* Slide 2: Review Palsu (3 komentar bintang 5 dengan tanggal berbeda, emoji & rincian pesanan) */}
        <section
          id="slide-2-reviews"
          className="w-full h-[100dvh] shrink-0 pt-12 pb-3 flex items-center justify-center"
        >
          <Slide2Reviews onGoNext={() => changeSlide(2)} />
        </section>

        {/* Slide 3: Katalog Penjualan & Kalkulator Order WA (Rp 3.500/pcs, kupon test 50%, dsb) */}
        <section
          id="slide-3-catalog"
          className="w-full h-[100dvh] shrink-0 pt-12 pb-3 flex items-center justify-center"
        >
          <Slide3CatalogOrder onGoPrev={() => changeSlide(1)} />
        </section>
      </motion.div>
    </div>
  );
}
