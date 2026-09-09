import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, MapPin, Phone, MessageCircle, Languages, Award, Briefcase, ChevronLeft, ShieldCheck, Clock } from 'lucide-react';
import { fmtCedi } from '../data/market';
import { Stars, ArtisanCard } from '../components/ui';
import { useStore } from '../store';

export default function ArtisanDetail() {
  const { id } = useParams();
  const { artisans, services, reviews, toggleFav, favs, showToast } = useStore();
  const a = artisans.find(x => x.id === id);
  if (!a) return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><p className="font-display text-3xl font-black">Artisan not found</p><Link to="/artisans" className="mt-4 inline-block rounded-full bg-[#0b3d2e] px-6 py-3 text-sm font-bold text-white">Back to artisans</Link></div>;
  const svc = services.find(s => s.id === a.trade);
  const revs = reviews.filter(r => r.artisanId === a.id);
  if (!svc) return null;
  const similar = artisans.filter(x => x.trade === a.trade && x.id !== a.id).slice(0, 3);
  const liked = favs.includes(a.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/artisans" className="inline-flex items-center gap-1.5 text-sm font-bold text-black/55 hover:text-[#0b3d2e]"><ChevronLeft size={16} /> Back to artisans</Link>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white">
            <div className="relative h-64 sm:h-80">
              {a.image
                ? <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                : <div className="adinkra-bg flex h-full items-center justify-center"><span className="font-display text-8xl font-black text-[#e8a90c]">{a.initials}</span></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute left-5 top-5 flex gap-2">
                {a.verified && <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#0b3d2e]"><BadgeCheck size={14} className="text-[#147a5b]" /> ID Verified</span>}
                {a.availableNow
                  ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[#147a5b] px-3 py-1.5 text-xs font-extrabold text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Available now</span>
                  : <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">Busy · back soon</span>}
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#fcd116]">{a.tradeLabel} · {svc.name}</p>
                  <h1 className="font-display text-3xl font-black text-white sm:text-4xl">{a.name}</h1>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white/80"><MapPin size={14} /> {a.city} · serves {a.areas.join(', ')}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-2.5 text-center">
                  <p className="flex items-center gap-1.5 text-lg font-extrabold text-[#062a1f]"><Stars value={a.rating} /> {a.rating.toFixed(1)}</p>
                  <p className="text-[11px] font-bold text-black/50">{a.reviewsCount} reviews · {a.jobsDone} jobs</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-black/10 border-b border-black/10 bg-[#fff8ec]/70 text-center">
              {[
                { v: `${a.yearsExp} yrs`, l: 'Experience' },
                { v: `~${a.responseMins}m`, l: 'Responds in' },
                { v: fmtCedi(a.priceFrom), l: 'Starting at' },
              ].map(s => (
                <div key={s.l} className="px-2 py-4">
                  <p className="tick font-display text-xl font-black text-[#0b3d2e]">{s.v}</p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-black/45">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-7">
              <h2 className="font-display text-xl font-black text-[#062a1f]">About {a.name.split(' ')[0]}</h2>
              <p className="mt-2 leading-relaxed text-black/65">{a.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.skills.map(s => <span key={s} className="rounded-full bg-[#0b3d2e] px-3.5 py-1.5 text-xs font-bold text-[#fcd116]">{s}</span>)}
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl bg-[#f5ead2]/60 p-4 text-sm font-semibold text-black/65 sm:grid-cols-3">
                <span className="inline-flex items-center gap-2"><Languages size={16} className="text-[#147a5b]" /> {a.languages.join(', ')}</span>
                <span className="inline-flex items-center gap-2"><Award size={16} className="text-[#147a5b]" /> Trade certified</span>
                <span className="inline-flex items-center gap-2"><Briefcase size={16} className="text-[#147a5b]" /> Insured jobs</span>
              </div>

              <h2 className="font-display mt-7 text-xl font-black text-[#062a1f]">Price list</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {svc.tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                    <span className="text-sm font-bold text-[#062a1f]">{t.label}</span>
                    <span className="tick text-sm font-extrabold text-[#147a5b]">{fmtCedi(t.price)}</span>
                  </div>
                ))}
              </div>

              <h2 className="font-display mt-7 text-xl font-black text-[#062a1f]">Reviews ({revs.length || a.reviewsCount})</h2>
              <div className="mt-3 space-y-3">
                {(revs.length ? revs : [{ id: 'd', artisanId: a.id, name: 'Verified customer', city: a.city, rating: 5, text: `${a.name.split(' ')[0]} did a clean, professional job and arrived on time. I will book again.`, date: 'Aug 2026' }]).map(r => (
                  <div key={r.id} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-extrabold text-[#062a1f]">{r.name} <span className="font-semibold text-black/45">· {r.city}</span></p>
                      <Stars value={r.rating} size={12} />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-black/65">“{r.text}”</p>
                    <p className="mt-1 text-[11px] font-bold text-black/35">{r.date} · Verified job</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-xl font-black text-[#062a1f]">Similar {svc.name.toLowerCase()} pros</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map(s => <ArtisanCard key={s.id} a={s} compact />)}
              </div>
            </div>
          )}
        </div>

        {/* sticky booking panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[28px] bg-[#062a1f] p-6 text-white shadow-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Book {a.name.split(' ')[0]}</p>
            <p className="tick font-display mt-1 text-3xl font-black">from {fmtCedi(a.priceFrom)}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/60"><Clock size={12} /> Responds in ~{a.responseMins} mins · Free cancellation 2hrs before</p>
            <div className="mt-4 space-y-2.5">
              <Link to={`/book?artisan=${a.id}`} className="block rounded-2xl bg-[#e8a90c] py-3.5 text-center text-sm font-extrabold text-[#062a1f] hover:bg-[#fcd116]">Book this artisan</Link>
              <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 rounded-2xl border border-white/25 py-3.5 text-sm font-bold hover:bg-white/10"><Phone size={15} /> {a.phone}</a>
              <Link to={`/book?artisan=${a.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 text-sm font-bold hover:bg-white/15"><MessageCircle size={15} /> Chat before booking</Link>
              <button onClick={() => { toggleFav(a.id); showToast(liked ? 'Removed from favourites' : 'Saved to favourites'); }} className="w-full rounded-2xl py-2.5 text-xs font-bold text-white/60 hover:text-[#fcd116]">
                {liked ? '★ Saved to favourites — tap to remove' : '☆ Save to favourites'}
              </button>
            </div>
            <div className="mt-5 rounded-2xl bg-white/[0.07] p-4 text-xs leading-relaxed text-white/65">
              <p className="flex items-center gap-1.5 font-extrabold text-[#fcd116]"><ShieldCheck size={14} /> Y3FIX-GH Guarantee</p>
              <p className="mt-1">ID-checked pro · Upfront price locked · 7-day free re-fix if anything goes wrong.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
