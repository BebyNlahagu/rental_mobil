import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, Car as CarIcon, Filter, 
  ChevronLeft, ChevronRight, Fuel, Settings2, Users, 
  CheckCircle2, AlertCircle, X, Loader2
} from 'lucide-react';
import { CarFormModal } from '../../components/CarFormModal';
import { 
  getCarsFromDB,
  addCarToDB,
  updateCarInDB,
  deleteCarFromDB,
  subscribeToCars
} from '../../lib/supabase';
import { formatCurrency, getCarTypeLabel } from '../../lib/utils';
import type { Car } from '../../types';

export function ManageCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load cars on mount
  useEffect(() => {
    // Load cars from Supabase
    loadCars();
    
    // Subscribe to realtime updates
    const unsubscribe = subscribeToCars((updatedCars) => {
      setCars(updatedCars);
      setLoading(false);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await getCarsFromDB();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars from Supabase:', error);
      showNotification('error', 'Gagal memuat data mobil');
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || car.type === selectedType;
    return matchesSearch && matchesType;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCar = async (carData: Partial<Car>) => {
    setIsSaving(true);
    try {
      // Create complete car object
      const newCar: Car = {
        id: Date.now().toString(),
        name: carData.name || '',
        brand: carData.brand || '',
        model: carData.model || '',
        year: carData.year || new Date().getFullYear(),
        type: carData.type || 'compact',
        transmission: carData.transmission || 'automatic',
        fuelType: carData.fuelType || 'petrol',
        seats: carData.seats || 5,
        luggage: carData.luggage || 2,
        pricePerDay: carData.pricePerDay || 0,
        images: carData.images || [],
        features: carData.features || [],
        description: carData.description || '',
        availability: carData.availability ?? true,
        rating: 4.5,
        reviewCount: 0,
        location: carData.location || 'Jakarta'
      };
      
      const savedCar = await addCarToDB({
        name: newCar.name,
        brand: newCar.brand,
        model: newCar.model,
        year: newCar.year,
        type: newCar.type,
        transmission: newCar.transmission,
        fuelType: newCar.fuelType,
        seats: newCar.seats,
        luggage: newCar.luggage,
        pricePerDay: newCar.pricePerDay,
        images: newCar.images,
        features: newCar.features,
        description: newCar.description,
        availability: newCar.availability,
        rating: newCar.rating,
        reviewCount: newCar.reviewCount,
        location: newCar.location
      });

      console.log('Supabase addCar result:', savedCar);
      
      if (savedCar) {
        setCars(prevCars => [...prevCars, savedCar]);
        setIsModalOpen(false);
        showNotification('success', 'Mobil berhasil ditambahkan ke Supabase!');
      } else {
        showNotification('error', 'Gagal menambahkan mobil ke Supabase');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      showNotification('error', 'Gagal menambahkan mobil: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCar = async (carData: Partial<Car>) => {
    if (editingCar) {
      setIsSaving(true);
      try {
        const updatedCar = await updateCarInDB(editingCar.id, {
          ...editingCar,
          ...carData
        });

        console.log('Supabase updateCar result:', updatedCar);

        if (updatedCar) {
          setCars(prevCars => prevCars.map(car => car.id === updatedCar.id ? updatedCar : car));
          setEditingCar(null);
          setIsModalOpen(false);
          showNotification('success', 'Data mobil berhasil diperbarui di Supabase!');
        } else {
          showNotification('error', 'Gagal memperbarui mobil di Supabase');
        }
      } catch (error) {
        console.error('Error updating car:', error);
        showNotification('error', 'Gagal memperbarui mobil: ' + (error as Error).message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async (carId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
      try {
        const deleted = await deleteCarFromDB(carId);
        console.log('Supabase deleteCar result:', deleted);

        if (deleted) {
          setCars(prevCars => prevCars.filter(car => car.id !== carId));
          showNotification('success', 'Mobil berhasil dihapus dari Supabase!');
        } else {
          showNotification('error', 'Gagal menghapus mobil dari Supabase');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        showNotification('error', 'Gagal menghapus mobil');
      }
    }
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const handleSave = (carData: Partial<Car>) => {
    if (editingCar) {
      handleEditCar(carData);
    } else {
      handleAddCar(carData);
    }
  };

  const carTypeList = ['all', 'economy', 'compact', 'midsize', 'suv', 'luxury', 'van'];

  const stats = [
    { label: 'Total Mobil', value: cars.length, icon: CarIcon, color: 'blue' },
    { label: 'Tersedia', value: cars.filter(c => c.availability).length, icon: CheckCircle2, color: 'emerald' },
    { label: 'Disewa', value: cars.filter(c => !c.availability).length, icon: Users, color: 'amber' },
    { label: 'Total Tipe', value: new Set(cars.map(c => c.type)).size, icon: Filter, color: 'purple' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center ${
              notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-4">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Mobil</h1>
          <p className="text-slate-500 mt-1">Kelola armada mobil rental Anda</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Mobil
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari mobil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Semua Tipe</option>
              {carTypeList.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{getCarTypeLabel(type)}</option>
              ))}
            </select>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    car.availability 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {car.availability ? 'Tersedia' : 'Disewa'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(car)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{car.name}</h3>
                    <p className="text-sm text-slate-500">{car.brand} {car.model}</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                    {getCarTypeLabel(car.type)}
                  </span>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 my-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {car.seats}
                  </span>
                  <span className="flex items-center">
                    <Settings2 className="h-4 w-4 mr-1" />
                    {car.transmission === 'automatic' ? 'AT' : 'MT'}
                  </span>
                  <span className="flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    {car.fuelType === 'electric' ? 'EV' : car.fuelType.slice(0, 3).toUpperCase()}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Harga/hari</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(car.pricePerDay)}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium text-slate-700">{car.rating}</span>
                    <span className="text-slate-400 text-sm ml-1">({car.reviewCount})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Mobil</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tipe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Spesifikasi</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Harga</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-14 h-14 rounded-xl object-cover mr-4"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{car.name}</p>
                        <p className="text-sm text-slate-500">{car.brand} {car.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-medium text-slate-700">
                      {getCarTypeLabel(car.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {car.seats} kursi
                      </span>
                      <span className="flex items-center">
                        <Settings2 className="h-4 w-4 mr-1" />
                        {car.transmission}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{formatCurrency(car.pricePerDay)}</p>
                    <p className="text-sm text-slate-500">per hari</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      car.availability 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {car.availability ? 'Tersedia' : 'Disewa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(car)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredCars.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CarIcon className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Tidak ada mobil ditemukan</h3>
          <p className="text-slate-500 mt-1">Coba ubah filter pencarian Anda</p>
          <button
            onClick={openAddModal}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Tambah Mobil Baru
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Menampilkan {filteredCars.length} dari {cars.length} mobil
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">1</button>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Car Form Modal */}
      <CarFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCar(null);
        }}
        onSave={handleSave}
        car={editingCar}
        isSaving={isSaving}
      />
    </div>
  );
}
