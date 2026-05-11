import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, ShoppingCart, MessageSquare
} from 'lucide-react';
import { orders as initialOrders } from '../../data/cars';
import type { Order } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'pending': 'bg-amber-100 text-amber-700',
      'processed': 'bg-blue-100 text-blue-700',
      'completed': 'bg-emerald-100 text-emerald-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Menunggu',
      'processed': 'Diproses',
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Kelola Pesanan</h1>
          <p className="text-slate-500 mt-1">Kelola semua pesanan dari pelanggan</p>
        </div>
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
              placeholder="Cari pesanan..."
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
            <option value="processed">Diproses</option>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={order.car.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{order.car.name}</p>
                        <p className="text-sm text-slate-500">{formatPrice(order.car.pricePerDay)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{order.customerName}</p>
                      <p className="text-sm text-slate-500">{order.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
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
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} dari {filteredOrders.length} pesanan
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Detail Pesanan</h3>
                <p className="text-slate-500 text-sm">{selectedOrder.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedOrder.status)}`}>
                {getStatusLabel(selectedOrder.status)}
              </span>
            </div>

            {/* Car Info */}
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl mb-6">
              <img 
                src={selectedOrder.car.images[0]} 
                alt="" 
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900">{selectedOrder.car.name}</h4>
                <p className="text-indigo-600 font-semibold">{formatPrice(selectedOrder.car.pricePerDay)}</p>
                <p className="text-sm text-slate-500">{selectedOrder.car.brand} • {selectedOrder.car.year}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-slate-900">Informasi Pelanggan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Nama</p>
                  <p className="font-medium text-slate-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Telepon</p>
                  <p className="font-medium text-slate-900">{selectedOrder.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{selectedOrder.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            {selectedOrder.message && (
              <div className="p-4 bg-amber-50 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-900">Pesan Pelanggan</span>
                </div>
                <p className="text-amber-800 text-sm">{selectedOrder.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Update Status:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'processed')}
                  disabled={selectedOrder.status === 'processed'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Proses
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                  disabled={selectedOrder.status === 'completed'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Selesai
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  disabled={selectedOrder.status === 'cancelled'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Batal
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                  disabled={selectedOrder.status === 'pending'}
                  className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={18} />
                  Pending
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
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
