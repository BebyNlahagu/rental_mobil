import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Users, Briefcase, Fuel, Settings2, 
  Star, Check, Calendar, Shield, Info, MapPin, Loader2
} from 'lucide-react';
import { SEO, generateCarStructuredData } from '../components/SEO';
import { getCarByIdFromDB } from '../lib/supabase';
import { additionalServices } from '../data/cars';
import { formatCurrency, calculateDays, formatDate } from '../lib/utils';

export function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadCar(id);
    }
  }, [id]);

  const loadCar = async (carId: string) => {
    setLoading(true);
    try {
      const data = await getCarByIdFromDB(carId);
      setCar(data);
    } catch (error) {
      console.error('Error loading car from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mobil Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Mobil yang Anda cari tidak tersedia.</p>
          <Link to="/cars" className="text-blue-600 font-medium">
            Kembali ke Daftar Mobil
          </Link>
        </div>
      </div>
    );
  }

  const pickupDate = searchParams.get('pickupDate') || '';
  const dropoffDate = searchParams.get('dropoffDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const dropoffTime = searchParams.get('dropoffTime') || '10:00';
  const hasDates = Boolean(pickupDate && dropoffDate);
  const totalDays = hasDates
    ? calculateDays(pickupDate, dropoffDate)
    : 1;
  
  const basePrice = car.pricePerDay * totalDays;
  const servicesPrice = selectedServices.reduce((total, serviceId) => {
    const service = additionalServices.find(s => s.id === serviceId);
    return total + (service?.price || 0) * totalDays;
  }, 0);
  const totalPrice = basePrice + servicesPrice;

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBook = () => {
    if (!hasDates) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set('carId', car.id);
    params.set('services', selectedServices.join(','));
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <>
      <SEO
        title={`Sewa ${car.name} - ${formatCurrency(car.pricePerDay)}/hari`}
        description={`${car.description} Harga rental mulai ${formatCurrency(car.pricePerDay)}/hari. Tersedia di ${car.location}.`}
        image={car.images[0]}
        type="product"
        structuredData={generateCarStructuredData(car)}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to={`/cars?${searchParams.toString()}`} className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Kembali ke Pencarian
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-96">
                  <img
                    src={car.images[selectedImage]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {car.images.length > 1 && (
                  <div className="flex gap-2 p-4">
                    {car.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt={`${car.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Car Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
                    <p className="text-gray-600">{car.brand} {car.model} {car.year}</p>
                  </div>
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
                    <span className="font-semibold text-gray-900">{car.rating}</span>
                    <span className="text-gray-500 ml-1">({car.reviewCount} ulasan)</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{car.description}</p>

                {/* Specifications */}
                <h3 className="font-bold text-gray-900 mb-4">Spesifikasi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Kursi</p>
                      <p className="font-semibold">{car.seats} Orang</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Bagasi</p>
                      <p className="font-semibold">{car.luggage} Koper</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Settings2 className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Transmisi</p>
                      <p className="font-semibold capitalize">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Bahan Bakar</p>
                      <p className="font-semibold capitalize">{car.fuelType}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Fitur</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature: string) => (
                    <div key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Additional Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Layanan Tambahan</h3>
                <div className="space-y-3">
                  {additionalServices.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedServices.includes(service.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(service.price)}/hari
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6 sticky top-24"
              >
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Harga per hari</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(car.pricePerDay)}</p>
                </div>

                {pickupDate && dropoffDate && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold">{totalDays} hari</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(pickupDate)} - {formatDate(dropoffDate)}
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sewa Mobil ({totalDays} hari)</span>
                    <span className="font-semibold">{formatCurrency(basePrice)}</span>
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Layanan Tambahan</span>
                      <span className="font-semibold">{formatCurrency(servicesPrice)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={!hasDates}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${hasDates ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Lanjutkan Pemesanan
                </button>
                {!hasDates && (
                  <p className="mt-3 text-sm text-red-600">
                    Silakan pilih tanggal pickup dan dropoff terlebih dahulu sebelum melanjutkan.
                  </p>
                )}

                <div className="mt-4 flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    Pembatalan gratis hingga 24 jam sebelum pengambilan
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
