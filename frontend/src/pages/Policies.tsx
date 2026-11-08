import { Link } from 'react-router-dom';
import { FileText, LockKeyhole, RefreshCcw, ShieldCheck } from 'lucide-react';

type PolicyKind = 'privacy' | 'terms' | 'refund';

const content: Record<PolicyKind, { title: string; icon: typeof ShieldCheck; intro: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy policy',
    icon: LockKeyhole,
    intro: 'We collect only the information needed to operate the artisan directory, respond to reports, and manage artisan applications.',
    sections: [
      { heading: 'What we collect', body: 'When you submit a report, we collect your name, contact details, the people involved, and your description of the concern. For artisan applications, we collect contact, location, trade, experience, and selected skills.' },
      { heading: 'How we use it', body: 'We use this information to publish and maintain artisan profiles, review reports, verify profile details, and respond to support requests. We do not collect booking addresses or Mobile Money details, and we do not sell personal information or use it for advertising profiles.' },
      { heading: 'Storage and sharing', body: 'Report details are accessible to the team reviewing the report and may be shared with the people involved when needed to review it. We keep information only as long as needed for these purposes or as required by law.' },
      { heading: 'Your choices', body: 'You may ask what personal information we hold, request correction or deletion where applicable, or contact us about a privacy concern at hello@artisan-gh.com. Necessary session storage for admin access and local preferences can be cleared from your browser.' },
      { heading: 'Tracking', body: 'This version of Y3FIX-GH does not use advertising trackers, analytics pixels, fingerprinting, or third-party tracking cookies. Essential storage is used only for functions you request, such as favourites and an admin session.' },
    ],
  },
  terms: {
    title: 'Terms and conditions',
    icon: FileText,
    intro: 'These terms explain the ground rules for using Y3FIX-GH to find and contact artisans in Ghana.',
    sections: [
      { heading: 'Using the directory', body: 'Y3FIX-GH publishes artisan profiles so customers and artisans can contact one another directly. Profile details and availability can change; confirm them with the artisan before making arrangements.' },
      { heading: 'Arrangements and payments', body: 'Customers and artisans are responsible for agreeing on the work, price, timing, materials, and payment directly. Y3FIX-GH does not book, supervise, or collect payment for jobs arranged through the directory.' },
      { heading: 'Reports and profile moderation', body: 'Customers and artisans may report concerns to Y3FIX-GH. We review reports and may suspend or restore profiles. Directory listings and reviews are not a guarantee of work quality or a promise to resolve private arrangements.' },
      { heading: 'Reviews', body: 'Reviews must describe a genuine experience and must not contain abusive, discriminatory, private, or misleading content. We may remove reviews that break these rules.' },
      { heading: 'Contact', body: 'For help, call 030 274 0000 during support hours or email hello@artisan-gh.com. We may update these terms as the marketplace develops and will publish the current version here.' },
    ],
  },
  refund: {
    title: 'Refund policy',
    icon: RefreshCcw,
    intro: 'Y3FIX-GH does not collect job payments or arrange cancellations. Customers and artisans make these arrangements directly.',
    sections: [
      { heading: 'Payments and cancellations', body: 'Confirm payment terms and cancellation arrangements with the artisan before work begins. Any refund for a direct payment must be discussed with the person who received it.' },
      { heading: 'Job concerns', body: 'If you have a concern about a job or someone using the directory, submit a report or contact support at 030 274 0000 or 059 000 0000. Y3FIX-GH can review directory profiles but does not control payments between customers and artisans.' },
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
