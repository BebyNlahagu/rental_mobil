export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateDays(pickupDate: string, dropoffDate: string): number {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);
  const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
}

export function generateBookingId(): string {
  return 'BK' + Date.now().toString(36).toUpperCase();
}

export function generateTransactionId(): string {
  return 'TRX' + Date.now().toString(36).toUpperCase();
}

export function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  return parseJSON<T>(localStorage.getItem(key), fallback);
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCarTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    economy: 'Economy',
    compact: 'Compact',
    midsize: 'Midsize',
    suv: 'SUV',
    luxury: 'Luxury',
    van: 'Van'
  };
  return labels[type] || type;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    unpaid: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    active: 'Aktif',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    unpaid: 'Belum Dibayar',
    paid: 'Lunas',
    refunded: 'Dikembalikan',
    success: 'Berhasil',
    failed: 'Gagal'
  };
  return labels[status] || status;
}
