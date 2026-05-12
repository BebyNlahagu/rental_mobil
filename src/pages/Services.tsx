import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CalendarDays, Users, MapPin, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

const services = [
  {
    icon: CalendarDays,
    title: 'Sewa Harian',
    description: 'Booking mobil untuk perjalanan singkat dengan proses cepat dan fleksibel.',
    link: '/daily'
  },
  {
    icon: ShieldCheck,
    title: 'Sewa Bulanan',
    description: 'Kontrak sewa jangka panjang dengan tarif khusus dan layanan prioritas.',
    link: '/monthly'
  },
  {
    icon: Users,
    title: 'Driver Profesional',
    description: 'Perjalanan nyaman dengan pengemudi handal untuk bisnis atau liburan.',
    link: '/driver'
  },
  {
    icon: MapPin,
    title: 'Airport Transfer',
    description: 'Layanan antar-jemput bandara tepat waktu untuk perjalanan yang lancar.',
    link: '/airport'
  }
];

export function Services() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Layanan Rental Mobil - Sewa Harian, Bulanan, Driver, Airport Transfer"
        description="Temukan layanan rental mobil kami: sewa harian, sewa bulanan, jasa driver profesional, dan airport transfer."
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.3),_transparent_40%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 mb-6"
            >
              Semua Layanan
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              Pilih Layanan Rental Mobil yang Tepat
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg text-slate-200"
            >
              Solusi mobil sewa lengkap untuk kebutuhan liburan, bisnis, driver pribadi, dan transfer bandara.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <service.icon className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">{service.title}</h2>
                <p className="text-slate-600 mb-8">{service.description}</p>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-all"
                >
                  Pelajari lebih lanjut
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
