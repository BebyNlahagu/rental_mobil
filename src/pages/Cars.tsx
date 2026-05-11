import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { CarCard } from '../components/CarCard';
import { getCarsFromDB, subscribeToCars } from '../lib/supabase';
import { carTypes } from '../data/cars';
import { formatCurrency } from '../lib/utils';
import type { Car, SearchFilters } from '../types';

export function Cars() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    pickupDate: searchParams.get('pickupDate') || '',
    pickupTime: searchParams.get('pickupTime') || '10:00',
    dropoffDate: searchParams.get('dropoffDate') || '',
    dropoffTime: searchParams.get('dropoffTime') || '10:00',
    carType: [],
    transmission: [],
    fuelType: [],
    minPrice: 0,
    maxPrice: 2000000,
    seats: 0,
  });

  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    loadCars();
    
    const unsubscribe = subscribeToCars((updatedCars) => {
      setCars(updatedCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await getCarsFromDB();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (filters.carType.length > 0) {
      result = result.filter(car => filters.carType.includes(car.type));
    }

    if (filters.transmission.length > 0) {
      result = result.filter(car => filters.transmission.includes(car.transmission));
    }

    if (filters.fuelType.length > 0) {
      result = result.filter(car => filters.fuelType.includes(car.fuelType));
    }

    result = result.filter(car => car.pricePerDay >= filters.minPrice);
    result = result.filter(car => car.pricePerDay <= filters.maxPrice);

    if (filters.seats) {
      result = result.filter(car => car.seats >= filters.seats);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [filters, sortBy, cars]);

  const toggleFilter = (
    key: 'carType' | 'transmission' | 'fuelType',
    value: string
  ) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      return { ...prev, [key]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      location: searchParams.get('location') || '',
      pickupDate: searchParams.get('pickupDate') || '',
      pickupTime: searchParams.get('pickupTime') || '10:00',
      dropoffDate: searchParams.get('dropoffDate') || '',
      dropoffTime: searchParams.get('dropoffTime') || '10:00',
      carType: [],
      transmission: [],
      fuelType: [],
      minPrice: 0,
      maxPrice: 2000000,
      seats: 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Daftar Mobil Rental - Pilihan Lengkap & Harga Terbaik"
        description="Temukan mobil rental sesuai kebutuhan Anda. Tersedia berbagai tipe dari economy hingga luxury dengan harga kompetitif."
        keywords={['daftar mobil rental', 'sewa mobil jakarta', 'harga rental mobil', 'mobil rental murah']}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Mobil</h1>
            <p className="text-gray-600">
              {filteredCars.length} mobil tersedia untuk tanggal yang Anda pilih
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-900 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filter
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Tipe Mobil</h3>
                  <div className="space-y-2">
                    {carTypes.map((type) => (
                      <label key={type.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.carType.includes(type.value)}
                          onChange={() => toggleFilter('carType', type.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Transmisi</h3>
                  <div className="space-y-2">
                    {['automatic', 'manual'].map((trans) => (
                      <label key={trans} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.transmission.includes(trans)}
                          onChange={() => toggleFilter('transmission', trans)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{trans}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Bahan Bakar</h3>
                  <div className="space-y-2">
                    {['petrol', 'diesel', 'hybrid', 'electric'].map((fuel) => (
                      <label key={fuel} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fuelType.includes(fuel)}
                          onChange={() => toggleFilter('fuelType', fuel)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Rentang Harga</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatCurrency(0)}</span>
                      <span>{formatCurrency(filters.maxPrice ?? 2000000)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Jumlah Kursi</h3>
                  <select
                    value={filters.seats || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, seats: parseInt(e.target.value) || 0 })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Semua</option>
                    <option value="5">5+ kursi</option>
                    <option value="7">7+ kursi</option>
                    <option value="15">15+ kursi</option>
                  </select>
                </div>
              </div>
            </motion.div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center text-gray-700 font-medium"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filter
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="recommended">Rekomendasi</option>
                    <option value="price-low">Harga: Rendah - Tinggi</option>
                    <option value="price-high">Harga: Tinggi - Rendah</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>
              </div>

              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} searchParams={searchParams} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tidak ada mobil ditemukan
                  </h3>
                  <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}