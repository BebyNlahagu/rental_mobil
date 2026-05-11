import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Calendar,
  ChevronLeft, ChevronRight, Download, MoreHorizontal,
  Clock, Car, User, CreditCard, MapPin, Plus, RotateCcw
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../lib/utils';
import { updateBookingInDB, isSupabaseAvailable } from '../../lib/supabase';
import { useBookings } from '../../lib/useBookings';
import type { Booking } from '../../types';

export function ManageBookings() {
  const { bookings, isLoading, refreshBookings, updateBookings } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.car?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('Filtered bookings:', filteredBookings.length, 'out of', bookings.length);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (isSupabaseAvailable) {
      const updatedBooking = await updateBookingInDB(bookingId, {
        status: newStatus as Booking['status']
      });

      if (updatedBooking) {
        refreshBookings();
        return;
      }
    }

    const updated = bookings.map((b: Booking) => 
      b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b
    );
    updateBookings(updated);
  };

  const createTestBooking = () => {
    const testBooking: Booking = {
      id: 'BK-TEST-' + Date.now(),
      carId: '1',
      car: {
        id: '1',
        name: 'Toyota Avanza',
        brand: 'Toyota',
        model: 'Avanza',
        year: 2024,
        type: 'compact' as const,
        transmission: 'automatic' as const,
        fuelType: 'petrol' as const,
        seats: 7,
        luggage: 3,
        pricePerDay: 350000,
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags'],
        description: 'Mobil keluarga yang nyaman.',
        availability: true,
        rating: 4.5,
        reviewCount: 128,
        location: 'Jakarta'
      },
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '081234567890',
      pickupLocation: 'Jakarta',
      dropoffLocation: 'Jakarta',
      pickupDate: '2024-12-25',
      pickupTime: '10:00',
      dropoffDate: '2024-12-27',
      dropoffTime: '10:00',
      totalDays: 2,
      basePrice: 700000,
      insuranceFee: 0,
      additionalServices: [],
      totalPrice: 700000,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      driverAge: 25,
      licenseNumber: '1234567890'
    };

    const updated = [...bookings, testBooking];
    updateBookings(updated);
    console.log('Test booking created:', testBooking);
  };

  const viewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Car', 'Pickup Date', 'Dropoff Date', 'Total', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map((b: Booking) => [
        b.id,
        b.customerName,
        b.car?.name || '',
        b.pickupDate,
        b.dropoffDate,
        b.totalPrice,
        b.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
  };

  const stats = [
    { label: 'Total', value: bookings.length, color: 'blue' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'amber' },
    { label: 'Aktif', value: bookings.filter(b => b.status === 'active').length, color: 'emerald' },
    { label: 'Selesai', value: bookings.filter(b => b.status === 'completed').length, color: 'purple' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pemesanan</h1>
          <p className="text-slate-500 mt-1">Kelola semua pemesanan mobil rental</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshBookings}
            className="flex items-center justify-center bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-all"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Refresh Data
          </button>
          <button
            onClick={createTestBooking}
            className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Buat Test Booking
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center justify-center bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all"
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-${stat.color}-50 rounded-xl p-4 border border-${stat.color}-100`}
          >
            <p className={`text-sm text-${stat.color}-600 font-medium`}>{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
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
              placeholder="Cari booking ID, nama, atau mobil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="active">Aktif</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobil</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Periode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-900">{booking.id}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{booking.customerName}</p>
                          <p className="text-sm text-slate-500">{booking.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={booking.car?.images[0]}
                          alt={booking.car?.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <span className="text-slate-700 font-medium">{booking.car?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">
                        <p className="font-medium">{formatDate(booking.pickupDate)}</p>
                        <p className="text-sm text-slate-500">s/d {formatDate(booking.dropoffDate)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{formatCurrency(booking.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${getStatusColor(booking.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="active">Aktif</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewDetails(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Tidak ada pemesanan ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan {filteredBookings.length} pemesanan
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
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Detail Pemesanan</h2>
                <p className="text-sm text-slate-500">{selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Status Pemesanan</span>
                <span className={`inline-flex px-4 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusLabel(selectedBooking.status)}
                </span>
              </div>

              {/* Car Info */}
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                <img
                  src={selectedBooking.car?.images[0]}
                  alt={selectedBooking.car?.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedBooking.car?.name}</h3>
                  <p className="text-slate-500">{selectedBooking.car?.brand} {selectedBooking.car?.model}</p>
                  <p className="text-blue-600 font-bold mt-1">{formatCurrency(selectedBooking.totalPrice)}</p>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Pelanggan</p>
                  <p className="font-semibold text-slate-900">{selectedBooking.customerName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="font-semibold text-slate-900">{selectedBooking.customerEmail}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Telepon</p>
                  <p className="font-semibold text-slate-900">{selectedBooking.customerPhone}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Nomor SIM</p>
                  <p className="font-semibold text-slate-900">{selectedBooking.licenseNumber}</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-slate-900">Pengambilan</span>
                  </div>
                  <p className="text-slate-700">{formatDate(selectedBooking.pickupDate)}</p>
                  <p className="text-slate-500">{selectedBooking.pickupTime}</p>
                  <p className="text-sm text-slate-500 mt-1">{selectedBooking.pickupLocation}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-slate-900">Pengembalian</span>
                  </div>
                  <p className="text-slate-700">{formatDate(selectedBooking.dropoffDate)}</p>
                  <p className="text-slate-500">{selectedBooking.dropoffTime}</p>
                  <p className="text-sm text-slate-500 mt-1">{selectedBooking.dropoffLocation}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-3">Rincian Harga</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sewa Mobil ({selectedBooking.totalDays} hari)</span>
                    <span className="font-medium">{formatCurrency(selectedBooking.basePrice)}</span>
                  </div>
                  {selectedBooking.additionalServices?.map((service) => (
                    <div key={service.id} className="flex justify-between">
                      <span className="text-slate-600">{service.name}</span>
                      <span className="font-medium">{formatCurrency(service.price * selectedBooking.totalDays)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-blue-600">{formatCurrency(selectedBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
