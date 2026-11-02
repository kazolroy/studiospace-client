import { Link } from 'react-router-dom';
import useTitle from '../lib/useTitle';
import { PageHeader, SmartImage } from '../components/ui';

const values = [
  ['Access for everyone', 'A great space shouldn’t depend on a big budget. Hourly pricing puts professional rooms within reach of solo creators.'],
  ['Honest and transparent', 'Rates, deposits and house rules are visible before you book. What you see is what you pay.'],
  ['Community first', 'Hosts are creators too. We build tools that help both sides trust each other and do their best work.'],
];

const numbers = [['12+', 'Studio cities'], ['5', 'Studio categories'], ['24/7', 'Host support'], ['0', 'Hidden fees']];

export default function About() {
  useTitle('About Us');
  return (
    <>
      <PageHeader eyebrow="Our story" title="Built by creators, for creators" sub="StudioSpace started with a simple frustration: finding a good studio shouldn't take longer than the shoot itself." />
      <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-2">
        <SmartImage src="https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=1200&q=80" alt="A bright creative studio" className="h-[380px] w-full rounded-2xl border border-line object-cover" />
        <div>
          <h2 className="section-title">A marketplace for creative space</h2>
          <p className="mt-4 leading-relaxed text-mute">
            Photographers, filmmakers, podcasters and musicians all need the same thing: a reliable room with the right light, sound and gear. At the same time, thousands of studios sit empty for most of the week.
          </p>
          <p className="mt-4 leading-relaxed text-mute">
            StudioSpace connects the two with live availability, clear pricing and a booking flow that respects everyone’s time. Our goal is to keep creative spaces busy and creative people productive.
          </p>
          <Link to="/studios" className="btn-primary mt-8">Find a studio</Link>
        </div>
      </div>

      <div className="container-x">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {numbers.map(([n, l]) => (
            <div key={l} className="card p-6 text-center">
              <p className="font-display text-4xl font-bold text-amber">{n}</p>
              <p className="mt-1 text-sm text-mute">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map(([t, d]) => (
            <div key={t} className="card h-full p-7">
              <h3 className="font-display text-xl font-bold">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
