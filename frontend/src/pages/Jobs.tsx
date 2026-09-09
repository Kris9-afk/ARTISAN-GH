import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Star, CheckCircle2, XCircle, Send, ChevronRight, PackageSearch, Navigation } from 'lucide-react';
import { fmtCedi } from '../data/market';
import { SectionHead } from '../components/ui';
import { useStore, type JobStatus } from '../store';

const FLOW: JobStatus[] = ['confirmed', 'enroute', 'inprogress', 'completed'];
const FLOW_LABEL: Record<JobStatus, string> = {
  confirmed: 'Confirmed', enroute: 'On the way', inprogress: 'Work in progress', completed: 'Completed', cancelled: 'Cancelled',
};

export default function Jobs() {
  const { bookings, artisans, updateStatus, rateBooking, chats, sendChat, showToast } = useStore();
  const [openChat, setOpenChat] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (bookings.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f5ead2] text-[#0b3d2e]"><PackageSearch size={34} /></span>
        <h1 className="font-display mt-5 text-3xl font-black text-[#062a1f]">No jobs yet — let's fix that!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black/55">Book a plumber, electrician, mechanic or cleaner in under 2 minutes. Your live job tracking will appear here.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/book" className="rounded-full bg-[#e8a90c] px-7 py-3 text-sm font-extrabold text-[#062a1f]">Book now</Link>
          <Link to="/artisans" className="rounded-full border border-black/15 px-7 py-3 text-sm font-extrabold text-[#0b3d2e]">Browse artisans</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Live tracking" title="My jobs" sub="Follow each job from confirmation to completion. Chat with your artisan or call anytime." />
      <div className="mt-7 space-y-5">
        {bookings.map(b => {
          const artisan = artisans.find(a => a.id === b.artisanId);
          const idx = FLOW.indexOf(b.status);
          const msgs = chats[b.id] || [];
          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_14px_40px_-20px_rgba(6,42,31,0.4)]">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#062a1f] px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  {artisan?.image
                    ? <img src={artisan.image} alt="" className="h-11 w-11 rounded-full border-2 border-[#e8a90c] object-cover" />
                    : <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8a90c] font-display text-sm font-black text-[#062a1f]">{b.artisanName.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>}
                  <div>
                    <p className="text-sm font-extrabold">{b.artisanName}</p>
                    <p className="tick text-xs font-semibold text-white/60">{b.id} · {b.trade} · {fmtCedi(b.total)} · {b.momoProvider}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide ${b.status === 'completed' ? 'bg-[#147a5b] text-white' : b.status === 'cancelled' ? 'bg-[#ce1126] text-white' : 'bg-[#e8a90c] text-[#062a1f]'}`}>
                  {FLOW_LABEL[b.status]}
                </span>
              </div>

              {/* progress */}
              {b.status !== 'cancelled' && (
                <div className="border-b border-black/10 bg-[#fff8ec]/60 px-5 py-4">
                  <div className="flex items-center">
                    {FLOW.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-extrabold ${i <= idx ? 'bg-[#147a5b] text-white' : 'bg-black/10 text-black/40'}`}>
                            {i < idx ? '✓' : i + 1}
                          </span>
                          <span className={`hidden text-[10px] font-extrabold sm:block ${i <= idx ? 'text-[#0b3d2e]' : 'text-black/35'}`}>{FLOW_LABEL[s]}</span>
                        </div>
                        {i < FLOW.length - 1 && <span className={`mx-1 mb-0 h-1 flex-1 rounded-full sm:mb-5 ${i < idx ? 'bg-[#147a5b]' : 'bg-black/10'}`} />}
                      </div>
                    ))}
                  </div>
                  {b.status !== 'completed' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {idx < FLOW.length - 1 && (
                        <button onClick={() => { updateStatus(b.id, FLOW[idx + 1]); showToast(`Job moved to: ${FLOW_LABEL[FLOW[idx + 1]]}`); }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#0b3d2e] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#147a5b]">
                          Simulate: {FLOW_LABEL[FLOW[idx + 1]]} <ChevronRight size={13} />
                        </button>
                      )}
                      <button onClick={() => { updateStatus(b.id, 'cancelled'); showToast('Job cancelled. Refund initiated to MoMo.'); }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#ce1126]/30 px-4 py-2 text-xs font-extrabold text-[#ce1126] hover:bg-[#ce1126]/5">
                        <XCircle size={13} /> Cancel job
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <div className="text-sm">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-black/40">Tasks</p>
                  {b.tasks.map(t => <p key={t.id} className="mt-1 flex justify-between gap-2 font-semibold text-black/70"><span>{t.qty}× {t.label}</span><span className="tick">{fmtCedi(t.price * t.qty)}</span></p>)}
                  <p className="mt-2 flex items-start gap-1.5 border-t border-black/10 pt-2 text-xs font-semibold text-black/55"><MapPin size={13} className="mt-0.5 shrink-0" /> {b.address}, {b.city} · {b.date} at {b.time}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-black/55"><Navigation size={12} /> Booked by {b.name} · {b.phone}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {artisan && (
                    <div className="flex gap-2">
                      <a href={`tel:${artisan.phone.replace(/\s/g, '')}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0b3d2e] py-2.5 text-xs font-extrabold text-white hover:bg-[#147a5b]"><Phone size={14} /> Call {artisan.name.split(' ')[0]}</a>
                      <button onClick={() => setOpenChat(openChat === b.id ? null : b.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#e8a90c] py-2.5 text-xs font-extrabold text-[#062a1f] hover:bg-[#fcd116]"><MessageCircle size={14} /> Chat{msgs.length ? ` (${msgs.length})` : ''}</button>
                    </div>
                  )}
                  {openChat === b.id && (
                    <div className="overflow-hidden rounded-2xl border border-black/10">
                      <div className="max-h-52 space-y-2 overflow-y-auto bg-[#f5ead2]/50 p-3">
                        {msgs.length === 0 && <p className="text-center text-xs font-semibold text-black/40">Say hello — {b.artisanName.split(' ')[0]} typically replies in minutes.</p>}
                        {msgs.map((m, i) => (
                          <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs font-medium ${m.from === 'you' ? 'ml-auto bg-[#0b3d2e] text-white' : 'bg-white text-black/75 shadow-sm'}`}>
                            {m.text}
                            <span className={`tick mt-0.5 block text-right text-[10px] ${m.from === 'you' ? 'text-white/60' : 'text-black/35'}`}>{m.at}</span>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={e => { e.preventDefault(); if (draft.trim()) { sendChat(b.id, draft.trim(), b.artisanName.split(' ')[0]); setDraft(''); } }}
                        className="flex gap-2 bg-white p-2">
                        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message…" className="w-full rounded-xl bg-black/5 px-3 py-2 text-xs font-semibold outline-none" />
                        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0b3d2e] text-white"><Send size={14} /></button>
                      </form>
                    </div>
                  )}
                  {b.status === 'completed' && (
                    <div className="rounded-2xl bg-[#147a5b]/10 p-3">
                      <p className="text-xs font-extrabold text-[#0b3d2e]">How was the job?</p>
                      <div className="mt-1.5 flex gap-1">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button key={r} onClick={() => { rateBooking(b.id, r); showToast(`Medaase! You rated ${r} star${r > 1 ? 's' : ''}.`); }} aria-label={`${r} stars`}>
                            <Star size={22} className={(b.rating || 0) >= r ? 'fill-[#e8a90c] text-[#e8a90c]' : 'text-black/25 hover:text-[#e8a90c]'} />
                          </button>
                        ))}
                      </div>
                      {b.rating ? <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#147a5b]"><CheckCircle2 size={12} /> Rated {b.rating}/5 — medaase!</p> : null}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
