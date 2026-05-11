import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, ArrowLeft, Share2, Clock, Shield,
  Car, Calendar, MapPin, Star, Phone, Mail, Download, QrCode
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { TicketPDF } from '../components/TicketPDF';
import { formatCurrency, formatDate, loadFromStorage } from '../lib/utils';
import { getBookingByIdFromDB } from '../lib/supabase';
import { isAdmin } from '../lib/auth';
import type { Booking } from '../types';

export function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        return;
      }

      const bookingFromDB = await getBookingByIdFromDB(bookingId);
      if (bookingFromDB) {
        setBooking(bookingFromDB);
        return;
      }

      const bookings = loadFromStorage<Booking[]>('bookings', []);
      const found = bookings.find((b: Booking) => b.id === bookingId);
      if (found) {
        setBooking(found);
      }
    };

    loadBooking();
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Tidak Ditemukan</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Konfirmasi Pemesanan - ${booking.id}`}
        description="Detail pemesanan rental mobil Anda. Simpan informasi ini untuk referensi."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {!showTicket ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Pemesanan Berhasil!</h1>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Terima kasih telah memilih Rental Mobil Premium. E-tiket telah dikirim ke email Anda.
              </p>
            </motion.div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
            >
              {/* Booking Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Nomor Booking</p>
                    <p className="text-3xl font-bold text-white tracking-wider">{booking.id}</p>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Clock className="h-5 w-5 text-white mr-2" />
                    <span className="text-white font-medium">
                      {booking.totalDays} Hari
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Car Info */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-full md:w-1/3">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={booking.car?.images[0]}
                        alt={booking.car?.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-semibold">{booking.car?.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{booking.car?.name}</h2>
                    <p className="text-gray-500 mb-4">{booking.car?.brand} {booking.car?.model} {booking.car?.year}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {booking.car?.transmission === 'automatic' ? 'Automatic' : 'Manual'}
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        {booking.car?.seats} Kursi
                      </span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium capitalize">
                        {booking.car?.fuelType}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Pengambilan</p>
                        <p className="text-gray-900 font-bold">{formatDate(booking.pickupDate)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {booking.pickupTime}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.pickupLocation}
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Pengembalian</p>
                        <p className="text-gray-900 font-bold">{formatDate(booking.dropoffDate)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {booking.dropoffTime}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Penyewa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-xl font-bold text-blue-600">
                          {booking.customerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Nama</p>
                        <p className="font-semibold text-gray-900">{booking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="font-semibold text-gray-900">{booking.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Telepon</p>
                        <p className="font-semibold text-gray-900">{booking.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">Informasi Penting</h4>
                      <ul className="text-amber-800 text-sm space-y-1">
                        <li>• Simpan nomor booking ini untuk referensi</li>
                        <li>• Bawa KTP dan SIM asli saat pengambilan mobil</li>
                        <li>• Datang 15 menit sebelum jadwal yang ditentukan</li>
                        <li>• Keterlambatan pengembalian dikenakan biaya tambahan</li>
                        <li>• Hubungi customer service di 021-12345678 jika ada pertanyaan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => setShowTicket(true)}
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="h-5 w-5 mr-2" />
                Lihat & Download Tiket
              </button>
              {isAdmin() && (
                <button
                  onClick={() => navigate('/scan')}
                  className="flex-1 flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-4 px-8 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  Scan Tiket
                </button>
              )}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Booking Rental Mobil',
                      text: `Booking ID: ${booking.id}`,
                      url: window.location.href
                    });
                  }
                }}
                className="flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-4 px-8 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Bagikan
              </button>
            </motion.div>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          /* Ticket View */
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <button
                onClick={() => setShowTicket(false)}
                className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Detail
              </button>
            </motion.div>
            <TicketPDF booking={booking} />
          </div>
        )}
      </div>
    </>
  );
}
