import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, Mail, Phone, Shield, 
  MoreHorizontal, CheckCircle, XCircle, User as UserIcon
} from 'lucide-react';
import { getUsersFromDB } from '../../lib/supabase';
import type { User } from '../../types';

const defaultUserStatus = 'active';
const defaultLastLogin = 'Baru saja';

const mockUsers: User[] = [
  { id: '1', name: 'Administrator', email: 'admin@rentalmobil.com', phone: '081234567890', role: 'admin', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff', lastLogin: '2 jam yang lalu' },
  { id: '2', name: 'Ahmad Fauzi', email: 'ahmad@example.com', phone: '081234567891', role: 'customer', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=random', lastLogin: '1 hari yang lalu' },
  { id: '3', name: 'Siti Rahayu', email: 'siti@example.com', phone: '081234567892', role: 'customer', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=random', lastLogin: '3 hari yang lalu' },
  { id: '4', name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567893', role: 'customer', status: 'inactive', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=random', lastLogin: '1 minggu yang lalu' },
  { id: '5', name: 'Dewi Putri', email: 'dewi@example.com', phone: '081234567894', role: 'customer', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Dewi+Putri&background=random', lastLogin: '5 jam yang lalu' },
];

export function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await getUsersFromDB();
        const normalized = result.map((user) => ({
          ...user,
          status: user.status ?? defaultUserStatus,
          lastLogin: user.lastLogin ?? defaultLastLogin,
          avatar: user.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        }));

        setUsers(normalized.length > 0 ? normalized : mockUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total Users', value: users.length, color: 'blue' },
    { label: 'Admin', value: users.filter(u => u.role === 'admin').length, color: 'purple' },
    { label: 'Customers', value: users.filter(u => u.role === 'customer').length, color: 'emerald' },
    { label: 'Aktif', value: users.filter(u => u.status === 'active').length, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pengguna</h1>
          <p className="text-slate-500 mt-1">Kelola pengguna sistem rental mobil</p>
        </div>
        <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Pengguna
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
            className={`bg-${stat.color}-50 rounded-xl p-4 border border-${stat.color}-100`}
          >
            <p className={`text-sm text-${stat.color}-600 font-medium`}>{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
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
              placeholder="Cari pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Terakhir Login</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm" />
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="flex items-center text-sm text-slate-600">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      {user.phone}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.status === 'active' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{user.lastLogin}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
