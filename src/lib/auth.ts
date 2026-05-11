import { currentUser } from '../data/cars';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

export interface Session {
  user: User;
  loginAt: string;
}

// Get current session
export function getSession(): Session | null {
  const sessionData = localStorage.getItem('session') || sessionStorage.getItem('session');
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }
  return null;
}

// Check if user is logged in
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// Check if user is admin
export function isAdmin(): boolean {
  const session = getSession();
  return session?.user.role === 'admin';
}

// Get current user
export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

// Logout
export function logout(): void {
  localStorage.removeItem('session');
  sessionStorage.removeItem('session');
  window.location.href = '/';
}

// Initialize demo users if not exists
export function initializeUsers(): void {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.length === 0) {
    const demoUsers = [
      {
        id: '1',
        name: 'Administrator',
        email: 'admin@rentalmobil.com',
        phone: '081234567890',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Demo User',
        email: 'user@example.com',
        phone: '081234567891',
        password: 'user123',
        role: 'customer',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }
}

// Protected route helper
export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

export function requireAdmin(): boolean {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  if (!isAdmin()) {
    window.location.href = '/';
    return false;
  }
  return true;
}
