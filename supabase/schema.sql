-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== CARS TABLE ====================
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('economy', 'compact', 'midsize', 'suv', 'luxury', 'van')),
  transmission TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
  seats INTEGER NOT NULL DEFAULT 5,
  luggage INTEGER NOT NULL DEFAULT 2,
  price_per_day INTEGER NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  availability BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  location TEXT DEFAULT 'Jakarta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Drop then recreate all policies
DROP POLICY IF EXISTS "cars_public_read" ON cars;
CREATE POLICY "cars_public_read" ON cars FOR SELECT USING (true);

DROP POLICY IF EXISTS "cars_admin_all" ON cars;
CREATE POLICY "cars_admin_all" ON cars FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own" ON users;
CREATE POLICY "users_read_own" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_public_read" ON users;
CREATE POLICY "users_public_read" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_public_insert" ON users;
CREATE POLICY "users_public_insert" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_admin_all" ON users;
CREATE POLICY "users_admin_all" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== BOOKINGS TABLE ====================
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  dropoff_date DATE NOT NULL,
  dropoff_time TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  base_price INTEGER NOT NULL,
  insurance_fee INTEGER DEFAULT 0,
  additional_services JSONB DEFAULT '[]'::jsonb,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  driver_age INTEGER,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_read_own" ON bookings;
CREATE POLICY "bookings_read_own" ON bookings FOR SELECT
  USING (customer_email = auth.jwt() ->> 'email');

DROP POLICY IF EXISTS "bookings_admin_all" ON bookings;
CREATE POLICY "bookings_admin_all" ON bookings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== PAYMENTS TABLE ====================
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('credit_card', 'bank_transfer', 'e_wallet', 'virtual_account')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
  transaction_id TEXT NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_details JSONB
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_admin_all" ON payments;
CREATE POLICY "payments_admin_all" ON payments FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== BLOG POSTS TABLE ====================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  reading_time TEXT NOT NULL,
  image TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
CREATE POLICY "blog_public_read" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "blog_admin_all" ON blog_posts;
CREATE POLICY "blog_admin_all" ON blog_posts FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== STORAGE BUCKET ====================
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

DROP POLICY IF EXISTS "storage_admin_upload" ON storage.objects;
CREATE POLICY "storage_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "storage_admin_delete" ON storage.objects;
CREATE POLICY "storage_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'car-images' AND auth.jwt() ->> 'role' = 'admin');

-- ==================== TRIGGERS ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== INITIAL DATA ====================
INSERT INTO cars (name, brand, model, year, type, transmission, fuel_type, seats, luggage, price_per_day, images, features, description, availability, rating, review_count, location) VALUES
('Toyota Avanza', 'Toyota', 'Avanza', 2024, 'compact', 'automatic', 'petrol', 7, 3, 350000,
 '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]',
 '["AC", "Power Steering", "ABS", "Airbags", "Audio System", "Bluetooth"]',
 'Mobil keluarga yang nyaman dan irit bahan bakar.', true, 4.5, 128, 'Jakarta'),
('Honda Brio', 'Honda', 'Brio', 2024, 'economy', 'automatic', 'petrol', 5, 2, 250000,
 '["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]',
 '["AC", "Power Steering", "ABS", "Airbags", "USB Port"]',
 'Mobil city car yang lincah dan hemat bahan bakar.', true, 4.3, 95, 'Jakarta'),
('Mitsubishi Pajero Sport', 'Mitsubishi', 'Pajero Sport', 2024, 'suv', 'automatic', 'diesel', 7, 4, 750000,
 '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]',
 '["4WD", "Leather Seats", "Sunroof", "GPS Navigation", "Premium Audio", "Cruise Control", "Parking Camera"]',
 'SUV tangguh untuk petualangan Anda.', true, 4.8, 76, 'Jakarta'),
('Toyota Fortuner', 'Toyota', 'Fortuner', 2024, 'suv', 'automatic', 'diesel', 7, 4, 800000,
 '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"]',
 '["4WD", "Leather Seats", "Sunroof", "GPS Navigation", "Premium Audio", "Cruise Control", "Parking Sensors"]',
 'Premium SUV dengan kenyamanan kelas atas.', true, 4.7, 89, 'Jakarta'),
('Honda HR-V', 'Honda', 'HR-V', 2024, 'midsize', 'automatic', 'petrol', 5, 3, 450000,
 '["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"]',
 '["AC", "Power Steering", "ABS", "Airbags", "Audio System", "Bluetooth", "Reverse Camera"]',
 'Crossover SUV yang stylish dengan interior luas.', true, 4.6, 112, 'Jakarta'),
('Mercedes-Benz C-Class', 'Mercedes-Benz', 'C200', 2024, 'luxury', 'automatic', 'petrol', 5, 2, 1500000,
 '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]',
 '["Leather Seats", "Sunroof", "Premium Audio", "GPS Navigation", "Auto Parking", "360 Camera", "Heated Seats"]',
 'Mobil mewah dengan performa superior dan kenyamanan premium.', true, 4.9, 45, 'Jakarta'),
('Toyota Hiace', 'Toyota', 'Hiace', 2024, 'van', 'manual', 'diesel', 15, 10, 900000,
 '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"]',
 '["AC", "Audio System", "USB Charging", "Reclining Seats", "Large Luggage Space"]',
 'Van besar ideal untuk rombongan atau perjalanan grup.', true, 4.4, 67, 'Jakarta'),
('Toyota Camry Hybrid', 'Toyota', 'Camry Hybrid', 2024, 'midsize', 'automatic', 'hybrid', 5, 3, 600000,
 '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]',
 '["Hybrid Engine", "Leather Seats", "Premium Audio", "GPS Navigation", "Cruise Control", "Lane Assist"]',
 'Sedan hybrid yang elegan dan ramah lingkungan.', true, 4.7, 54, 'Jakarta'),
('Tesla Model 3', 'Tesla', 'Model 3', 2024, 'luxury', 'automatic', 'electric', 5, 2, 1200000,
 '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"]',
 '["Autopilot", "Touchscreen Display", "Premium Audio", "Supercharging", "Glass Roof", "Over-the-air Updates"]',
 'Mobil listrik terdepan dengan teknologi autopilot canggih.', true, 4.9, 38, 'Jakarta')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, name, email, role, avatar) VALUES
('00000000-0000-0000-0000-000000000001', 'Administrator', 'admin@rentalmobil.com', 'admin', 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'),
('00000000-0000-0000-0000-000000000002', 'Demo User', 'user@example.com', 'customer', 'https://ui-avatars.com/api/?name=Demo+User&background=random')
ON CONFLICT DO NOTHING;