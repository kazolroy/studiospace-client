import { Link } from 'react-router-dom';
import useTitle from '../lib/useTitle';
import { PageHeader } from '../components/ui';

const guest = [
  ['Search & compare', 'Filter by category, price and rating. Every listing shows its hourly rate, deposit and capacity upfront.'],
  ['Check live availability', 'Choose a date and see which hours are already reserved, so you only request slots that are actually free.'],
  ['Send a booking request', 'Confirm your hours and note for the host. Your request is saved as Pending and the host is notified.'],
  ['Shoot, record or create', 'Once confirmed, arrive and make something great. After the session, leave an honest review.'],
];
const host = [
  ['List your space', 'Add photos, amenities, your hourly rate and a security deposit. It takes about five minutes.'],
  ['Review requests', 'Confirm or decline each request from your dashboard. Double bookings are blocked automatically.'],
  ['Host the session', 'Welcome the creator, hand over the keys or door code and keep your studio rules front and centre.'],
  ['Complete & get reviewed', 'Mark the booking as completed and build a reputation through guest reviews.'],
];

function Track({ title, items }) {
  return (
    <div className="card h-full p-8">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <ol className="mt-6 space-y-6">
        {items.map(([t, d], i) => (
          <li key={t} className="flex gap-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber font-bold text-ink">{i + 1}</span>
            <div>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-mute">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorks() {
  useTitle('How It Works');
  return (
    <>
      <PageHeader eyebrow="The process" title="How StudioSpace Works" sub="Whether you're booking a space or sharing one, the flow is the same: simple, transparent and fast." />
      <div className="container-x grid gap-6 py-12 lg:grid-cols-2">
        <Track title="For creators" items={guest} />
        <Track title="For hosts" items={host} />
      </div>
      <div className="container-x">
        <div className="card flex flex-col items-center gap-5 px-6 py-12 text-center">
          <h2 className="section-title">Ready to get started?</h2>
          <p className="section-sub">Find a space for your next project or turn your own into income.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/studios" className="btn-primary">Explore Studios</Link>
            <Link to="/add-studio" className="btn-ghost">Host Your Space</Link>
          </div>
        </div>
      </div>
    </>
  );
}
