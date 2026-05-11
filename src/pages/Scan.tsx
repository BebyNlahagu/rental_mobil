import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { SEO } from '../components/SEO';
import { getBookingByIdFromDB } from '../lib/supabase';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { loadFromStorage } from '../lib/utils';
import type { Booking } from '../types';

export function Scan() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState('Menyiapkan kamera...');
  const [error, setError] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const startScanner = async () => {
    if (!navigator.mediaDevices || !videoRef.current) {
      setError('Browser tidak mendukung kamera.');
      setStatus('Kamera tidak tersedia');
      return null;
    }

    try {
      setStatus('Meminta izin kamera...');
      setError(null);
      setScannedText(null);
      setBooking(null);
      setIsScanning(true);

      // Create reader with optimal settings
      const codeReader = new BrowserMultiFormatReader();
      
      // Start scanning
      const controls = await codeReader.decodeFromVideoDevice(
        undefined, 
        videoRef.current, 
        (result, err) => {
          if (result) {
            const text = result.getText();
            console.log('QR Scanned successfully:', text);
            setScannedText(text);
            setStatus('QR berhasil discan');
            setIsScanning(false);
            controls?.stop();
          } 
          // Suppress scanner errors - these are normal when no QR is detected
          // NotFoundException, ChecksumException, etc. are just scanner feedback
          else if (err && typeof err.message === 'string') {
            const errorMsg = err.message.toLowerCase();
            const errorName = (err.name || '').toLowerCase();
            
            // Only show critical errors, suppress normal scanning feedback
            const isNormalScannerError = 
              errorName.includes('notfound') || 
              errorName.includes('checksum') ||
              errorMsg.includes('no multiformat') ||
              errorMsg.includes('could not find') ||
              errorMsg.includes('unable to locate');
            
            if (!isNormalScannerError) {
              console.error('Scan error:', err.name, err.message);
              setError(`Scan error: ${err.message}`);
            }
          }
        }
      );

      setStatus('📸 Arahkan kamera ke kode QR. Pastikan pencahayaan cukup dan QR jelas terlihat.');
      return controls;
    } catch (err) {
      console.error('Camera error:', err);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('⛔ Izin kamera ditolak. Buka Settings → Camera dan berikan izin untuk situs ini.');
          setStatus('Izin kamera ditolak');
        } else if (err.name === 'NotFoundError') {
          setError('❌ Kamera tidak ditemukan. Pastikan device memiliki kamera yang berfungsi.');
          setStatus('Kamera tidak ditemukan');
        } else if (err.name === 'NotReadableError') {
          setError('⚠️ Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut dan coba lagi.');
          setStatus('Kamera dalam penggunaan');
        } else if (err.name === 'OverconstrainedError') {
          setError('⚙️ Kamera tidak memenuhi requirement. Coba gunakan kamera lain atau browser lain.');
          setStatus('Kamera tidak kompatibel');
        } else {
          setError(`Kamera error: ${err.message}`);
          setStatus('Kamera error');
        }
      } else {
        setError('Tidak dapat mengakses kamera. Periksa izin browser dan coba refresh halaman.');
        setStatus('Kamera gagal');
      }

      setIsScanning(false);
      return null;
    }
  };

  const handleScanAgain = async () => {
    console.log('Restarting scanner...');
    // Reset all states
    setScannedText(null);
    setBooking(null);
    setError(null);
    setStatus('Menyiapkan kamera...');
    setManualInput('');
    setShowManualInput(false);

    // Start new scanner
    const controls = await startScanner();
    if (controls) {
      console.log('Scanner restarted successfully');
    } else {
      console.log('Failed to restart scanner');
    }
  };

  const handleManualInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setError('Masukkan Booking ID');
      return;
    }

    console.log('Processing manual input:', manualInput);
    setScannedText(manualInput.trim());
  };

  useEffect(() => {
    let controls: IScannerControls | null = null;

    startScanner().then((scannerControls) => {
      controls = scannerControls || null;
    });

    return () => {
      if (controls) {
        controls.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!scannedText) return;

    console.log('Processing scanned text:', scannedText);

    const verifyBooking = async () => {
      try {
        let bookingId: string | null = null;

        // First try to parse as JSON (from QR code)
        try {
          const payload = JSON.parse(scannedText);
          console.log('Parsed JSON payload:', payload);

          if (typeof payload === 'object' && payload !== null) {
            // Coba berbagai kemungkinan field untuk booking ID
            bookingId = payload.id || payload.bookingId || payload.booking_id || null;
          }
        } catch (_) {
          // If not JSON, treat as direct booking ID
          console.log('Not JSON, treating as direct booking ID');
          bookingId = scannedText.trim();
        }

        console.log('Extracted booking ID:', bookingId);

        if (!bookingId) {
          console.error('No booking ID found in:', scannedText);
          throw new Error('No booking ID found');
        }

        // Fetch from Supabase first, with localStorage fallback
        console.log('Fetching booking from Supabase with ID:', bookingId);
        const found = await getBookingByIdFromDB(bookingId);
        console.log('Found booking:', found);

        if (found) {
          setBooking(found);
          setError(null);
          setStatus('✅ Booking berhasil diverifikasi!');
        } else {
          setBooking(null);
          setError(`❌ Booking dengan ID "${bookingId}" tidak ditemukan.`);
          setStatus('Booking tidak ditemukan');
        }
      } catch (err) {
        console.error('Parse error:', err);
        console.error('Raw scanned text:', scannedText);
        setBooking(null);
        setError('❌ QR tidak valid atau format tidak sesuai.');
        setStatus('QR tidak valid');
      }
    };

    verifyBooking();
  }, [scannedText]);

  return (
    <>
      <SEO title="Scan Tiket - Rental Mobil" description="Pindai QR tiket untuk memverifikasi booking Anda." />

      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-3xl bg-blue-600 text-white flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Scan Tiket</h1>
                        <p className="text-gray-600">Arahkan kamera ke QR tiket untuk memverifikasi booking.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 overflow-hidden bg-black relative">
                    <video
                      ref={videoRef}
                      className="w-full h-96 object-cover"
                      muted
                      autoPlay
                      playsInline
                    />
                    {isScanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-2xl p-4 flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-gray-900">Memindai...</span>
                        </div>
                      </div>
                    )}
                    {booking && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-2xl p-4 flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">Booking Ditemukan!</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div className="rounded-3xl border border-blue-200 bg-blue-50 px-5 py-4">
                      <p className="text-sm text-blue-700">{status}</p>
                    </div>

                    {error && (
                      <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}


                    {!isScanning && (
                      <div className="space-y-3">
                        <button
                          onClick={handleScanAgain}
                          className="w-full rounded-3xl bg-blue-600 text-white py-3 px-6 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Scan Ulang
                        </button>
                        
                        {!showManualInput && (
                          <button
                            onClick={() => setShowManualInput(true)}
                            className="w-full rounded-3xl bg-slate-200 text-slate-700 py-3 px-6 font-medium hover:bg-slate-300 transition-colors"
                          >
                            Masukkan Booking ID Manually
                          </button>
                        )}

                        {showManualInput && (
                          <form onSubmit={handleManualInputSubmit} className="space-y-2">
                            <input
                              type="text"
                              placeholder="Contoh: booking-123456"
                              value={manualInput}
                              onChange={(e) => setManualInput(e.target.value)}
                              className="w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex-1 rounded-3xl bg-green-600 text-white py-3 px-4 font-medium hover:bg-green-700 transition-colors"
                              >
                                Verifikasi
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowManualInput(false);
                                  setManualInput('');
                                }}
                                className="flex-1 rounded-3xl bg-slate-200 text-slate-700 py-3 px-4 font-medium hover:bg-slate-300 transition-colors"
                              >
                                Batal
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-1/3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-3xl bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status Scan</p>
                        <p className="text-lg font-semibold text-slate-900">Live QR Verification</p>
                      </div>
                    </div>

                    {booking ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-500">Booking ID</p>
                          <p className="text-base font-semibold text-slate-900">{booking.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Nama Penyewa</p>
                          <p className="text-base font-semibold text-slate-900">{booking.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mobil</p>
                          <p className="text-base font-semibold text-slate-900">{booking.car?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Tanggal</p>
                          <p className="text-base font-semibold text-slate-900">
                            {booking.pickupDate} - {booking.dropoffDate}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-slate-500">
                        <p className="text-sm">Data booking akan muncul setelah QR berhasil discan.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
