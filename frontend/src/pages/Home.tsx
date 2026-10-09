import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ShieldCheck, Star, ChevronRight, BadgeCheck, Clock, ArrowRight, Quote, Wrench, Siren } from 'lucide-react';
import { fmtCedi } from '../data/market';
import { SectionHead, ArtisanCard, TradeIcon, KenteBar } from '../components/ui';
import { useStore } from '../store';

export default function Home() {
  const nav = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('Accra');
  const selectedCity = new URLSearchParams(location.search).get('city');
  const { services, artisans, cities, testimonials } = useStore();

  const goSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    nav(`/artisans?search=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#062a1f] grain">
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="Ghanaian artisans" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041f17] via-[#062a1f]/85 to-[#062a1f]/30" />
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#e8a90c]/20 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display mt-0 text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-[58px]">
              Plumber, electrician, mechanic <span className="text-[#fcd116]">booked in minutes.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/75">
              ARTISAN-GH connects you to <strong className="text-white">verified Ghanaian pros</strong> with upfront GH₵ prices.
              No more “come tomorrow” stories — track your job live and pay safely with MoMo.
            </p>

            <form onSubmit={goSearch} className="mt-6 rounded-[28px] bg-white p-2.5 shadow-2xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex flex-1 items-center gap-3 rounded-2xl bg-[#f5ead2]/60 px-4 py-4">
                  <Search size={18} className="shrink-0 text-[#0b3d2e]" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="What do you need? e.g. plumber, AC…" className="w-full bg-transparent text-base font-semibold text-[#062a1f] outline-none placeholder:text-black/40" />
                </label>
                <label className="flex items-center gap-3 rounded-2xl bg-[#f5ead2]/60 px-4 py-4 sm:w-48">
                  <MapPin size={18} className="shrink-0 text-[#0b3d2e]" />
                  <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-transparent text-base font-bold text-[#062a1f] outline-none">
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <button className="rounded-2xl bg-[#0b3d2e] px-8 py-4 text-sm font-extrabold text-white transition hover:bg-[#147a5b]">
                  Find help
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                { icon: <ShieldCheck size={17} />, t: 'ID-verified pros' },
                { icon: <Star size={17} />, t: '4.8★ from 12k reviews' },
                { icon: <Clock size={17} />, t: 'Avg arrival 45 mins' },
              ].map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-sm font-bold text-white/85">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8a90c]/20 text-[#fcd116]">{b.icon}</span>{b.t}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
        <KenteBar h="h-2.5" />
      </section>

      {/* STATS */}
      <section className="bg-[#fff8ec]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {[
            { n: '38,400+', l: 'Jobs completed' },
            { n: '2,400+', l: 'Verified artisans' },
            { n: '4.8 / 5', l: 'Average rating' },
            { n: '45 mins', l: 'Avg. response time' },
          ].map(s => (
            <div key={s.l} className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-center">
              <p className="font-display tick text-2xl font-black text-[#0b3d2e] sm:text-3xl">{s.n}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-black/45">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead kicker="12 trades · upfront GH₵ prices" title="What needs fixing today?" sub="Pick a trade to see fixed price list, verified pros and same-day slots." />
          <Link to="/services" className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-5 py-2.5 text-sm font-extrabold text-[#0b3d2e] hover:bg-[#0b3d2e] hover:text-white">All services <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {services.slice(0, 8).map((s, i) => (
            <motion.button key={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onClick={() => nav(`/services#${s.id}`)}
              className="card-lift group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-5 text-left">
              {s.popular && <span className="absolute right-3 top-3 rounded-full bg-[#ce1126] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">Hot</span>}
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0b3d2e] text-[#fcd116] transition group-hover:bg-[#e8a90c] group-hover:text-[#062a1f]">
                <TradeIcon icon={s.icon} />
              </span>
              <p className="font-display mt-3 text-lg font-black text-[#062a1f]">{s.name}</p>
              <p className="text-xs font-semibold text-black/50">{s.tagline}</p>
              <p className="tick mt-2 text-sm font-extrabold text-[#147a5b]">from {fmtCedi(s.baseFrom)}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-extrabold text-[#b97f06]">See prices <ChevronRight size={13} /></span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS strip */}
      <section className="adinkra-bg relative overflow-hidden py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead light kicker="Simple as 1 · 2 · 3" title="From wahala to fixed, in 3 steps" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: '01', t: 'Describe & pick a price', d: 'Choose your trade, tick the tasks you need and see the total in cedis — before anyone knocks.', icon: <Search size={22} /> },
              { n: '02', t: 'We match a verified pro', d: 'Nearest available artisan accepts instantly. See their photo, rating, ID badge and live ETA.', icon: <BadgeCheck size={22} /> },
              { n: '03', t: 'Track, pay & rate', d: 'Follow the job live, pay with MTN / Telecel / AT MoMo, and rate. 7-day fix-it guarantee.', icon: <ShieldCheck size={22} /> },
            ].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-white/[0.07] p-6 backdrop-blur border border-white/10">
                <span className="font-display text-5xl font-black text-[#e8a90c]/25">{s.n}</span>
                <span className="mt-2 grid h-12 w-12 place-items-center rounded-2xl bg-[#e8a90c] text-[#062a1f]">{s.icon}</span>
                <p className="font-display mt-3 text-xl font-bold text-white">{s.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="rounded-full bg-[#e8a90c] px-7 py-3.5 text-sm font-extrabold text-[#062a1f] hover:bg-[#fcd116]">Book a job now</Link>
            <Link to="/how-it-works" className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10">Learn more</Link>
          </div>
        </div>
      </section>

      {/* TOP ARTISANS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead kicker="Top rated this week" title="Trusted professionals" sub="Skilled local pros ready to help in your area." />
          <Link to="/artisans" className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-5 py-2.5 text-sm font-extrabold text-[#0b3d2e] hover:bg-[#0b3d2e] hover:text-white">Browse all <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artisans.filter(a => a.topRated).map(a => <ArtisanCard key={a.id} a={a} />)}
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-[#ce1126] p-8 text-white sm:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-40 h-52 w-52 rounded-full bg-black/15" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest"><Siren size={14} /> 24/7 Emergency line</p>
              <h3 className="font-display mt-3 text-3xl font-black sm:text-4xl">Burst pipe? Total blackout? Car dead on the motorway?</h3>
              <p className="mt-2 text-white/80">Emergency jobs jump the queue — a verified pro is dispatched in under 20 minutes, anywhere in Accra & Kumasi.</p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <Link to="/book?emergency=1" className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-extrabold text-[#ce1126] hover:bg-[#fdf0c9]">Request emergency help</Link>
              <a href="tel:0302740000" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 px-7 py-3 text-sm font-extrabold hover:bg-white/10"><Wrench size={15} /> Call 030 274 0000</a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-black/10 bg-[#f5ead2]/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <SectionHead kicker="Ghanaians are talking" title="Medaase for the love, Ghana" />
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-black/10 bg-white p-6">
                <Quote size={26} className="text-[#e8a90c]" />
                <blockquote className="mt-3 text-[15px] leading-relaxed text-black/70">“{t.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0b3d2e] font-display text-sm font-black text-[#fcd116]">
                    {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-[#062a1f]">{t.name}</span>
                    <span className="block text-xs font-semibold text-black/50">{t.role} · {t.area}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          {/* city coverage */}
          <div className="mt-8 overflow-hidden rounded-[28px] border border-[#0b3d2e]/10 bg-[#f5ead2] p-3 shadow-inner shadow-white/40 sm:rounded-full sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="flex items-center justify-between gap-3 px-1 sm:shrink-0 sm:px-0">
                <div className="inline-flex items-center gap-2 text-xs font-black tracking-[0.08em] text-[#062a1f] sm:text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0b3d2e] text-[#fcd116] shadow-sm sm:h-5 sm:w-5 sm:bg-white/60 sm:text-[#0b3d2e] sm:shadow-none">
                  <MapPin size={11} className="text-[#fcd116] sm:text-[#0b3d2e]" />
                  </span>
                  <span>NOW SERVING</span>
                </div>
                <span className="rounded-full bg-white/65 px-2.5 py-1 text-[10px] font-extrabold text-[#0b3d2e]/60 sm:hidden">10 cities</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-1 sm:flex-wrap sm:gap-3">
                {cities.map(c => {
                  const active = selectedCity === c;
                  return (
                    <button
                      key={c}
                      onClick={() => nav(`/artisans?city=${c}`)}
                      className={`min-w-0 rounded-full border px-2 py-2.5 text-center text-xs font-extrabold transition sm:px-4 sm:py-2 sm:text-base ${
                        active
                          ? 'border-[#0b3d2e] bg-[#0b3d2e] text-white shadow-[0_8px_20px_-12px_rgba(11,61,46,0.9)]'
                          : 'border-[#0b3d2e]/25 bg-[#0b3d2e] text-[#fdf8ef] hover:bg-[#147a5b]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
