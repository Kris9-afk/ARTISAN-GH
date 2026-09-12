import type { Artisan, Review, Service } from './data/market';
import type { Booking, ChatMsg } from './store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const api = {
  loginAdmin: (code: string) => request<{ authenticated: boolean }>('/admin/login', { method: 'POST', body: JSON.stringify({ code }) }),
  changeAdminCode: (currentCode: string, newCode: string) =>
    request<{ changed: boolean }>('/admin/change-code', { method: 'POST', body: JSON.stringify({ currentCode, newCode }) }),
  getBookings: () => request<Booking[]>('/bookings'),
  getArtisans: () => request<Artisan[]>('/artisans'),
  getServices: () => request<Service[]>('/services'),
  getReviews: () => request<Review[]>('/reviews'),
  createReview: (review: Review) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  getTestimonials: () => request<{ name: string; area: string; text: string; role: string }[]>('/testimonials'),
  getCities: () => request<string[]>('/cities'),
  createArtisan: (artisan: Artisan) => request<Artisan>('/artisans', { method: 'POST', body: JSON.stringify(artisan) }),
  deleteArtisan: (id: string) => request<{ deleted: boolean }>(`/artisans/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createBooking: (booking: Booking) => request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(booking) }),
  updateBooking: (id: string, update: Partial<Booking>) =>
    request<Booking>(`/bookings/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(update) }),
  addMessage: (id: string, message: ChatMsg) =>
    request<ChatMsg>(`/bookings/${encodeURIComponent(id)}/messages`, { method: 'POST', body: JSON.stringify(message) }),
  getMessages: (id: string) => request<ChatMsg[]>(`/bookings/${encodeURIComponent(id)}/messages`),
};

