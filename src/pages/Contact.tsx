import { useState } from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, Send, Facebook, 
  Instagram, Twitter, Linkedin, CheckCircle 
} from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telepon',
      content: '+62 21 1234 5678',
      subContent: 'Hotline 24/7'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@rentalmobil.com',
      subContent: 'support@rentalmobil.com'
    },
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jl. Sudirman No. 123',
      subContent: 'Jakarta Pusat, 12190'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Senin - Minggu',
      subContent: '08:00 - 20:00 WIB'
    }
  ];

  const locations = [
    { city: 'Jakarta', address: 'Jl. Sudirman No. 123, Jakarta Pusat', phone: '021-1234567' },
    { city: 'Bandung', address: 'Jl. Braga No. 45, Bandung', phone: '022-1234567' },
    { city: 'Surabaya', address: 'Jl. Tunjungan No. 78, Surabaya', phone: '031-1234567' },
    { city: 'Bali', address: 'Jl. Sunset Road No. 90, Kuta', phone: '0361-123456' }
  ];

  return (
    <>
      <SEO
        title="Kontak Kami - Rental Mobil Premium"
        description="Hubungi kami untuk informasi lebih lanjut tentang rental mobil. Tersedia 24/7 untuk melayani Anda."
        keywords={['kontak rental mobil', 'alamat rental mobil', 'customer service rental mobil']}
      />

      {/* Hero */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hubungi Kami
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Kami siap membantu Anda. Hubungi kami melalui berbagai channel yang tersedia.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium">{info.content}</p>
                <p className="text-gray-600 text-sm">{info.subContent}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
              <p className="text-gray-600 mb-6">Isi formulir di bawah ini dan kami akan segera menghubungi Anda.</p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-green-800 mb-2">Pesan Terkirim!</h3>
                  <p className="text-green-700">Terima kasih telah menghubungi kami. Tim kami akan segera merespons.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="081234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subjek *</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Pilih Subjek</option>
                        <option value="booking">Pemesanan</option>
                        <option value="payment">Pembayaran</option>
                        <option value="complaint">Keluhan</option>
                        <option value="partnership">Kerjasama</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pesan *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Kirim Pesan
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-full min-h-[400px] bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Peta Lokasi</p>
                  <p className="text-sm text-gray-500">Jl. Sudirman No. 123, Jakarta Pusat</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Cabang</h2>
            <p className="text-gray-600">Kami hadir di berbagai kota besar di Indonesia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc, index) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">{loc.city}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {loc.address}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    {loc.phone}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Ikuti Kami di Media Sosial</h2>
          <div className="flex justify-center space-x-6">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon className="h-6 w-6 text-white" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
