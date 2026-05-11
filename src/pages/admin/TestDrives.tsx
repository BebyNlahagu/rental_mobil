import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Calendar, Clock,
  ChevronLeft, ChevronRight, RefreshCw, User, Phone, Mail
} from 'lucide-react';
import { testDrives as initialTestDrives } from '../../data/cars';
import type { TestDrive } from '../../types';

export default function AdminTestDrives() {
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);

  // Load test drives from localStorage + initial data
  useEffect(() => {
    const loadTestDrives = () => {
      const storedData = localStorage.getItem('testDrives');
      const storedTestDrives = storedData ? JSON.parse(storedData) : [];
      // Merge initial data with stored data, remove duplicates by ID
      const merged = [...storedTestDrives, ...initialTestDrives];
      const unique = merged.filter((td, index, self) => 
        index === self.findIndex((t) => t.id === td.id)
      );
      setTestDrives(unique);
    };
    
    loadTestDrives();
    
    // Listen for storage changes (in case other tabs update it)
    window.addEventListener('storage', loadTestDrives);
    return () => window.removeEventListener('storage', loadTestDrives);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTD, setSelectedTD] = useState<TestDrive | null>(null);
  const itemsPerPage = 10;

  const filteredTD = testDrives.filter(td => {
    const matchesSearch = td.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      td.car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || td.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTD.length / itemsPerPage);
  const paginatedTD = filteredTD.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = (id: string, newStatus: TestDrive['status']) => {
    const updated = testDrives.map(td => 
      td.id === id ? { ...td, status: newStatus } : td
    );
    setTestDrives(updated);
    
    // Save to localStorage
    localStorage.setItem('testDrives', JSON.stringify(updated));
    
    if (selectedTD?.id === id) {
      setSelectedTD({ ...selectedTD, status: newStatus });
    }
  };

  const refreshData = () => {
    const storedData = localStorage.getItem('testDrives');
    if (storedData) {
      const storedTestDrives = JSON.parse(storedData);
      const merged = [...storedTestDrives, ...initialTestDrives];
      const unique = merged.filter((td, index, self) => 
        index === self.findIndex((t) => t.id === td.id)
      );
      setTestDrives(unique);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'pending': 'bg-amber-100 text-amber-700',
      'confirmed': 'bg-blue-100 text-blue-700',
      'completed': 'bg-emerald-100 text-emerald-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Menunggu',
      'confirmed': 'Dikonfirmasi',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Jadwal Test Drive</h1>
          <p className="text-slate-500 mt-1">Kelola jadwal test drive pelanggan</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari jadwal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Mobil</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Pelanggan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Jadwal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTD.map((td) => (
                <tr key={td.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{td.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={td.car.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-slate-900">{td.car.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{td.name}</p>
                      <p className="text-sm text-slate-500">{td.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={16} />
                      {new Date(td.date).toLocaleDateString('id-ID')}
                      <Clock size={16} className="ml-2" />
                      {td.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(td.status)}`}>
                      {getStatusLabel(td.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedTD(td)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTD.length)} dari {filteredTD.length} jadwal
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedTD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTD(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Detail Test Drive</h3>
                <p className="text-slate-500 text-sm">{selectedTD.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedTD.status)}`}>
                {getStatusLabel(selectedTD.status)}
              </span>
            </div>

            {/* Car Info */}
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl mb-6">
              <img src={selectedTD.car.images[0]} alt="" className="w-24 h-24 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-slate-900">{selectedTD.car.name}</h4>
                <p className="text-sm text-slate-500">{selectedTD.car.brand} • {selectedTD.car.year}</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 rounded-xl">
              <div>
                <p className="text-sm text-indigo-600">Tanggal</p>
                <p className="font-bold text-indigo-900">{new Date(selectedTD.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600">Waktu</p>
                <p className="font-bold text-indigo-900">{selectedTD.time} WIB</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-slate-900">Informasi Pelanggan</h4>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{selectedTD.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{selectedTD.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{selectedTD.email}</span>
              </div>
            </div>

            {/* Message */}
            {selectedTD.message && (
              <div className="p-4 bg-amber-50 rounded-xl mb-6">
                <p className="text-sm text-amber-800">{selectedTD.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Update Status:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateStatus(selectedTD.id, 'confirmed')}
                  disabled={selectedTD.status === 'confirmed'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Konfirmasi
                </button>
                <button
                  onClick={() => updateStatus(selectedTD.id, 'completed')}
                  disabled={selectedTD.status === 'completed'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Selesai
                </button>
                <button
                  onClick={() => updateStatus(selectedTD.id, 'cancelled')}
                  disabled={selectedTD.status === 'cancelled'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Batal
                </button>
                <button
                  onClick={() => updateStatus(selectedTD.id, 'pending')}
                  disabled={selectedTD.status === 'pending'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  <Clock size={18} />
                  Pending
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedTD(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <XCircle size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
