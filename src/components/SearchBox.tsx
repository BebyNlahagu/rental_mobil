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
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi Penjemputan
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                required
              >
                <option value="">Pilih Lokasi</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Ambil
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchData.pickupDate}
                onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                min={today}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Ambil
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="time"
                value={searchData.pickupTime}
                onChange={(e) => setSearchData({ ...searchData, pickupTime: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Dropoff Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Kembali
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchData.dropoffDate}
                onChange={(e) => setSearchData({ ...searchData, dropoffDate: e.target.value })}
                min={searchData.pickupDate || today}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            <span>Cari Mobil</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
