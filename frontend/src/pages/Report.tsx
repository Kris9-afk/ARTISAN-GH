import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileWarning, Phone, MessageCircle } from 'lucide-react';
import { api } from '../api';
import { SectionHead } from '../components/ui';
import { useStore } from '../store';

export default function Report() {
  const [params] = useSearchParams();
  const { artisans, showToast } = useStore();
  const [reporterType, setReporterType] = useState<'customer' | 'artisan'>('customer');
  const [subjectType, setSubjectType] = useState<'artisan' | 'customer'>('artisan');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [artisanId, setArtisanId] = useState(params.get('artisan') || '');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const artisan = artisans.find(item => item.id === artisanId);
    setSending(true);
    try {
      await api.createReport({
        reporterType, reporterName: reporterName.trim(), reporterPhone: reporterPhone.trim(),
        subjectType, subjectName: subjectType === 'artisan' ? artisan?.name || '' : subjectName.trim(),
        ...(subjectType === 'artisan' && artisan ? { artisanId: artisan.id } : {}),
        description: description.trim(),
      });
      setSubmitted(true);
      showToast('Report sent for review');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not send report. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SectionHead kicker="Help & safety" title="Report a concern" sub="Tell us what happened. Our team will review the report and may contact you for more information." />
      <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-5 sm:p-7">
        {submitted ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#147a5b]/10 text-[#147a5b]"><FileWarning size={24} /></span>
            <h2 className="font-display mt-4 text-2xl font-black text-[#062a1f]">Report received</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black/60">Thank you for letting us know. The team will review the details you sent.</p>
            <Link to="/artisans" className="mt-5 inline-block rounded-xl bg-[#0b3d2e] px-5 py-3 text-sm font-extrabold text-white">Return to artisans</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">I am a
                <select value={reporterType} onChange={event => setReporterType(event.target.value as 'customer' | 'artisan')} className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#062a1f]">
                  <option value="customer">Customer</option><option value="artisan">Artisan</option>
                </select>
              </label>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">This report is about a
                <select value={subjectType} onChange={event => setSubjectType(event.target.value as 'artisan' | 'customer')} className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#062a1f]">
                  <option value="artisan">Artisan</option><option value="customer">Customer</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">Your name
                <input required value={reporterName} onChange={event => setReporterName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#062a1f] outline-none focus:border-[#e8a90c]" />
              </label>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">Your phone number
                <input required type="tel" inputMode="tel" value={reporterPhone} onChange={event => setReporterPhone(event.target.value)} className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#062a1f] outline-none focus:border-[#e8a90c]" />
              </label>
            </div>
            {subjectType === 'artisan' ? (
              <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">Artisan
                <select required value={artisanId} onChange={event => setArtisanId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#062a1f]">
                  <option value="">Choose an artisan</option>
                  {artisans.map(artisan => <option key={artisan.id} value={artisan.id}>{artisan.name} · {artisan.city}</option>)}
                </select>
              </label>
            ) : (
              <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">Person's name
                <input required value={subjectName} onChange={event => setSubjectName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#062a1f] outline-none focus:border-[#e8a90c]" />
              </label>
            )}
            <label className="block text-xs font-extrabold uppercase tracking-widest text-black/50">What happened?
              <textarea required minLength={15} maxLength={2000} rows={5} value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the concern and when it happened." className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-3 text-sm font-medium normal-case tracking-normal text-[#062a1f] outline-none focus:border-[#e8a90c]" />
            </label>
            <button disabled={sending} className="w-full rounded-xl bg-[#0b3d2e] px-5 py-3.5 text-sm font-extrabold text-white hover:bg-[#147a5b] disabled:opacity-50">{sending ? 'Sending report…' : 'Send report'}</button>
          </form>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-[#0b3d2e]">
        <a href="tel:+233302740000" className="inline-flex items-center gap-1.5"><Phone size={15} /> Call support</a>
        <a href="https://wa.me/233590000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> WhatsApp support</a>
      </div>
    </main>
  );
}