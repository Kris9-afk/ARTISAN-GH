import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Flag, LockKeyhole, Plus, RotateCcw, ShieldCheck, UserPlus } from 'lucide-react';
import { type Artisan, type TradeId } from '../data/market';
import { api, type MarketplaceReport } from '../api';
import { useStore } from '../store';

const inputClass = 'mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#e8a90c]';

export default function Admin() {
  const { services, cities, addArtisan, updateArtisan, showToast } = useStore();
  const [authenticated, setAuthenticated] = useState(() => Boolean(sessionStorage.getItem('agh-admin-token')));
  const [code, setCode] = useState('');
  const [adminArtisans, setAdminArtisans] = useState<Artisan[]>([]);
  const [reports, setReports] = useState<MarketplaceReport[]>([]);
  const [loading, setLoading] = useState(authenticated);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingArtisan, setSavingArtisan] = useState(false);
  const [form, setForm] = useState({
    name: '', trade: 'plumbing' as TradeId, city: 'Accra', phone: '', yearsExp: '3',
    skills: '', bio: '', availableNow: true,
  });

  const loadAdminData = useCallback(async () => {
    try {
      const [artisanData, reportData] = await Promise.all([api.getAdminArtisans(), api.getReports()]);
      setAdminArtisans(artisanData);
      setReports(reportData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load admin data';
      setLoadError(message);
      if (message.includes('401')) {
        sessionStorage.removeItem('agh-admin-token');
        setAuthenticated(false);
        showToast('Admin session expired. Sign in again.');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setTimeout(() => void loadAdminData(), 0);
    return () => window.clearTimeout(timer);
  }, [authenticated, loadAdminData]);

  const signIn = (event: FormEvent) => {
    event.preventDefault();
    const lowerCode = code.trim().toLowerCase();
    setLoadError(null);
    api.loginAdmin(lowerCode).then(({ token }) => {
      sessionStorage.setItem('agh-admin-token', token);
      setLoading(true);
      setAuthenticated(true);
      setCode('');
    }).catch(error => {
      if (error instanceof Error && error.message.includes('401')) {
        showToast('Invalid admin access code');
      } else if (error instanceof TypeError) {
        showToast('Cannot reach the admin API. The local API server may be stopped.');
      } else {
        showToast(error instanceof Error ? `Admin sign-in failed: ${error.message}` : 'Admin sign-in failed. Please try again.');
      }
    });
  };

  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (savingArtisan) return;
    const service = services.find(item => item.id === form.trade);
    if (!service || !form.name.trim() || !form.phone.trim()) {
      showToast('Name, trade and phone are required');
      return;
    }
    const id = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;
    const artisan: Artisan = {
      id, name: form.name.trim(), trade: form.trade, tradeLabel: service.name, city: form.city,
      areas: [form.city], rating: 5, reviewsCount: 0, jobsDone: 0,
      yearsExp: Math.max(0, Number(form.yearsExp) || 0), priceFrom: service.baseFrom,
      verified: false, availableNow: form.availableNow, languages: ['English'], phone: form.phone.trim(),
      bio: form.bio.trim() || `${form.name.trim()} is available for ${service.name.toLowerCase()} jobs in ${form.city}.`,
      skills: form.skills.split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 6),
      color: '#0b3d2e', initials: form.name.trim().split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase(),
      responseMins: 30,
    };
    setSavingArtisan(true);
    try {
      const saved = await addArtisan(artisan);
      setForm(current => ({ ...current, name: '', phone: '', skills: '', bio: '' }));
      setAdminArtisans(current => [saved, ...current.filter(existing => existing.id !== saved.id)]);
      showToast(`${saved.name} added to the artisan directory`);
    } catch (error) {
      showToast(error instanceof Error ? `Could not add artisan: ${error.message}` : 'Could not add artisan');
    } finally {
      setSavingArtisan(false);
    }
  };

  const toggleSuspended = async (artisan: Artisan) => {
    try {
      const saved = await updateArtisan(artisan.id, { suspended: !artisan.suspended });
      setAdminArtisans(current => current.map(item => item.id === saved.id ? saved : item));
      showToast(saved.suspended ? `${saved.name} suspended from the directory` : `${saved.name} restored to the directory`);
    } catch {
      showToast('Could not update artisan status');
    }
  };

  const updateReportStatus = async (report: MarketplaceReport, status: MarketplaceReport['status']) => {
    try {
      const saved = await api.updateReport(report.id, status);
      setReports(current => current.map(item => item.id === saved.id ? saved : item));
      showToast(`Report ${status}`);
    } catch {
      showToast('Could not update report');
    }
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-xl">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#062a1f] text-[#e8a90c]"><LockKeyhole size={25} /></span>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#147a5b]">Restricted workspace</p>
          <h1 className="font-display mt-2 text-3xl font-black text-[#062a1f]">Admin console</h1>
          <p className="mt-2 text-sm leading-relaxed text-black/55">Manage artisan profiles and review concerns submitted by customers or artisans.</p>
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#147a5b]">Operations</p>
          <h1 className="font-display mt-2 text-4xl font-black text-[#062a1f]">Admin console</h1>
          <p className="mt-1 text-sm font-semibold text-black/50">Onboard artisans and review directory reports.</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem('agh-admin-token'); setAuthenticated(false); }} className="rounded-full border border-black/15 px-4 py-2 text-xs font-extrabold text-[#0b3d2e]">Sign out</button>
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
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Years exp.<input type="number" min="0" value={form.yearsExp} onChange={event => setForm({ ...form, yearsExp: event.target.value })} className={inputClass} /></label>
            </div>
            <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Skills<input value={form.skills} onChange={event => setForm({ ...form, skills: event.target.value })} className={inputClass} placeholder="Pipe repairs, pumps, tiling" /></label>
            <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Short bio<textarea value={form.bio} onChange={event => setForm({ ...form, bio: event.target.value })} className={`${inputClass} min-h-20 resize-y`} /></label>
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <label className="flex items-center gap-2 text-xs font-bold text-black/60"><input type="checkbox" checked={form.availableNow} onChange={event => setForm({ ...form, availableNow: event.target.checked })} /> Available for jobs now</label>
            </div>
            <button disabled={savingArtisan} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a90c] px-4 py-3 text-sm font-extrabold text-[#062a1f] hover:bg-[#fcd116] disabled:cursor-wait disabled:opacity-60"><Plus size={16} /> {savingArtisan ? 'Saving artisan…' : 'Add artisan'}</button>
          </form>
        </section>

        <section className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Listed profiles', value: adminArtisans.filter(artisan => !artisan.suspended).length, icon: ShieldCheck },
              { label: 'Suspended profiles', value: adminArtisans.filter(artisan => artisan.suspended).length, icon: RotateCcw },
              { label: 'Open reports', value: reports.filter(report => report.status === 'open').length, icon: Flag },
            ].map(item => <div key={item.label} className="rounded-2xl border border-black/10 bg-white p-4"><item.icon size={18} className="text-[#147a5b]" /><p className="tick mt-2 text-2xl font-black text-[#062a1f]">{item.value}</p><p className="text-xs font-bold text-black/45">{item.label}</p></div>)}
          </div>
          <div className="rounded-[26px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-black text-[#062a1f]">All artisans</h2>
                <p className="mt-1 text-xs font-semibold text-black/45">Every artisan currently available in the marketplace directory.</p>
              </div>
              <span className="rounded-full bg-[#f5ead2] px-3 py-1 text-xs font-extrabold text-[#6b5510]">{adminArtisans.length} total</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {loading && <p className="text-sm font-semibold text-black/50">Loading admin data…</p>}
              {loadError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#ce1126]/5 p-3 text-sm text-[#9f1020]">
                <span>Could not load admin data: {loadError}</span>
                <button type="button" onClick={() => { setLoading(true); setLoadError(null); void loadAdminData(); }} className="rounded-lg border border-current px-3 py-1.5 text-xs font-bold">Retry</button>
              </div>}
              {adminArtisans.map(artisan => (
                <div key={artisan.id} className="flex items-center gap-3 rounded-2xl border border-black/10 p-3">
                  {artisan.image
                    ? <img src={artisan.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#062a1f] font-display text-sm font-black text-[#e8a90c]">{artisan.initials}</span>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-[#062a1f]">{artisan.name}</p>
                    <p className="truncate text-xs font-semibold text-black/50">{artisan.tradeLabel} · {artisan.city}</p>
                    <p className="mt-1 text-[11px] font-bold text-black/40">{artisan.areas.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${artisan.suspended ? 'bg-[#ce1126]' : artisan.availableNow ? 'bg-[#147a5b]' : 'bg-black/20'}`} title={artisan.suspended ? 'Suspended' : artisan.availableNow ? 'Available' : 'Busy'} />
                    <button
                      type="button"
                      onClick={() => void toggleSuspended(artisan)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide transition ${artisan.suspended ? 'border-[#147a5b]/20 bg-[#147a5b]/5 text-[#147a5b] hover:bg-[#147a5b] hover:text-white' : 'border-[#ce1126]/20 bg-[#ce1126]/5 text-[#ce1126] hover:bg-[#ce1126] hover:text-white'}`}
                    >
                      {artisan.suspended ? 'Restore' : 'Suspend'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[26px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-black text-[#062a1f]">Reports</h2><p className="mt-1 text-xs font-semibold text-black/45">Review concerns submitted by customers and artisans.</p></div><span className="rounded-full bg-[#147a5b]/10 px-3 py-1 text-xs font-extrabold text-[#147a5b]">{reports.filter(report => report.status === 'open').length} open</span></div>
            {loading ? <p className="mt-6 text-center text-sm font-semibold text-black/50">Loading reports…</p> : loadError ? <p role="alert" className="mt-6 rounded-2xl bg-[#ce1126]/5 p-5 text-center text-sm font-semibold text-[#9f1020]">Reports are unavailable until admin data loads successfully.</p> : reports.length === 0 ? <p className="mt-6 rounded-2xl bg-[#f5ead2]/50 p-5 text-center text-sm font-semibold text-black/50">No reports have been submitted.</p> : <div className="mt-4 space-y-3">{reports.map(report => {
              const reportedArtisan = report.artisanId ? adminArtisans.find(artisan => artisan.id === report.artisanId) : undefined;
              return <article key={report.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><p className="text-sm font-extrabold text-[#062a1f]">{report.subjectType === 'artisan' ? 'Artisan' : 'Customer'}: {report.subjectName}</p><p className="mt-1 text-xs font-semibold text-black/50">Reported by {report.reporterType} {report.reporterName} · {report.reporterPhone} · {new Date(report.createdAt).toLocaleDateString('en-GH')}</p></div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${report.status === 'open' ? 'bg-[#fdf0c9] text-[#6b5510]' : 'bg-[#147a5b]/10 text-[#147a5b]'}`}>{report.status}</span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/70">{report.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`tel:${report.reporterPhone.replace(/[^\d+]/g, '')}`} className="rounded-lg border border-black/10 px-3 py-2 text-xs font-bold text-[#0b3d2e]">Call reporter</a>
                  {reportedArtisan && <button onClick={() => void toggleSuspended(reportedArtisan)} className="rounded-lg border border-[#ce1126]/20 px-3 py-2 text-xs font-bold text-[#ce1126]">{reportedArtisan.suspended ? 'Restore artisan' : 'Suspend artisan'}</button>}
                  {report.status !== 'resolved' && <button onClick={() => void updateReportStatus(report, 'resolved')} className="rounded-lg bg-[#0b3d2e] px-3 py-2 text-xs font-bold text-white">Resolve</button>}
                  {report.status !== 'dismissed' && <button onClick={() => void updateReportStatus(report, 'dismissed')} className="rounded-lg border border-black/10 px-3 py-2 text-xs font-bold text-black/65">Dismiss</button>}
                  {report.status !== 'open' && <button onClick={() => void updateReportStatus(report, 'open')} className="rounded-lg border border-black/10 px-3 py-2 text-xs font-bold text-black/65">Reopen</button>}
                </div>
              </article>;
            })}</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
