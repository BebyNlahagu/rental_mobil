import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, Shield, Clock, Headphones, Award, ChevronRight,
  CheckCircle, MapPin, Star, Users, ArrowRight, Sparkles, Loader2
} from 'lucide-react';
import { SEO, generateLocalBusinessStructuredData } from '../components/SEO';
import { SearchBox } from '../components/SearchBox';
import { CarCard } from '../components/CarCard';
import { getCarsFromDB, subscribeToCars, getBlogsFromDB } from '../lib/supabase';
import type { Car as CarType, BlogPost } from '../types';

export function Home() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const featuredCars = cars.slice(0, 4);

  useEffect(() => {
    loadCars();
    loadBlogPosts();
    
    // Subscribe to realtime updates
    const unsubscribe = subscribeToCars((updatedCars) => {
      setCars(updatedCars);
      setLoading(false);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await getCarsFromDB();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const data = await getBlogsFromDB();
      setPosts(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  const stats = [
    { icon: Car, value: cars.length.toString(), label: 'Mobil Tersedia', suffix: '' },
    { icon: Users, value: '10K+', label: 'Pelanggan Puas', suffix: '' },
    { icon: MapPin, value: '7', label: 'Lokasi Cabang', suffix: ' Kota' },
    { icon: Star, value: '4.9', label: 'Rating Pelanggan', suffix: '/5' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Asuransi All Risk',
      description: 'Perlindungan menyeluruh untuk keamanan berkendara tanpa khawatir'
    },
    {
      icon: Clock,
      title: 'Proses 5 Menit',
      description: 'Booking online instan dan pengambilan mobil dalam 15 menit'
    },
    {
      icon: Headphones,
      title: 'Support Prioritas',
      description: 'Customer service professional siap membantu 24 jam sehari'
    },
    {
      icon: Award,
      title: 'Armada Premium',
      description: 'Mobil terbaru dengan kondisi prima, bersih, dan terawat'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmad Fauzi',
      role: 'Business Executive',
      content: 'Pelayanan sangat profesional dan mobil selalu dalam kondisi prima. Sudah menjadi langganan setia selama 2 tahun!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=random'
    },
    {
      name: 'Siti Rahayu',
      role: 'Travel Enthusiast',
      content: 'Harga kompetitif dengan kualitas mobil yang sangat baik. Proses booking seamless dan mudah digunakan.',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=random'
    },
    {
      name: 'Budi Santoso',
      role: 'Event Organizer',
      content: 'Pilihan mobil mewah yang lengkap sangat membantu untuk kebutuhan event klien. Highly recommended!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=random'
    }
  ];

  const carTypes = [
    { name: 'Economy', count: 15, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400', desc: 'Hemat & Efisien' },
    { name: 'Compact', count: 25, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', desc: 'Lincah di Kota' },
    { name: 'SUV', count: 20, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', desc: 'Tangguh & Luas' },
    { name: 'Luxury', count: 10, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400', desc: 'Mewah & Premium' }
  ];

  return (
    <>
      <SEO
        title="Sewa Mobil Premium - Harga Terbaik & Armada Terbaru"
        description="Rental mobil terpercaya dengan armada berkualitas, harga kompetitif, dan pelayanan profesional 24/7. Tersedia di Jakarta, Bandung, Surabaya, dan kota besar lainnya."
        keywords={['sewa mobil', 'rental mobil', 'rental mobil jakarta', 'sewa mobil harian', 'rental mobil murah']}
        structuredData={generateLocalBusinessStructuredData()}
      />

      {/* Hero Section - Modern Gradient */}
      <section className="relative min-h-[780px] md:min-h-[820px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">
                ✨ Rental Mobil #1 di Indonesia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Rental Mobil{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Premium
              </span>
              <br />
              untuk Perjalanan Anda
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed"
            >
              Nikmati pengalaman berkendara dengan armada terbaru, harga transparan,
              dan layanan profesional 24/7 di seluruh Indonesia.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section - Premium Glassmorphism */}
      <section className="relative -mt-12 z-20 px-4 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white/85 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_80px_rgba(15,23,42,0.15)] border border-white/40 p-8 md:p-12 overflow-hidden"
          >
            {/* Background glow effects */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 relative z-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stat.value}{stat.suffix}</p>
                  <p className="text-slate-600 mt-2 font-medium text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Box Above Fleet Choices */}
      <section className="px-4 -mt-6 md:-mt-8 relative z-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBox />
        </div>
      </section>

      {/* Car Types - Modern Grid */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 mb-4"
            >
              🏎️ Pilihan Armada Kami
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight max-w-3xl mx-auto"
            >
              Temukan Tipe Mobil yang Sempurna
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            >
              Dari mobil ekonomis hingga mewah, kami memiliki opsi terbaik untuk setiap kebutuhan dan budget perjalanan Anda
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {carTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12 }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/5]">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-900/10" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-blue-300 text-xs md:text-sm font-semibold mb-2 uppercase tracking-wide">{type.desc}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{type.name}</h3>
                  <p className="text-white/75 text-sm mb-4">{type.count} Mobil Tersedia</p>
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="inline-flex items-center text-white text-sm font-semibold bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-full">
                      Lihat Pilihan
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 md:mb-16">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 mb-3"
              >
                ⭐ Mobil Populer
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
              >
                Pilihan Terbaik Bulan Ini
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/cars"
                className="group inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors mt-6 md:mt-0"
              >
                Lihat Semua Mobil
                <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 rounded-3xl bg-slate-100 animate-pulse"
                />
              ))
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car) => <CarCard key={car.id} car={car} />)
            ) : (
              <div className="md:col-span-2 lg:col-span-4 rounded-3xl bg-slate-50 p-12 text-center border border-dashed border-slate-200">
                <p className="text-lg text-slate-600">Belum ada mobil unggulan untuk ditampilkan saat ini.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 md:mb-16">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 mb-3"
              >
                💡 Insight & Tips
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
              >
                Artikel Terbaru dari Blog Kami
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/blog"
                className="group inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors mt-6 md:mt-0"
              >
                Lihat Semua Artikel
                <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{post.title}</h3>
                    <p className="text-slate-600 mb-5 line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
                      <span>{post.author}</span>
                      <span>{post.date} · {post.readingTime}</span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center justify-center mt-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Baca Selengkapnya
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="md:col-span-3 rounded-3xl bg-white p-12 text-center border border-slate-200">
                <p className="text-lg text-slate-600">Belum ada artikel blog untuk ditampilkan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features - Gradient Cards */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-blue-400 font-semibold mb-3"
            >
              KEUNGGULAN KAMI
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Mengapa Memilih Kami?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-blue-600 font-semibold mb-3"
            >
              CARA KERJA
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Mudah & Cepat
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Pilih Mobil',
                description: 'Cari dan pilih mobil sesuai kebutuhan Anda dari armada kami yang lengkap',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'Booking Online',
                description: 'Isi formulir booking dengan data Anda dan lakukan pembayaran aman',
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '03',
                title: 'Ambil & Berkendara',
                description: 'Ambil mobil di lokasi yang Anda pilih dan nikmati perjalanan Anda',
                color: 'from-pink-500 to-pink-600'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-blue-600 font-semibold mb-3"
            >
              TESTIMONI
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Apa Kata Mereka?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Siap Untuk Perjalanan Anda?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto"
          >
            Dapatkan harga spesial untuk rental mobil harian, mingguan, atau bulanan. 
            Booking sekarang dan nikmati perjalanan nyaman bersama kami.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/cars"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
            >
              <Car className="h-5 w-5 mr-2" />
              Lihat Semua Mobil
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-blue-500/30 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500/50 transition-colors"
            >
              Hubungi Kami
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
