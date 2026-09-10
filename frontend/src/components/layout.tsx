import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Hammer, Menu, X, Briefcase, PhoneCall, ChevronRight, ShieldCheck, Smartphone, MapPin } from 'lucide-react';
import { useStore } from '../store';
import { KenteBar } from './ui';

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-[#0b3d2e] text-[#fcd116] shadow-lg">
        <Hammer size={20} />
        <span className="absolute -bottom-1 left-2 right-2 h-1 rounded-full kente-thin" />
      </span>
      <span className="leading-none">
        <span className={`font-display text-[22px] font-black tracking-tight ${light ? 'text-white' : 'text-[#062a1f]'}`}>
          ARTISAN<span className="text-[#e8a90c]">-GH</span>
        </span>
        <span className={`block text-[10px] font-bold uppercase tracking-[0.24em] ${light ? 'text-white/60' : 'text-black/50'}`}>Y3FIX-GH</span>
      </span>
    </Link>
  );
}

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/artisans', label: 'Find Artisans' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/join', label: 'Join as Artisan' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { bookings } = useStore();
  const active = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-50">
      <KenteBar h="h-1.5" />
      <div className="bg-[#fff8ec]/95 backdrop-blur border-b border-black/10">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-bold transition ${isActive || loc.pathname === l.to ? 'bg-[#0b3d2e] text-white' : 'text-[#062a1f]/70 hover:bg-[#f5ead2] hover:text-[#062a1f]'}`}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/jobs" className={({ isActive }) => `relative rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-[#0b3d2e] text-white' : 'text-[#062a1f]/70 hover:bg-[#f5ead2] hover:text-[#062a1f]'}`}>
              My Jobs
              {active > 0 && <span className="tick ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-[#ce1126] px-1 text-[11px] font-extrabold text-white">{active}</span>}
            </NavLink>
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <a href="tel:0302740000" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-bold text-[#0b3d2e] hover:bg-[#f5ead2]">
              <PhoneCall size={15} /> 030 274 0000
            </a>
            <Link to="/book" className="rounded-full bg-[#e8a90c] px-5 py-2.5 text-sm font-extrabold text-[#062a1f] shadow-[0_8px_20px_-8px_rgba(232,169,12,0.8)] transition hover:bg-[#fcd116]">
              Book now
            </Link>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 lg:hidden" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-black/10 bg-[#fff8ec] px-4 pb-5 pt-2 lg:hidden">
            {[...LINKS, { to: '/jobs', label: `My Jobs${active ? ` (${active})` : ''}` }].map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-bold ${isActive ? 'bg-[#0b3d2e] text-white' : 'text-[#062a1f]'}`}>
                {l.label} <ChevronRight size={16} />
              </NavLink>
            ))}
            <Link to="/book" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-[#e8a90c] px-3 py-3 text-center text-[15px] font-extrabold text-[#062a1f]">Book now</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  const nav = useNavigate();
  return (
    <footer className="relative mt-0 bg-[#041f17] text-white">
      <KenteBar h="h-2" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Ghana's trusted marketplace for plumbers, electricians, mechanics & more. Verified pros, upfront GH₵ prices, MoMo payments.
          </p>
          <div className="mt-4 flex gap-2">
            {['MTN MoMo', 'Telecel', 'AT'].map(m => (
              <span key={m} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold text-[#fcd116]">
                <Smartphone size={12} /> {m}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Popular services</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-white/70">
            {['Plumbing in Accra', 'Electrician in Kumasi', 'Car mechanic near me', 'Deep cleaning Tema', 'Solar & inverter setup', 'AC repair Madina'].map(s => (
              <li key={s}><button className="hover:text-[#fcd116]" onClick={() => nav('/services')}>{s}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Company</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-white/70">
            <li><Link className="hover:text-[#fcd116]" to="/how-it-works">How it works</Link></li>
            <li><Link className="hover:text-[#fcd116]" to="/join">Join as artisan</Link></li>
            <li><Link className="hover:text-[#fcd116]" to="/support">Help & safety</Link></li>
            <li><Link className="hover:text-[#fcd116]" to="/jobs">Track my job</Link></li>
            <li><Link className="inline-flex items-center gap-1 hover:text-[#fcd116]" to="/admin"><ShieldCheck size={13} /> Admin console</Link></li>
          </ul>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50"><ShieldCheck size={13} className="text-[#e8a90c]" /> Every pro ID-checked & guaranteed</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-white/55">
            <Link className="hover:text-[#fcd116]" to="/privacy">Privacy</Link>
            <Link className="hover:text-[#fcd116]" to="/terms">Terms</Link>
            <Link className="hover:text-[#fcd116]" to="/refunds">Refunds</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e8a90c]">Reach us</p>
          <p className="mt-3 text-sm font-semibold text-white/70">Osu Badu St 12, Accra<br />Mon–Sat · 7am–8pm</p>
          <p className="mt-2 text-lg font-extrabold text-white">030 274 0000</p>
          <p className="text-sm font-semibold text-white/70">hello@artisan-gh.com</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/70"><MapPin size={12} /> Accra · Kumasi · Takoradi · Tamale</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs font-semibold text-white/45 sm:flex-row sm:px-6">
          <p>© 2026 ARTISAN-GH Ltd · Made with pride in Ghana · Medaase!</p>
          <p className="flex items-center gap-1.5"><Briefcase size={12} /> 2,400+ verified artisans · 38,000+ jobs done</p>
        </div>
      </div>
    </footer>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const isError = /invalid|incorrect|error|denied/i.test(toast);

  return (
    <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2">
      <div className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold shadow-2xl ${isError ? 'border-[#f5b7b1] bg-[#7f1d1d] text-white' : 'border-[#0b3d2e]/10 bg-[#062a1f] text-white'}`}>
        <span className={`grid h-6 w-6 place-items-center rounded-full text-[13px] ${isError ? 'bg-[#f87171] text-white' : 'bg-[#147a5b] text-white'}`}>
          {isError ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
              <path d="M12 2.75a1.15 1.15 0 0 1 1.02.63l8.72 16.14A1.14 1.14 0 0 1 20.72 21H3.28a1.14 1.14 0 0 1-.98-1.48L10.98 3.38A1.15 1.15 0 0 1 12 2.75Zm0 7.25c-.6 0-1 .48-1 1.08v4.66c0 .6.4 1.08 1 1.08s1-.48 1-1.08v-4.66c0-.6-.4-1.08-1-1.08Zm1.12 8.41a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0Z"/>
            </svg>
          ) : '✓'}
        </span>
        {toast}
      </div>
    </div>
  );
}

export function CookieNotice() {
  const [visible, setVisible] = useState(() => {
    try { return localStorage.getItem('agh-cookie-notice') !== 'seen'; } catch { return true; }
  });
  if (!visible) return null;
  const dismiss = () => { try { localStorage.setItem('agh-cookie-notice', 'seen'); } catch { setVisible(false); } setVisible(false); };
  return (
    <aside className="fixed bottom-4 left-4 right-4 z-[110] rounded-2xl border border-black/10 bg-white p-4 shadow-2xl sm:left-auto sm:max-w-md" aria-label="Cookie notice">
      <p className="text-sm font-extrabold text-[#062a1f]">Your privacy matters</p>
      <p className="mt-1 text-xs leading-relaxed text-black/60">We use only essential browser storage for requested features like favourites and sign-in sessions. No advertising or analytics cookies.</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <Link to="/privacy" className="text-xs font-extrabold text-[#147a5b] underline underline-offset-2">Read privacy policy</Link>
        <button type="button" onClick={dismiss} className="rounded-xl bg-[#0b3d2e] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#147a5b]">Continue</button>
      </div>
    </aside>
  );
}

export function EmergencyFab() {
  return (
    <Link to="/book?emergency=1"
      className="pulse-ring fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-[#ce1126] px-5 py-3.5 text-sm font-extrabold text-white shadow-2xl transition hover:bg-[#a50e1f]">
      <PhoneCall size={17} /> Emergency? <span className="hidden sm:inline">Get help now</span>
    </Link>
  );
}
