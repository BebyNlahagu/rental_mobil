export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'tips-sewa-mobil-untuk-liburan',
    slug: 'tips-sewa-mobil-untuk-liburan',
    title: 'Tips Sewa Mobil untuk Liburan yang Lebih Nyaman',
    excerpt: 'Pelajari cara memilih armada yang tepat, persiapan perjalanan, dan tips hemat saat liburan dengan mobil sewaan.',
    content: `Menggunakan mobil sewaan saat liburan memberikan fleksibilitas maksimal untuk menjelajah. Mulai dari memilih kendaraan yang sesuai dengan jumlah penumpang hingga memastikan seluruh dokumen siap sejak awal.

1. Pilih mobil sesuai kebutuhan: perhatikan kapasitas penumpang, bagasi, dan kenyamanan.
2. Cek fasilitas tambahan: GPS, kursi anak, atau asuransi all risk.
3. Bandingkan harga di beberapa penyedia agar mendapat penawaran terbaik.
4. Baca ulasan dan reputasi penyedia rental sebelum melakukan booking.

Dengan persiapan matang, perjalanan liburan akan lebih lancar dan penuh kesenangan.`,
    author: 'Rian Pratama',
    date: '2025-12-10',
    readingTime: '5 menit',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
    tags: ['tips', 'liburan', 'rental']
  },
  {
    id: 'keuntungan-rental-mobil-jangka-panjang',
    slug: 'keuntungan-rental-mobil-jangka-panjang',
    title: 'Keuntungan Rental Mobil Jangka Panjang untuk Perusahaan',
    excerpt: 'Kenali manfaat sewa mobil jangka panjang bagi bisnis, termasuk biaya operasional yang lebih ringan dan kenyamanan karyawan.',
    content: `Rental mobil jangka panjang menawarkan solusi kendaraan yang efisien untuk perusahaan. Dengan biaya tetap dan perawatan yang ditangani penyedia, perusahaan dapat fokus pada operasional utama.

1. Stabilitas anggaran: biaya sewa bulanan membantu perencanaan keuangan.
2. Perawatan terkelola: semua servis dan perbaikan dilakukan oleh penyedia.
3. Pilihan armada bervariasi: perusahaan bisa memilih kendaraan yang sesuai fungsi.
4. Dukungan layanan pelanggan profesional.

Solusi ini sangat cocok untuk tim penjualan, event, dan operasional yang membutuhkan mobil berkualitas tanpa investasi besar.`,
    author: 'Maya Widya',
    date: '2026-01-18',
    readingTime: '6 menit',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200',
    tags: ['bisnis', 'operasional', 'mobil']
  },
  {
    id: 'perbandingan-mobil-otomatis-dan-manual',
    slug: 'perbandingan-mobil-otomatis-dan-manual',
    title: 'Perbandingan Mobil Otomatis dan Manual untuk Perjalanan Harian',
    excerpt: 'Cari tahu kelebihan dan kekurangan mobil otomatis vs manual sehingga Anda dapat memilih kendaraan yang paling nyaman untuk perjalanan sehari-hari.',
    content: `Memilih antara mobil otomatis dan manual tergantung pada gaya berkendara dan kondisi jalan. Kedua jenis transmisi menawarkan pengalaman berbeda.

- Otomatis: lebih nyaman di kemacetan dan cocok untuk pengemudi baru.
- Manual: kontrol lebih baik dan sering lebih ekonomis pada beberapa rute.
- Perjalanan jauh: mobil otomatis biasanya membuat pengemudi lebih rileks.
- Performa di medan berbukit: mobil manual memberi respons lebih langsung.

Pilihlah sesuai kebutuhan perjalanan Anda, dari komuter harian hingga road trip panjang.`,
    author: 'Dina Safitri',
    date: '2026-03-02',
    readingTime: '4 menit',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200',
    tags: ['otomatis', 'manual', 'perjalanan']
  }
];

export const getBlogPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getAllBlogPosts = () => [...blogPosts];
