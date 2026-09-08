import { BusinessMilestone, PortfolioItem } from '../types';

export const STORE_INFO = {
  name: 'DIMSUM ISTIMEWA',
  tagline: 'Sensasi Dimsum Juicy Resep Otentik Warisan Rasa',
  phone: '+62 838-6294-9796',
  phoneRaw: '6283862949796',
  email: 'samuellogabriel95@gmail.com',
  rating: '4.9/5.0',
  reviewCount: '2.450+ Ulasan Puas',
  soldCount: '85.000+ Pcs Terjual',
  basePrice: 3500,
  halalCertified: 'LPPOM-MUI No. 12090004281223',
};

export const SOCIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Official',
    category: 'Fast Response Order',
    icon: 'MessageCircle',
    value: '+62 838-6294-9796',
    url: 'https://wa.me/6283862949796',
    description: 'Chat langsung dengan tim dapur kami 24/7',
    color: 'from-emerald-500/20 to-green-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: '@dimsumistimewa.id',
    icon: 'Instagram',
    value: '35.4K Followers',
    url: 'https://instagram.com/dimsumistimewa.id',
    description: 'Update promo harian, behind-the-scene dapur, & giveaway',
    color: 'from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30',
  },
  {
    id: 'tiktok',
    name: 'TikTok Official',
    category: '@dimsumistimewa',
    icon: 'Video',
    value: '128.5K Likes',
    url: 'https://tiktok.com/@dimsumistimewa',
    description: 'Video mukbang dimsum lumer & proses kukus segar',
    color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'youtube',
    name: 'YouTube Channel',
    category: 'Dimsum Istimewa Official',
    icon: 'Youtube',
    value: '14.2K Subscribers',
    url: 'https://youtube.com',
    description: 'Dokumentasi resep, tips menyimpan frozen, & liputan kuliner',
    color: 'from-red-500/20 to-orange-500/10 text-red-400 border-red-500/30',
  },
];

export const FOUNDER_INFO = {
  name: 'Samuel Gabriel',
  role: 'Founder & Head Recipe Creator',
  email: 'samuellogabriel95@gmail.com',
  phone: '+62 838-6294-9796',
  quote: '"Dimsum terbaik bukan hanya soal rasa gurih di lidah, melainkan ketulusan memilih daging ayam dan udang laut paling segar setiap subuh tanpa kompromi."',
  milestones: [
    {
      year: '2021',
      title: 'Awal Mula dari Dapur Sederhana',
      highlight: '30 Porsi Pertama untuk Tetangga',
      description:
        'Bermula dari eksperimen resep keluarga turun-temurun di dapur kontrakan kecil. Menguji rasio daging ayam fillet dan udang segar laut lebih dari 40 kali hingga menemukan tekstur padat, kenyal, dan juicy alami tanpa pengawet sintetik.',
    },
    {
      year: '2022',
      title: 'Gerobak Pertama & Ujian Pandemi',
      highlight: 'Laris Manis dalam 2 Jam Setiap Sore',
      description:
        'Membuka outlet gerobak kayu pertama. Di tengah tantangan cuaca dan modal terbatas, racikan chili oil otentik berpadu dimsum hangat memikat hati ratusan pelanggan harian yang rela antre setiap hari.',
    },
    {
      year: '2023',
      title: 'Standarisasi Higienis & Inovasi Frozen',
      highlight: 'Sertifikasi Halal & Kemasan Vakum Steril',
      description:
        'Resmi mengantongi sertifikasi Halal dan izin sanitasi makanan. Mengembangkan teknologi frozen pack bertekanan vakum nitrogen food-grade sehingga dimsum tahan hingga 2 bulan di freezer tanpa merusak kesegaran.',
    },
    {
      year: '2024 - Sekarang',
      title: 'Ekspansi Ribuan Pcs & Komitmen Kualitas',
      highlight: 'Melayani 1.000+ Porsi/Hari & Kirim Antar Kota',
      description:
        'Kini memasok puluhan kafe, acara pernikahan, katering hajatan, serta ribuan reseller. Tetap teguh pada prinsip awal: harga terjangkau Rp 3.500/pcs agar semua kalangan dapat menikmati hidangan dimsum kelas resto bintang lima.',
    },
  ] as BusinessMilestone[],
};
