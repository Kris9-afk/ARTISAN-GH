import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BadgeCheck, PhoneCall, MessageCircle, ShieldCheck, ChevronDown, Hammer, GraduationCap, Users, LifeBuoy, AlertTriangle, FileCheck } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { useStore } from '../store';

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Find the right local help" title="How Y3FIX-GH works" sub="Browse artisan profiles, then speak directly with the person you choose to arrange the work." />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          { t: 'For customers', icon: <Search size={22} />, color: 'bg-[#0b3d2e]', items: ['Browse profiles by trade, city, and service area.', 'Compare experience, skills, availability, ratings, and reviews.', 'Call, WhatsApp, or SMS an artisan directly.', 'Agree on the job, price, timing, and payment with the artisan.'] },
          { t: 'For artisans', icon: <Hammer size={22} />, color: 'bg-[#e8a90c]', items: ['Apply to be listed in the directory.', 'Share your trade, service areas, skills, and contact number.', 'Customers can reach you directly from your profile.', 'Build your profile with customer reviews and updated details.'] },
          { t: 'Use the directory thoughtfully', icon: <ShieldCheck size={22} />, color: 'bg-[#ce1126]', items: ['Read profiles and reviews before choosing.', 'Confirm the scope, final price, timing, and materials directly.', 'Agree payment terms with the artisan before work begins.', 'Report concerns to Y3FIX-GH by form, phone, or WhatsApp.'] },
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
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Browse local profiles</p>
        <h3 className="font-display mx-auto mt-2 max-w-xl text-2xl font-black sm:text-3xl">Choose an artisan and make arrangements directly.</h3>
        <div className="mt-5 flex justify-center gap-2">
          <Link to="/artisans" className="rounded-full bg-[#e8a90c] px-7 py-3 text-sm font-extrabold text-[#062a1f]">Find artisans</Link>
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
  const [consent, setConsent] = useState(false);
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
          <SectionHead kicker="Make your work easier to find" title="List your artisan profile" sub="Share your trade, service areas, experience, and contact details so local customers can reach you directly." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: <Users size={20} />, t: 'A public profile', d: 'Show customers your trade, service area, and skills.' },
              { icon: <PhoneCall size={20} />, t: 'Direct enquiries', d: 'Customers call or message you to discuss a job.' },
              { icon: <GraduationCap size={20} />, t: 'Show your experience', d: 'Add your background, languages, and relevant qualifications.' },
              { icon: <MessageCircle size={20} />, t: 'Build trust', d: 'Share your profile and collect customer reviews.' },
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
            <form onSubmit={e => { e.preventDefault(); if (!consent) return; setSent(true); showToast('Application sent — we will call you soon!'); }}>
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
                     <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Trades & skills</span>
                     <button type="button" onClick={() => setTradeOpen(open => !open)} className="mt-1.5 flex w-full items-center justify-between rounded-2xl border-2 border-black/10 px-4 py-3 text-left text-sm font-bold outline-none focus:border-[#e8a90c]">
                       <span className="truncate">{form.trade.length ? form.trade.join(', ') : 'Select trades'}{form.skills.length ? ` · ${form.skills.length} skill${form.skills.length === 1 ? '' : 's'}` : ''}</span>
                       <ChevronDown size={17} className={`shrink-0 transition ${tradeOpen ? 'rotate-180' : ''}`} />
                     </button>
                     {tradeOpen && (
                       <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[70vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                         <p className="px-2 py-1 text-[11px] font-bold text-black/45">Trades · select all that apply</p>
                         <div className="grid gap-1 sm:grid-cols-2">
                           {['Plumbing','Electrical','Carpentry','Painting','Masonry & Tiling','Auto Mechanic','AC & Refrigeration','Cleaning','Welding','Solar & Generator','Pest Control','Appliance Repair'].map(trade => (
                             <button type="button" key={trade} onClick={() => toggleTrade(trade)} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-extrabold ${form.trade.includes(trade) ? 'bg-[#0b3d2e] text-white' : 'text-black/65 hover:bg-[#f5ead2]'}`}>
                               <span className={`grid h-5 w-5 place-items-center rounded-md border text-[11px] ${form.trade.includes(trade) ? 'border-[#e8a90c] bg-[#e8a90c] text-[#062a1f]' : 'border-black/20'}`}>{form.trade.includes(trade) ? '✓' : ''}</span>
                               {trade}
                             </button>
                           ))}
                         </div>
                         <fieldset className="mt-2 border-t border-black/10 pt-2">
                           <legend className="px-2 text-[11px] font-bold text-black/45">Skills · select all that apply</legend>
                           <div className="flex flex-wrap gap-1">
                             {skillOptions.map(skill => (
                               <button type="button" key={skill} onClick={() => toggleSkill(skill)}
                                 className={`rounded-full border px-3 py-2 text-xs font-extrabold transition ${form.skills.includes(skill) ? 'border-[#0b3d2e] bg-[#0b3d2e] text-white' : 'border-black/10 bg-white text-black/60 hover:border-[#147a5b] hover:text-[#0b3d2e]'}`}
                                 aria-pressed={form.skills.includes(skill)}>
                                 {form.skills.includes(skill) ? '✓ ' : ''}{skill}
                               </button>
                             ))}
                           </div>
                         </fieldset>
                         <button type="button" onClick={() => setTradeOpen(false)} className="mt-2 w-full rounded-xl bg-[#e8a90c] px-3 py-2.5 text-xs font-extrabold text-[#062a1f]">Done</button>
                       </div>
                     )}
                     <span className="mt-1 block text-[11px] font-semibold text-black/40">{form.trade.length} trade{form.trade.length === 1 ? '' : 's'} · {form.skills.length} skill{form.skills.length === 1 ? '' : 's'} selected</span>
                  </div>
                  <label className="block"><span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Years of experience</span>
                    <input value={form.exp} onChange={e => set('exp', e.target.value)} placeholder="e.g. 6" inputMode="numeric" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" /></label>
                </div>
                <label className="block">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Add your ID</span>
                  <span className="mt-1 block text-xs font-semibold text-black/50">Ghana Card</span>
                  <input required type="text" placeholder="GHA-XXXXXXXXX-X" autoCapitalize="characters" className="mt-1.5 w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#e8a90c]" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Ghana Card front</span>
                    <input required type="file" accept="image/*" className="mt-1.5 block w-full rounded-2xl border-2 border-black/10 px-3 py-2.5 text-sm font-semibold text-black/65 file:mr-3 file:rounded-lg file:border-0 file:bg-[#f5ead2] file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[#062a1f]" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-black/45">Ghana Card back</span>
                    <input required type="file" accept="image/*" className="mt-1.5 block w-full rounded-2xl border-2 border-black/10 px-3 py-2.5 text-sm font-semibold text-black/65 file:mr-3 file:rounded-lg file:border-0 file:bg-[#f5ead2] file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[#062a1f]" />
                  </label>
                </div>
                <p className="flex items-start gap-2 rounded-2xl bg-[#f5ead2]/70 p-3 text-xs font-semibold text-black/60"><BadgeCheck size={15} className="mt-0.5 shrink-0 text-[#147a5b]" /> Bring your Ghana Card + any trade certificate to verification. No certificates? Our free trade test can still qualify you.</p>
                <label className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-black/60"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#147a5b]" /> <span>I agree to the <Link to="/privacy" className="font-extrabold text-[#147a5b] underline">Privacy Policy</Link> and consent to being contacted about this application.</span></label>
                <button type="submit" className="w-full rounded-2xl bg-[#0b3d2e] py-3.5 text-sm font-extrabold text-white hover:bg-[#147a5b]">Submit application</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  { q: 'How do I arrange a job?', a: 'Open an artisan profile and call, WhatsApp, or SMS them. Discuss the work, price, timing, materials, and payment directly.' },
  { q: 'How are prices and payments handled?', a: 'Y3FIX-GH does not set or collect payment for a job. Confirm the price and payment method directly with the artisan before work begins.' },
  { q: 'What if I have a concern about an artisan or customer?', a: 'Send a report through our report form, call 030 274 0000, or WhatsApp 059 000 0000. Our team reviews directory concerns.' },
  { q: 'What does the Verified badge mean?', a: 'The badge identifies profiles marked as verified by Y3FIX-GH. Review the profile details and discuss any questions directly with the artisan.' },
  { q: 'How do I choose an artisan?', a: 'Compare the trade, service areas, skills, experience, availability, ratings, and reviews shown on each profile.' },
  { q: 'Which areas do you serve?', a: 'Use the city and service-area details on artisan profiles to find people listed near you.' },
];

export function Support() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Help & safety" title="Questions? Yɛwɔ ha ma wo." sub="Call 030 274 0000 or WhatsApp 059 000 0000, or read the answers below." />
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
          { icon: <AlertTriangle size={18} />, t: 'Call support', d: '030 274 0000', href: 'tel:+233302740000', external: true },
          { icon: <FileCheck size={18} />, t: 'Report a concern', d: 'Send a report for review', href: '/report' },
          { icon: <LifeBuoy size={18} />, t: 'WhatsApp support', d: 'Chat 059 000 0000', href: 'https://wa.me/233590000000', external: true },
        ].map(c => (
          <a key={c.t} href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})} className="flex items-center gap-3 rounded-2xl bg-[#062a1f] p-4 text-white hover:bg-[#0b3d2e]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8a90c] text-[#062a1f]">{c.icon}</span>
            <span><span className="block text-sm font-extrabold">{c.t}</span><span className="block text-xs text-white/60">{c.d}</span></span>
          </a>
        ))}
      </div>
    </div>
  );
}
