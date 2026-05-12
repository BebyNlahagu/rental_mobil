import { createClient } from '@supabase/supabase-js';
import { getCars as getCarStorage, saveCars as saveCarStorage } from './carStorage';
import { generateBookingId, generateTransactionId, loadFromStorage, saveToStorage } from './utils';
import { blogPosts as defaultBlogPosts } from '../data/blog';
import type { BlogPost, Car, Booking, Payment, User } from '../types';

type DBUser = User & {
  password?: string;
  createdAt?: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Fallback: use localStorage if Supabase env vars are not set
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Flag to indicate if Supabase is available
export const isSupabaseAvailable = !!supabase;

console.log('Supabase configuration:', {
  url: supabaseUrl,
  key: supabaseKey ? '***' + supabaseKey.slice(-4) : null,
  available: isSupabaseAvailable
});

// ==================== CARS ====================

export async function getCarsFromDB(): Promise<Car[]> {
  // Fallback to localStorage if Supabase is not available
  if (!supabase) {
    console.log('Supabase not available, using localStorage');
    return getCarStorage();
  }

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars from Supabase:', error);
    console.log('Falling back to localStorage');
    return getCarStorage();
  }

  return data?.map(transformCarFromDB) || [];
}

export async function getCarByIdFromDB(id: string): Promise<Car | null> {
  // Fallback to localStorage if Supabase is not available
  if (!supabase) {
    const cars = getCarStorage();
    return cars.find(c => c.id === id) || null;
  }

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching car from Supabase:', error);
    const cars = getCarStorage();
    return cars.find(c => c.id === id) || null;
  }

  return data ? transformCarFromDB(data) : null;
}

export async function addCarToDB(car: Omit<Car, 'id'>): Promise<Car | null> {
  // Fallback to localStorage if Supabase is not available
  if (!supabase) {
    console.log('Supabase not available, saving to localStorage');
    const cars = getCarStorage();
    const newCar: Car = {
      id: Date.now().toString(),
      ...car
    };
    saveCarStorage([...cars, newCar]);
    console.log('Car saved to localStorage:', newCar);
    return newCar;
  }

  const dbCar = transformCarToDB(car);

  const { data, error } = await supabase
    .from('cars')
    .insert([dbCar])
    .select()
    .single();

  if (error) {
    console.error('Error adding car to Supabase:', error);
    // Fallback to localStorage
    const cars = getCarStorage();
    const newCar: Car = {
      id: Date.now().toString(),
      ...car
    };
    saveCarStorage([...cars, newCar]);
    console.log('Car saved to localStorage (fallback):', newCar);
    return newCar;
  }

  return data ? transformCarFromDB(data) : null;
}

export async function updateCarInDB(id: string, updates: Partial<Car>): Promise<Car | null> {
  // Fallback to localStorage if Supabase is not available
  if (!supabase) {
    console.log('Supabase not available, updating in localStorage');
    const cars = getCarStorage();
    const updated = cars.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCarStorage(updated);
    return updated.find(c => c.id === id) || null;
  }

  const dbUpdates = transformCarToDB(updates);

  const { data, error } = await supabase
    .from('cars')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating car in Supabase:', error);
    // Fallback to localStorage
    const cars = getCarStorage();
    const updated = cars.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCarStorage(updated);
    return updated.find(c => c.id === id) || null;
  }

  return data ? transformCarFromDB(data) : null;
}

export async function deleteCarFromDB(id: string): Promise<boolean> {
  // Fallback to localStorage if Supabase is not available
  if (!supabase) {
    console.log('Supabase not available, deleting from localStorage');
    const cars = getCarStorage();
    const updated = cars.filter(c => c.id !== id);
    saveCarStorage(updated);
    return true;
  }

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting car from Supabase:', error);
    // Fallback to localStorage
    const cars = getCarStorage();
    const updated = cars.filter(c => c.id !== id);
    saveCarStorage(updated);
    return true;
  }

  return true;
}

// ==================== BLOG POSTS ====================

function transformBlogFromDB(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: row.date,
    readingTime: row.reading_time,
    image: row.image,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getBlogsFromDB(): Promise<BlogPost[]> {
  if (!supabase) {
    console.log('Supabase not available, using local blog storage');
    return loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs from Supabase:', error);
    return loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
  }

  return data?.map(transformBlogFromDB) || [];
}

export async function getBlogBySlugFromDB(slug: string): Promise<BlogPost | null> {
  if (!supabase) {
    console.log('Supabase not available, using local blog storage');
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    return stored.find((post) => post.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching blog by slug from Supabase:', error);
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    return stored.find((post) => post.slug === slug) || null;
  }

  return data ? transformBlogFromDB(data) : null;
}

export async function addBlogToDB(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost | null> {
  if (!supabase) {
    console.log('Supabase not available, saving blog to local storage');
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    const newBlog: BlogPost = { ...blog, id: Date.now().toString() };
    const updated = [newBlog, ...stored];
    saveToStorage('blogPosts', updated);
    return newBlog;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      date: blog.date,
      reading_time: blog.readingTime,
      image: blog.image,
      tags: blog.tags
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding blog to Supabase:', error);
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    const newBlog: BlogPost = { ...blog, id: Date.now().toString() };
    const updated = [newBlog, ...stored];
    saveToStorage('blogPosts', updated);
    return newBlog;
  }

  return data ? transformBlogFromDB(data) : null;
}

export async function updateBlogInDB(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  if (!supabase) {
    console.log('Supabase not available, updating local blog storage');
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    const updated = stored.map((post) => post.id === id ? { ...post, ...updates } : post);
    saveToStorage('blogPosts', updated);
    return updated.find((post) => post.id === id) || null;
  }

  const dbUpdates = {
    slug: updates.slug,
    title: updates.title,
    excerpt: updates.excerpt,
    content: updates.content,
    author: updates.author,
    date: updates.date,
    reading_time: updates.readingTime,
    image: updates.image,
    tags: updates.tags
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog in Supabase:', error);
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    const updated = stored.map((post) => post.id === id ? { ...post, ...updates } : post);
    saveToStorage('blogPosts', updated);
    return updated.find((post) => post.id === id) || null;
  }

  return data ? transformBlogFromDB(data) : null;
}

export async function deleteBlogFromDB(id: string): Promise<boolean> {
  if (!supabase) {
    console.log('Supabase not available, deleting local blog data');
    const stored = loadFromStorage<BlogPost[]>('blogPosts', defaultBlogPosts);
    const updated = stored.filter((post) => post.id !== id);
    saveToStorage('blogPosts', updated);
    return true;
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog from Supabase:', error);
    return false;
  }

  return true;
}

// ==================== BOOKINGS ====================

export async function getBookingsFromDB(): Promise<Booking[]> {
  if (!supabase) {
    console.log('Supabase not available for bookings');
    return loadFromStorage<Booking[]>('bookings', []);
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      car:cars(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return loadFromStorage<Booking[]>('bookings', []);
  }

  return data?.map(transformBookingFromDB) || [];
}

export async function getBookingByIdFromDB(id: string): Promise<Booking | null> {
  if (!supabase) {
    console.log('Supabase not available for booking detail, checking localStorage');
    const bookings = loadFromStorage<Booking[]>('bookings', []);
    const found = bookings.find((booking) => booking.id === id);
    console.log('Found in localStorage:', found);
    return found || null;
  }

  console.log('Fetching booking from Supabase with ID:', id);
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      car:cars(*)
    `)
    .eq('id', id)
    .single();

  console.log('Supabase response:', { data, error });

  if (error) {
    console.error('Error fetching booking from Supabase:', error.message, error.details);
    console.log('Falling back to localStorage');
    const bookings = loadFromStorage<Booking[]>('bookings', []);
    const found = bookings.find((booking) => booking.id === id);
    console.log('Found in localStorage:', found);
    return found || null;
  }

  if (!data) {
    console.log('No data returned from Supabase for ID:', id);
    return null;
  }

  const transformed = transformBookingFromDB(data);
  console.log('Transformed booking:', transformed);
  return transformed;
}

export async function addBookingToDB(booking: Booking | Omit<Booking, 'id'>): Promise<Booking | null> {
  const bookingWithId: Booking = {
    id: 'id' in booking && booking.id ? booking.id : generateBookingId(),
    car: booking.car,
    carId: booking.carId,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    pickupDate: booking.pickupDate,
    pickupTime: booking.pickupTime,
    dropoffDate: booking.dropoffDate,
    dropoffTime: booking.dropoffTime,
    totalDays: booking.totalDays,
    basePrice: booking.basePrice,
    insuranceFee: booking.insuranceFee,
    additionalServices: booking.additionalServices,
    totalPrice: booking.totalPrice,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt || new Date().toISOString(),
    driverAge: booking.driverAge,
    licenseNumber: booking.licenseNumber,
  };

  if (!supabase) {
    console.log('Supabase not available for adding booking');
    const bookings = loadFromStorage<Booking[]>('bookings', []);
    const updatedBookings = [...bookings, bookingWithId];
    saveToStorage('bookings', updatedBookings);
    return bookingWithId;
  }

  const dbBooking = transformBookingToDB(bookingWithId);

  const { data, error } = await supabase
    .from('bookings')
    .insert([dbBooking])
    .select(`
      *,
      car:cars(*)
    `)
    .single();

  if (error) {
    console.error('Error adding booking:', error);
    const bookings = loadFromStorage<Booking[]>('bookings', []);
    const updatedBookings = [...bookings, bookingWithId];
    saveToStorage('bookings', updatedBookings);
    return bookingWithId;
  }

  return data ? transformBookingFromDB(data) : bookingWithId;
}

export async function updateBookingInDB(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  if (!supabase) {
    console.log('Supabase not available for updating booking');
    const bookings = loadFromStorage<Booking[]>('bookings', []);
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, ...updates } : booking
    );
    saveToStorage('bookings', updatedBookings);
    return updatedBookings.find((booking) => booking.id === id) || null;
  }

  const dbUpdates = transformBookingToDB(updates);

  const { data, error } = await supabase
    .from('bookings')
    .update(dbUpdates)
    .eq('id', id)
    .select(`
      *,
      car:cars(*)
    `)
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    const bookings = loadFromStorage<Booking[]>('bookings', []);
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, ...updates } : booking
    );
    saveToStorage('bookings', updatedBookings);
    return updatedBookings.find((booking) => booking.id === id) || null;
  }

  return data ? transformBookingFromDB(data) : null;
}

// ==================== PAYMENTS ====================

export async function getPaymentsFromDB(): Promise<Payment[]> {
  if (!supabase) {
    console.log('Supabase not available for payments');
    return loadFromStorage<Payment[]>('payments', []);
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return loadFromStorage<Payment[]>('payments', []);
  }

  return data?.map(transformPaymentFromDB) || [];
}

export async function addPaymentToDB(payment: Payment | Omit<Payment, 'id'>): Promise<Payment | null> {
  const paymentWithId: Payment = {
    id: 'id' in payment && payment.id ? payment.id : generateTransactionId(),
    bookingId: payment.bookingId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt || new Date().toISOString(),
    paymentDetails: payment.paymentDetails
  };

  if (!supabase) {
    console.log('Supabase not available for payments');
    const payments = loadFromStorage<Payment[]>('payments', []);
    const updatedPayments = [...payments, paymentWithId];
    saveToStorage('payments', updatedPayments);
    return paymentWithId;
  }

  const dbPayment = transformPaymentToDB(paymentWithId);

  const { data, error } = await supabase
    .from('payments')
    .insert([dbPayment])
    .select()
    .single();

  if (error) {
    console.error('Error adding payment:', error);
    const payments = loadFromStorage<Payment[]>('payments', []);
    const updatedPayments = [...payments, paymentWithId];
    saveToStorage('payments', updatedPayments);
    return paymentWithId;
  }

  return data ? transformPaymentFromDB(data) : paymentWithId;
}

export async function updatePaymentInDB(id: string, updates: Partial<Payment>): Promise<Payment | null> {
  if (!supabase) {
    console.log('Supabase not available for updating payment');
    const payments = loadFromStorage<Payment[]>('payments', []);
    const updatedPayments = payments.map((payment) =>
      payment.id === id ? { ...payment, ...updates } : payment
    );
    saveToStorage('payments', updatedPayments);
    return updatedPayments.find((payment) => payment.id === id) || null;
  }

  const dbUpdates = transformPaymentToDB(updates);

  const { data, error } = await supabase
    .from('payments')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment:', error);
    const payments = loadFromStorage<Payment[]>('payments', []);
    const updatedPayments = payments.map((payment) =>
      payment.id === id ? { ...payment, ...updates } : payment
    );
    saveToStorage('payments', updatedPayments);
    return updatedPayments.find((payment) => payment.id === id) || null;
  }

  return data ? transformPaymentFromDB(data) : null;
}

// ==================== USERS ====================

export async function getUsersFromDB(): Promise<User[]> {
  if (!supabase) {
    console.log('Supabase not available for users, using localStorage fallback');
    return loadFromStorage<User[]>('users', []);
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return loadFromStorage<User[]>('users', []);
  }

  return data?.map(transformUserFromDB) || [];
}

export async function getUserByIdFromDB(id: string): Promise<User | null> {
  if (!supabase) {
    console.log('Supabase not available for user detail');
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data ? transformUserFromDB(data) : null;
}

export async function addUserToDB(user: DBUser): Promise<User | null> {
  const userWithCreatedAt: DBUser = {
    ...user,
    createdAt: user.createdAt || new Date().toISOString()
  };

  if (!supabase) {
    console.log('Supabase not available for user registration');
    const users = loadFromStorage<DBUser[]>('users', []);
    const updatedUsers = [...users, userWithCreatedAt];
    saveToStorage('users', updatedUsers);
    return {
      id: userWithCreatedAt.id,
      name: userWithCreatedAt.name,
      email: userWithCreatedAt.email,
      phone: userWithCreatedAt.phone,
      role: userWithCreatedAt.role,
      avatar: userWithCreatedAt.avatar
    };
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{
      name: userWithCreatedAt.name,
      email: userWithCreatedAt.email,
      phone: userWithCreatedAt.phone,
      role: userWithCreatedAt.role,
      avatar: userWithCreatedAt.avatar,
      created_at: userWithCreatedAt.createdAt
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding user to Supabase:', error);
    console.error('Error details:', error.message, error.details, error.hint);
    const users = loadFromStorage<DBUser[]>('users', []);
    const updatedUsers = [...users, userWithCreatedAt];
    saveToStorage('users', updatedUsers);
    return {
      id: userWithCreatedAt.id,
      name: userWithCreatedAt.name,
      email: userWithCreatedAt.email,
      phone: userWithCreatedAt.phone,
      role: userWithCreatedAt.role,
      avatar: userWithCreatedAt.avatar
    };
  }

  console.log('User successfully saved to Supabase:', data);
  return transformUserFromDB(data);
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  if (!supabase) {
    console.log('Supabase not available for authentication, using localStorage fallback');
    const users = loadFromStorage<DBUser[]>('users', []);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      };
    }
    return null;
  }

  // For Supabase, we need to use auth system, but since we're using custom users table,
  // we'll check the users table directly (note: this is not secure for production)
  // TODO: Implement proper Supabase Auth for production use
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    console.error('Error authenticating user:', error);
    // Fallback to localStorage
    const users = loadFromStorage<DBUser[]>('users', []);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      };
    }
    return null;
  }

  // For demo purposes, we'll accept any password for users in Supabase
  // In production, you should use Supabase Auth with proper password hashing
  return transformUserFromDB(data);
}

export function subscribeToCars(callback: (cars: Car[]) => void) {
  getCarsFromDB().then(callback);

  // If Supabase is not available, return a no-op unsubscribe function
  if (!supabase) {
    console.log('Supabase not available, using localStorage polling');
    // Poll localStorage every 2 seconds for changes
    const interval = setInterval(async () => {
      const cars = await getCarsFromDB();
      callback(cars);
    }, 2000);
    
    return () => clearInterval(interval);
  }

  const subscription = supabase
    .channel('cars_channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'cars' },
      async () => {
        const cars = await getCarsFromDB();
        callback(cars);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToBookings(callback: (bookings: Booking[]) => void) {
  getBookingsFromDB().then(callback);

  // If Supabase is not available, return a no-op unsubscribe function
  if (!supabase) {
    console.log('Supabase not available for bookings subscription');
    return () => {};
  }

  const subscription = supabase
    .channel('bookings_channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      async () => {
        const bookings = await getBookingsFromDB();
        callback(bookings);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ==================== TRANSFORMERS ====================

function transformCarFromDB(dbCar: any): Car {
  if (!dbCar) throw new Error('Invalid car data');

  return {
    id: dbCar.id,
    name: dbCar.name,
    brand: dbCar.brand,
    model: dbCar.model,
    year: dbCar.year,
    type: dbCar.type,
    transmission: dbCar.transmission,
    fuelType: dbCar.fuel_type,
    seats: dbCar.seats,
    luggage: dbCar.luggage,
    pricePerDay: dbCar.price_per_day,
    images: dbCar.images || [],
    features: dbCar.features || [],
    description: dbCar.description,
    availability: dbCar.availability,
    rating: dbCar.rating,
    reviewCount: dbCar.review_count,
    location: dbCar.location,
  };
}

function transformCarToDB(car: Partial<Car>): any {
  return {
    ...(car.name !== undefined && { name: car.name }),
    ...(car.brand !== undefined && { brand: car.brand }),
    ...(car.model !== undefined && { model: car.model }),
    ...(car.year !== undefined && { year: car.year }),
    ...(car.type !== undefined && { type: car.type }),
    ...(car.transmission !== undefined && { transmission: car.transmission }),
    ...(car.fuelType !== undefined && { fuel_type: car.fuelType }),
    ...(car.seats !== undefined && { seats: car.seats }),
    ...(car.luggage !== undefined && { luggage: car.luggage }),
    ...(car.pricePerDay !== undefined && { price_per_day: car.pricePerDay }),
    ...(car.images !== undefined && { images: car.images }),
    ...(car.features !== undefined && { features: car.features }),
    ...(car.description !== undefined && { description: car.description }),
    ...(car.availability !== undefined && { availability: car.availability }),
    ...(car.rating !== undefined && { rating: car.rating }),
    ...(car.reviewCount !== undefined && { review_count: car.reviewCount }),
    ...(car.location !== undefined && { location: car.location }),
  };
}

function transformBookingFromDB(dbBooking: any): Booking {
  return {
    id: dbBooking.id,
    carId: dbBooking.car_id,
    car: dbBooking.car ? transformCarFromDB(dbBooking.car) : (undefined as any),
    customerName: dbBooking.customer_name,
    customerEmail: dbBooking.customer_email,
    customerPhone: dbBooking.customer_phone,
    pickupLocation: dbBooking.pickup_location,
    dropoffLocation: dbBooking.dropoff_location,
    pickupDate: dbBooking.pickup_date,
    pickupTime: dbBooking.pickup_time,
    dropoffDate: dbBooking.dropoff_date,
    dropoffTime: dbBooking.dropoff_time,
    totalDays: dbBooking.total_days,
    basePrice: dbBooking.base_price,
    insuranceFee: dbBooking.insurance_fee,
    additionalServices: dbBooking.additional_services || [],
    totalPrice: dbBooking.total_price,
    status: dbBooking.status,
    paymentStatus: dbBooking.payment_status,
    createdAt: dbBooking.created_at,
    driverAge: dbBooking.driver_age,
    licenseNumber: dbBooking.license_number,
  };
}

function transformUserFromDB(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role,
    avatar: dbUser.avatar
  };
}

function transformBookingToDB(booking: Partial<Booking>): any {
  return {
    ...(booking.id !== undefined && { id: booking.id }),
    ...(booking.carId !== undefined && { car_id: booking.carId }),
    ...(booking.customerName !== undefined && { customer_name: booking.customerName }),
    ...(booking.customerEmail !== undefined && { customer_email: booking.customerEmail }),
    ...(booking.customerPhone !== undefined && { customer_phone: booking.customerPhone }),
    ...(booking.pickupLocation !== undefined && { pickup_location: booking.pickupLocation }),
    ...(booking.dropoffLocation !== undefined && { dropoff_location: booking.dropoffLocation }),
    ...(booking.pickupDate !== undefined && booking.pickupDate !== '' && { pickup_date: booking.pickupDate }),
    ...(booking.pickupTime !== undefined && { pickup_time: booking.pickupTime }),
    ...(booking.dropoffDate !== undefined && booking.dropoffDate !== '' && { dropoff_date: booking.dropoffDate }),
    ...(booking.dropoffTime !== undefined && { dropoff_time: booking.dropoffTime }),
    ...(booking.totalDays !== undefined && { total_days: booking.totalDays }),
    ...(booking.basePrice !== undefined && { base_price: booking.basePrice }),
    ...(booking.insuranceFee !== undefined && { insurance_fee: booking.insuranceFee }),
    ...(booking.additionalServices !== undefined && { additional_services: booking.additionalServices }),
    ...(booking.totalPrice !== undefined && { total_price: booking.totalPrice }),
    ...(booking.status !== undefined && { status: booking.status }),
    ...(booking.paymentStatus !== undefined && { payment_status: booking.paymentStatus }),
    ...(booking.driverAge !== undefined && { driver_age: booking.driverAge }),
    ...(booking.licenseNumber !== undefined && { license_number: booking.licenseNumber }),
  };
}

function transformPaymentFromDB(dbPayment: any): Payment {
  return {
    id: dbPayment.id,
    bookingId: dbPayment.booking_id,
    amount: dbPayment.amount,
    method: dbPayment.method,
    status: dbPayment.status,
    transactionId: dbPayment.transaction_id,
    paidAt: dbPayment.paid_at,
    createdAt: dbPayment.created_at,
    paymentDetails: dbPayment.payment_details
  };
}

function transformPaymentToDB(payment: Partial<Payment>): any {
  return {
    ...(payment.id !== undefined && { id: payment.id }),
    ...(payment.bookingId !== undefined && { booking_id: payment.bookingId }),
    ...(payment.amount !== undefined && { amount: payment.amount }),
    ...(payment.method !== undefined && { method: payment.method }),
    ...(payment.status !== undefined && { status: payment.status }),
    ...(payment.transactionId !== undefined && { transaction_id: payment.transactionId }),
    ...(payment.paidAt !== undefined && { paid_at: payment.paidAt }),
    ...(payment.createdAt !== undefined && { created_at: payment.createdAt }),
    ...(payment.paymentDetails !== undefined && { payment_details: payment.paymentDetails }),
  };
}

// ==================== OAUTH ====================

export async function signInWithGoogle(): Promise<{ url?: string; error?: string }> {
  if (!supabase) {
    return { error: 'Supabase tidak tersedia' };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    console.error('Google OAuth error:', error);
    return { error: error.message };
  }

  return { url: data?.url };
}

export async function signInWithFacebook(): Promise<{ url?: string; error?: string }> {
  if (!supabase) {
    return { error: 'Supabase tidak tersedia' };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    console.error('Facebook OAuth error:', error);
    return { error: error.message };
  }

  return { url: data?.url };
}

export async function handleOAuthCallback(): Promise<User | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      console.error('OAuth callback error:', error);
      return null;
    }

    const oauthUser = session.user;
    
    // Check if user exists in database
    let user = await getUserByIdFromDB(oauthUser.id);

    if (!user) {
      // Create new user from OAuth data
      const newUser: DBUser = {
        id: oauthUser.id,
        name: oauthUser.user_metadata?.full_name || oauthUser.email?.split('@')[0] || 'User',
        email: oauthUser.email || '',
        phone: oauthUser.user_metadata?.phone_number,
        role: 'customer',
        avatar: oauthUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${oauthUser.email}&background=random`,
        createdAt: new Date().toISOString()
      };

      user = await addUserToDB(newUser);
    }

    return user;
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}