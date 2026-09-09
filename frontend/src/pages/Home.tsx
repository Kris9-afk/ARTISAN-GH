import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ShieldCheck, Star, ChevronRight, BadgeCheck, Clock, ArrowRight, Quote, Wrench, Siren } from 'lucide-react';
import { fmtCedi } from '../data/market';
import { SectionHead, ArtisanCard, TradeIcon, Stars, KenteBar } from '../components/ui';
import { useStore } from '../store';

export default function Home() {
  const nav = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('Accra');
  const selectedCity = new URLSearchParams(location.search).get('city');
  const { services, artisans, cities, testimonials } = useStore();

  const GHANA_REGIONS = [
    { name: 'Upper West', path: 'M117 112 L175 78 L225 97 L205 147 L156 166 L128 146 Z', labelX: 120, labelY: 118 },
    { name: 'Upper East', path: 'M227 96 L298 72 L344 82 L334 126 L285 145 L234 138 Z', labelX: 255, labelY: 112 },
    { name: 'North East', path: 'M344 82 L397 85 L424 110 L414 143 L352 148 L334 126 Z', labelX: 390, labelY: 118 },
    { name: 'Northern', path: 'M236 154 L321 144 L404 153 L454 178 L438 247 L366 266 L294 254 L247 196 Z', labelX: 375, labelY: 196 },
    { name: 'Savannah', path: 'M223 197 L292 164 L359 190 L351 258 L303 287 L236 270 L205 229 Z', labelX: 200, labelY: 218 },
    { name: 'Bono East', path: 'M248 277 L315 259 L356 274 L344 328 L282 353 L222 332 L212 294 Z', labelX: 292, labelY: 300 },
    { name: 'Bono', path: 'M156 266 L216 264 L202 334 L138 348 L112 303 Z', labelX: 117, labelY: 298 },
    { name: 'Ahafo', path: 'M114 313 L155 312 L200 336 L188 388 L134 396 L92 356 Z', labelX: 100, labelY: 350 },
    { name: 'Western North', path: 'M96 367 L160 360 L198 389 L184 454 L112 461 L70 420 Z', labelX: 86, labelY: 408 },
    { name: 'Western', path: 'M168 414 L260 388 L301 430 L276 489 L211 498 L146 475 L122 432 Z', labelX: 170, labelY: 448 },
    { name: 'Ashanti', path: 'M256 308 L360 288 L392 309 L405 356 L357 401 L298 388 L258 346 Z', labelX: 300, labelY: 340 },
    { name: 'Eastern', path: 'M394 292 L462 287 L512 302 L520 368 L460 389 L405 371 L389 325 Z', labelX: 438, labelY: 334 },
    { name: 'Volta', path: 'M471 349 L538 342 L575 362 L592 420 L525 449 L470 408 Z', labelX: 555, labelY: 390 },
    { name: 'Oti', path: 'M446 248 L519 220 L571 248 L562 318 L493 334 L448 292 Z', labelX: 514, labelY: 272 },
    { name: 'Central', path: 'M286 393 L348 386 L390 406 L388 468 L338 490 L286 465 Z', labelX: 330, labelY: 440 },
    { name: 'Greater Accra', path: 'M404 394 L489 385 L544 418 L529 478 L460 494 L404 458 Z', labelX: 480, labelY: 448 }
  ];

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
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#fcd116] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#25d366] animate-pulse" /> 312 artisans online now across Ghana
            </div>
            <h1 className="font-display mt-4 text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-[58px]">
              Plumber, electrician, mechanic <span className="italic text-[#fcd116]">booked in minutes.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/75">
              ARTISAN-GH connects you to <strong className="text-white">verified Ghanaian pros</strong> with upfront GH₵ prices.
              No more “come tomorrow” stories — track your job live and pay safely with MoMo.
            </p>

            <form onSubmit={goSearch} className="mt-6 rounded-3xl bg-white p-2.5 shadow-2xl">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex flex-1 items-center gap-2 rounded-2xl bg-[#f5ead2]/60 px-4 py-3">
                  <Search size={18} className="shrink-0 text-[#0b3d2e]" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="What do you need? e.g. plumber, AC…" className="w-full bg-transparent text-sm font-semibold text-[#062a1f] outline-none placeholder:text-black/40" />
                </label>
                <label className="flex items-center gap-2 rounded-2xl bg-[#f5ead2]/60 px-4 py-3 sm:w-44">
                  <MapPin size={18} className="shrink-0 text-[#0b3d2e]" />
                  <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-transparent text-sm font-bold text-[#062a1f] outline-none">
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <button className="rounded-2xl bg-[#0b3d2e] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#147a5b]">
                  Find help
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 px-2 pb-1 pt-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/40">Popular:</span>
                {['Leaking tap', 'Ceiling fan', 'Car service', 'Deep clean'].map(t => (
                  <button type="button" key={t} onClick={() => { setQ(t); nav(`/artisans?search=${encodeURIComponent(t)}&city=${city}`); }}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-bold text-[#0b3d2e] hover:bg-[#f5ead2]">{t}</button>
                ))}
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
          <SectionHead kicker="Top rated this week" title="Meet Ghana's finest hands" sub="Every badge means Ghana Card + trade certificate checked by our team." />
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
          <div className="mt-8 overflow-hidden rounded-full border border-[#0b3d2e]/10 bg-[#f5ead2] px-4 py-4 shadow-inner shadow-white/40 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 text-sm font-extrabold text-[#062a1f]">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[#0b3d2e]/20 bg-white/60 text-[10px]">
                  <MapPin size={11} className="text-[#0b3d2e]" />
                </span>
                NOW SERVING:
              </div>
              {cities.map(c => {
                const active = selectedCity === c;
                return (
                  <button
                    key={c}
                    onClick={() => nav(`/artisans?city=${c}`)}
                    className={`rounded-full border px-4 py-2 text-base font-extrabold transition ${
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
      </section>
    </div>
  );
}
