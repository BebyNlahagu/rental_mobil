import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, Mail, Lock, Eye, EyeOff, ArrowRight, 
  CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { authenticateUser, signInWithGoogle, signInWithFacebook } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;
  const from = fromLocation
    ? `${fromLocation.pathname || '/'}${fromLocation.search || ''}`
    : '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [oauthLoading, setOAuthLoading] = useState<'google' | 'facebook' | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Authenticate user
      const user = await authenticateUser(formData.email, formData.password);
      
      if (user) {
        // Store session
        const session = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          },
          loginAt: new Date().toISOString()
        };
        
        if (formData.rememberMe) {
          localStorage.setItem('session', JSON.stringify(session));
        } else {
          sessionStorage.setItem('session', JSON.stringify(session));
        }
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      } else {
        // Demo login for quick access (fallback)
        if (formData.email === 'admin@rentalmobil.com' && formData.password === 'admin123') {
          const session = {
            user: {
              id: '1',
              name: 'Administrator',
              email: 'admin@rentalmobil.com',
              role: 'admin',
              avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
            },
            loginAt: new Date().toISOString()
          };
          localStorage.setItem('session', JSON.stringify(session));
          navigate('/admin');
          return;
        }
        
        if (formData.email === 'user@example.com' && formData.password === 'user123') {
          const session = {
            user: {
              id: '2',
              name: 'Demo User',
              email: 'user@example.com',
              role: 'customer',
              avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
            },
            loginAt: new Date().toISOString()
          };
          localStorage.setItem('session', JSON.stringify(session));
          navigate(from);
          return;
        }
        
        setLoginError('Email atau password salah');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setOAuthLoading('google');
    try {
      const { url, error } = await signInWithGoogle();
      if (error) {
        setLoginError(error);
      } else if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('Gagal login dengan Google');
    }
    setOAuthLoading(null);
  };

  const handleFacebookLogin = async () => {
    setOAuthLoading('facebook');
    try {
      const { url, error } = await signInWithFacebook();
      if (error) {
        setLoginError(error);
      } else if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      setLoginError('Gagal login dengan Facebook');
    }
    setOAuthLoading(null);
  };

  return (
    <>
      <SEO
        title="Login - Rental Mobil Premium"
        description="Masuk ke akun Anda untuk mengakses layanan rental mobil."
      />

      <div className="min-h-screen flex">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200"
            alt="Car Rental"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80" />
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Car className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Selamat Datang Kembali</h1>
              <p className="text-blue-100 text-lg">
                Masuk untuk mengakses akun Anda dan kelola pemesanan mobil dengan mudah.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-blue-300" />
                <span>Akses riwayat pemesanan</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-blue-300" />
                <span>Kelola profil dan preferensi</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-blue-300" />
                <span>Dapatkan penawaran eksklusif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Rental Mobil</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Masuk</h2>
                <p className="text-gray-600 mt-2">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Daftar sekarang
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium mb-2">Demo Login:</p>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><span className="font-medium">Admin:</span> admin@rentalmobil.com / admin123</p>
                  <p><span className="font-medium">User:</span> user@example.com / user123</p>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="nama@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Lupa password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      Masuk
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {oauthLoading === 'google' ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {oauthLoading === 'facebook' ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Kembali ke beranda
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
