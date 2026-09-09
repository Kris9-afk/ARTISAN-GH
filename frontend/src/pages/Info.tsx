import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BadgeCheck, Smartphone, ShieldCheck, ChevronDown, Hammer, GraduationCap, Banknote, Users, LifeBuoy, AlertTriangle, FileCheck } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { useStore } from '../store';

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHead kicker="No wahala, just fixed" title="How Y3FIX-GH works" sub="Built for Ghanaian realities: traffic, dumsor, MoMo — and the need for someone you can trust in your home." />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          { t: 'For customers', icon: <Search size={22} />, color: 'bg-[#0b3d2e]', items: ['Search 12 trades with fixed GH₵ price lists — no haggling.', 'Pick a verified pro or let us auto-match the nearest one.', 'Pay securely with MTN MoMo, Telecel Cash or AT Money.', 'Track the job live, chat, then rate. 7-day re-fix guarantee.'] },
          { t: 'For artisans', icon: <Hammer size={22} />, color: 'bg-[#e8a90c]', items: ['Free to join — Ghana Card + trade proof verification.', 'Get matched jobs near you; accept in one tap.', 'Weekly payouts straight to your MoMo, zero wahala.', 'Build your star rating and unlock higher-value jobs.'] },
          { t: 'Our safety promise', icon: <ShieldCheck size={22} />, color: 'bg-[#ce1126]', items: ['Every pro is ID-checked and trade-tested in person.', 'Jobs are insured up to GH₵5,000 against damage.', 'Money is held in escrow until you confirm completion.', '24/7 support line: 030 274 0000, plus in-app SOS.'] },
        ].map((c, i) => (
          <motion.div key={c.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="rounded-[26px] border border-black/10 bg-white p-6">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${c.color}`} style={c.color === 'bg-[#e8a90c]' ? { background: '#e8a90c', color: '#062a1f' } : undefined}>{c.icon}</span>
            <h3 className="font-display mt-3 text-xl font-black text-[#062a1f]">{c.t}</h3>
            <ul className="mt-3 space-y-2.5">
              {c.items.map(x => <li key={x} className="flex items-start gap-2 text-sm leading-relaxed text-black/65"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#147a5b]/15 text-[11px] font-black text-[#147a5b]">✓</span>{x}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-[26px] bg-[#062a1f] p-8 text-center text-white">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Ready when you are</p>
        <h3 className="font-display mx-auto mt-2 max-w-xl text-2xl font-black sm:text-3xl">Your trusted handyman is one tap away. Yɛbɛfix am!</h3>
        <div className="mt-5 flex justify-center gap-2">
          <Link to="/book" className="rounded-full bg-[#e8a90c] px-7 py-3 text-sm font-extrabold text-[#062a1f]">Book a job</Link>
          <Link to="/join" className="rounded-full border border-white/25 px-7 py-3 text-sm font-bold">Join as artisan</Link>
        </div>
      </div>
    </div>
  );
}

export function Join() {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', trade: ['Plumbing'], city: 'Accra', exp: '', skills: [] as string[] });
  const [sent, setSent] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const skillOptions = ['Leak repairs', 'Installations', 'Maintenance', 'Diagnostics', 'Wiring', 'Tiling', 'Painting', 'Carpentry', 'Emergency call-outs', 'Preventive servicing'];
  const toggleSkill = (skill: string) => setForm(f => ({
    ...f,
    skills: f.skills.includes(skill) ? f.skills.filter(item => item !== skill) : [...f.skills, skill],
  }));
  const toggleTrade = (trade: string) => setForm(f => ({
    ...f,
    trade: f.trade.includes(trade) ? f.trade.filter(item => item !== trade) : [...f.trade, trade],
  }));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHead kicker="Earn with your hands" title="Join 2,400+ pros earning on Y3FIX-GH" sub="Free onboarding in Accra, Kumasi, Takoradi & Tamale. Keep 90% of every job — paid weekly to your MoMo." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: <Banknote size={20} />, t: 'GH₵3,800 avg / month', d: 'Top pros clear more with steady matched jobs.' },
              { icon: <Users size={20} />, t: 'Free customers', d: 'No flyers, no chasing. Jobs come to your phone.' },
              { icon: <GraduationCap size={20} />, t: 'Free upskilling', d: 'Monthly NVTI-aligned training & certification.' },
              { icon: <Smartphone size={20} />, t: 'Weekly MoMo payouts', d: 'Every Friday, no stories, full statement.' },
            ].map(b => (
              <div key={b.t} className="rounded-2xl border border-black/10 bg-white p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0b3d2e] text-[#fcd116]">{b.icon}</span>
                <p className="mt-2 text-sm font-extrabold text-[#062a1f]">{b.t}</p>
                <p className="text-xs leading-relaxed text-black/55">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[26px] border border-black/10 bg-white p-6 sm:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#147a5b] text-2xl text-white">✓</span>
              <h3 className="font-display mt-4 text-2xl font-black text-[#062a1f]">Application received, {form.name.split(' ')[0] || 'champion'}!</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-black/55">Our onboarding team will call <strong>{form.phone}</strong> within 2 working days to schedule your free verification & trade test in {form.city}.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm font-bold text-[#147a5b] underline">Submit another application</button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); showToast('Application sent — we will call you soon!'); }}>
              <h3 className="font-display text-xl font-black text-[#062a1f]">Apply in 60 seconds</h3>
              <div className="mt-4 space-y-3">
                <label className="block"><span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Full name</span>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Kofi Antwi" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" /></label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block"><span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Phone / WhatsApp</span>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="024 000 0000" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" /></label>
                  <label className="block"><span className="text-xs font-extrabold uppercase tracking-widest text-black/45">City</span>
                    <select value={form.city} onChange={e => set('city', e.target.value)} className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-bold outline-none">
                      {['Accra','Kumasi','Takoradi','Tamale','Cape Coast','Ho','Sunyani','Tema'].map(c => <option key={c}>{c}</option>)}
                    </select></label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                     <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Trades</span>
                     <button type="button" onClick={() => setTradeOpen(open => !open)} className="mt-1.5 flex w-full items-center justify-between rounded-2xl border-2 border-black/10 px-4 py-3 text-left text-sm font-bold outline-none focus:border-[#e8a90c]">
                       <span className="truncate">{form.trade.length ? form.trade.join(', ') : 'Select your trades'}</span>
                       <ChevronDown size={17} className={`shrink-0 transition ${tradeOpen ? 'rotate-180' : ''}`} />
                     </button>
                     {tradeOpen && (
                       <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                         <p className="px-2 py-1 text-[11px] font-bold text-black/45">Tap every trade you offer</p>
                         <div className="grid gap-1 sm:grid-cols-2">
                           {['Plumbing','Electrical','Carpentry','Painting','Masonry & Tiling','Auto Mechanic','AC & Refrigeration','Cleaning','Welding','Solar & Generator','Pest Control','Appliance Repair'].map(trade => (
                             <button type="button" key={trade} onClick={() => toggleTrade(trade)} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-extrabold ${form.trade.includes(trade) ? 'bg-[#0b3d2e] text-white' : 'text-black/65 hover:bg-[#f5ead2]'}`}>
                               <span className={`grid h-5 w-5 place-items-center rounded-md border text-[11px] ${form.trade.includes(trade) ? 'border-[#e8a90c] bg-[#e8a90c] text-[#062a1f]' : 'border-black/20'}`}>{form.trade.includes(trade) ? '✓' : ''}</span>
                               {trade}
                             </button>
                           ))}
                         </div>
                         <button type="button" onClick={() => setTradeOpen(false)} className="mt-2 w-full rounded-xl bg-[#e8a90c] px-3 py-2.5 text-xs font-extrabold text-[#062a1f]">Done</button>
                       </div>
                     )}
                     <span className="mt-1 block text-[11px] font-semibold text-black/40">{form.trade.length ? `${form.trade.length} trade${form.trade.length === 1 ? '' : 's'} selected` : 'No trades selected yet'}</span>
                  </div>
                  <label className="block"><span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Years of experience</span>
                    <input value={form.exp} onChange={e => set('exp', e.target.value)} placeholder="e.g. 6" inputMode="numeric" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" /></label>
                </div>
                <fieldset>
                    <legend className="text-xs font-extrabold uppercase tracking-widest text-black/45">Skills (select all that apply)</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skillOptions.map(skill => (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`rounded-full border px-3 py-2 text-xs font-extrabold transition ${
                            form.skills.includes(skill)
                              ? 'border-[#0b3d2e] bg-[#0b3d2e] text-white'
                              : 'border-black/10 bg-white text-black/60 hover:border-[#147a5b] hover:text-[#0b3d2e]'
                          }`}
                          aria-pressed={form.skills.includes(skill)}
                        >
                          {form.skills.includes(skill) ? '✓ ' : ''}{skill}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-black/40">
                      {form.skills.length ? `${form.skills.length} skill${form.skills.length === 1 ? '' : 's'} selected` : 'Choose one or more skills'}
                    </p>
                </fieldset>
                <p className="flex items-start gap-2 rounded-2xl bg-[#f5ead2]/70 p-3 text-xs font-semibold text-black/60"><BadgeCheck size={15} className="mt-0.5 shrink-0 text-[#147a5b]" /> Bring your Ghana Card + any trade certificate to verification. No certificates? Our free trade test can still qualify you.</p>
                <button className="w-full rounded-2xl bg-[#0b3d2e] py-3.5 text-sm font-extrabold text-white hover:bg-[#147a5b]">Submit application</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  { q: 'How fast can an artisan reach me?', a: 'In Accra and Kumasi, average arrival is 45 minutes for standard jobs and under 20 minutes for emergencies. You see a live ETA once a pro accepts.' },
  { q: 'How do payments work?', a: 'You approve an MTN MoMo, Telecel Cash or AT Money prompt at booking. Funds are held in escrow and released to the artisan only after you confirm the job is done. Full receipts by SMS.' },
  { q: 'What if the repair fails within days?', a: 'Every job carries a 7-day re-fix guarantee. Report it in My Jobs or call 030 274 0000 and we send the artisan back free — or a replacement pro.' },
  { q: 'Are artisans really verified?', a: 'Yes. Ghana Card, proof of address, trade certificate or practical trade test, plus a guarantor. Look for the green Verified badge on every profile.' },
  { q: 'Do prices include materials / parts?', a: 'Listed prices are labour. If parts are needed, the artisan shows you shop receipts and you approve before purchase — or supply parts yourself.' },
  { q: 'Which areas do you serve?', a: 'Accra, Tema & Kasoa, Kumasi, Takoradi, Tamale, Cape Coast, Ho, Sunyani and Koforidua — expanding monthly. Emergency dispatch currently covers Accra & Kumasi.' },
];

export function Support() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Help & safety" title="Questions? Yɛwɔ ha ma wo." sub="Call 030 274 0000 (Mon–Sat, 7am–8pm) or tap answers below." />
      <div className="mt-7 space-y-2.5">
        {FAQS.map((f, i) => (
          <div key={f.q} className={`overflow-hidden rounded-2xl border bg-white transition ${open === i ? 'border-[#e8a90c]' : 'border-black/10'}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left text-[15px] font-extrabold text-[#062a1f]">
              {f.q} <ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-black/60">{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: <AlertTriangle size={18} />, t: 'Emergency', d: 'Call 030 274 0000', href: 'tel:0302740000' },
          { icon: <FileCheck size={18} />, t: 'Report an issue', d: 'Guarantee claims', href: '/jobs' },
          { icon: <LifeBuoy size={18} />, t: 'WhatsApp us', d: 'Chat 059 000 0000', href: '/jobs' },
        ].map(c => (
          <Link key={c.t} to={c.href} className="flex items-center gap-3 rounded-2xl bg-[#062a1f] p-4 text-white hover:bg-[#0b3d2e]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8a90c] text-[#062a1f]">{c.icon}</span>
            <span><span className="block text-sm font-extrabold">{c.t}</span><span className="block text-xs text-white/60">{c.d}</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
