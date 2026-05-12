import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Monthly() {
  const services = [
    {
      icon: CalendarDays,
      title: 'Sewa Bulanan',
      description: 'Solusi fleksibel untuk kebutuhan jangka panjang dengan tarif khusus dan layanan prioritas.',
      highlight: 'Hemat biaya, mudah perencanaan',
    },
    {
      icon: DollarSign,
      title: 'Harga Kompetitif',
      description: 'Tarif transparan tanpa biaya tersembunyi, disesuaikan untuk kontrak bulanan.',
      highlight: 'Biaya terjangkau setiap bulan',
    },
    {
      icon: ShieldCheck,
      title: 'Asuransi & Perawatan',
      description: 'Perlindungan all-risk dan servis berkala selama masa sewa.',
      highlight: 'Aman dan nyaman sepanjang bulan',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Sewa Bulanan - Rental Mobil Premium"
        description="Nikmati sewa mobil bulanan dengan harga kompetitif, layanan prioritas, dan armada berkualitas."
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-24">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.4),_transparent_40%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 mb-6"
            >
              Layanan Pilihan
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              Sewa Bulanan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg text-slate-200"
            >
              Solusi ideal untuk pelanggan yang membutuhkan mobil jangka panjang dengan fleksibilitas tinggi, harga terbaik, dan layanan prioritas selama sewa.
            </motion.p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/cars"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-950/10 transition hover:bg-slate-100"
              >
                Pilih Mobil Bulanan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <service.icon className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">{service.title}</h2>
                <p className="text-slate-600 mb-4">{service.description}</p>
                <p className="text-sm font-semibold text-blue-600">{service.highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
