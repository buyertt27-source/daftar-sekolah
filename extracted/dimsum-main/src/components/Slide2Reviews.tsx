import { motion } from 'motion/react';
import {
  Star,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  Quote,
  Flame,
  Snowflake,
  Package,
} from 'lucide-react';

interface Slide2ReviewsProps {
  onGoNext: () => void;
}

interface ReviewItem {
  id: string;
  name: string;
  date: string;
  avatarText: string;
  avatarColor: string;
  stars: number;
  emojis: string;
  comment: string;
  orderSummary: {
    qty: string;
    serving: 'cooked' | 'frozen';
    servingLabel: string;
    details: string;
    totalPaid: string;
    badge: string;
  };
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Amanda Putri Lestari',
    date: '18 Juli 2024',
    avatarText: 'AP',
    avatarColor: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white',
    stars: 5,
    emojis: '🤤 🥟 🔥 ❤️',
    comment:
      'Sumpah ini dimsum ter-juicy yang pernah aku beli online! Kulitnya lembut tipis tapi nggak gampang robek, pas digigit langsung kerasa potongan udang laut segar yang kres-kres padat banget, bukan tipe adonan tepung doang 🤤 Chili oil-nya wangi gurih pedas nampol polll! Anak-anak di rumah langsung rebutan minta repeat order 🔥',
    orderSummary: {
      qty: '30 pcs',
      serving: 'cooked',
      servingLabel: 'Cooked (Kukus Hangat)',
      details: 'Dimsum Original Ayam Udang + 2 Cup Chili Oil Ekstra',
      totalPaid: 'Rp 105.000',
      badge: 'Sampai Masih Panas',
    },
  },
  {
    id: 'rev-2',
    name: 'Hendra Wijaya (Kirim Luar Kota)',
    date: '22 September 2024',
    avatarText: 'HW',
    avatarColor: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
    stars: 5,
    emojis: '📦 ❄️ 💯 ✨',
    comment:
      'Awalnya ragu pesan frozen kirim ke luar kota takut rusak di jalan. Ternyata packing vakum nitrogennya super aman dan rapih banget! Pas dikukus sendiri di rumah aromanya langsung semerbak wangi seisi dapur 🥟✨ Teksturnya tetap kenyal padat, rasanya persis dimsum resto bintang lima padahal harganya cuma Rp 3.500/pcs! Cocok banget buat stok freezer kulkas 💯',
    orderSummary: {
      qty: '50 pcs',
      serving: 'frozen',
      servingLabel: 'Frozen (Vakum Beku)',
      details: 'Dimsum Frozen Kemasan Kedap Udara + Kupon test 50%',
      totalPaid: 'Rp 87.500 (Diskon 50%)',
      badge: 'Tahan 2 Bulan di Freezer',
    },
  },
  {
    id: 'rev-3',
    name: 'Rizky Pratama (Gathering Kantor)',
    date: '14 Februari 2025',
    avatarText: 'RP',
    avatarColor: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white',
    stars: 5,
    emojis: '😋 🎉 🔥 🙌',
    comment:
      'Pesan 40 pcs buat snack sore tim kantor pas lagi lembur, langsung ludes dalam 10 menit nggak ada sisa sama sekali 😋 Semua teman pada nanyain beli di mana karena daging ayamnya beneran tebal dan udangnya kerasa premium. Sambal chili oil-nya nagih parah! Admin WhatsApp-nya juga gercep dan ramah banget 🙌',
    orderSummary: {
      qty: '40 pcs',
      serving: 'cooked',
      servingLabel: 'Cooked (Siap Santap)',
      details: 'Dimsum Kukus Original + Paket Chili Oil Jumbo',
      totalPaid: 'Rp 140.000',
      badge: 'Ludes 10 Menit',
    },
  },
];

export default function Slide2Reviews({ onGoNext }: Slide2ReviewsProps) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 md:p-6 max-w-lg mx-auto relative z-10 select-none overflow-hidden text-slate-900">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pt-1"
      >
        <div className="inline-flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-semibold mb-1 border border-orange-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-orange-700 font-bold">100% Kepuasan Pelanggan</span>
          <span className="text-slate-300">•</span>
          <span className="text-sky-700 font-bold">2.450+ Ulasan Terverifikasi</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Apa Kata Mereka yang Sudah Mencoba?
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-600 font-medium max-w-xs mx-auto">
          Testimoni asli pembeli dengan pengalaman rasa dimsum ayam udang kami
        </p>
      </motion.div>

      {/* Reviews Cards List (Scrollable on small phones) */}
      <div className="my-auto max-h-[73vh] sm:max-h-[76vh] overflow-y-auto pr-1 no-scrollbar space-y-2.5">
        {REVIEWS.map((rev, idx) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * idx, duration: 0.45 }}
            className="liquid-glass p-3.5 rounded-2xl shadow-md border border-white/90 relative overflow-hidden text-left"
          >
            {/* Header: User Avatar, Name, Rating & Date */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm ${rev.avatarColor}`}
                >
                  {rev.avatarText}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                      {rev.name}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {rev.date}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">Pembeli Terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* 5 Stars Rating Badge */}
              <div className="flex flex-col items-end">
                <div className="flex text-amber-500">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-bold font-mono mt-0.5">
                  5.0 / 5.0
                </span>
              </div>
            </div>

            {/* Comment Text with Emojis */}
            <div className="relative pl-4 pr-1 my-2">
              <Quote className="w-3.5 h-3.5 text-orange-400/60 absolute left-0 top-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {rev.comment}
              </p>
              <div className="text-sm mt-1 tracking-widest">{rev.emojis}</div>
            </div>

            {/* Customer Order Details Box (Rincian Pesanan Beliau) */}
            <div
              className={`mt-2 p-2.5 rounded-xl text-xs border ${
                rev.orderSummary.serving === 'frozen'
                  ? 'liquid-glass-blue border-sky-200/80 text-sky-950'
                  : 'liquid-glass-orange border-orange-200/80 text-orange-950'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                  <span>Rincian Pesanan Beliau:</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 shadow-xs text-slate-800">
                  {rev.orderSummary.badge}
                </span>
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center gap-1">
                    {rev.orderSummary.serving === 'cooked' ? (
                      <Flame className="w-3 h-3 text-orange-500" />
                    ) : (
                      <Snowflake className="w-3 h-3 text-sky-500" />
                    )}
                    {rev.orderSummary.qty} • {rev.orderSummary.servingLabel}
                  </span>
                  <span className="font-extrabold text-slate-900 font-mono">
                    {rev.orderSummary.totalPaid}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {rev.orderSummary.details}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Action CTA: Proceed to Slide 3 (Order Catalog) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-1"
      >
        <button
          id="btn-go-to-order-slide"
          onClick={onGoNext}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-sky-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/60"
        >
          <Package className="w-4 h-4 text-white" />
          <span>Lanjut ke Form Pemesanan (Rp 3.500/pcs)</span>
          <ChevronDown className="w-4 h-4 text-amber-200 animate-bounce" />
        </button>
        <p className="text-[10px] text-slate-500 mt-1">
          Geser ke bawah untuk menghitung jumlah porsi & klaim kupon diskon 50%
        </p>
      </motion.div>
    </div>
  );
}
