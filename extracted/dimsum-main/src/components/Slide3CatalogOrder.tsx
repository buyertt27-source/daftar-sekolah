import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Minus,
  CheckCircle2,
  Tag,
  ShoppingBag,
  Sparkles,
  Flame,
  Snowflake,
  ShieldCheck,
  ChevronUp,
  Info,
  Gift,
  Clock,
} from 'lucide-react';
import { APP_IMAGES } from '../assets/images';
import { DimsumServingType } from '../types';

interface Slide3CatalogOrderProps {
  onGoPrev: () => void;
}

export default function Slide3CatalogOrder({ onGoPrev }: Slide3CatalogOrderProps) {
  const [quantity, setQuantity] = useState<number>(10);
  const [servingType, setServingType] = useState<DimsumServingType>('cooked');
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>('');
  const [selectedPhotoTab, setSelectedPhotoTab] = useState<'platter' | 'detail'>('platter');

  const unitPrice = 3500;
  const subtotal = quantity * unitPrice;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.5) : 0;
  const grandTotal = subtotal - discountAmount;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply !== undefined ? codeToApply : couponInput).trim().toLowerCase();
    if (code === 'test') {
      setCouponApplied(true);
      setCouponError('');
      setCouponInput('test');
    } else {
      setCouponApplied(false);
      setCouponError('Kode kupon salah! Gunakan kode "test" untuk diskon 50%.');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponInput('');
    setCouponError('');
  };

  const handleBuyNow = () => {
    const servingName = servingType === 'frozen' ? 'Frozen' : 'Cooked (Hangat)';
    // User format requirement:
    // 'Halo, saya ingin memesan produk ini berjumlah ... dan ... (frozen/cooked)'
    let message = `Halo, saya ingin memesan produk ini berjumlah ${quantity} pcs dan ${servingName}`;
    
    // Add structured breakdown for smooth ordering
    message += `\n\n*Rincian Pesanan:*`;
    message += `\n• Produk: Dimsum Original Ayam & Udang`;
    message += `\n• Jumlah: ${quantity} pcs (@ Rp 3.500)`;
    message += `\n• Jenis: ${servingName}`;
    message += `\n• Subtotal: ${formatIDR(subtotal)}`;
    if (couponApplied) {
      message += `\n• Kupon Diskon (test): -${formatIDR(discountAmount)} (Hemat 50%)`;
    }
    message += `\n• Saus Chili Oil Spesial: GRATIS`;
    message += `\n• *Total Tagihan:* ${formatIDR(grandTotal)}`;
    message += `\n\nMohon konfirmasi pesanan dan estimasi pengiriman ya kak. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6283862949796?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-lg mx-auto relative z-10 select-none overflow-hidden text-slate-900">
      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pt-1"
      >
        <div className="inline-flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-semibold mb-1 border border-orange-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-orange-700 font-bold">Katalog Resmi Pemesanan</span>
          <span className="text-slate-300">•</span>
          <span className="text-sky-700 font-bold">Rp 3.500 / pcs</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Dimsum Original Ayam & Udang
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-600 font-medium max-w-xs mx-auto">
          Daging Segar Pilihan • Kulit Lembut Juicy • Resep Otentik Halal
        </p>
      </motion.div>

      {/* Main Order Form (Enhanced Liquid Glass) */}
      <div className="my-auto max-h-[72vh] sm:max-h-[75vh] overflow-y-auto pr-1 no-scrollbar space-y-2.5">
        {/* Product Visual & Selling Points Card */}
        <div className="liquid-glass p-3 rounded-2xl border border-white/95 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-3">
            {/* Visual Photo Box with Toggle */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-orange-200/90 shadow-sm group">
              <img
                src={selectedPhotoTab === 'platter' ? APP_IMAGES.dimsumPlatter : APP_IMAGES.dimsumDetail}
                alt="Dimsum Asli Ayam Udang"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-1 right-1 flex gap-1 bg-black/65 backdrop-blur-md rounded-lg p-0.5 text-[9px]">
                <button
                  onClick={() => setSelectedPhotoTab('platter')}
                  className={`px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                    selectedPhotoTab === 'platter'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Porsi
                </button>
                <button
                  onClick={() => setSelectedPhotoTab('detail')}
                  className={`px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                    selectedPhotoTab === 'detail'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Detail
                </button>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="flex-1 text-left space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-sky-700">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>100% Halal & Tanpa Pengawet</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug font-medium">
                Paduan daging ayam fillet segar dan cacahan udang laut gurih, dibungkus kulit tipis kenyal.
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] bg-orange-100/90 text-orange-800 font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                  + Gratis Chili Oil
                </span>
                <span className="text-[10px] bg-sky-100/90 text-sky-800 font-extrabold px-2 py-0.5 rounded-full border border-sky-200">
                  Kukus Tiap Jam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Serving Type Selector (Cooked vs Frozen) */}
        <div className="liquid-glass p-3 rounded-2xl border border-white/95 shadow-sm space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Pilih Jenis Penyajian:
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Kualitas sama terjamin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Cooked Button */}
            <button
              id="serving-cooked-btn"
              onClick={() => setServingType('cooked')}
              className={`p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                servingType === 'cooked'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md border-2 border-orange-400'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>Cooked (Siap Makan)</span>
            </button>

            {/* Frozen Button */}
            <button
              id="serving-frozen-btn"
              onClick={() => setServingType('frozen')}
              className={`p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                servingType === 'frozen'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md border-2 border-sky-400'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Snowflake className="w-4 h-4 text-sky-200" />
              <span>Frozen (Vakum Beku)</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-tight">
            {servingType === 'cooked'
              ? 'Dikukus segar saat dipesan, disajikan hangat lengkap dengan saus chili oil gurih pedas.'
              : 'Kemasan steril kedap udara nitrogen tahan hingga 2 bulan di freezer kulkas. Sangat praktis!'}
          </p>
        </div>

        {/* Quantity Stepper & Price Calculation */}
        <div className="liquid-glass p-3 rounded-2xl border border-white/95 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block text-left">
                Jumlah Pembelian
              </span>
              <span className="text-[11px] text-orange-600 font-extrabold font-mono text-left block">
                Rp 3.500 / pcs
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                id="qty-minus-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 shadow-xs flex items-center justify-center text-slate-800 hover:bg-orange-50 active:scale-90 cursor-pointer"
              >
                <Minus className="w-4 h-4 text-slate-700" />
              </button>

              <span className="w-14 text-center text-base font-black text-slate-900 font-mono">
                {quantity} <span className="text-[10px] text-slate-500 font-normal">pcs</span>
              </span>

              <button
                id="qty-plus-btn"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 shadow-xs flex items-center justify-center text-slate-800 hover:bg-orange-50 active:scale-90 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Quick Select Quantity Chips */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {[5, 10, 20, 50].map((num) => (
              <button
                key={num}
                id={`quick-qty-${num}`}
                onClick={() => setQuantity(num)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quantity === num
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {num} pcs
              </button>
            ))}
          </div>
        </div>

        {/* Coupon Code Column with "test" 50% discount */}
        <div className="liquid-glass p-3 rounded-2xl border border-white/95 shadow-sm space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-orange-500" />
              <span>Kode Kupon Diskon</span>
            </span>

            {!couponApplied ? (
              <button
                id="btn-auto-apply-test"
                onClick={() => handleApplyCoupon('test')}
                className="text-[11px] text-sky-700 hover:text-sky-800 font-bold underline cursor-pointer flex items-center gap-1"
              >
                <Gift className="w-3 h-3 text-sky-600" />
                <span>Gunakan Kupon "test" (50% OFF)</span>
              </button>
            ) : (
              <button
                onClick={handleRemoveCoupon}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
              >
                Hapus Kupon
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              id="input-coupon"
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Masukkan kode kupon diskon..."
              disabled={couponApplied}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 uppercase tracking-wider font-mono disabled:opacity-60 shadow-inner"
            />
            <button
              id="btn-apply-coupon"
              onClick={() => handleApplyCoupon()}
              disabled={couponApplied || !couponInput.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
            >
              Terapkan
            </button>
          </div>

          {couponApplied && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kupon "test" aktif! Diskon 50% berhasil dipotong.</span>
            </div>
          )}

          {couponError && (
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{couponError}</span>
            </div>
          )}
        </div>

        {/* Realtime Payment Breakdown Card */}
        <div className="liquid-glass-accent p-3.5 rounded-2xl border border-orange-200/90 shadow-md space-y-2 text-left">
          <div className="flex items-center justify-between border-b border-orange-200/60 pb-1.5">
            <h4 className="text-xs font-extrabold text-orange-900 uppercase tracking-wider">
              Rincian Pembayaran
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Harga Real-time</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Dimsum Original ({quantity} pcs × Rp 3.500)</span>
              <span className="font-mono font-semibold text-slate-900">{formatIDR(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Varian Penyajian</span>
              <span className="font-bold text-slate-900">
                {servingType === 'frozen' ? 'Frozen (Vakum)' : 'Cooked (Kukus Hangat)'}
              </span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-700 font-extrabold">
                <span>Diskon Kupon 50% ("test")</span>
                <span className="font-mono">-{formatIDR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Chili Oil Gurih Khas</span>
              <span className="text-orange-600 font-bold">GRATIS</span>
            </div>

            <div className="border-t border-orange-200/80 pt-2 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-black text-slate-900 block">Total Tagihan:</span>
                {couponApplied && (
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Hemat {formatIDR(discountAmount)} dengan kupon test!
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-orange-600 font-mono">
                {formatIDR(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp Buy Now Button */}
        <button
          id="btn-buy-now-wa"
          onClick={handleBuyNow}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/60"
        >
          <ShoppingBag className="w-5 h-5 text-white" />
          <span>Beli Sekarang via WhatsApp ({formatIDR(grandTotal)})</span>
        </button>

        <p className="text-[10px] text-center text-slate-500">
          Pesanan otomatis diteruskan ke WhatsApp resmi: <span className="font-mono font-bold text-slate-800">+62 838-6294-9796</span> dengan rincian lengkap dan kupon diskon.
        </p>
      </div>

      {/* Bottom: Back to Reviews / Portofolio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-1"
      >
        <button
          id="btn-back-to-reviews"
          onClick={onGoPrev}
          className="liquid-glass text-slate-700 hover:text-slate-900 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
        >
          <ChevronUp className="w-4 h-4 text-orange-500" />
          <span>Kembali ke Ulasan Pembeli</span>
        </button>
      </motion.div>
    </div>
  );
}
