import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, MapPin } from 'lucide-react';
import { SectionHead, TradeIcon } from '../components/ui';
import { useStore } from '../store';

export default function Services() {
  const loc = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const { services, artisans } = useStore();

  useEffect(() => {
    const id = loc.hash.replace('#', '');
    if (id) {
      const timer = window.setTimeout(() => {
        setOpen(id);
        document.getElementById(`svc-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [loc.hash]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Find skilled local professionals" title="Browse services" sub="Choose a trade to see the kinds of work local artisans can help with, then contact a profile directly to discuss your job." />
      <div className="mt-8 space-y-4">
        {services.map((s, i) => {
          const pros = artisans.filter(a => a.trade === s.id);
          const isOpen = open === s.id;
          return (
            <motion.div key={s.id} id={`svc-${s.id}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.03, 0.2) }}
              className={`scroll-mt-28 overflow-hidden rounded-3xl border bg-white transition ${isOpen ? 'border-[#e8a90c] shadow-[0_20px_50px_-20px_rgba(185,127,6,0.5)]' : 'border-black/10'}`}>
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${isOpen ? 'bg-[#e8a90c] text-[#062a1f]' : 'bg-[#0b3d2e] text-[#fcd116]'}`}>
                  <TradeIcon icon={s.icon} size={26} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-black text-[#062a1f]">{s.name}</span>
                    {s.popular && <span className="rounded-full bg-[#ce1126] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">Popular</span>}
                  </span>
                  <span className="block truncate text-sm font-medium text-black/50">{s.twi} · {s.tagline}</span>
                </span>
                <ChevronRight size={20} className={`shrink-0 text-black/40 transition ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-black/10 bg-[#fff8ec]/60 p-4 sm:p-5">
                  {s.image && (
                    <div className="mb-4 overflow-hidden rounded-2xl">
                      <img src={s.image} alt={s.name} className="h-44 w-full object-cover sm:h-56" loading="lazy" />
                    </div>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {s.tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[#062a1f]">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#147a5b]/15 text-[#147a5b]"><Check size={13} /></span>
                        {t.label} <span className="font-medium text-black/40">· {t.unit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-black/50">
                      <MapPin size={13} /> {pros.length ? `${pros.length} artisan profiles listed: ${pros.map(p => `${p.name} (${p.city})`).join(' · ')}` : 'No artisan profiles listed for this trade yet'}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/artisans?trade=${s.id}`} className="rounded-full bg-[#0b3d2e] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#147a5b]">See artisans</Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
