import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from './utils';
import { getBookingsFromDB, isSupabaseAvailable } from './supabase';
import type { Booking } from '../types';

// Custom hook untuk mengelola bookings dengan real-time updates
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const stored = isSupabaseAvailable
        ? await getBookingsFromDB()
        : loadFromStorage<Booking[]>('bookings', []);
      setBookings(stored);
      console.log('[useBookings] Loaded', stored.length, 'bookings');
    } catch (error) {
      console.error('[useBookings] Error loading bookings:', error);
      setBookings([]);
    }
  };

  useEffect(() => {
    // Initial load
    loadBookings().finally(() => setIsLoading(false));

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookings' || e.key === null) {
        console.log('[useBookings] Storage changed, reloading...');
        loadBookings();
      }
    };

    // Listen for window focus
    const handleFocus = () => {
      console.log('[useBookings] Window focused, reloading...');
      loadBookings();
    };

    // Polling for real-time updates
    const pollingInterval = setInterval(() => {
      loadBookings();
    }, 2000);

    // Custom event for same-tab updates
    const handleCustomEvent = () => {
      console.log('[useBookings] Custom event received, reloading...');
      loadBookings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('bookingsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('bookingsUpdated', handleCustomEvent);
      clearInterval(pollingInterval);
    };
  }, []);

  // Helper function to update bookings and trigger reload
  const updateBookings = (newBookings: Booking[]) => {
    saveToStorage('bookings', newBookings);
    setBookings(newBookings);
    // Trigger custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('bookingsUpdated'));
  };

  return {
    bookings,
    isLoading,
    loadBookings,
    updateBookings,
    refreshBookings: loadBookings
  };
}
