// Global car storage management
import type { Car } from '../types';

const STORAGE_KEY = 'rentalCars';

// Default cars data
const defaultCars: Car[] = [
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
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
    features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Audio System', 'Bluetooth'],
    description: 'Mobil keluarga yang nyaman dan irit bahan bakar.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
    features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'USB Port'],
    description: 'Mobil city car yang lincah dan hemat bahan bakar.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'],
    features: ['4WD', 'Leather Seats', 'Sunroof', 'GPS Navigation', 'Premium Audio', 'Cruise Control', 'Parking Camera'],
    description: 'SUV tangguh untuk petualangan Anda.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
    features: ['4WD', 'Leather Seats', 'Sunroof', 'GPS Navigation', 'Premium Audio', 'Cruise Control', 'Parking Sensors'],
    description: 'Premium SUV dengan kenyamanan kelas atas.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'],
    features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Audio System', 'Bluetooth', 'Reverse Camera'],
    description: 'Crossover SUV yang stylish dengan interior luas.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
    features: ['Leather Seats', 'Sunroof', 'Premium Audio', 'GPS Navigation', 'Auto Parking', '360 Camera', 'Heated Seats'],
    description: 'Mobil mewah dengan performa superior dan kenyamanan premium.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800'],
    features: ['AC', 'Audio System', 'USB Charging', 'Reclining Seats', 'Large Luggage Space'],
    description: 'Van besar ideal untuk rombongan atau perjalanan grup.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'],
    features: ['Hybrid Engine', 'Leather Seats', 'Premium Audio', 'GPS Navigation', 'Cruise Control', 'Lane Assist'],
    description: 'Sedan hybrid yang elegan dan ramah lingkungan.',
    availability: true,
    fleetCount: 1,
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
    images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
    features: ['Autopilot', 'Touchscreen Display', 'Premium Audio', 'Supercharging', 'Glass Roof', 'Over-the-air Updates'],
    description: 'Mobil listrik terdepan dengan teknologi autopilot canggih.',
    availability: true,
    fleetCount: 1,
    rating: 4.9,
    reviewCount: 38,
    location: 'Jakarta'
  }
];

// Initialize storage with default data if empty
export const initializeCars = (): void => {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCars));
  }
};

// Get all cars
export const getCars = (): Car[] => {
  if (typeof window === 'undefined') return defaultCars;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCars));
  return defaultCars;
};

// Save all cars
export const saveCars = (cars: Car[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('carsUpdated', { detail: cars }));
};

// Add new car
export const addCar = (car: Car): void => {
  const cars = getCars();
  cars.push(car);
  saveCars(cars);
};

// Update car
export const updateCar = (id: string, updates: Partial<Car>): void => {
  const cars = getCars();
  const index = cars.findIndex(c => c.id === id);
  if (index !== -1) {
    cars[index] = { ...cars[index], ...updates };
    saveCars(cars);
  }
};

// Delete car
export const deleteCar = (id: string): void => {
  const cars = getCars();
  const filtered = cars.filter(c => c.id !== id);
  saveCars(filtered);
};

// Get car by ID
export const getCarById = (id: string): Car | undefined => {
  return getCars().find(c => c.id === id);
};

// Subscribe to car updates
export const subscribeToCars = (callback: (cars: Car[]) => void): () => void => {
  const handleUpdate = (event: CustomEvent<Car[]>) => {
    callback(event.detail);
  };
  
  window.addEventListener('carsUpdated', handleUpdate as EventListener);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('carsUpdated', handleUpdate as EventListener);
  };
};

// Export default cars for initial use
export { defaultCars };
