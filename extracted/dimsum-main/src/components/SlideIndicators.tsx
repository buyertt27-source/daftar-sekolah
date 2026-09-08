interface SlideIndicatorsProps {
  currentSlide: number;
  totalSlides: number;
  onSelectSlide: (index: number) => void;
}

export default function SlideIndicators({
  currentSlide,
  totalSlides,
  onSelectSlide,
}: SlideIndicatorsProps) {
  const slideTitles = ['Portofolio Toko', 'Review Pelanggan', 'Katalog & Order'];

  return (
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* Slide Navigation Dots (NO ^ and ↓ buttons as requested) */}
      <div className="liquid-glass rounded-full p-2 flex flex-col gap-2.5 items-center shadow-md border border-white/90">
        {Array.from({ length: totalSlides }).map((_, index) => {
          const isActive = currentSlide === index;
          return (
            <button
              key={index}
              id={`slide-dot-${index}`}
              onClick={() => onSelectSlide(index)}
              title={slideTitles[index]}
              aria-label={slideTitles[index]}
              className="group relative flex items-center justify-center focus:outline-none cursor-pointer"
            >
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-3 h-7 bg-gradient-to-b from-orange-500 to-sky-500 shadow-md ring-2 ring-orange-200'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
              {/* Tooltip on hover (desktop) */}
              <div className="absolute right-7 px-2.5 py-1 rounded-lg liquid-glass text-[11px] font-bold text-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block border border-slate-200 shadow-md">
                {slideTitles[index]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
