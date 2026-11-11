import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { ARTISANS, CITIES, REVIEWS, SERVICES, TESTIMONIALS, type Artisan, type Review, type Service } from './data/market';

interface Store {
  artisans: Artisan[];
  services: Service[];
  reviews: Review[];
  testimonials: { name: string; area: string; text: string; role: string }[];
  cities: string[];
  favs: string[];
  toggleFav: (id: string) => void;
  addArtisan: (artisan: Artisan) => Promise<Artisan>;
  updateArtisan: (id: string, update: Partial<Artisan>) => Promise<Artisan>;
  addReview: (review: Review) => void;
  toast: string | null;
  showToast: (t: string) => void;
}

const Ctx = createContext<Store | null>(null);

function load<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : fb; } catch { return fb; }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [artisans, setArtisans] = useState<Artisan[]>(ARTISANS);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [testimonials, setTestimonials] = useState<{ name: string; area: string; text: string; role: string }[]>(TESTIMONIALS);
  const [cities, setCities] = useState<string[]>(CITIES);
  const [favs, setFavs] = useState<string[]>(() => load('agh-favs', []));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getServices(), api.getReviews(), api.getTestimonials(), api.getCities()])
      .then(([serviceData, reviewData, testimonialData, cityData]) => {
        if (serviceData?.length) setServices(serviceData);
        if (reviewData?.length) setReviews(reviewData);
        if (testimonialData?.length) setTestimonials(testimonialData);
        if (cityData?.length) setCities(cityData);
      })
      .catch(error => {
        console.error('Could not load catalog data from API:', error);
        setServices(SERVICES);
        setReviews(REVIEWS);
        setTestimonials(TESTIMONIALS);
        setCities(CITIES);
      });
  }, []);
  useEffect(() => {
    api.getArtisans()
      .then(remote => {
        setArtisans(remote);
      })
      .catch(error => {
        console.error('Could not load artisans from API:', error);
        setArtisans(ARTISANS);
      });
  }, []);
  useEffect(() => { try { localStorage.setItem('agh-favs', JSON.stringify(favs)); } catch (error) { console.warn('Could not persist favourites:', error); } }, [favs]);
  const showToast = (t: string) => {
    setToast(t);
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 3200);
  };

  const toggleFav = (id: string) => setFavs(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id]));
  const addArtisan = async (artisan: Artisan) => {
    const saved = await api.createArtisan(artisan);
    setArtisans(current => [saved, ...current.filter(existing => existing.id !== saved.id)]);
    return saved;
  };
  const updateArtisan = async (id: string, update: Partial<Artisan>) => {
    const saved = await api.updateArtisan(id, update);
    setArtisans(current => {
      const updated = current.some(artisan => artisan.id === id)
        ? current.map(artisan => artisan.id === id ? saved : artisan)
        : [...current, saved];
      return updated.filter(artisan => !artisan.suspended);
    });
    return saved;
  };
  const addReview = (review: Review) => {
    setReviews(current => [review, ...current]);
    api.createReview(review).catch(error => console.error('Could not save review:', error));
  };
  const value = useMemo(() => ({
    artisans, services, reviews, testimonials, cities, favs, toggleFav, addArtisan, updateArtisan, addReview, toast, showToast,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [artisans, services, reviews, testimonials, cities, favs, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('store missing');
  return s;
}
