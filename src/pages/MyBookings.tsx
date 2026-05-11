import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Calendar, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCurrentUser } from '../lib/auth';
import { getBookingsFromDB } from '../lib/supabase';
import { loadFromStorage, formatCurrency, formatDate } from '../lib/utils';
import type { Booking } from '../types';

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const userEmail = user.email.toLowerCase();

      try {
        const allBookings = await getBookingsFromDB();
        const userBookings = allBookings.filter(
          (booking) => booking.customerEmail?.toLowerCase() === userEmail
        );
        setBookings(userBookings);
      } catch (error) {
        console.error('[MyBookings] Error loading bookings from DB:', error);
        const storedBookings = loadFromStorage<Booking[]>('bookings', []);
        const userBookings = storedBookings.filter(
          (booking) => booking.customerEmail?.toLowerCase() === userEmail
        );
        setBookings(userBookings);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  return (
    <>
      <SEO
        title="Kelola Pemesanan Saya"
        description="Lihat dan kelola tiket booking Anda di halaman profil." 
      />

      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 mb-4">
                  <Ticket className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Kelola Pemesanan Saya</h1>
                <p className="mt-2 text-slate-500 max-w-2xl">
                  Semua tiket booking Anda ada di sini. Klik detail untuk melihat informasi lengkap pemesanan.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Akun</p>
                <p className="font-semibold text-slate-900">{user?.name || 'Tamu'}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-xl font-semibold text-slate-900 mb-3">Belum ada tiket booking</p>
                  <p className="text-slate-500 mb-6">Anda belum melakukan pemesanan atau tiket belum tersimpan.</p>
                  <Link
                    to="/cars"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Temukan Mobil Sekarang
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 bg-blue-100 rounded-full px-3 py-1">
                              {booking.status === 'active' ? 'Aktif' : booking.status === 'confirmed' ? 'Dikonfirmasi' : booking.status}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 bg-white rounded-full px-3 py-1">
                              {booking.paymentStatus === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <p className="font-semibold text-slate-900">{booking.car?.name}</p>
                            <p className="text-sm text-slate-500">{booking.car?.brand} • {booking.car?.model}</p>
                          </div>
                          <p className="text-slate-500">{formatCurrency(booking.totalPrice)} • {booking.totalDays} hari</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div className="rounded-3xl bg-white px-4 py-3 text-center shadow-sm">
                            <p className="text-xs text-slate-500">Pengambilan</p>
                            <p className="font-semibold text-slate-900">{formatDate(booking.pickupDate)}</p>
                          </div>
                          <div className="rounded-3xl bg-white px-4 py-3 text-center shadow-sm">
                            <p className="text-xs text-slate-500">Pengembalian</p>
                            <p className="font-semibold text-slate-900">{formatDate(booking.dropoffDate)}</p>
                          </div>
                          <div className="rounded-3xl bg-white px-4 py-3 text-center shadow-sm">
                            <p className="text-xs text-slate-500">Lokasi</p>
                            <p className="font-semibold text-slate-900">{booking.pickupLocation}</p>
                          </div>
                        </div>

                        <Link
                          to={`/booking-confirmation?bookingId=${booking.id}`}
                          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          Lihat Tiket
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
