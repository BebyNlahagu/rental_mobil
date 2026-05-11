import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, Users, Calendar, CreditCard, TrendingUp, 
  TrendingDown, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../lib/utils';
import { getCurrentUser } from '../../lib/auth';
import type { Booking, Payment } from '../../types';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 9,
    totalBookings: 0,
    totalRevenue: 0,
    activeRentals: 0,
    pendingBookings: 0,
    completedBookings: 0,
    newCustomers: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);

    // Load data from localStorage
    const bookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const payments: Payment[] = JSON.parse(localStorage.getItem('payments') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Calculate stats
    const totalRevenue = payments
      .filter((p: Payment) => p.status === 'success')
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);
    
    const activeRentals = bookings.filter((b: Booking) => b.status === 'active').length;
    const pendingBookings = bookings.filter((b: Booking) => b.status === 'pending').length;
    const completedBookings = bookings.filter((b: Booking) => b.status === 'completed').length;
    const newCustomers = users.filter((u: any) => u.role === 'customer').length;

    setStats({
      totalCars: 9,
      totalBookings: bookings.length,
      totalRevenue,
      activeRentals,
      pendingBookings,
      completedBookings,
      newCustomers
    });

    // Recent bookings
    setRecentBookings(bookings.slice(-5).reverse());

    // Monthly data for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyStats = months.map((month, idx) => ({
      name: month,
      revenue: Math.floor(Math.random() * 50000000) + 10000000,
      bookings: Math.floor(Math.random() * 50) + 10,
      lastMonth: Math.floor(Math.random() * 40000000) + 10000000
    }));
    setMonthlyData(monthlyStats);
  }, []);

  const statCards = [
    { 
      title: 'Total Pendapatan',
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
      trend: '+12.5%',
      trendUp: true,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Total Pemesanan',
      value: stats.totalBookings.toString(),
      icon: Calendar,
      trend: '+8.2%',
      trendUp: true,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      title: 'Sewa Aktif',
      value: stats.activeRentals.toString(),
      icon: Car,
      trend: '+5.1%',
      trendUp: true,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    { 
      title: 'Pelanggan Baru',
      value: stats.newCustomers.toString(),
      icon: Users,
      trend: '-2.4%',
      trendUp: false,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
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
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Selamat datang kembali, <span className="font-medium text-slate-700">{getCurrentUser()?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center text-sm font-medium ${
                stat.trendUp ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stat.trendUp ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.trend}
              </span>
              <span className="text-slate-400 text-sm ml-2">vs bulan lalu</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pendapatan Bulanan</h3>
              <p className="text-sm text-slate-500">Grafik pendapatan 12 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-sm text-slate-600">2024</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={12}
                  tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Pendapatan']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Cepat</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Pending</p>
                  <p className="text-xs text-slate-500">Menunggu konfirmasi</p>
                </div>
              </div>
              <span className="text-xl font-bold text-amber-600">{stats.pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <Car className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Selesai</p>
                  <p className="text-xs text-slate-500">Pemesanan selesai</p>
                </div>
              </div>
              <span className="text-xl font-bold text-emerald-600">{stats.completedBookings}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Rata-rata</p>
                  <p className="text-xs text-slate-500">Pendapatan/hari</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.totalRevenue / 30)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pemesanan Terbaru</h3>
              <p className="text-sm text-slate-500">5 pemesanan terakhir yang masuk</p>
            </div>
            <Link 
              to="/admin/bookings" 
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Lihat Semua
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobil</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-slate-900">{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{booking.customerName}</p>
                          <p className="text-sm text-slate-500">{booking.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={booking.car?.images[0]} 
                          alt={booking.car?.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <span className="text-slate-700">{booking.car?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">
                        <p>{formatDate(booking.pickupDate)}</p>
                        <p className="text-sm text-slate-500">s/d {formatDate(booking.dropoffDate)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.paymentStatus === 'paid' ? 'Lunas' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Belum ada pemesanan</p>
                      <p className="text-sm text-slate-400 mt-1">Pemesanan akan muncul di sini</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
