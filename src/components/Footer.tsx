import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, Phone, Mail, MapPin, Facebook, Instagram, Twitter,
  Clock, Shield, Award, ChevronRight
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'Tentang Kami', path: '/about' },
      { label: 'Karir', path: '/careers' },
      { label: 'Blog', path: '/blog' },
      { label: 'Partner', path: '/partners' }
    ],
    support: [
      { label: 'Pusat Bantuan', path: '/help' },
      { label: 'Syarat & Ketentuan', path: '/terms' },
      { label: 'Kebijakan Privasi', path: '/privacy' },
      { label: 'FAQ', path: '/faq' }
    ],
    services: [
      { label: 'Sewa Harian', path: '/cars' },
      { label: 'Sewa Bulanan', path: '/monthly' },
      { label: 'Driver', path: '/driver' },
      { label: 'Airport Transfer', path: '/airport' }
    ]
  };

  const features = [
    { icon: Shield, label: 'Asuransi All Risk' },
    { icon: Clock, label: 'Support 24/7' },
    { icon: Award, label: 'Armada Terbaru' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Features Bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center md:justify-start"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mr-4">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <span className="font-semibold text-white">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Car className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">Rental Mobil</span>
                <span className="text-blue-400 text-sm">Premium</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              Solusi rental mobil terpercaya dengan armada berkualitas, 
              harga kompetitif, dan pelayanan profesional 24/7.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-slate-400 hover:text-blue-400 transition-colors group"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Bantuan</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-slate-400 hover:text-blue-400 transition-colors group"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Layanan</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center text-slate-400 hover:text-blue-400 transition-colors group"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 bg-slate-800/50 rounded-xl p-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Telepon</p>
                <p className="text-white font-semibold">+62 21 1234 5678</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-slate-800/50 rounded-xl p-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-semibold">info@rentalmobil.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-slate-800/50 rounded-xl p-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Alamat</p>
                <p className="text-white font-semibold">Jl. Sudirman No. 123, Jakarta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              &copy; {currentYear} Rental Mobil Premium. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
