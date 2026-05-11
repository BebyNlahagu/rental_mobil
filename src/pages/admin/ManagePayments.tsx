import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Eye, Download, CheckCircle, XCircle,
  CreditCard, ChevronLeft, ChevronRight, TrendingUp,
  Wallet, Building2, Banknote
} from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../lib/utils';
import { getPaymentsFromDB, getBookingsFromDB, updatePaymentInDB, isSupabaseAvailable } from '../../lib/supabase';
import type { Payment, Booking } from '../../types';

export function ManagePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create test data if none exists
  const createTestData = () => {
    const testBookings: Booking[] = [
      {
        id: 'BOOK001',
        carId: 'car1',
        customerName: 'Budi Santoso',
        customerEmail: 'budi@example.com',
        customerPhone: '081234567890',
        pickupLocation: 'Bandung',
        dropoffLocation: 'Bandung',
        pickupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        pickupTime: '10:00',
        dropoffDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        dropoffTime: '10:00',
        totalDays: 2,
        basePrice: 400000,
        insuranceFee: 50000,
        additionalServices: [],
        totalPrice: 500000,
        status: 'completed',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        driverAge: 30,
        licenseNumber: 'B1234567',
        car: {
          id: 'car1',
          name: 'Toyota Avanza 2023',
          brand: 'Toyota',
          model: 'Avanza',
          year: 2023,
          type: 'economy',
          transmission: 'manual',
          fuelType: 'petrol',
          seats: 7,
          luggage: 4,
          pricePerDay: 250000,
          images: ['https://via.placeholder.com/300x200'],
          features: ['AC', 'MP3 Player'],
          description: 'Toyota Avanza nyaman untuk keluarga',
          availability: true,
          rating: 4.5,
          reviewCount: 24,
          location: 'Bandung'
        }
      },
      {
        id: 'BOOK002',
        carId: 'car2',
        customerName: 'Siti Nurhaliza',
        customerEmail: 'siti@example.com',
        customerPhone: '082345678901',
        pickupLocation: 'Jakarta',
        dropoffLocation: 'Jakarta',
        pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        pickupTime: '09:00',
        dropoffDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        dropoffTime: '09:00',
        totalDays: 3,
        basePrice: 600000,
        insuranceFee: 75000,
        additionalServices: [],
        totalPrice: 750000,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        driverAge: 28,
        licenseNumber: 'D9876543',
        car: {
          id: 'car2',
          name: 'Honda Jazz 2024',
          brand: 'Honda',
          model: 'Jazz',
          year: 2024,
          type: 'compact',
          transmission: 'automatic',
          fuelType: 'petrol',
          seats: 5,
          luggage: 2,
          pricePerDay: 250000,
          images: ['https://via.placeholder.com/300x200'],
          features: ['AC', 'Bluetooth'],
          description: 'Honda Jazz efisien untuk perjalanan dalam kota',
          availability: true,
          rating: 4.7,
          reviewCount: 18,
          location: 'Jakarta'
        }
      }
    ];

    const testPayments: Payment[] = [
      {
        id: 'PAY001',
        bookingId: 'BOOK001',
        amount: 500000,
        method: 'virtual_account',
        status: 'success',
        transactionId: 'TRX20260511001',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        paymentDetails: { bankName: 'BCA' }
      },
      {
        id: 'PAY002',
        bookingId: 'BOOK002',
        amount: 750000,
        method: 'credit_card',
        status: 'pending',
        transactionId: 'TRX20260511002',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentDetails: { cardName: 'Siti Nurhaliza' }
      }
    ];

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');

    if (existingBookings.length === 0) {
      localStorage.setItem('bookings', JSON.stringify(testBookings));
      console.log('[ManagePayments] Created test bookings');
    }
    if (existingPayments.length === 0) {
      localStorage.setItem('payments', JSON.stringify(testPayments));
      console.log('[ManagePayments] Created test payments');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      let loadedPayments: Payment[] = [];
      let loadedBookings: Booking[] = [];
      
      if (isSupabaseAvailable) {
        try {
          loadedPayments = await getPaymentsFromDB();
          loadedBookings = await getBookingsFromDB();
          console.log('[ManagePayments] Loaded from DB:', loadedPayments.length, 'payments');
        } catch (dbError) {
          console.log('[ManagePayments] DB load failed, using localStorage:', dbError);
          loadedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
          loadedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        }
      } else {
        const storedPayments = localStorage.getItem('payments');
        const storedBookings = localStorage.getItem('bookings');
        
        console.log('[ManagePayments] Stored payments:', storedPayments);
        console.log('[ManagePayments] Stored bookings:', storedBookings);
        
        loadedPayments = storedPayments ? JSON.parse(storedPayments) : [];
        loadedBookings = storedBookings ? JSON.parse(storedBookings) : [];
        
        console.log('[ManagePayments] Parsed:', loadedPayments.length, 'payments,', loadedBookings.length, 'bookings');
      }
      
      // If still no data, create test data
      if (loadedPayments.length === 0) {
        console.log('[ManagePayments] No payments found, creating test data...');
        createTestData();
        loadedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        loadedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      }
      
      setPayments(loadedPayments);
      
      const bookingMap: Record<string, Booking> = {};
      loadedBookings.forEach((b: Booking) => {
        bookingMap[b.id] = b;
      });
      setBookings(bookingMap);
      
      console.log('[ManagePayments] Final state - payments:', loadedPayments.length, 'bookings:', loadedBookings.length);
    } catch (error) {
      console.error('[ManagePayments] Error loading data:', error);
      // Even on error, try to load from localStorage
      try {
        const fallbackPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        const fallbackBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        if (fallbackPayments.length === 0) {
          createTestData();
          const testPayments = JSON.parse(localStorage.getItem('payments') || '[]');
          const testBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
          setPayments(testPayments);
          
          const bookingMap: Record<string, Booking> = {};
          testBookings.forEach((b: Booking) => {
            bookingMap[b.id] = b;
          });
          setBookings(bookingMap);
        } else {
          setPayments(fallbackPayments);
          
          const bookingMap: Record<string, Booking> = {};
          fallbackBookings.forEach((b: Booking) => {
            bookingMap[b.id] = b;
          });
          setBookings(bookingMap);
        }
        console.log('[ManagePayments] Fallback loaded');
      } catch (fallbackError) {
        console.error('[ManagePayments] Fallback also failed:', fallbackError);
        // Create test data even on error
        createTestData();
        const emergencyPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        const emergencyBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        setPayments(emergencyPayments);
        
        const bookingMap: Record<string, Booking> = {};
        emergencyBookings.forEach((b: Booking) => {
          bookingMap[b.id] = b;
        });
        setBookings(bookingMap);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ensureStorage = () => {
      const storedPayments = localStorage.getItem('payments');
      const storedBookings = localStorage.getItem('bookings');
      const hasPayments = storedPayments && JSON.parse(storedPayments).length > 0;
      const hasBookings = storedBookings && JSON.parse(storedBookings).length > 0;

      if (!hasPayments || !hasBookings) {
        console.log('[ManagePayments] No localStorage data found, seeding test storage');
        createTestData();
      }
    };

    ensureStorage();
    loadData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'payments' || e.key === 'bookings' || e.key === null) {
        console.log('[ManagePayments] Storage changed, reloading...');
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredPayments = payments.filter(payment => {
    const booking = bookings[payment.bookingId];
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking?.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyPayment = async (paymentId: string, status: 'success' | 'failed') => {
    // Optimistic update - update local state first
    const updated = payments.map(p => 
      p.id === paymentId ? { ...p, status } : p
    );
    setPayments(updated);
    
    // Then update storage/database
    if (isSupabaseAvailable) {
      try {
        await updatePaymentInDB(paymentId, { status });
      } catch (error) {
        console.error('Error updating payment in DB:', error);
        // Revert on error
        setPayments(payments);
      }
    } else {
      // For localStorage, don't call loadData() - just update directly
      localStorage.setItem('payments', JSON.stringify(updated));
    }
  };

  const viewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Transaction ID', 'Booking ID', 'Amount', 'Method', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => [
        p.id,
        p.transactionId,
        p.bookingId,
        p.amount,
        p.method,
        p.status,
        p.createdAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, any> = {
      credit_card: CreditCard,
      bank_transfer: Building2,
      e_wallet: Wallet,
      virtual_account: Banknote
    };
    return icons[method] || CreditCard;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: 'Kartu Kredit',
      bank_transfer: 'Transfer Bank',
      e_wallet: 'E-Wallet',
      virtual_account: 'Virtual Account'
    };
    return labels[method] || method;
  };

  // Calculate stats
  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { 
      label: 'Total Pendapatan', 
      value: totalRevenue, 
      icon: TrendingUp, 
      color: 'emerald',
      trend: '+15.3%'
    },
    { 
      label: 'Menunggu Verifikasi', 
      value: pendingAmount, 
      icon: CreditCard, 
      color: 'amber',
      trend: '5 transaksi'
    },
    { 
      label: 'Total Transaksi', 
      value: payments.length, 
      icon: Wallet, 
      color: 'blue',
      trend: '+8.2%'
    },
    { 
      label: 'Berhasil', 
      value: payments.filter(p => p.status === 'success').length, 
      icon: CheckCircle, 
      color: 'purple',
      trend: '98.5%'
    }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pembayaran</h1>
          <p className="text-slate-500 mt-1">Kelola dan verifikasi pembayaran pelanggan</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all"
        >
          <Download className="h-5 w-5 mr-2" />
          Export CSV
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
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {typeof stat.value === 'number' && stat.value > 1000 
                    ? formatCurrency(stat.value) 
                    : stat.value}
                </p>
              </div>
              <div className={`w-11 h-11 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
            </div>
            <p className={`text-sm mt-3 text-${stat.color}-600 font-medium`}>{stat.trend}</p>
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
              placeholder="Cari transaksi..."
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
              <option value="success">Sukses</option>
              <option value="failed">Gagal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaksi</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Metode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const booking = bookings[payment.bookingId];
                  const MethodIcon = getMethodIcon(payment.method);
                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-slate-900">{payment.transactionId}</span>
                          <span className="text-xs text-slate-500">{payment.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{booking?.customerName || '-'}</p>
                        <p className="text-sm text-slate-500">{booking?.car?.name || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-2">
                            <MethodIcon className="h-4 w-4 text-slate-600" />
                          </div>
                          <span className="text-slate-700">{getMethodLabel(payment.method)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusLabel(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">{formatDateTime(payment.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewDetails(payment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerifyPayment(payment.id, 'success')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Verifikasi"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleVerifyPayment(payment.id, 'failed')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Tolak"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Tidak ada pembayaran ditemukan</p>
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
            Menampilkan {filteredPayments.length} pembayaran
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
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Detail Pembayaran</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Transaction ID</p>
                  <p className="font-mono font-semibold text-slate-900">{selectedPayment.transactionId}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Payment ID</p>
                  <p className="font-mono font-semibold text-slate-900">{selectedPayment.id}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">Jumlah Pembayaran</p>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(selectedPayment.amount)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Metode</p>
                  <p className="font-semibold text-slate-900">{getMethodLabel(selectedPayment.method)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusLabel(selectedPayment.status)}
                  </span>
                </div>
              </div>

              {selectedPayment.paidAt && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Dibayar pada</p>
                  <p className="font-semibold text-slate-900">{formatDateTime(selectedPayment.paidAt)}</p>
                </div>
              )}

              {bookings[selectedPayment.bookingId] && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-2">Booking Terkait</p>
                  <div className="flex items-center">
                    <img
                      src={bookings[selectedPayment.bookingId].car?.images[0]}
                      alt={bookings[selectedPayment.bookingId].car?.name}
                      className="w-16 h-16 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{bookings[selectedPayment.bookingId].customerName}</p>
                      <p className="text-sm text-slate-500">{bookings[selectedPayment.bookingId].car?.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
