import type { Artisan, Review, Service } from './data/market';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface MarketplaceReport {
  id: string;
  reporterType: 'customer' | 'artisan';
  reporterName: string;
  reporterPhone: string;
  subjectType: 'customer' | 'artisan';
  subjectName: string;
  artisanId?: string;
  description: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  const token = sessionStorage.getItem('agh-admin-token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(errorBody?.error || `API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  loginAdmin: (code: string) => request<{ authenticated: boolean; token: string }>('/admin/login', { method: 'POST', body: JSON.stringify({ code }) }),
  getArtisans: () => request<Artisan[]>('/artisans'),
  getAdminArtisans: () => request<Artisan[]>('/admin/artisans'),
  getServices: () => request<Service[]>('/services'),
  getReviews: () => request<Review[]>('/reviews'),
  createReview: (review: Review) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  createReport: (report: Omit<MarketplaceReport, 'id' | 'status' | 'createdAt'>) =>
    request<MarketplaceReport>('/reports', { method: 'POST', body: JSON.stringify(report) }),
  getReports: () => request<MarketplaceReport[]>('/admin/reports'),
  updateReport: (id: string, status: MarketplaceReport['status']) =>
    request<MarketplaceReport>(`/admin/reports/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getTestimonials: () => request<{ name: string; area: string; text: string; role: string }[]>('/testimonials'),
  getCities: () => request<string[]>('/cities'),
  createArtisan: (artisan: Artisan) => request<Artisan>('/artisans', { method: 'POST', body: JSON.stringify(artisan) }),
  updateArtisan: (id: string, update: Partial<Artisan>) =>
    request<Artisan>(`/admin/artisans/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(update) }),
};
