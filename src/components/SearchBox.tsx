import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';
import { locations } from '../data/cars';

export function SearchBox() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    pickupDate: '',
    pickupTime: '10:00',
    dropoffDate: '',
    dropoffTime: '10:00'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/cars?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-[0_30px_80px_rgba(15,23,42,0.15)] rounded-3xl p-8 md:p-10"
    >
      <div className="mb-8 md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 mb-3">
          ✨ Temukan Kendaraan Impian
        </p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-snug">
          Mobil Terbaik untuk Perjalanan Sempurna
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Lokasi Penjemputan
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 transition-colors group-focus-within:text-blue-600" />
            <select
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-400"
              required
            >
              <option value="">Pilih Lokasi</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tanggal Ambil
          </label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 transition-colors group-focus-within:text-blue-600" />
            <input
              type="date"
              value={searchData.pickupDate}
              onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
              min={today}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Waktu Ambil
          </label>
          <div className="relative group">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 transition-colors group-focus-within:text-blue-600" />
            <input
              type="time"
              value={searchData.pickupTime}
              onChange={(e) => setSearchData({ ...searchData, pickupTime: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tanggal Kembali
          </label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 transition-colors group-focus-within:text-blue-600" />
            <input
              type="date"
              value={searchData.dropoffDate}
              onChange={(e) => setSearchData({ ...searchData, dropoffDate: e.target.value })}
              min={searchData.pickupDate || today}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-2xl font-semibold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Search className="h-5 w-5" />
            Cari
          </button>
        </div>
      </form>
    </motion.div>
  );
}
