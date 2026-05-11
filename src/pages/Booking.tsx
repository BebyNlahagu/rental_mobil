import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, User, Mail, Phone, Calendar, 
  MapPin, Clock, Shield, Info, Car as CarIcon
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { additionalServices } from '../data/cars';
import { addBookingToDB, getCarByIdFromDB } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { formatCurrency, calculateDays, formatDate, generateBookingId } from '../lib/utils';
import type { Booking, Car } from '../types';

export function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  
  const carId = searchParams.get('carId');
  const currentUser = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    if (carId) {
      loadCar(carId);
    }
  }, [carId]);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        email: currentUser.email,
        firstName: prev.firstName || currentUser.name.split(' ')[0] || '',
        lastName: prev.lastName || currentUser.name.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [currentUser]);

  const loadCar = async (id: string) => {
    setLoading(true);
    try {
      const carData = await getCarByIdFromDB(id);
      setCar(carData);
    } catch (error) {
      console.error('Error loading car:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const pickupDate = searchParams.get('pickupDate') || '';
  const dropoffDate = searchParams.get('dropoffDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const dropoffTime = searchParams.get('dropoffTime') || '10:00';
  const location = searchParams.get('location') || 'Jakarta';
  const serviceIds = searchParams.get('services')?.split(',').filter(Boolean) || [];
  
  const selectedServices = additionalServices.filter(s => serviceIds.includes(s.id));
  const totalDays = calculateDays(pickupDate, dropoffDate);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverAge: '',
    licenseNumber: '',
    pickupLocation: location,
    dropoffLocation: location,
    specialRequests: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasFormErrors = Object.keys(errors).length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Memuat data mobil...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mobil Tidak Ditemukan</h1>
          <p className="text-gray-600">Silakan pilih mobil terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  const basePrice = car.pricePerDay * totalDays;
  const servicesPrice = selectedServices.reduce((total, service) => 
    total + (service.price * totalDays), 0
  );
  const totalPrice = basePrice + servicesPrice;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Nama depan wajib diisi';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nama belakang wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid';
    }
    if (!formData.driverAge || parseInt(formData.driverAge) < 18) {
      newErrors.driverAge = 'Umur pengemudi minimal 18 tahun';
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Nomor SIM wajib diisi';
    }
    if (!pickupDate || !dropoffDate) {
      newErrors.dates = 'Tanggal pickup dan dropoff wajib dipilih';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    const bookingId = generateBookingId();
    const bookingData: Booking = {
      id: bookingId,
      carId: car.id,
      car: car,
      customerName: currentUser?.name || `${formData.firstName} ${formData.lastName}`,
      customerEmail: currentUser?.email || formData.email,
      customerPhone: formData.phone,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      totalDays,
      basePrice,
      insuranceFee: 0,
      additionalServices: selectedServices,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      driverAge: parseInt(formData.driverAge),
      licenseNumber: formData.licenseNumber
    };

    console.log('Creating booking:', bookingData);

    try {
      const savedBooking = await addBookingToDB(bookingData);
      const bookingIdToUse = savedBooking?.id ?? bookingId;

      console.log('Booking saved:', savedBooking || bookingData);
      navigate(`/payment?bookingId=${bookingIdToUse}`);
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  return (
    <>
      <SEO
        title="Formulir Pemesanan - Rental Mobil"
        description="Lengkapi data Anda untuk melanjutkan pemesanan mobil. Proses booking cepat dan aman."
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold">
                <CarIcon className="h-5 w-5" />
              </div>
              <span className="ml-2 font-medium text-gray-900">Pilih Mobil</span>
            </div>
            <ChevronRight className="h-5 w-5 mx-4 text-gray-400" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                2
              </div>
              <span className="ml-2 font-medium text-gray-900">Data Diri</span>
            </div>
            <ChevronRight className="h-5 w-5 mx-4 text-gray-400" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-bold">
                3
              </div>
              <span className="ml-2 font-medium text-gray-500">Pembayaran</span>
            </div>
          </div>

          {hasFormErrors && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="font-semibold">Perhatian:</p>
              <p className="mt-1 text-sm">
                Mohon lengkapi semua data yang diperlukan sebelum melanjutkan ke pembayaran.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Pemesan</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informasi Pribadi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Depan *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Belakang *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Telepon *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="081234567890"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Informasi Pengemudi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Umur Pengemudi *
                        </label>
                        <input
                          type="number"
                          min="18"
                          max="80"
                          value={formData.driverAge}
                          onChange={(e) => setFormData({ ...formData, driverAge: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.driverAge ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="25"
                        />
                        {errors.driverAge && (
                          <p className="mt-1 text-sm text-red-600">{errors.driverAge}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor SIM *
                        </label>
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="A1234567"
                        />
                        {errors.licenseNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dates Info */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Tanggal Pemesanan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Pickup *
                        </label>
                        <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          <p className="text-gray-800">{pickupDate ? formatDate(pickupDate) : '(Belum dipilih)'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Dropoff *
                        </label>
                        <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          <p className="text-gray-800">{dropoffDate ? formatDate(dropoffDate) : '(Belum dipilih)'}</p>
                        </div>
                      </div>
                    </div>
                    {errors.dates && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <span className="inline-block w-4 h-4 mr-2 bg-red-100 rounded-full text-center flex items-center justify-center text-xs">!</span>
                        {errors.dates}
                      </p>
                    )}
                  </div>

                  {/* Pickup/Dropoff */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Lokasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lokasi Pengambilan
                        </label>
                        <input
                          type="text"
                          value={formData.pickupLocation}
                          onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lokasi Pengembalian
                        </label>
                        <input
                          type="text"
                          value={formData.dropoffLocation}
                          onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permintaan Khusus (Opsional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tulis permintaan khusus Anda..."
                    />
                  </div>

                  {/* Terms */}
                  <div className="border-t pt-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className={`mt-1 w-4 h-4 rounded focus:ring-blue-500 ${
                          errors.agreeTerms ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Saya menyetujui{' '}
                        <a href="#" className="text-blue-600 hover:underline">Syarat dan Ketentuan</a>
                        {' '}serta{' '}
                        <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!pickupDate || !dropoffDate}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${pickupDate && dropoffDate ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Lanjutkan ke Pembayaran
                  </button>
                  {(!pickupDate || !dropoffDate) && (
                    <p className="mt-3 text-sm text-red-600">
                      Silakan pilih tanggal pickup dan dropoff pada halaman pencarian sebelum melanjutkan.
                    </p>
                  )}
                </form>
              </motion.div>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6 sticky top-24"
              >
                <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pemesanan</h3>
                
                {/* Car Info */}
                <div className="flex items-center space-x-4 mb-4 pb-4 border-b">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{car.name}</h4>
                    <p className="text-sm text-gray-600">{car.brand} {car.model}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {formatDate(pickupDate)} {pickupTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {formatDate(dropoffDate)} {dropoffTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{location}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sewa ({totalDays} hari)</span>
                    <span>{formatCurrency(basePrice)}</span>
                  </div>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{service.name}</span>
                      <span>{formatCurrency(service.price * totalDays)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="mt-4 flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <p className="text-xs text-gray-600">
                    Data Anda aman dan terenkripsi
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
