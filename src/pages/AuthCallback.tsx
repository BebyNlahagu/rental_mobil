import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { handleOAuthCallback } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeOAuthFlow = async () => {
      try {
        const user = await handleOAuthCallback();

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

          localStorage.setItem('session', JSON.stringify(session));

          // Redirect based on role
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }, 1500);
        } else {
          setError('Gagal melengkapi proses login. Silakan coba lagi.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Terjadi kesalahan saat proses login. Silakan coba lagi.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    completeOAuthFlow();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Gagal</h2>
            <p className="text-gray-600">{error}</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Melengkapi Login</h2>
            <p className="text-gray-600">
              Kami sedang menyelesaikan proses login Anda. Harap tunggu...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
