import { Link } from 'react-router-dom';
import { FileText, LockKeyhole, RefreshCcw, ShieldCheck } from 'lucide-react';

type PolicyKind = 'privacy' | 'terms' | 'refund';

const content: Record<PolicyKind, { title: string; icon: typeof ShieldCheck; intro: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy policy',
    icon: LockKeyhole,
    intro: 'We collect only the information needed to match you with an artisan, process a booking, support your job, and keep the marketplace secure.',
    sections: [
      { heading: 'What we collect', body: 'For a booking, we collect your name, phone number, service address, city, job notes, and Mobile Money details needed to process the payment. Optional landmarks and notes help an artisan find you. For artisan applications, we collect contact, location, trade, experience, and selected skills.' },
      { heading: 'How we use it', body: 'We use this information to arrange services, send booking and support messages, make payments, verify artisans, prevent fraud, and improve the service. We do not sell personal information or use it for advertising profiles.' },
      { heading: 'Storage and sharing', body: 'Booking details are shared only with the matched artisan, payment providers where needed, and trusted service providers that help us operate the platform. We keep information only as long as needed for the purposes above or as required by law.' },
      { heading: 'Your choices', body: 'You may ask what personal information we hold, request correction or deletion where applicable, or contact us about a privacy concern at hello@artisan-gh.com. Necessary session storage for admin access and local preferences can be cleared from your browser.' },
      { heading: 'Tracking', body: 'This version of Y3FIX-GH does not use advertising trackers, analytics pixels, fingerprinting, or third-party tracking cookies. Essential storage is used only for functions you request, such as favourites, your name for a smoother booking, and an admin session.' },
    ],
  },
  terms: {
    title: 'Terms and conditions',
    icon: FileText,
    intro: 'These terms explain the ground rules for using Y3FIX-GH to find, book, and review artisans in Ghana.',
    sections: [
      { heading: 'Using the marketplace', body: 'You must provide accurate contact and job information, keep your payment details secure, and use the service lawfully. Artisan profiles, prices, availability, and arrival times can change and are confirmed during booking.' },
      { heading: 'Bookings and payments', body: 'A booking is confirmed after the details and Mobile Money payment prompt are accepted. Listed prices are labour estimates unless the booking says otherwise. Parts and materials require your approval before purchase.' },
      { heading: 'Artisan conduct and guarantees', body: 'We verify artisans using identity and trade checks, but you should still use reasonable care on site. Eligible jobs include the stated 7-day re-fix guarantee. Report an issue promptly through My Jobs or our support line.' },
      { heading: 'Reviews', body: 'Reviews must describe a genuine experience and must not contain abusive, discriminatory, private, or misleading content. We may remove reviews that break these rules.' },
      { heading: 'Contact', body: 'For help, call 030 274 0000 during support hours or email hello@artisan-gh.com. We may update these terms as the marketplace develops and will publish the current version here.' },
    ],
  },
  refund: {
    title: 'Refund policy',
    icon: RefreshCcw,
    intro: 'We want payments and cancellations to be clear. The outcome depends on when you cancel and whether the job has started.',
    sections: [
      { heading: 'Before dispatch', body: 'Cancel at least two hours before the scheduled visit for a full refund of the amount paid, subject to payment provider processing times.' },
      { heading: 'After dispatch or arrival', body: 'If an artisan has already been dispatched, contact support immediately. We review reasonable dispatch costs and the work completed before confirming the refundable amount.' },
      { heading: 'Job problems', body: 'If the work fails within 7 days, report it through My Jobs or call 030 274 0000. We will arrange a free re-fix or review a replacement/refund where a re-fix is not practical.' },
      { heading: 'How refunds are sent', body: 'Approved refunds are returned to the Mobile Money number used for the booking. Timing depends on MTN MoMo, Telecel Cash, or AirtelTigo processing and may take several working days.' },
      { heading: 'Disputes', body: 'Please include your booking ID, phone number, and a short description of the issue. We will review the booking record and communicate the decision clearly.' },
    ],
  },
};

export default function PolicyPage({ kind }: { kind: PolicyKind }) {
  const policy = content[kind];
  const Icon = policy.icon;
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0b3d2e] text-[#fcd116]"><Icon size={22} /></span>
        <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#147a5b]">Y3FIX-GH</p>
        <h1 className="font-display mt-2 text-3xl font-black text-[#062a1f] sm:text-4xl">{policy.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60">{policy.intro}</p>
        <div className="mt-8 space-y-6">
          {policy.sections.map(section => (
            <section key={section.heading}>
              <h2 className="font-display text-lg font-black text-[#062a1f]">{section.heading}</h2>
              <p className="mt-1.5 text-sm leading-7 text-black/65">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 border-t border-black/10 pt-5 text-sm font-semibold text-black/55">
          Need help? <Link to="/support" className="font-extrabold text-[#147a5b] underline underline-offset-2">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
