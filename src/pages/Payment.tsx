import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, CreditCard, Building2, Wallet, 
  Shield, CheckCircle, AlertCircle, Copy, Clock
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getBookingByIdFromDB, updateBookingInDB, addPaymentToDB } from '../lib/supabase';
import { formatCurrency, generateTransactionId, loadFromStorage } from '../lib/utils';
import type { Booking, Payment } from '../types';

export function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'e_wallet' | 'virtual_account'>('virtual_account');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3600); // 1 hour

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        navigate('/');
        return;
      }

      try {
        const bookingFromDB = await getBookingByIdFromDB(bookingId);
        if (bookingFromDB) {
          setBooking(bookingFromDB);
          return;
        }

        const bookings = loadFromStorage<Booking[]>('bookings', []);
        const found = bookings.find((b: Booking) => b.id === bookingId);
        if (found) {
          setBooking(found);
          return;
        }

        console.error('Booking not found for ID:', bookingId);
        navigate('/');
      } catch (error) {
        console.error('Error loading booking:', error);
        navigate('/');
      }
    };

    loadBooking();
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    console.log('Starting payment process for booking:', bookingId);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (!booking) {
        throw new Error('Booking data is not available');
      }

      const updatedBooking = await updateBookingInDB(booking.id, {
        paymentStatus: 'paid',
        status: 'confirmed'
      });

      const bookingForState = updatedBooking ?? {
        ...booking,
        paymentStatus: 'paid',
        status: 'confirmed'
      };
      setBooking(bookingForState);

      const transactionId = generateTransactionId();
      const paymentRecord: Payment = {
        id: transactionId,
        bookingId: booking.id,
        amount: booking.totalPrice,
        method: paymentMethod,
        status: 'success',
        transactionId,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await addPaymentToDB(paymentRecord);

      setIsProcessing(false);
      setPaymentComplete(true);
      console.log('Payment process completed successfully');
    } catch (error) {
      console.error('Error during payment process:', error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <>
        <SEO
          title="Pembayaran Berhasil - Rental Mobil"
          description="Pembayaran Anda telah berhasil dikonfirmasi. Terima kasih telah memesan."
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-gray-600 mb-6">
              Pemesanan Anda telah dikonfirmasi. E-tiket telah dikirim ke email Anda.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Nomor Booking</p>
              <p className="text-xl font-bold text-gray-900">{booking.id}</p>
            </div>
            <div className="space-y-3">
              <Link
                to={`/booking-confirmation?bookingId=${booking.id}`}
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Lihat Detail Pemesanan
              </Link>
              <Link
                to="/"
                className="block w-full text-gray-600 py-3 font-medium hover:text-gray-900"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const virtualAccountNumber = `88099${booking.id.replace(/\D/g, '').slice(-8)}`;

  return (
    <>
      <SEO
        title="Pembayaran - Rental Mobil"
        description="Selesaikan pembayaran Anda dengan berbagai metode pembayaran yang tersedia."
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="ml-2 font-medium text-gray-900">Pilih Mobil</span>
            </div>
            <ChevronRight className="h-5 w-5 mx-4 text-gray-400" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="ml-2 font-medium text-gray-900">Data Diri</span>
            </div>
            <ChevronRight className="h-5 w-5 mx-4 text-gray-400" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                3
              </div>
              <span className="ml-2 font-medium text-gray-900">Pembayaran</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
              <h1 className="text-2xl font-bold mb-2">Pembayaran</h1>
              <p className="text-blue-100">
                Selesaikan pembayaran dalam <span className="font-bold">{formatTime(countdown)}</span>
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>
                  
                  <div className="space-y-3">
                    {/* Virtual Account */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'virtual_account' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="virtual_account"
                        checked={paymentMethod === 'virtual_account'}
                        onChange={() => setPaymentMethod('virtual_account')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Building2 className="h-6 w-6 ml-3 text-gray-600" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">Virtual Account</p>
                        <p className="text-sm text-gray-600">Transfer dari ATM/Internet Banking</p>
                      </div>
                    </label>

                    {/* Credit Card */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <CreditCard className="h-6 w-6 ml-3 text-gray-600" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">Kartu Kredit/Debit</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                      </div>
                    </label>

                    {/* E-Wallet */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'e_wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="e_wallet"
                        checked={paymentMethod === 'e_wallet'}
                        onChange={() => setPaymentMethod('e_wallet')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Wallet className="h-6 w-6 ml-3 text-gray-600" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">E-Wallet</p>
                        <p className="text-sm text-gray-600">GoPay, OVO, DANA, ShopeePay</p>
                      </div>
                    </label>
                  </div>

                  {/* Virtual Account Details */}
                  {paymentMethod === 'virtual_account' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">Bank Transfer - BCA</h4>
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-sm text-gray-600 mb-1">Nomor Virtual Account</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-gray-900 font-mono">{virtualAccountNumber}</p>
                          <button
                            onClick={() => handleCopy(virtualAccountNumber)}
                            className="flex items-center text-blue-600 hover:text-blue-700"
                          >
                            {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <ol className="mt-4 space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Buka aplikasi m-banking atau ATM</li>
                        <li>Pilih menu Transfer atau Pembayaran</li>
                        <li>Masukkan nomor virtual account di atas</li>
                        <li>Masukkan nominal {formatCurrency(booking.totalPrice)}</li>
                        <li>Konfirmasi pembayaran</li>
                      </ol>
                    </motion.div>
                  )}

                  {/* Credit Card Form */}
                  {paymentMethod === 'credit_card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Kartu</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik Kartu</label>
                        <input
                          type="text"
                          placeholder="JOHN DOE"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expired</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* E-Wallet Form */}
                  {paymentMethod === 'e_wallet' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map((wallet) => (
                        <label key={wallet} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="radio" name="wallet" className="w-4 h-4 text-blue-600" />
                          <span className="ml-3 font-medium">{wallet}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
                  
                  <div className="space-y-3 mb-4 pb-4 border-b">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobil</span>
                      <span className="font-medium">{booking.car.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durasi</span>
                      <span className="font-medium">{booking.totalDays} hari</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sewa Mobil</span>
                      <span>{formatCurrency(booking.basePrice)}</span>
                    </div>
                    {booking.additionalServices?.map((service) => (
                      <div key={service.id} className="flex justify-between">
                        <span className="text-gray-600">{service.name}</span>
                        <span>{formatCurrency(service.price * booking.totalDays)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</span>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Memproses...
                      </>
                    ) : (
                      `Bayar ${formatCurrency(booking.totalPrice)}`
                    )}
                  </button>

                  <div className="mt-4 flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <p className="text-xs text-gray-600">
                      Pembayaran Anda aman dan terenkripsi dengan SSL 256-bit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
