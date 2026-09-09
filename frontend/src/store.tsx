import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { type Artisan, type Review, type Service } from './data/market';

export type JobStatus = 'confirmed' | 'enroute' | 'inprogress' | 'completed' | 'cancelled';

export interface BookedTask { id: string; label: string; price: number; qty: number }
export interface Booking {
  id: string; artisanId: string; artisanName: string; trade: string;
  tasks: BookedTask[]; subtotal: number; emergencyFee: number; serviceFee: number; transport: number; total: number;
  date: string; time: string; address: string; city: string; landmark?: string; notes?: string;
  name: string; phone: string; momoProvider: string; momoNumber: string;
  status: JobStatus; createdAt: string; emergency: boolean; rating?: number;
}
export interface ChatMsg { from: 'you' | 'artisan'; text: string; at: string }

interface Store {
  bookings: Booking[];
  artisans: Artisan[];
  services: Service[];
  reviews: Review[];
  testimonials: { name: string; area: string; text: string; role: string }[];
  cities: string[];
  favs: string[];
  toggleFav: (id: string) => void;
  addBooking: (b: Booking) => void;
  addArtisan: (artisan: Artisan) => void;
  updateStatus: (id: string, s: JobStatus) => void;
  rateBooking: (id: string, r: number) => void;
  chats: Record<string, ChatMsg[]>;
  sendChat: (bookingId: string, text: string, artisanName: string) => void;
  toast: string | null;
  showToast: (t: string) => void;
  userName: string; setUserName: (s: string) => void;
}

const Ctx = createContext<Store | null>(null);

function load<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : fb; } catch { return fb; }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [testimonials, setTestimonials] = useState<{ name: string; area: string; text: string; role: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [favs, setFavs] = useState<string[]>(() => load('agh-favs', []));
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({});
  const [userName, setUserName] = useState(() => { try { return localStorage.getItem('agh-name') || ''; } catch { return ''; } });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.getBookings()
      .then(async remote => {
        setBookings(remote);
        const messageSets = await Promise.all(remote.map(async booking => [booking.id, await api.getMessages(booking.id)] as const));
        setChats(Object.fromEntries(messageSets));
      })
      .catch(error => console.error('Could not load bookings from API:', error));
  }, []);
  useEffect(() => {
    Promise.all([api.getServices(), api.getReviews(), api.getTestimonials(), api.getCities()])
      .then(([serviceData, reviewData, testimonialData, cityData]) => {
        setServices(serviceData); setReviews(reviewData); setTestimonials(testimonialData); setCities(cityData);
      })
      .catch(error => console.error('Could not load catalog data from API:', error));
  }, []);
  useEffect(() => {
    api.getArtisans()
      .then(remote => setArtisans(remote))
      .catch(error => console.error('Could not load artisans from API:', error));
  }, []);
  useEffect(() => { try { localStorage.setItem('agh-favs', JSON.stringify(favs)); } catch {} }, [favs]);
  useEffect(() => { try { localStorage.setItem('agh-name', userName); } catch {} }, [userName]);

  const showToast = (t: string) => {
    setToast(t);
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 3200);
  };

  const toggleFav = (id: string) => setFavs(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id]));
  const addBooking = (b: Booking) => {
    setBookings(bs => [b, ...bs]);
    api.createBooking(b).catch(error => console.error('Could not save booking:', error));
  };
  const addArtisan = (artisan: Artisan) => {
    setArtisans(current => [artisan, ...current.filter(existing => existing.id !== artisan.id)]);
    api.createArtisan(artisan).catch(error => console.error('Could not save artisan:', error));
  };
  const updateStatus = (id: string, s: JobStatus) => {
    setBookings(bs => bs.map(b => (b.id === id ? { ...b, status: s } : b)));
    api.updateBooking(id, { status: s }).catch(error => console.error('Could not update booking:', error));
  };
  const rateBooking = (id: string, r: number) => {
    setBookings(bs => bs.map(b => (b.id === id ? { ...b, rating: r } : b)));
    api.updateBooking(id, { rating: r }).catch(error => console.error('Could not rate booking:', error));
  };

  const sendChat = (bookingId: string, text: string, _artisanName: string) => {
    const t = new Date().toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });
    const message = { from: 'you' as const, text, at: t };
    setChats(c => ({ ...c, [bookingId]: [...(c[bookingId] || []), message] }));
    api.addMessage(bookingId, message).catch(error => console.error('Could not save message:', error));
  };

  const value = useMemo(() => ({
    bookings, artisans, services, reviews, testimonials, cities, favs, toggleFav, addBooking, addArtisan, updateStatus, rateBooking, chats, sendChat, toast, showToast, userName, setUserName,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [bookings, artisans, services, reviews, testimonials, cities, favs, chats, toast, userName]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('store missing');
  return s;
}
