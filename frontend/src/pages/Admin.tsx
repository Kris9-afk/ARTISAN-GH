import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, CheckCircle2, LockKeyhole, Plus, ShieldCheck, UserPlus } from 'lucide-react';
import { type Artisan, type TradeId } from '../data/market';
import { fmtCedi } from '../data/market';
import { useStore, type JobStatus } from '../store';
import { api } from '../api';

const ACTIVE_STATUSES: JobStatus[] = ['confirmed', 'enroute', 'inprogress'];
const STATUS_LABEL: Record<JobStatus, string> = {
  confirmed: 'Confirmed', enroute: 'On the way', inprogress: 'In progress', completed: 'Completed', cancelled: 'Cancelled',
};

const inputClass = 'mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#e8a90c]';

export default function Admin() {
  const { artisans, services, cities, addArtisan, removeArtisan, bookings, updateStatus, showToast } = useStore();
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('agh-admin') === '1');
  const [code, setCode] = useState('');
  const [artisanToDelete, setArtisanToDelete] = useState<Artisan | null>(null);
  const [form, setForm] = useState({
    name: '', trade: 'plumbing' as TradeId, city: 'Accra', phone: '', priceFrom: '100', yearsExp: '3',
    skills: '', bio: '', availableNow: true,
  });

  useEffect(() => {
    if (!artisanToDelete) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setArtisanToDelete(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [artisanToDelete]);

  const ongoing = useMemo(() => bookings.filter(b => ACTIVE_STATUSES.includes(b.status)), [bookings]);

  const signIn = (event: FormEvent) => {
    event.preventDefault();
    const lowerCode = code.trim().toLowerCase();
    api.loginAdmin(lowerCode).then(() => {
      sessionStorage.setItem('agh-admin', '1');
      setAuthenticated(true);
      setCode('');
    }).catch(error => {
      const invalidCode = error instanceof Error && error.message.includes('401');
      showToast(invalidCode ? 'Invalid admin access code' : 'Admin service unavailable. Check the backend and database connection.');
    });
  };

  const add = (event: FormEvent) => {
    event.preventDefault();
    const service = services.find(item => item.id === form.trade);
    if (!service || !form.name.trim() || !form.phone.trim()) {
      showToast('Name, trade and phone are required');
      return;
    }
    const id = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;
    const artisan: Artisan = {
      id, name: form.name.trim(), trade: form.trade, tradeLabel: service.name, city: form.city,
      areas: [form.city], rating: 5, reviewsCount: 0, jobsDone: 0,
      yearsExp: Math.max(0, Number(form.yearsExp) || 0), priceFrom: Math.max(0, Number(form.priceFrom) || service.baseFrom),
      verified: false, availableNow: form.availableNow, languages: ['English'], phone: form.phone.trim(),
      bio: form.bio.trim() || `${form.name.trim()} is available for ${service.name.toLowerCase()} jobs in ${form.city}.`,
      skills: form.skills.split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 6),
      color: '#0b3d2e', initials: form.name.trim().split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase(),
      responseMins: 30,
    };
    addArtisan(artisan);
    setForm(current => ({ ...current, name: '', phone: '', skills: '', bio: '' }));
    showToast(`${artisan.name} added to the artisan directory`);
  };

  const confirmDelete = () => {
    if (!artisanToDelete) return;
    removeArtisan(artisanToDelete.id);
    showToast(`${artisanToDelete.name} removed`);
    setArtisanToDelete(null);
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-xl">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#062a1f] text-[#e8a90c]"><LockKeyhole size={25} /></span>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#147a5b]">Restricted workspace</p>
          <h1 className="font-display mt-2 text-3xl font-black text-[#062a1f]">Admin console</h1>
          <p className="mt-2 text-sm leading-relaxed text-black/55">Manage artisan onboarding and keep an eye on jobs currently in the field.</p>
          <form onSubmit={signIn} className="mt-6">
            <label className="text-xs font-extrabold uppercase tracking-widest text-black/45">Access code
              <input type="password" value={code} onChange={event => setCode(event.target.value)} className={inputClass} autoFocus />
            </label>
            <button className="mt-4 w-full rounded-xl bg-[#0b3d2e] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#147a5b]">Enter admin console</button>
          </form>
          <Link to="/" className="mt-4 block text-center text-xs font-bold text-black/45 hover:text-[#0b3d2e]">Return to marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {artisanToDelete && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-[#062a1f]/55 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setArtisanToDelete(null); }}>
          <div className="w-full max-w-sm rounded-[24px] border border-black/10 bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-artisan-title">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fee2e2] text-[#b91c1c]">
              <span className="text-xl font-black">!</span>
            </div>
            <h3 id="delete-artisan-title" className="mt-4 font-display text-2xl font-black text-[#062a1f]">Delete artisan?</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Are you sure you want to remove <span className="font-extrabold text-[#062a1f]">{artisanToDelete.name}</span> from the directory?
              This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setArtisanToDelete(null)} className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-extrabold text-[#062a1f] hover:bg-[#f3f5f4]">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="flex-1 rounded-xl bg-[#ce1126] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#a20d1c]">
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#147a5b]">Operations</p>
          <h1 className="font-display mt-2 text-4xl font-black text-[#062a1f]">Admin console</h1>
          <p className="mt-1 text-sm font-semibold text-black/50">Onboard trusted pros and coordinate active jobs.</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem('agh-admin'); setAuthenticated(false); }} className="rounded-full border border-black/15 px-4 py-2 text-xs font-extrabold text-[#0b3d2e]">Sign out</button>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[380px_1fr]">
        <section className="rounded-[26px] border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><UserPlus size={18} className="text-[#147a5b]" /><h2 className="font-display text-xl font-black text-[#062a1f]">Add an artisan</h2></div>
          <form onSubmit={add} className="mt-3 space-y-2.5">
            <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={inputClass} placeholder="e.g. Ama Boateng" /></label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Trade<select value={form.trade} onChange={event => setForm({ ...form, trade: event.target.value as TradeId })} className={inputClass}>{services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">City<select value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} className={inputClass}>{cities.map(city => <option key={city}>{city}</option>)}</select></label>
            </div>
            <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Phone<input required value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} className={inputClass} placeholder="024 000 0000" /></label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Starting price<input type="number" min="0" value={form.priceFrom} onChange={event => setForm({ ...form, priceFrom: event.target.value })} className={inputClass} /></label>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Years exp.<input type="number" min="0" value={form.yearsExp} onChange={event => setForm({ ...form, yearsExp: event.target.value })} className={inputClass} /></label>
            </div>
            <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Skills<input value={form.skills} onChange={event => setForm({ ...form, skills: event.target.value })} className={inputClass} placeholder="Pipe repairs, pumps, tiling" /></label>
            <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Short bio<textarea value={form.bio} onChange={event => setForm({ ...form, bio: event.target.value })} className={`${inputClass} min-h-20 resize-y`} /></label>
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <label className="flex items-center gap-2 text-xs font-bold text-black/60"><input type="checkbox" checked={form.availableNow} onChange={event => setForm({ ...form, availableNow: event.target.checked })} /> Available for jobs now</label>
            </div>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a90c] px-4 py-3 text-sm font-extrabold text-[#062a1f] hover:bg-[#fcd116]"><Plus size={16} /> Add artisan</button>
          </form>
        </section>

        <section className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Ongoing jobs', value: ongoing.length, icon: BriefcaseBusiness },
              { label: 'Total jobs', value: bookings.length, icon: CheckCircle2 },
              { label: 'Artisan directory', value: artisans.length, icon: ShieldCheck },
            ].map(item => <div key={item.label} className="rounded-2xl border border-black/10 bg-white p-4"><item.icon size={18} className="text-[#147a5b]" /><p className="tick mt-2 text-2xl font-black text-[#062a1f]">{item.value}</p><p className="text-xs font-bold text-black/45">{item.label}</p></div>)}
          </div>
          <div className="rounded-[26px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-black text-[#062a1f]">All artisans</h2>
                <p className="mt-1 text-xs font-semibold text-black/45">Every artisan currently available in the marketplace directory.</p>
              </div>
              <span className="rounded-full bg-[#f5ead2] px-3 py-1 text-xs font-extrabold text-[#6b5510]">{artisans.length} total</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {artisans.map(artisan => (
                <div key={artisan.id} className="flex items-center gap-3 rounded-2xl border border-black/10 p-3">
                  {artisan.image
                    ? <img src={artisan.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#062a1f] font-display text-sm font-black text-[#e8a90c]">{artisan.initials}</span>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-[#062a1f]">{artisan.name}</p>
                    <p className="truncate text-xs font-semibold text-black/50">{artisan.tradeLabel} · {artisan.city}</p>
                    <p className="mt-1 text-[11px] font-bold text-black/40">{artisan.jobsDone} jobs · from {fmtCedi(artisan.priceFrom)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${artisan.availableNow ? 'bg-[#147a5b]' : 'bg-black/20'}`} title={artisan.availableNow ? 'Available' : 'Busy'} />
                    <button
                      type="button"
                      onClick={() => setArtisanToDelete(artisan)}
                      className="rounded-full border border-[#ce1126]/20 bg-[#ce1126]/5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#ce1126] transition hover:bg-[#ce1126] hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[26px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-black text-[#062a1f]">Ongoing jobs</h2><p className="mt-1 text-xs font-semibold text-black/45">Update status as your operations team receives field updates.</p></div><span className="rounded-full bg-[#147a5b]/10 px-3 py-1 text-xs font-extrabold text-[#147a5b]">{ongoing.length} active</span></div>
            {ongoing.length === 0 ? <p className="mt-6 rounded-2xl bg-[#f5ead2]/50 p-5 text-center text-sm font-semibold text-black/50">No active jobs right now.</p> : <div className="mt-4 space-y-3">{ongoing.map(job => <div key={job.id} className="rounded-2xl border border-black/10 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-extrabold text-[#062a1f]">{job.id} · {job.artisanName}</p><p className="mt-1 text-xs font-semibold text-black/50">{job.trade} · {job.city} · {job.name} · {fmtCedi(job.total)}</p></div><select value={job.status} onChange={event => { updateStatus(job.id, event.target.value as JobStatus); showToast(`${job.id} moved to ${STATUS_LABEL[event.target.value as JobStatus]}`); }} className="rounded-xl bg-[#f5ead2] px-3 py-2 text-xs font-extrabold text-[#062a1f]">{ACTIVE_STATUSES.concat(['completed', 'cancelled']).map(status => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}</select></div><p className="mt-3 text-xs font-semibold text-black/55">{job.address} · {job.date} at {job.time}</p></div>)}</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
