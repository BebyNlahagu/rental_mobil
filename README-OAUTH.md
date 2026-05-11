# Setup OAuth Login dengan Google & Facebook

## Langkah-langkah Setup di Supabase

### 1. Setup Google OAuth
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google+ API
4. Buat OAuth 2.0 Client ID:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173` (untuk development)
   - Authorized redirect URIs: `http://localhost:5173/auth/callback`
5. Copy Client ID dan Client Secret

### 2. Setup Facebook OAuth
1. Buka [Facebook Developers](https://developers.facebook.com/)
2. Buat app baru atau pilih app yang ada
3. Tambahkan produk "Facebook Login"
4. Di Settings → Basic, isi:
   - App Domains: `localhost`
   - Privacy Policy URL: URL kebijakan privasi Anda
   - Terms of Service URL: URL syarat dan ketentuan Anda
5. Di Facebook Login → Settings:
   - Valid OAuth Redirect URIs: `http://localhost:5173/auth/callback`
6. Copy App ID dan App Secret

### 3. Konfigurasi Supabase
1. Buka Supabase Dashboard → Authentication → Providers
2. Aktifkan Google:
   - Paste Client ID dan Client Secret dari Google
   - Redirect URL: `http://localhost:5173/auth/callback`
3. Aktifkan Facebook:
   - Paste App ID dan App Secret dari Facebook
   - Redirect URL: `http://localhost:5173/auth/callback`

### 4. Environment Variables
Tambahkan ke file `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 5. Database Setup
Jalankan SQL ini di Supabase SQL Editor:
```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id::uuid);

-- Allow users to insert their own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id::uuid);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id::uuid);
```

### 6. Testing
1. Jalankan `npm run dev`
2. Buka `http://localhost:5173/login`
3. Klik tombol "Google" atau "Facebook"
4. Pastikan redirect ke `/auth/callback` berhasil

## Troubleshooting

### Error: "Invalid OAuth access token"
- Pastikan Client ID/Secret benar
- Pastikan redirect URI sesuai

### Error: "User not found"
- Pastikan RLS policies sudah benar
- Check Supabase logs untuk error detail

### Error: "Redirect URI mismatch"
- Pastikan redirect URI di provider sama dengan yang di code
- Untuk development: `http://localhost:5173/auth/callback`

## Production Deployment
Untuk production, update:
1. Authorized origins di Google/Facebook
2. Redirect URIs di Supabase
3. Environment variables di hosting platform

## Security Notes
- Jangan commit `.env` files ke git
- Gunakan HTTPS di production
- Regularly rotate OAuth secrets
- Monitor authentication logs