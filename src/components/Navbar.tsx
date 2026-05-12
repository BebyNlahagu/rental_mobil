import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Menu, X, User, LogOut, ChevronDown, Search, Ticket } from 'lucide-react';
import { getCurrentUser, isAuthenticated, logout } from '../lib/auth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for auth changes and scroll
  useEffect(() => {
    const checkAuth = () => {
      setUser(getCurrentUser());
      setAuthenticated(isAuthenticated());
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    checkAuth();
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(checkAuth, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isPageOpaque = isScrolled || location.pathname.startsWith('/cars');

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/cars', label: 'Daftar Mobil' },
    { path: '/blog', label: 'Blog' },
    { path: '/how-it-works', label: 'Cara Kerja' },
    { path: '/contact', label: 'Kontak' }
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isPageOpaque
          ? 'bg-white/95 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl transition-colors ${
              isPageOpaque ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-white'
            }`}>
              <Car className={`h-6 w-6 ${isPageOpaque ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div>
              <span className={`text-xl font-bold transition-colors ${
                isPageOpaque ? 'text-gray-900' : 'text-white'
              }`}>
                Rental Mobil
              </span>
              <span className={`text-xs block -mt-1 transition-colors ${
                isPageOpaque ? 'text-blue-600' : 'text-blue-300'
              }`}>
                Premium
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? isPageOpaque
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white/20 text-white'
                    : isPageOpaque
                      ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Link */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname.startsWith('/admin')
                    ? isPageOpaque
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white/20 text-white'
                    : isPageOpaque
                      ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <button
              className={`p-2.5 rounded-xl transition-colors ${
                isPageOpaque 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Auth Buttons or Profile */}
            {authenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors ${
                    isPageOpaque 
                      ? 'hover:bg-gray-100' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border-2 border-white shadow-md"
                  />
                  <span className={`text-sm font-medium ${
                    isPageOpaque ? 'text-gray-700' : 'text-white'
                  }`}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-4 w-4 ${
                    isPageOpaque ? 'text-gray-400' : 'text-white/60'
                  }`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/my-bookings');
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Ticket className="h-4 w-4 mr-3" />
                        Kelola Pemesanan
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/admin');
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Dashboard Admin
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isPageOpaque
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-colors ${
              isPageOpaque 
                ? 'text-gray-600 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="border-t my-2 pt-2">
                {authenticated && user ? (
                  <>
                    <div className="flex items-center px-4 py-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-xl"
                    >
                      <Ticket className="h-4 w-4 mr-3" />
                      Kelola Pemesanan
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Keluar
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block py-3 text-sm font-medium text-gray-700"
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block py-3 text-sm font-medium text-blue-600"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
