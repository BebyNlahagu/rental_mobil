import { motion } from 'framer-motion';
import { Award, Users, Target, Heart, CheckCircle, Star } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Integritas',
      description: 'Kami selalu jujur dan transparan dalam setiap transaksi.',
    },
    {
      icon: Target,
      title: 'Kualitas',
      description: 'Hanya mobil terbaik yang kami tawarkan kepada pelanggan.',
    },
    {
      icon: Users,
      title: 'Pelayanan',
      description: 'Kepuasan pelanggan adalah prioritas utama kami.',
    },
    {
      icon: Award,
      title: 'Profesionalisme',
      description: 'Tim kami terdiri dari tenaga ahli yang berpengalaman.',
    },
  ];

  const milestones = [
    { year: '2008', title: 'Berdiri', description: 'AutoLux didirikan di Jakarta' },
    { year: '2012', title: 'Ekspansi', description: 'Membuka cabang di 5 kota besar' },
    { year: '2015', title: 'Digitalisasi', description: 'Meluncurkan platform online' },
    { year: '2018', title: 'Award', description: 'Penghargaan dealer terbaik' },
    { year: '2024', title: 'Inovasi', description: '10.000+ mobil terjual' },
  ];

  const team = [
    {
      name: 'Budi Santoso',
      role: 'Founder & CEO',
      image: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=6366f1&color=fff&size=200',
    },
    {
      name: 'Dewi Kusuma',
      role: 'Marketing Director',
      image: 'https://ui-avatars.com/api/?name=Dewi+Kusuma&background=8b5cf6&color=fff&size=200',
    },
    {
      name: 'Ahmad Rizki',
      role: 'Sales Manager',
      image: 'https://ui-avatars.com/api/?name=Ahmad+Rizki&background=ec4899&color=fff&size=200',
    },
    {
      name: 'Siti Rahayu',
      role: 'Customer Service Head',
      image: 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=f59e0b&color=fff&size=200',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-indigo-300 text-sm font-medium mb-6">
              Tentang Kami
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Membangun Kepercayaan{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Sejak 2008
              </span>
            </h1>
            <p className="text-lg text-slate-300">
              AutoLux adalah showroom mobil premium terpercaya yang telah melayani ribuan pelanggan 
              di seluruh Indonesia dengan komitmen pada kualitas dan kepuasan pelanggan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '15+', label: 'Tahun Berpengalaman' },
              { value: '10K+', label: 'Mobil Terjual' },
              { value: '50+', label: 'Mitra Dealer' },
              { value: '98%', label: 'Pelanggan Puas' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800"
                alt="Showroom"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Visi & Misi Kami
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Visi</h3>
                  <p className="text-slate-600">
                    Menjadi showroom mobil terpercaya nomor satu di Indonesia yang memberikan 
                    pengalaman terbaik dalam membeli mobil impian.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Misi</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Menyediakan mobil berkualitas dengan harga terbaik
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Memberikan pelayanan profesional dan transparan
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Membangun hubungan jangka panjang dengan pelanggan
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Terus berinovasi dalam layanan otomotif
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Nilai-Nilai Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Prinsip yang Kami Pegang
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nilai-nilai ini menjadi fondasi dalam setiap langkah kami melayani Anda.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Perjalanan Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Milestones
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-indigo-200 hidden md:block" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-sm inline-block">
                    <span className="text-indigo-600 font-bold text-lg">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{milestone.title}</h3>
                    <p className="text-slate-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-lg hidden md:block z-10" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Tim Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Bertemu dengan Tim AutoLux
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Profesional berpengalaman yang siap membantu Anda menemukan mobil impian.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                  />
                  <div className="absolute bottom-0 right-1/2 translate-x-8 translate-y-2">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
