import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Building, CreditCard, Bell, Shield, Mail, 
  Globe, Clock, Percent, FileText, User, Palette,
  ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    booking: true,
    payment: true,
    reminder: true,
    promo: false
  });

  const tabs = [
    { id: 'general', label: 'Umum', icon: Building },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 mt-1">Kelola pengaturan aplikasi rental mobil</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-72">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-5 py-4 text-left transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                  activeTab === tab.id ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
                <span className="font-medium">{tab.label}</span>
                <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${
                  activeTab === tab.id ? 'rotate-90 text-blue-600' : 'text-slate-400'
                }`} />
              </button>
            ))}
          </div>

          {/* Quick Info */}
          <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
            <h4 className="font-bold mb-2">Butuh Bantuan?</h4>
            <p className="text-blue-100 text-sm mb-4">Tim support kami siap membantu Anda 24/7</p>
            <button className="w-full py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
              Hubungi Support
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            {activeTab === 'general' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Pengaturan Umum</h2>
                    <p className="text-slate-500">Informasi dasar perusahaan Anda</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Perusahaan</label>
                    <input type="text" defaultValue="Rental Mobil Premium" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" defaultValue="info@rentalmobil.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Telepon</label>
                    <input type="text" defaultValue="+62 21 1234 5678" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                    <input type="text" defaultValue="www.rentalmobil.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
                  <textarea rows={3} defaultValue="Jl. Sudirman No. 123, Jakarta Pusat, 12190" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Jam Operasional</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="time" defaultValue="08:00" className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                    <input type="time" defaultValue="20:00" className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Pengaturan Pembayaran</h2>
                    <p className="text-slate-500">Metode pembayaran yang tersedia</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 'va', name: 'Virtual Account', desc: 'BCA, Mandiri, BNI', icon: Building, enabled: true },
                    { id: 'cc', name: 'Kartu Kredit', desc: 'Visa, Mastercard, JCB', icon: CreditCard, enabled: true },
                    { id: 'ewallet', name: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay', icon: CreditCard, enabled: true }
                  ].map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                          <method.icon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{method.name}</p>
                          <p className="text-sm text-slate-500">{method.desc}</p>
                        </div>
                      </div>
                      <button className={`w-14 h-8 rounded-full transition-colors ${
                        method.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          method.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Biaya Tambahan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Biaya Admin (%)</label>
                      <input type="number" defaultValue="2" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Deposit Minimum</label>
                      <input type="number" defaultValue="500000" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                    <Bell className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Pengaturan Notifikasi</h2>
                    <p className="text-slate-500">Atur notifikasi yang ingin Anda terima</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 'booking', label: 'Pemesanan Baru', desc: 'Terima notifikasi saat ada pemesanan baru', state: notifications.booking },
                    { id: 'payment', label: 'Pembayaran', desc: 'Terima notifikasi saat ada pembayaran', state: notifications.payment },
                    { id: 'reminder', label: 'Pengingat', desc: 'Kirim pengingat sebelum waktu pengambilan', state: notifications.reminder },
                    { id: 'promo', label: 'Promosi', desc: 'Kirim email promosi ke pelanggan', state: notifications.promo }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-5 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          item.state ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          item.state ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Keamanan</h2>
                    <p className="text-slate-500">Pengaturan keamanan akun</p>
                  </div>
                </div>
                
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                  <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Ubah Password
                  </h3>
                  <div className="space-y-4">
                    <input type="password" placeholder="Password Saat Ini" className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white" />
                    <input type="password" placeholder="Password Baru" className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white" />
                    <input type="password" placeholder="Konfirmasi Password Baru" className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Autentikasi Dua Faktor</p>
                      <p className="text-sm text-slate-500">Tambahkan lapisan keamanan ekstra</p>
                    </div>
                    <button className="w-14 h-8 rounded-full bg-slate-300 transition-colors">
                      <div className="w-6 h-6 bg-white rounded-full shadow-md translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                <Save className="h-5 w-5 mr-2" />
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
