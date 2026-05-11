import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';
import { Search, Car, CreditCard, Key, Shield, Clock, Headphones, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: '1. Cari Mobil',
      description: 'Pilih dari berbagai armada mobil kami yang tersedia. Filter berdasarkan tipe, harga, atau kapasitas sesuai kebutuhan Anda.',
      color: 'bg-blue-500'
    },
    {
      icon: Car,
      title: '2. Pilih & Booking',
      description: 'Tentukan tanggal pengambilan dan pengembalian, pilih layanan tambahan yang diinginkan, dan lakukan booking online.',
      color: 'bg-green-500'
    },
    {
      icon: CreditCard,
      title: '3. Pembayaran',
      description: 'Lakukan pembayaran dengan berbagai metode yang tersedia: transfer bank, kartu kredit, atau e-wallet.',
      color: 'bg-purple-500'
    },
    {
      icon: Key,
      title: '4. Ambil Mobil',
      description: 'Datang ke lokasi yang telah ditentukan dan ambil mobil Anda. Staff kami akan memandu proses pengambilan.',
      color: 'bg-orange-500'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Asuransi Lengkap',
      description: 'Semua mobil dilengkapi asuransi all risk untuk perlindungan maksimal'
    },
    {
      icon: Clock,
      title: 'Proses Cepat',
      description: 'Booking online hanya butuh waktu 5 menit, pengambilan mobil dalam 15 menit'
    },
    {
      icon: Headphones,
      title: 'Support 24/7',
      description: 'Tim customer service siap membantu Anda kapan saja'
    }
  ];

  const faqs = [
    {
      question: 'Apa saja persyaratan untuk menyewa mobil?',
      answer: 'Persyaratan utama adalah: KTP yang masih berlaku, SIM A yang masih berlaku minimal 1 tahun, dan deposit sesuai ketentuan. Usia pengemudi minimal 18 tahun.'
    },
    {
      question: 'Bagaimana cara melakukan pembayaran?',
      answer: 'Kami menerima berbagai metode pembayaran: transfer bank (BCA, Mandiri, BNI), kartu kredit (Visa, Mastercard), dan e-wallet (GoPay, OVO, DANA, ShopeePay).'
    },
    {
      question: 'Apakah bisa mengambil mobil di lokasi lain?',
      answer: 'Ya, kami menyediakan layanan antar-jemput mobil dengan biaya tambahan sesuai jarak. Silakan hubungi customer service untuk informasi lebih lanjut.'
    },
    {
      question: 'Bagaimana jika mobil mengalami kerusakan?',
      answer: 'Semua mobil kami dilengkapi asuransi all risk. Hubungi hotline kami 24/7 dan tim kami akan segera membantu menyelesaikan masalah.'
    },
    {
      question: 'Apakah ada biaya tambahan untuk pengemudi tambahan?',
      answer: 'Ya, biaya pengemudi tambahan adalah Rp 75.000 per hari. Pengemudi tambahan harus memenuhi persyaratan yang sama.'
    },
    {
      question: 'Bagaimana kebijakan pembatalan?',
      answer: 'Pembatalan gratis hingga 24 jam sebelum waktu pengambilan. Pembatalan dalam 24 jam dikenakan biaya 50% dari total sewa.'
    }
  ];

  return (
    <>
      <SEO
        title="Cara Kerja - Rental Mobil Premium"
        description="Pelajari cara mudah menyewa mobil di Rental Mobil Premium. Proses booking cepat, pembayaran aman, dan layanan profesional."
        keywords={['cara sewa mobil', 'proses rental mobil', 'syarat sewa mobil']}
      />

      {/* Hero */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cara Kerja Rental Mobil
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Proses rental mobil yang mudah dan cepat dalam 4 langkah sederhana
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Keunggulan Kami</h2>
            <p className="text-gray-600">Mengapa memilih Rental Mobil Premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Persyaratan Rental</h2>
              <ul className="space-y-4">
                {[
                  'KTP yang masih berlaku (asli)',
                  'SIM A yang masih berlaku minimal 1 tahun',
                  'Usia pengemudi minimal 18 tahun',
                  'Deposit sesuai ketentuan (dikembalikan saat pengembalian)',
                  'Kartu kredit untuk verifikasi (opsional)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Butuh Bantuan?</h3>
              <p className="text-gray-600 mb-6">
                Tim customer service kami siap membantu Anda 24/7
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Headphones className="h-5 w-5 text-blue-600 mr-3" />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span>support@rentalmobil.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
            <p className="text-gray-600">Jawaban untuk pertanyaan yang sering diajukan</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
