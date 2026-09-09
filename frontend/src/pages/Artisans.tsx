import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, BadgeCheck } from 'lucide-react';
import { ArtisanCard, SectionHead, TradeIcon } from '../components/ui';
import { useStore } from '../store';

export default function Artisans() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [trade, setTrade] = useState(params.get('trade') || 'all');
  const [city, setCity] = useState(params.get('city') || 'All cities');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('rating');
  const { artisans, services, cities } = useStore();

  const list = useMemo(() => {
    let l = [...artisans];
    const q = (search || params.get('search') || '').toLowerCase();
    if (q) l = l.filter(a =>
      a.name.toLowerCase().includes(q) || a.skills.join(' ').toLowerCase().includes(q) ||
      a.tradeLabel.toLowerCase().includes(q) || a.bio.toLowerCase().includes(q) ||
      services.find(s => s.id === a.trade)?.name.toLowerCase().includes(q) ||
      services.find(s => s.id === a.trade)?.tasks.some(t => t.label.toLowerCase().includes(q)));
    if (trade !== 'all') l = l.filter(a => a.trade === trade);
    const pc = params.get('city');
    const cc = pc || city;
    if (cc && cc !== 'All cities') l = l.filter(a => a.city === cc || a.areas.some(x => x.toLowerCase().includes(cc.toLowerCase())));
    if (onlyVerified) l = l.filter(a => a.verified);
    if (onlyAvailable) l = l.filter(a => a.availableNow);
    l.sort((a, b) => sort === 'price' ? a.priceFrom - b.priceFrom : sort === 'jobs' ? b.jobsDone - a.jobsDone : b.rating - a.rating);
    return l;
  }, [search, trade, city, onlyVerified, onlyAvailable, sort, params, artisans, services]);

  const setP = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v); else n.delete(k);
    setParams(n, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Verified Ghanaian pros" title="Find your artisan" sub="Search by trade, task or name. Every profile shows real ratings, ID badge and live availability." />

      <div className="sticky top-[76px] z-30 mt-6 rounded-3xl border border-black/10 bg-white/95 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-2 lg:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-2xl bg-[#f5ead2]/60 px-4 py-3">
            <Search size={17} className="text-[#0b3d2e]" />
            <input value={search} onChange={e => { setSearch(e.target.value); setP('search', e.target.value); }}
              placeholder="Try 'plumber', 'AC', 'Kwame', ' tiling'…" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-black/35" />
          </label>
          <div className="flex gap-2">
            <select value={trade} onChange={e => { setTrade(e.target.value); setP('trade', e.target.value === 'all' ? '' : e.target.value); }}
              className="rounded-2xl bg-[#f5ead2]/60 px-3 py-3 text-sm font-bold text-[#062a1f] outline-none">
              <option value="all">All trades</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={params.get('city') || city} onChange={e => { setCity(e.target.value); setP('city', e.target.value === 'All cities' ? '' : e.target.value); }}
              className="rounded-2xl bg-[#f5ead2]/60 px-3 py-3 text-sm font-bold text-[#062a1f] outline-none">
              <option>All cities</option>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="hidden rounded-2xl bg-[#0b3d2e] px-3 py-3 text-sm font-bold text-white outline-none sm:block">
              <option value="rating">Top rated</option>
              <option value="price">Lowest price</option>
              <option value="jobs">Most jobs</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 px-1 pt-2.5">
          <SlidersHorizontal size={14} className="text-black/40" />
          <button onClick={() => setOnlyVerified(!onlyVerified)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${onlyVerified ? 'bg-[#0b3d2e] text-white' : 'bg-black/5 text-black/55 hover:bg-black/10'}`}>
            <BadgeCheck size={13} /> Verified only
          </button>
          <button onClick={() => setOnlyAvailable(!onlyAvailable)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${onlyAvailable ? 'bg-[#147a5b] text-white' : 'bg-black/5 text-black/55 hover:bg-black/10'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" /> Available now
          </button>
          <span className="tick ml-auto text-xs font-bold text-black/45">{list.length} pro{list.length === 1 ? '' : 's'} found</span>
        </div>
      </div>

      {/* trade chips */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => { setTrade('all'); setP('trade', ''); }} className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold ${trade === 'all' ? 'bg-[#e8a90c] text-[#062a1f]' : 'bg-white border border-black/10 text-black/60'}`}>All</button>
        {services.map(s => (
          <button key={s.id} onClick={() => { setTrade(s.id); setP('trade', s.id); }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold ${trade === s.id ? 'bg-[#0b3d2e] text-white' : 'bg-white border border-black/10 text-black/60'}`}>
            <TradeIcon icon={s.icon} size={13} /> {s.name}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-black/20 bg-white p-10 text-center">
          <p className="font-display text-2xl font-black text-[#062a1f]">No pros match — yet!</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-black/55">Try a different spelling or city, or book directly and we will manually match you within 30 minutes.</p>
          <Link to="/book" className="mt-4 inline-block rounded-full bg-[#e8a90c] px-6 py-3 text-sm font-extrabold text-[#062a1f]">Request manual matching</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map(a => <ArtisanCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}
