import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Car, Calendar, CreditCard, Users,
  Settings, LogOut, Menu, X, ChevronDown, Bell,
  Home, Search, QrCode, BookOpen
} from 'lucide-react';
import { getCurrentUser, isAuthenticated, isAdmin, logout } from '../../lib/auth';
import type { User } from '../../lib/auth';

const sidebarLinks = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/cars', icon: Car, label: 'Kelola Mobil' },
  { path: '/admin/blogs', icon: BookOpen, label: 'Kelola Blog' },
  { path: '/admin/bookings', icon: Calendar, label: 'Pemesanan' },
  { path: '/scan', icon: QrCode, label: 'Scan Tiket' },
  { path: '/admin/payments', icon: CreditCard, label: 'Pembayaran' },
  { path: '/admin/users', icon: Users, label: 'Pengguna' },
  { path: '/admin/settings', icon: Settings, label: 'Pengaturan' }
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    setUser(getCurrentUser());
  }, [navigate, location]);

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-6 border-b border-slate-800">
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white block">Rental Mobil</span>
              <span className="text-blue-400 text-xs">Admin Panel</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=random'}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500/30"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)]">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-2">
            Menu Utama
          </p>
          {sidebarLinks.slice(0, 4).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                isActive(link.path) ? 'bg-white/20' : 'bg-slate-800'
              }`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{link.label}</span>
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </Link>
          ))}

          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-6">
            Sistem
          </p>
          {sidebarLinks.slice(4).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                isActive(link.path) ? 'bg-white/20' : 'bg-slate-800'
              }`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors mb-2"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-3">
              <Home className="h-5 w-5" />
            </div>
            <span className="font-medium">Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-3">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left Side */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center ml-4 text-sm">
                <Link to="/admin" className="text-slate-500 hover:text-slate-700">
                  Admin
                </Link>
                {location.pathname !== '/admin' && (
                  <>
                    <span className="mx-2 text-slate-400">/</span>
                    <span className="text-slate-900 font-medium">
                      {sidebarLinks.find(l => l.path === location.pathname)?.label || 'Halaman'}
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2">
                <Search className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Cari..."
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=random'}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full border-2 border-slate-200"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 border border-slate-100 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/admin/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3 text-slate-400" />
                        Pengaturan Akun
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
