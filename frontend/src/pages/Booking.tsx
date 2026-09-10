import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Siren, MapPin, CalendarDays, Smartphone, ShieldCheck, Minus, Plus, BadgeCheck, PartyPopper } from 'lucide-react';
import { fmtCedi } from '../data/market';
import { TradeIcon, Stars } from '../components/ui';
import { useStore, type Booking as Bk, type BookedTask } from '../store';

const TIMES = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
const MOMOS = [
  { id: 'MTN MoMo', color: '#ffcc08', note: 'Pay to 059 000 0000' },
  { id: 'Telecel Cash', color: '#e30613', note: 'Pay to 050 000 0000' },
  { id: 'AirtelTigo', color: '#0e5aa7', note: 'Pay to 057 000 0000' },
];

const plusDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export default function Booking() {
  const [params] = useSearchParams();
  const { addBooking, artisans, services, cities, showToast, userName, setUserName } = useStore();

  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState(params.get('trade') || 'plumbing');
  const [artisanId, setArtisanId] = useState(params.get('artisan') || 'any');
  const [emergency, setEmergency] = useState(params.get('emergency') === '1');
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [date, setDate] = useState(plusDays(1));
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Accra');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState('');
  const [momo, setMomo] = useState('MTN MoMo');
  const [momoNum, setMomoNum] = useState('');
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState<Bk | null>(null);
  const [paying, setPaying] = useState(false);

  const pros = useMemo(() => artisans.filter(a => a.trade === trade), [artisans, trade]);
  const svc = services.find(s => s.id === trade);
  if (!svc) return null;
  const artisan = artisanId === 'any' ? null : artisans.find(a => a.id === artisanId) || null;

  const tasks: BookedTask[] = svc.tasks.filter(t => picked[t.id]).map(t => ({ id: t.id, label: t.label, price: t.price, qty: picked[t.id] }));
  const subtotal = tasks.reduce((s, t) => s + t.price * t.qty, 0);
  const emergencyFee = emergency ? Math.round(subtotal * 0.2) : 0;
  const transport = subtotal > 0 ? 30 : 0;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + emergencyFee + transport + serviceFee;

  const toggleQty = (id: string, d: number) => {
    setPicked(p => {
      const v = Math.max(0, Math.min(9, (p[id] || 0) + d));
      const n = { ...p };
      if (v === 0) delete n[id]; else n[id] = v;
      return n;
    });
  };

  const validStep = () => {
    if (step === 1) return tasks.length > 0;
    if (step === 2) return date && time;
    if (step === 3) return address.trim().length > 3 && cities.includes(city);
    if (step === 4) return name.trim().length > 1 && phone.replace(/\D/g, '').length >= 9 && momoNum.replace(/\D/g, '').length >= 9 && consent;
    return true;
  };

  const confirm = () => {
    setPaying(true);
    setTimeout(() => {
      const b: Bk = {
        id: 'AGH-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        artisanId: artisan?.id || 'match',
        artisanName: artisan?.name || `Best ${svc.name} pro (auto-match)`,
        trade: svc.name, tasks, subtotal, emergencyFee, serviceFee, transport, total,
        date, time, address, city, landmark, notes, name, phone,
        momoProvider: momo, momoNumber: momoNum,
        status: 'confirmed', createdAt: new Date().toISOString(), emergency,
      };
      addBooking(b);
      setUserName(name);
      setPaying(false);
      setDone(b);
      showToast('Booking confirmed — artisan notified!');
    }, 1800);
  };

  const steps = ['Trade & pro', 'Tasks', 'Schedule', 'Address', 'Payment'];

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-[28px] border border-black/10 bg-white text-center shadow-2xl">
          <div className="kente-thin h-2.5" />
          <div className="p-8">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#147a5b] text-white"><PartyPopper size={28} /></span>
            <h1 className="font-display mt-4 text-3xl font-black text-[#062a1f]">Medase, {done.name.split(' ')[0]}! Job booked.</h1>
            <p className="mt-2 text-sm font-semibold text-black/55">Booking <span className="tick font-extrabold text-[#0b3d2e]">{done.id}</span> · {done.trade} · {done.date} at {done.time}</p>
            <div className="mx-auto mt-5 max-w-md rounded-2xl bg-[#f5ead2]/70 p-4 text-left text-sm">
              <p className="font-extrabold text-[#062a1f]">{done.artisanName}</p>
              {done.tasks.map(t => <p key={t.id} className="mt-1 flex justify-between gap-2 text-black/65"><span>{t.qty}× {t.label}</span><span className="tick font-bold">{fmtCedi(t.price * t.qty)}</span></p>)}
              <div className="mt-2 border-t border-black/10 pt-2">
                <p className="flex justify-between font-extrabold text-[#062a1f]"><span>Total paid · {done.momoProvider}</span><span className="tick">{fmtCedi(done.total)}</span></p>
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-black/55"><MapPin size={13} className="mt-0.5 shrink-0" /> {done.address}, {done.city}{done.landmark ? ` (${done.landmark})` : ''}</p>
            </div>
            <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-black/50">Receipt sent by SMS to {done.phone}. Your artisan will call within ~15 mins to confirm. Track progress live in My Jobs.</p>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <Link to="/jobs" className="rounded-full bg-[#0b3d2e] px-7 py-3 text-sm font-extrabold text-white hover:bg-[#147a5b]">Track my job live</Link>
              <Link to="/artisans" className="rounded-full border border-black/15 px-7 py-3 text-sm font-extrabold text-[#0b3d2e]">Book another</Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link to="/artisans" className="inline-flex items-center gap-1.5 text-sm font-bold text-black/55 hover:text-[#0b3d2e]"><ChevronLeft size={16} /> Back</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black text-[#062a1f] sm:text-4xl">Book your artisan</h1>
          <p className="text-sm font-semibold text-black/50">Upfront price · MoMo payment · 7-day guarantee</p>
        </div>
        <button onClick={() => setEmergency(!emergency)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition ${emergency ? 'bg-[#ce1126] text-white' : 'border-2 border-[#ce1126]/40 text-[#ce1126] hover:bg-[#ce1126]/5'}`}>
          <Siren size={16} /> {emergency ? 'Emergency ON (+20%)' : 'Mark as emergency'}
        </button>
      </div>

      {/* stepper */}
      <div className="mt-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {steps.map((s, i) => (
          <div key={s} className="flex shrink-0 items-center gap-1.5">
            <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-extrabold ${i < step ? 'bg-[#147a5b] text-white' : i === step ? 'bg-[#e8a90c] text-[#062a1f]' : 'bg-black/10 text-black/45'}`}>
              {i < step ? <Check size={15} /> : i + 1}
            </span>
            <span className={`text-xs font-extrabold ${i === step ? 'text-[#062a1f]' : 'text-black/40'}`}>{s}</span>
            {i < steps.length - 1 && <span className="mx-1.5 h-px w-6 bg-black/15 sm:w-10" />}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 rounded-[26px] border border-black/10 bg-white p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-black text-[#062a1f]">1 · Which trade do you need?</h2>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {services.map(s => (
                    <button key={s.id} onClick={() => { setTrade(s.id); setPicked({}); setArtisanId('any'); }}
                      className={`rounded-2xl border-2 p-3 text-center transition ${trade === s.id ? 'border-[#e8a90c] bg-[#fdf0c9]' : 'border-black/10 hover:border-black/25'}`}>
                      <span className={`mx-auto grid h-10 w-10 place-items-center rounded-xl ${trade === s.id ? 'bg-[#e8a90c] text-[#062a1f]' : 'bg-[#0b3d2e] text-[#fcd116]'}`}><TradeIcon icon={s.icon} size={19} /></span>
                      <span className="mt-1.5 block text-[11px] font-extrabold text-[#062a1f]">{s.name}</span>
                    </button>
                  ))}
                </div>
                <h2 className="font-display mt-6 text-xl font-black text-[#062a1f]">Pick your pro <span className="text-sm font-sans font-semibold text-black/45">(or let us auto-match)</span></h2>
                <div className="mt-3 space-y-2">
                  <button onClick={() => setArtisanId('any')} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${artisanId === 'any' ? 'border-[#147a5b] bg-[#147a5b]/5' : 'border-black/10'}`}>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0b3d2e] font-display text-sm font-black text-[#fcd116]">⚡</span>
                    <span className="flex-1"><span className="block text-sm font-extrabold text-[#062a1f]">Auto-match me — fastest</span><span className="block text-xs text-black/50">Nearest verified {svc.name.toLowerCase()} pro accepts in ~5 mins</span></span>
                    {artisanId === 'any' && <Check size={18} className="text-[#147a5b]" />}
                  </button>
                  {pros.map(p => (
                    <button key={p.id} onClick={() => setArtisanId(p.id)} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${artisanId === p.id ? 'border-[#e8a90c] bg-[#fdf0c9]/60' : 'border-black/10'}`}>
                      {p.image
                        ? <img src={p.image} alt={p.name} className="h-11 w-11 rounded-full object-cover" />
                        : <span className="grid h-11 w-11 place-items-center rounded-full font-display text-sm font-black text-white" style={{ background: p.color }}>{p.initials}</span>}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#062a1f]">{p.name} {p.verified && <BadgeCheck size={14} className="text-[#147a5b]" />}</span>
                        <span className="flex flex-wrap items-center gap-x-2 text-xs text-black/50"><Stars value={p.rating} size={11} /> {p.rating} ({p.reviewsCount}) · {p.city} · from {fmtCedi(p.priceFrom)}</span>
                      </span>
                      {artisanId === p.id && <Check size={18} className="shrink-0 text-[#b97f06]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-black text-[#062a1f]">2 · What should {artisan ? artisan.name.split(' ')[0] : 'your pro'} do?</h2>
                <p className="text-sm text-black/50">Tap + to add tasks. Prices are fixed labour rates.</p>
                <div className="mt-4 space-y-2">
                  {svc.tasks.map(t => {
                    const qn = picked[t.id] || 0;
                    return (
                      <div key={t.id} className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 transition ${qn ? 'border-[#147a5b] bg-[#147a5b]/5' : 'border-black/10'}`}>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold text-[#062a1f]">{t.label}</p>
                          <p className="tick text-xs font-bold text-black/50">{fmtCedi(t.price)} {t.unit}</p>
                        </div>
                        {qn === 0 ? (
                          <button onClick={() => toggleQty(t.id, 1)} className="rounded-full bg-[#0b3d2e] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#147a5b]">+ Add</button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleQty(t.id, -1)} className="grid h-8 w-8 place-items-center rounded-full border border-black/15 hover:bg-black/5" aria-label="minus"><Minus size={15} /></button>
                            <span className="tick w-6 text-center text-sm font-extrabold">{qn}</span>
                            <button onClick={() => toggleQty(t.id, 1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#0b3d2e] text-white" aria-label="plus"><Plus size={15} /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-black text-[#062a1f]">3 · Pick date & time</h2>
                <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-black/55"><CalendarDays size={15} /> Date</p>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {[0, 1, 2, 3, 4, 5, 6].map(n => {
                    const d = plusDays(n);
                    const dt = new Date(d + 'T00:00');
                    const lbl = n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-GH', { weekday: 'short' });
                    return (
                      <button key={d} onClick={() => setDate(d)} className={`rounded-2xl border-2 px-2 py-3 text-center transition ${date === d ? 'border-[#e8a90c] bg-[#fdf0c9]' : 'border-black/10'}`}>
                        <span className="block text-[11px] font-extrabold uppercase text-black/45">{lbl}</span>
                        <span className="tick block text-sm font-extrabold text-[#062a1f]">{dt.toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm font-bold text-black/55">Time slot</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setTime(t)} className={`tick rounded-2xl border-2 py-3 text-sm font-extrabold transition ${time === t ? 'border-[#0b3d2e] bg-[#0b3d2e] text-white' : 'border-black/10 text-black/60'}`}>{t}</button>
                  ))}
                </div>
                {emergency && <p className="mt-3 rounded-2xl bg-[#ce1126]/10 p-3 text-xs font-bold text-[#ce1126]">Emergency: we dispatch immediately regardless of slot — slot is your backup window.</p>}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-black text-[#062a1f]">4 · Where is the job?</h2>
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">City</span>
                    <select value={city} onChange={e => setCity(e.target.value)} className="mt-1.5 w-full rounded-2xl border-2 border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e8a90c]">
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Street address / house number</span>
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. House 12, Jungle Avenue, East Legon" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Landmark <span className="font-semibold normal-case text-black/35">(optional)</span></span>
                    <input value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="e.g. Opposite Palace Mall, blue gate" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Job notes <span className="font-semibold normal-case text-black/35">(optional)</span></span>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Describe the problem… e.g. kitchen tap drips non-stop, 2 bathrooms affected" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-medium outline-none focus:border-[#e8a90c]" />
                  </label>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-black text-[#062a1f]">5 · Your details & MoMo payment</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Full name</span>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ama Serwaa" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Phone (for artisan to call)</span>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 024 000 0000" inputMode="tel" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" />
                  </label>
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-black/45"><Smartphone size={14} /> Pay with mobile money</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {MOMOS.map(m => (
                    <button key={m.id} onClick={() => setMomo(m.id)} className={`rounded-2xl border-2 p-3.5 text-left transition ${momo === m.id ? 'border-[#e8a90c] bg-[#fdf0c9]' : 'border-black/10'}`}>
                      <span className="inline-block h-3 w-3 rounded-full" style={{ background: m.color }} />
                      <span className="block text-sm font-extrabold text-[#062a1f]">{m.id}</span>
                      <span className="block text-[11px] font-semibold text-black/45">{m.note}</span>
                    </button>
                  ))}
                </div>
                <label className="mt-3 block">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">MoMo number to charge</span>
                  <input value={momoNum} onChange={e => setMomoNum(e.target.value)} placeholder="e.g. 024 000 0000" inputMode="tel" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" />
                </label>
                <p className="mt-3 flex items-start gap-2 rounded-2xl bg-[#147a5b]/10 p-3 text-xs font-semibold leading-relaxed text-[#0b3d2e]">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" /> You approve the MoMo prompt on your phone. Money is held safely and released to the artisan only after you confirm the job is done. 7-day re-fix guarantee included.
                </p>
                <label className="mt-3 flex items-start gap-2 text-xs font-semibold leading-relaxed text-black/60">
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#147a5b]" />
                  <span>I agree to the <Link to="/privacy" className="font-extrabold text-[#147a5b] underline">Privacy Policy</Link>, <Link to="/terms" className="font-extrabold text-[#147a5b] underline">Terms</Link>, and <Link to="/refunds" className="font-extrabold text-[#147a5b] underline">Refund Policy</Link>.</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
            <button disabled={step === 0} onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-5 py-2.5 text-sm font-extrabold text-[#0b3d2e] disabled:opacity-30"><ChevronLeft size={16} /> Back</button>
            {step < 4 ? (
              <button disabled={!validStep()} onClick={() => { if (validStep()) setStep(step + 1); }} className="inline-flex items-center gap-1.5 rounded-full bg-[#0b3d2e] px-6 py-2.5 text-sm font-extrabold text-white hover:bg-[#147a5b] disabled:opacity-30">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button disabled={!validStep() || paying} onClick={confirm} className="inline-flex items-center gap-2 rounded-full bg-[#e8a90c] px-7 py-3 text-sm font-extrabold text-[#062a1f] hover:bg-[#fcd116] disabled:opacity-40">
                {paying ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#062a1f]/30 border-t-[#062a1f]" /> Sending MoMo prompt…</> : <>Pay {fmtCedi(total)} & confirm</>}
              </button>
            )}
          </div>
          {step === 1 && tasks.length === 0 && <p className="mt-2 text-right text-xs font-bold text-[#ce1126]">Add at least one task to continue</p>}
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[26px] bg-[#062a1f] text-white shadow-xl">
            <div className="kente-thin h-1.5" />
            <div className="p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Order summary</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-extrabold">{svc.name} {artisan && <span className="font-semibold text-white/60">· {artisan.name}</span>}</p>
              <p className="text-xs font-semibold text-white/55">{new Date(date + 'T00:00').toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long' })} · {time} · {city}</p>
              <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-sm">
                {tasks.length === 0 && <p className="text-xs text-white/45">No tasks yet — pick some in step 2.</p>}
                {tasks.map(t => (
                  <p key={t.id} className="flex justify-between gap-2"><span className="text-white/75">{t.qty}× {t.label}</span><span className="tick font-bold">{fmtCedi(t.price * t.qty)}</span></p>
                ))}
                {tasks.length > 0 && (
                  <>
                    <p className="flex justify-between text-white/60"><span>Transport</span><span className="tick">{fmtCedi(transport)}</span></p>
                    <p className="flex justify-between text-white/60"><span>Service fee (5%)</span><span className="tick">{fmtCedi(serviceFee)}</span></p>
                    {emergency && <p className="flex justify-between text-[#ff9d9d]"><span>Emergency priority (20%)</span><span className="tick">{fmtCedi(emergencyFee)}</span></p>}
                    <p className="flex justify-between border-t border-white/10 pt-2 text-base font-extrabold"><span>Total</span><span className="tick text-[#fcd116]">{fmtCedi(total)}</span></p>
                  </>
                )}
              </div>
              {(artisan?.verified || artisanId === 'any') && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-white/60"><BadgeCheck size={13} className="text-[#25d366]" /> Verified pro · ID & certificates checked</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

