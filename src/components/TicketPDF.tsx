import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import {
  Car, Phone, Mail, Globe
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import type { Booking } from '../types';
import domtoimage from 'dom-to-image-more';

interface TicketPDFProps {
  booking: Booking;
}

async function preloadTicketImages(container: HTMLDivElement) {
  const images = Array.from(container.querySelectorAll<HTMLImageElement>('img[data-ticket-image]'));
  const objectUrls: string[] = [];
  const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn0B9U5Y8/IAAAAASUVORK5CYII=';

  await Promise.all(images.map(async (image) => {
    if (!image.src || image.src.startsWith('blob:') || image.src.startsWith('data:')) {
      return;
    }

    image.crossOrigin = 'anonymous';

    try {
      const response = await fetch(image.src, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      objectUrls.push(objectUrl);
      image.src = objectUrl;
      await image.decode();
    } catch (error) {
      console.warn('Unable to preload ticket image for PDF export:', error);
      image.src = fallbackImage;
      // Ensure the fallback image is decoded before rendering
      await image.decode().catch(() => null);
    }
  }));

  return objectUrls;
}

async function createPdfExportImage(sourceNode: HTMLElement) {
  const clone = sourceNode.cloneNode(true) as HTMLElement;
  clone.style.width = '800px';
  clone.style.maxWidth = '800px';
  clone.style.margin = '0';
  clone.style.padding = '0';
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';

  clone.querySelectorAll<HTMLElement>('[data-pdf-hide]').forEach((el) => el.remove());

  const unsupportedColorRegex = /(?:oklab|oklch|lab|lch)/i;
  clone.querySelectorAll<HTMLElement>('*').forEach((el) => {
    const computed = window.getComputedStyle(el);
    const bgImage = computed.backgroundImage || '';
    const bgColor = computed.backgroundColor || '';
    const color = computed.color || '';
    const borderColor = computed.borderColor || '';
    const fill = computed.fill || '';
    const stroke = computed.stroke || '';

    if (bgImage !== 'none' || unsupportedColorRegex.test(bgColor)) {
      el.style.backgroundImage = 'none';
      el.style.backgroundColor = '#0f172a';
    }
    if (unsupportedColorRegex.test(color)) {
      el.style.color = '#ffffff';
    }
    if (unsupportedColorRegex.test(borderColor)) {
      el.style.borderColor = 'rgba(255,255,255,0.18)';
    }
    if (unsupportedColorRegex.test(fill)) {
      el.style.fill = '#ffffff';
    }
    if (unsupportedColorRegex.test(stroke)) {
      el.style.stroke = '#ffffff';
    }
  });

  const exportContainer = document.createElement('div');
  exportContainer.style.position = 'fixed';
  exportContainer.style.top = '0';
  exportContainer.style.left = '0';
  exportContainer.style.width = '100%';
  exportContainer.style.height = '100%';
  exportContainer.style.pointerEvents = 'none';
  exportContainer.style.opacity = '0';
  exportContainer.appendChild(clone);
  document.body.appendChild(exportContainer);

  try {
    return await domtoimage.toPng(clone, {
      width: 800,
      bgcolor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        boxShadow: 'none',
        background: '#ffffff'
      }
    });
  } finally {
    document.body.removeChild(exportContainer);
  }
}

export function TicketPDF({ booking }: TicketPDFProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = qrRef.current;
    if (!container) return;

    const writer = new BrowserQRCodeSvgWriter();
    const payload = JSON.stringify({
      type: 'booking',
      id: booking.id,
      customerName: booking.customerName,
      pickupDate: booking.pickupDate,
      dropoffDate: booking.dropoffDate,
      timestamp: new Date().toISOString()
    });

    container.innerHTML = '';

    try {
      const svg = writer.write(payload, 200, 200);
      svg.setAttribute('aria-label', 'QR Code Booking');
      svg.setAttribute('width', '200');
      svg.setAttribute('height', '200');
      svg.style.display = 'block';
      svg.style.maxWidth = '100%';
      svg.style.margin = '0 auto';
      container.appendChild(svg);
    } catch (error) {
      console.error('QR code generation failed:', error);
      const fallback = document.createElement('div');
      fallback.textContent = 'QR tidak tersedia';
      fallback.className = 'text-slate-500 text-sm';
      container.appendChild(fallback);
    }
  }, [booking]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    const ticketElement = ticketRef.current;
    const objectUrls = await preloadTicketImages(ticketElement);

    try {
      const dataUrl = await createPdfExportImage(ticketElement);
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const imgWidth = availableWidth;
      let imgHeight = (img.height * imgWidth) / img.width;
      let x = margin;
      let y = margin;

      if (imgHeight > availableHeight) {
        const scale = availableHeight / imgHeight;
        imgHeight *= scale;
        const scaledWidth = imgWidth * scale;
        x = (pageWidth - scaledWidth) / 2;
        pdf.addImage(dataUrl, 'PNG', x, y, scaledWidth, imgHeight);
      } else {
        pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
      }

      pdf.save(`Tiket-${booking.id}.pdf`);
    } catch (error) {
      console.error('Gagal mengunduh tiket sebagai PDF:', error);
      alert('Terjadi kesalahan saat mengunduh tiket. Silakan coba lagi.');
    } finally {
      objectUrls.forEach(URL.revokeObjectURL);
    }
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
        data-ticket-pdf-root
        className="bg-transparent print:shadow-none"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Ticket Container */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl print:rounded-none print:shadow-none">
          <div className="absolute inset-y-0 left-0 w-6 -translate-x-1/2 rounded-full bg-white shadow-sm hidden print:hidden" />
          <div className="absolute inset-y-0 right-0 w-6 translate-x-1/2 rounded-full bg-white shadow-sm hidden print:hidden" />

          <div className="px-8 pt-8 pb-6 bg-slate-900 rounded-t-3xl text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Boarding Pass</p>
                <h1 className="text-3xl font-semibold">Rental Mobil</h1>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Ticket</p>
                <p className="text-2xl font-semibold">{booking.id}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-6">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                <div className="flex flex-wrap gap-4">
                  <div className="min-w-40">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Passenger</p>
                    <p className="text-slate-900 font-semibold">{booking.customerName}</p>
                    <p className="text-slate-500 text-sm">{booking.customerPhone}</p>
                  </div>
                  <div className="min-w-40">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Vehicle</p>
                    <p className="text-slate-900 font-semibold">{booking.car?.name}</p>
                    <p className="text-slate-500 text-sm">{booking.car?.brand} • {booking.car?.model}</p>
                  </div>
                  <div className="min-w-40">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Class</p>
                    <p className="text-slate-900 font-semibold">{booking.car?.transmission === 'automatic' ? 'Automatic' : 'Manual'}</p>
                    <p className="text-slate-500 text-sm">{booking.car?.fuelType}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Pickup</p>
                  <p className="text-slate-900 font-semibold text-lg">{formatDate(booking.pickupDate)}</p>
                  <p className="text-slate-500 text-sm">{booking.pickupTime}</p>
                  <p className="text-slate-500 text-sm mt-3">{booking.pickupLocation}</p>
                </div>
                <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Drop-off</p>
                  <p className="text-slate-900 font-semibold text-lg">{formatDate(booking.dropoffDate)}</p>
                  <p className="text-slate-500 text-sm">{booking.dropoffTime}</p>
                  <p className="text-slate-500 text-sm mt-3">{booking.dropoffLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Days</p>
                  <p className="text-slate-900 font-semibold">{booking.totalDays}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Total</p>
                  <p className="text-slate-900 font-semibold">{formatCurrency(booking.totalPrice)}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Notes</p>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Bawa KTP & SIM asli saat pengambilan.</li>
                  <li>• Hadir 15 menit lebih awal.</li>
                  <li>• Biaya denda berlaku untuk keterlambatan.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Ticket Info</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Booking</span>
                    <span className="font-medium">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email</span>
                    <span className="font-medium">{booking.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Driver</span>
                    <span className="font-medium">{booking.licenseNumber}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
                <div ref={qrRef} className="w-full h-56 bg-slate-50 rounded-3xl flex items-center justify-center" />
                <p className="text-center text-slate-500 text-sm mt-3">Scan untuk verifikasi</p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Passenger</p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold">{booking.customerName}</span></p>
                  <p>{booking.customerEmail}</p>
                  <p>{booking.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative px-8 py-6 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-slate-600 text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@rentalmobil.com</span>
                </div>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <Globe className="h-4 w-4 mr-2" />
                <span>www.rentalmobil.com</span>
              </div>
            </div>
            <p className="text-center text-slate-500 text-xs mt-4">
              &copy; {new Date().getFullYear()} Rental Mobil Premium. All rights reserved.
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
