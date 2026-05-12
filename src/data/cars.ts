// Re-export from carStorage for backward compatibility
export { getCars, initializeCars } from '../lib/carStorage';

import type { Car, AdditionalService, Booking, Payment, User, TestDrive, Order } from '../types';

// Default cars data (for initial state)
export const initialCars: Car[] = [
  {
    id: '1',
    name: 'Toyota Avanza',
    brand: 'Toyota',
    model: 'Avanza',
    year: 2024,
    type: 'compact',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 7,
    luggage: 3,
    pricePerDay: 350000,
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ],
    features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Audio System', 'Bluetooth'],
    description: 'Mobil keluarga yang nyaman dan irit bahan bakar. Cocok untuk perjalanan dalam kota maupun luar kota.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.5,
    reviewCount: 128,
    location: 'Jakarta'
  },
  {
    id: '2',
    name: 'Honda Brio',
    brand: 'Honda',
    model: 'Brio',
    year: 2024,
    type: 'economy',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    luggage: 2,
    pricePerDay: 250000,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800'
    ],
    features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'USB Port'],
    description: 'Mobil city car yang lincah dan hemat bahan bakar. Ideal untuk mobilitas harian di perkotaan.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.3,
    reviewCount: 95,
    location: 'Jakarta'
  },
  {
    id: '3',
    name: 'Mitsubishi Pajero Sport',
    brand: 'Mitsubishi',
    model: 'Pajero Sport',
    year: 2024,
    type: 'suv',
    transmission: 'automatic',
    fuelType: 'diesel',
    seats: 7,
    luggage: 4,
    pricePerDay: 750000,
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
    ],
    features: ['4WD', 'Leather Seats', 'Sunroof', 'GPS Navigation', 'Premium Audio', 'Cruise Control', 'Parking Camera'],
    description: 'SUV tangguh untuk petualangan Anda. Dilengkapi teknologi 4WD dan fitur keselamatan lengkap.',
    availability: true,
    status: 'Dipesan',
    condition: 'Baru',
    rating: 4.8,
    reviewCount: 76,
    location: 'Jakarta'
  },
  {
    id: '4',
    name: 'Toyota Fortuner',
    brand: 'Toyota',
    model: 'Fortuner',
    year: 2024,
    type: 'suv',
    transmission: 'automatic',
    fuelType: 'diesel',
    seats: 7,
    luggage: 4,
    pricePerDay: 800000,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1546636889-ba24fdd1d929?w=800'
    ],
    features: ['4WD', 'Leather Seats', 'Sunroof', 'GPS Navigation', 'Premium Audio', 'Cruise Control', 'Parking Sensors'],
    description: 'Premium SUV dengan kenyamanan kelas atas. Sempurna untuk perjalanan bisnis atau liburan keluarga.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.7,
    reviewCount: 89,
    location: 'Jakarta'
  },
  {
    id: '5',
    name: 'Honda HR-V',
    brand: 'Honda',
    model: 'HR-V',
    year: 2024,
    type: 'midsize',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    luggage: 3,
    pricePerDay: 450000,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800'
    ],
    features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Audio System', 'Bluetooth', 'Reverse Camera'],
    description: 'Crossover SUV yang stylish dengan interior luas dan fitur modern.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.6,
    reviewCount: 112,
    location: 'Jakarta'
  },
  {
    id: '6',
    name: 'Mercedes-Benz C-Class',
    brand: 'Mercedes-Benz',
    model: 'C200',
    year: 2024,
    type: 'luxury',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    luggage: 2,
    pricePerDay: 1500000,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
    ],
    features: ['Leather Seats', 'Sunroof', 'Premium Audio', 'GPS Navigation', 'Auto Parking', '360 Camera', 'Heated Seats'],
    description: 'Mobil mewah dengan performa superior dan kenyamanan premium. Sempurna untuk acara spesial.',
    availability: true,
    status: 'Terjual',
    condition: 'Baru',
    rating: 4.9,
    reviewCount: 45,
    location: 'Jakarta'
  },
  {
    id: '7',
    name: 'Toyota Hiace',
    brand: 'Toyota',
    model: 'Hiace',
    year: 2024,
    type: 'van',
    transmission: 'manual',
    fuelType: 'diesel',
    seats: 15,
    luggage: 10,
    pricePerDay: 900000,
    images: [
      'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'
    ],
    features: ['AC', 'Audio System', 'USB Charging', 'Reclining Seats', 'Large Luggage Space'],
    description: 'Van besar ideal untuk rombongan atau perjalanan grup. Kapasitas luas dengan kenyamanan maksimal.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.4,
    reviewCount: 67,
    location: 'Jakarta'
  },
  {
    id: '8',
    name: 'Toyota Camry Hybrid',
    brand: 'Toyota',
    model: 'Camry Hybrid',
    year: 2024,
    type: 'midsize',
    transmission: 'automatic',
    fuelType: 'hybrid',
    seats: 5,
    luggage: 3,
    pricePerDay: 600000,
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ],
    features: ['Hybrid Engine', 'Leather Seats', 'Premium Audio', 'GPS Navigation', 'Cruise Control', 'Lane Assist'],
    description: 'Sedan hybrid yang elegan dan ramah lingkungan. Kombinasi sempurna antara performa dan efisiensi.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.7,
    reviewCount: 54,
    location: 'Jakarta'
  },
  {
    id: '9',
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    type: 'luxury',
    transmission: 'automatic',
    fuelType: 'electric',
    seats: 5,
    luggage: 2,
    pricePerDay: 1200000,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'
    ],
    features: ['Autopilot', 'Touchscreen Display', 'Premium Audio', 'Supercharging', 'Glass Roof', 'Over-the-air Updates'],
    description: 'Mobil listrik terdepan dengan teknologi autopilot canggih. Pengalaman mengemudi masa depan.',
    availability: true,
    status: 'Tersedia',
    condition: 'Baru',
    rating: 4.9,
    reviewCount: 38,
    location: 'Jakarta'
  }
];

// Backward compatibility - cars array that reads from localStorage
export const cars: Car[] = initialCars;

export const additionalServices: AdditionalService[] = [
  {
    id: '1',
    name: 'Asuransi All Risk',
    price: 50000,
    description: 'Perlindungan lengkap untuk kerusakan dan kecelakaan'
  },
  {
    id: '2',
    name: 'GPS Navigation',
    price: 25000,
    description: 'Sistem navigasi GPS dengan peta terbaru'
  },
  {
    id: '3',
    name: 'Baby Car Seat',
    price: 35000,
    description: 'Kursi bayi yang aman dan nyaman'
  },
  {
    id: '4',
    name: 'Additional Driver',
    price: 75000,
    description: 'Izinkan pengemudi tambahan'
  },
  {
    id: '5',
    name: 'Full Tank Fuel',
    price: 500000,
    description: 'BBM penuh saat pengambilan'
  },
  {
    id: '6',
    name: 'Airport Transfer',
    price: 150000,
    description: 'Layanan antar jemput bandara profesional dan aman'
  }
];

export const bookings: Booking[] = [
  {
    id: 'BK001',
    carId: '1',
    car: initialCars[0],
    customerName: 'Ahmad Fauzi',
    customerEmail: 'ahmad@example.com',
    customerPhone: '081234567890',
    pickupLocation: 'Jakarta',
    dropoffLocation: 'Jakarta',
    pickupDate: '2024-12-25',
    pickupTime: '10:00',
    dropoffDate: '2024-12-28',
    dropoffTime: '10:00',
    totalDays: 3,
    basePrice: 1050000,
    insuranceFee: 150000,
    additionalServices: [additionalServices[0], additionalServices[2]],
    totalPrice: 1255000,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-12-20T10:30:00Z',
    driverAge: 30,
    licenseNumber: 'A1234567'
  },
  {
    id: 'BK002',
    carId: '3',
    car: initialCars[2],
    customerName: 'Siti Rahayu',
    customerEmail: 'siti@example.com',
    customerPhone: '082345678901',
    pickupLocation: 'Bandung',
    dropoffLocation: 'Bandung',
    pickupDate: '2024-12-26',
    pickupTime: '14:00',
    dropoffDate: '2024-12-29',
    dropoffTime: '14:00',
    totalDays: 3,
    basePrice: 2250000,
    insuranceFee: 150000,
    additionalServices: [additionalServices[0]],
    totalPrice: 2400000,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2024-12-21T08:15:00Z',
    driverAge: 28,
    licenseNumber: 'B7654321'
  }
];

export const payments: Payment[] = [
  {
    id: 'PAY001',
    bookingId: 'BK001',
    amount: 1255000,
    method: 'credit_card',
    status: 'success',
    transactionId: 'TRX123456789',
    paidAt: '2024-12-20T10:35:00Z',
    createdAt: '2024-12-20T10:30:00Z',
    paymentDetails: {
      cardNumber: '****1234',
      cardName: 'Ahmad Fauzi'
    }
  }
];

export const currentUser: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@rentalmobil.com',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
};

export const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Medan', 'Makassar'];

export const carTypes = [
  { value: 'economy', label: 'Economy', description: 'Hemat dan efisien' },
  { value: 'compact', label: 'Compact', description: 'Lincah di kota' },
  { value: 'midsize', label: 'Midsize', description: 'Kenyamanan optimal' },
  { value: 'suv', label: 'SUV', description: 'Tangguh & luas' },
  { value: 'luxury', label: 'Luxury', description: 'Mewah & premium' },
  { value: 'van', label: 'Van/Minibus', description: 'Untuk rombongan' }
];

export const testDrives: TestDrive[] = [
  {
    id: 'TD001',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    phone: '081234567890',
    car: initialCars[0],
    date: '2024-12-25',
    time: '09:00',
    status: 'pending',
    message: 'Ingin mencoba Toyota Avanza untuk keluarga',
    createdAt: '2024-12-21T10:00:00Z'
  },
  {
    id: 'TD002',
    name: 'Rina Wijaya',
    email: 'rina@example.com',
    phone: '082345678901',
    car: initialCars[2],
    date: '2024-12-26',
    time: '13:30',
    status: 'confirmed',
    message: 'Test drive Pajero Sport untuk petualangan',
    createdAt: '2024-12-20T14:20:00Z'
  },
  {
    id: 'TD003',
    name: 'Ahmad Wijaya',
    email: 'ahmad.w@example.com',
    phone: '083456789012',
    car: initialCars[5],
    date: '2024-12-27',
    time: '15:00',
    status: 'completed',
    message: 'Sudah test drive Mercedes C-Class',
    createdAt: '2024-12-19T09:15:00Z'
  }
];

export const orders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Budi Santoso',
    customerEmail: 'budi@example.com',
    customerPhone: '081234567890',
    car: initialCars[0],
    status: 'pending',
    message: 'Perlu pengiriman secepatnya',
    createdAt: '2024-12-21T10:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'ORD002',
    customerName: 'Rina Wijaya',
    customerEmail: 'rina@example.com',
    customerPhone: '082345678901',
    car: initialCars[2],
    status: 'processed',
    message: 'Tersedia tempat tidur untuk pemandu',
    createdAt: '2024-12-20T14:20:00Z',
    updatedAt: '2024-12-21T08:00:00Z'
  },
  {
    id: 'ORD003',
    customerName: 'Ahmad Wijaya',
    customerEmail: 'ahmad.w@example.com',
    customerPhone: '083456789012',
    car: initialCars[5],
    status: 'completed',
    createdAt: '2024-12-19T09:15:00Z',
    updatedAt: '2024-12-21T14:45:00Z'
  },
  {
    id: 'ORD004',
    customerName: 'Siti Rahayu',
    customerEmail: 'siti@example.com',
    customerPhone: '084567890123',
    car: initialCars[8],
    status: 'pending',
    message: 'Tesla Model 3 untuk acara khusus',
    createdAt: '2024-12-22T11:00:00Z'
  }
];
