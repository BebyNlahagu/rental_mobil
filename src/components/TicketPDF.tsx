import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { 
  Car, User, Calendar, MapPin, Clock, 
  Shield, Phone, Mail, Globe 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import type { Booking } from '../types';

interface TicketPDFProps {
  booking: Booking;
}

export function TicketPDF({ booking }: TicketPDFProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrRef.current) return;

    const writer = new BrowserQRCodeSvgWriter();
    const payload = JSON.stringify({
      type: 'booking',
      id: booking.id,
      customerName: booking.customerName,
      pickupDate: booking.pickupDate,
      dropoffDate: booking.dropoffDate,
      timestamp: new Date().toISOString()
    });

    qrRef.current.innerHTML = '';
    const svg = writer.write(payload, 200, 200);
    svg.setAttribute('aria-label', 'QR Code Booking');
    svg.style.width = '200px';
    svg.style.height = '200px';
    qrRef.current.appendChild(svg);
  }, [booking]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Tiket-${booking.id}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 no-print mb-6">
        <button
          onClick={downloadPDF}
          className="flex items-center justify-center bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Tiket PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Tiket
        </button>
      </div>

      {/* Ticket Design - Elegant & Modern */}
      <div 
        ref={ticketRef} 
        className="bg-white print:shadow-none"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Ticket Container */}
        <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl print:rounded-none print:shadow-none">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          {/* Header */}
          <div className="relative px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Rental Mobil</h1>
                  <p className="text-blue-300 text-sm">Premium</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-wider">E-Tiket</p>
                <p className="text-2xl font-bold text-white">{booking.id}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative px-8 py-8">
            
            {/* Status Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-6 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">Tiket Aktif</span>
              </div>
            </div>

            {/* Car Info Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={booking.car?.images[0]}
                    alt={booking.car?.name}
                    className="w-full h-40 object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">{booking.car?.name}</h2>
                  <p className="text-white/60 mb-4">{booking.car?.brand} {booking.car?.model} {booking.car?.year}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                      {booking.car?.transmission === 'automatic' ? 'Automatic' : 'Manual'}
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                      {booking.car?.seats} Kursi
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm capitalize">
                      {booking.car?.fuelType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Pickup */}
              <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs uppercase tracking-wider">Pengambilan</p>
                    <p className="text-white font-bold">{formatDate(booking.pickupDate)}</p>
                  </div>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{booking.pickupTime}</span>
                </div>
                <div className="flex items-center text-white/70 mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{booking.pickupLocation}</span>
                </div>
              </div>

              {/* Dropoff */}
              <div className="bg-linear-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-300 text-xs uppercase tracking-wider">Pengembalian</p>
                    <p className="text-white font-bold">{formatDate(booking.dropoffDate)}</p>
                  </div>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{booking.dropoffTime}</span>
                </div>
                <div className="flex items-center text-white/70 mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{booking.dropoffLocation}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="text-white/60 text-xs uppercase tracking-wider mb-4">Informasi Penyewa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Nama</p>
                    <p className="text-white font-medium">{booking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-medium">{booking.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Telepon</p>
                    <p className="text-white font-medium">{booking.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Nomor SIM</p>
                    <p className="text-white font-medium">{booking.licenseNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/20 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Durasi Sewa</span>
                <span className="text-white font-semibold">{booking.totalDays} Hari</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Harga Sewa</span>
                <span className="text-white">{formatCurrency(booking.basePrice)}</span>
              </div>
              {booking.additionalServices && booking.additionalServices.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70">Layanan Tambahan</span>
                  <span className="text-white">
                    {formatCurrency(booking.additionalServices.reduce((sum, s) => sum + s.price * booking.totalDays, 0))}
                  </span>
                </div>
              )}
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-white font-bold text-lg">Total Pembayaran</span>
                <span className="text-2xl font-bold text-amber-400">{formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <div ref={qrRef} className="w-56 h-56 flex items-center justify-center" />
                <p className="text-center text-gray-600 text-xs mt-2">Scan untuk verifikasi</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Informasi Penting
              </h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Harap membawa KTP dan SIM asli saat pengambilan</li>
                <li>• Datang 15 menit sebelum jadwal yang telah ditentukan</li>
                <li>• Keterlambatan pengembalian dikenakan biaya tambahan</li>
                <li>• Hubungi customer service untuk perubahan jadwal</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-8 py-6 border-t border-white/10 bg-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-white/60 text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className="flex items-center text-white/60 text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@rentalmobil.com</span>
                </div>
              </div>
              <div className="flex items-center text-white/60 text-sm">
                <Globe className="h-4 w-4 mr-2" />
                <span>www.rentalmobil.com</span>
              </div>
            </div>
            <p className="text-center text-white/40 text-xs mt-4">
              © 2024 Rental Mobil Premium. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 0;
          }
          body {
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
