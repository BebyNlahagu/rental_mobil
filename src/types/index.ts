// Types for Car Rental Application

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'economy' | 'compact' | 'midsize' | 'suv' | 'luxury' | 'van';
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  seats: number;
  luggage: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  description: string;
  availability: boolean;
  status?: 'Tersedia' | 'Terjual' | 'Dipesan';
  condition?: 'Baru' | 'Bekas';
  rating: number;
  reviewCount: number;
  location: string;
  // Optional form properties
  price?: number;
  originalPrice?: number;
  mileage?: number;
  engine?: string;
  color?: string;
}

export interface Booking {
  id: string;
  carId: string;
  car: Car;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  totalDays: number;
  basePrice: number;
  insuranceFee: number;
  additionalServices: AdditionalService[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
  driverAge: number;
  licenseNumber: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'e_wallet' | 'virtual_account';
  status: 'pending' | 'success' | 'failed' | 'expired';
  transactionId: string;
  paidAt?: string;
  createdAt: string;
  paymentDetails?: {
    cardNumber?: string;
    cardName?: string;
    bankName?: string;
    walletName?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  lastLogin?: string;
}

export interface SearchFilters {
  location: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  carType: string[];
  transmission: string[];
  fuelType: string[];
  minPrice: number;
  maxPrice: number;
  seats: number;
}

export interface TestDrive {
  id: string;
  name: string;
  email: string;
  phone: string;
  car: Car;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  message?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  car: Car;
  status: 'pending' | 'processed' | 'completed' | 'cancelled';
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}
