import { Star, BadgeCheck, MapPin, Heart, Clock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Artisan } from '../data/market';
import { fmtCedi } from '../data/market';
import { useStore } from '../store';

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-[#e8a90c] text-[#e8a90c]' : 'text-black/25'} />
      ))}
    </span>
  );
}

export function KenteBar({ h = 'h-2' }: { h?: string }) {
  return <div className={`kente-bar w-full ${h}`} aria-hidden />;
}

export function SectionHead({ kicker, title, sub, light }: { kicker: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`text-[11px] font-extrabold tracking-[0.22em] uppercase ${light ? 'text-[#e8a90c]' : 'text-[#147a5b]'}`}>{kicker}</p>
      <h2 className={`font-display text-3xl sm:text-4xl font-black leading-tight mt-2 ${light ? 'text-white' : 'text-[#062a1f]'}`}>{title}</h2>
      {sub && <p className={`mt-2 text-[15px] leading-relaxed ${light ? 'text-white/70' : 'text-black/60'}`}>{sub}</p>}
    </div>
  );
}

export function TradeIcon({ icon, size = 22 }: { icon: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
    car: <path d="M5 17h14M6.5 17a1.5 1.5 0 1 0 0 .01M17.5 17a1.5 1.5 0 1 0 0 .01M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v4h-2.5M3 13v4h2.5M3 13h18" />,
    sparkles: <path d="M12 3v3m0 12v3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2M3 12h3m12 0h3M5.6 18.4l2.2-2.2m8.4-8.4 2.2-2.2" />,
    hammer: <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9m4-8 6 6-2 2-6-6 2-2Zm-4 4 2 2" />,
    paint: <path d="m14 5 5 5L8 21H3v-5L14 5Zm2-2 2-2 5 5-2 2" />,
    brick: <path d="M3 9h18v11H3zM3 5h18v4H3zM7 9v4m4-4v4m4-4v4M3 15h18" />,
    snow: <path d="M12 2v20M4 6l16 12M20 6 4 18M2 12h20" />,
    flame: <path d="M12 22c4.4 0 8-3.6 8-8 0-5-4-9-8-12-4 3-8 7-8 12 0 4.4 3.6 8 8 8Zm0-4a4 4 0 0 1-4-4c0-2 2-4 4-6 2 2 4 4 4 6a4 4 0 0 1-4 4Z" />,
    sun: <circle cx="12" cy="12" r="4" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    tv: <path d="M3 7h18v10H3zM8 21h8m-4-4v4" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[icon] || paths.wrench}
      {icon === 'sun' && <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />}
    </svg>
  );
}

export function ArtisanCard({ a, compact }: { a: Artisan; compact?: boolean }) {
  const { favs, toggleFav, services } = useStore();
  const liked = favs.includes(a.id);
  const svc = services.find(service => service.id === a.trade);
  if (!svc) return null;
  return (
    <div className="card-lift group relative overflow-hidden rounded-3xl bg-white border border-black/10 shadow-[0_10px_30px_-14px_rgba(6,42,31,0.25)]">
      <div className="relative h-44 overflow-hidden bg-[#062a1f]">
        {a.image ? (
          <img src={a.image} alt={a.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center adinkra-bg">
            <span className="font-display text-6xl font-black text-[#e8a90c]/90">{a.initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {a.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#0b3d2e]"><BadgeCheck size={13} className="text-[#147a5b]" /> Verified</span>
          )}
          {a.availableNow && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#147a5b] px-2.5 py-1 text-[11px] font-bold text-white"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Available</span>
          )}
        </div>
        <button onClick={() => toggleFav(a.id)} aria-label="save" className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${liked ? 'bg-[#ce1126] text-white' : 'bg-white/90 text-black/60 hover:text-[#ce1126]'}`}>
          <Heart size={16} className={liked ? 'fill-white' : ''} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#fcd116]">{svc.name}</p>
            <p className="font-display text-xl font-bold text-white leading-none mt-0.5">{a.name}</p>
          </div>
          <div className="rounded-2xl bg-white/95 px-2.5 py-1.5 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wide text-black/50">from</p>
            <p className="tick text-sm font-extrabold text-[#0b3d2e]">{fmtCedi(a.priceFrom)}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#062a1f]"><Stars value={a.rating} /> {a.rating.toFixed(1)} <span className="font-medium text-black/45">({a.reviewsCount})</span></span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-black/55"><MapPin size={13} /> {a.city}</span>
        </div>
        {!compact && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {a.skills.slice(0, 3).map(s => (
              <span key={s} className="rounded-full bg-[#f5ead2] px-2.5 py-1 text-[11px] font-bold text-[#6b5510]">{s}</span>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <Link to={`/artisan/${a.id}`} className="flex-1 rounded-xl bg-[#0b3d2e] px-3 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#147a5b]">View profile</Link>
          <Link to={`/book?artisan=${a.id}`} className="flex-1 rounded-xl bg-[#e8a90c] px-3 py-2.5 text-center text-sm font-extrabold text-[#062a1f] transition hover:bg-[#fcd116]">Book now</Link>
          <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-[#0b3d2e] hover:bg-[#f5ead2]" aria-label="call"><Phone size={16} /></a>
        </div>
        <p className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-black/45"><Clock size={12} /> Responds in ~{a.responseMins} mins · {a.jobsDone} jobs done</p>
      </div>
    </div>
  );
}
