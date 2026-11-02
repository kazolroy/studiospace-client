import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { FaMagnifyingGlass, FaCalendarCheck, FaBolt, FaClapperboard, FaShieldHalved, FaIdBadge, FaScrewdriverWrench, FaHeadset, FaArrowRight } from 'react-icons/fa6';
import { api } from '../lib/api';
import useTitle from '../lib/useTitle';
import { CATEGORIES } from '../lib/constants';
import StudioCard from '../components/StudioCard';
import { EmptyState, GridSkeleton, SectionHeading, SmartImage } from '../components/ui';

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Photo studios & cyc walls',
    title: 'Your next shoot starts with the right light.',
    text: 'Discover daylight lofts, infinity cycs and rooftop sets booked by the hour, with prices shown upfront.',
  },
  {
    img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Music suites & podcast lounges',
    title: 'Record somewhere that sounds as good as your idea.',
    text: 'Treated rooms, pro mics and engineers on request. Reserve a slot and walk in ready to hit record.',
  },
  {
    img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Sound stages for film crews',
    title: 'Turn your empty room into a working set.',
    text: 'Own a creative space? List it in minutes, set your own rates and let creators fill your calendar.',
  },
];

const steps = [
  { icon: <FaMagnifyingGlass />, title: 'Discover Spaces', text: 'Search by category, city or budget and compare studios side by side.' },
  { icon: <FaCalendarCheck />, title: 'Select Shoot Hours', text: 'Pick a date and see live availability for every hour of the day.' },
  { icon: <FaBolt />, title: 'Book Instantly', text: 'Send a request with a transparent total, deposit included. No hidden fees.' },
  { icon: <FaClapperboard />, title: 'Create & Produce', text: 'Show up, set up and shoot. Leave a review once your session wraps.' },
];

const guarantees = [
  { icon: <FaShieldHalved />, title: 'Liability Protection', text: 'Every confirmed booking is covered by our host and guest liability policy.' },
  { icon: <FaIdBadge />, title: 'Verified Profiles', text: 'Hosts and creators sign in with verified accounts, so you know who you are working with.' },
  { icon: <FaScrewdriverWrench />, title: 'Equipment Safety', text: 'Refundable security deposits protect the lights, mics and gear in every studio.' },
  { icon: <FaHeadset />, title: '24/7 Host Support', text: 'A real person is always on hand if something goes wrong before, during or after a session.' },
];

export default function Home() {
  useTitle('');
  const navigate = useNavigate();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/studios?sort=newest&limit=6')
      .then(setStudios)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero slider */}
      <section className="relative">
        <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" loop autoplay={{ delay: 5500, disableOnInteraction: false }} pagination={{ clickable: true }} className="h-[560px] sm:h-[640px]">
          {slides.map((s) => (
            <SwiperSlide key={s.title}>
              <SmartImage src={s.img} alt={s.eyebrow} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="container-x relative flex h-full items-center">
                <div className="max-w-2xl pb-10">
                  <p className="section-eyebrow mb-4">{s.eyebrow}</p>
                  <h1 className="font-display text-4xl font-bold leading-[1.08] sm:text-6xl">{s.title}</h1>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/80">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link to="/studios" className="btn-primary">Explore Studios <FaArrowRight /></Link>
                    <Link to="/studios" className="btn-ghost bg-ink/40 backdrop-blur">Host Your Space</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured studios */}
      <section className="container-x pt-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Fresh on StudioSpace" title="Featured Studios" sub="The newest creative spaces added by hosts this week." />
          <Link to="/studios" className="btn-ghost btn-sm self-start sm:self-auto">View all studios <FaArrowRight /></Link>
        </div>
        <div className="mt-10">
          {loading ? (
            <GridSkeleton count={6} />
          ) : error ? (
            <EmptyState icon="!" title="We couldn't load studios" text={error} actionLabel="Try again" onAction={() => window.location.reload()} />
          ) : studios.length === 0 ? (
            <EmptyState icon="🎬" title="No studios listed yet" text="Be the first host on StudioSpace and put your space in front of creators." actionLabel="Host Your Space" actionTo="/add-studio" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x pt-24">
        <SectionHeading eyebrow="Find your format" title="Browse by Studio Category" sub="Choose the kind of space your project needs and we'll filter the rest." />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => navigate(`/studios?category=${encodeURIComponent(c.value)}`)} className="group relative h-64 overflow-hidden rounded-2xl border border-line text-left transition hover:border-amber">
              <SmartImage src={c.img} alt={c.label} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-lg font-bold">{c.label}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-cream/70">{c.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How booking works */}
      <section className="container-x pt-24">
        <SectionHeading center eyebrow="Simple by design" title="How Booking Works" sub="From first search to final take in four easy steps." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative h-full p-7">
              <span className="absolute right-6 top-5 font-display text-5xl font-bold text-line">0{i + 1}</span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber/10 text-xl text-amber">{s.icon}</div>
              <h3 className="mt-6 font-display text-xl font-bold">{i + 1}. {s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="container-x pt-24">
        <div className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-raised via-panel to-ink p-8 sm:p-14">
          <SectionHeading eyebrow="Peace of mind" title="Host Guarantee & Creator Support" sub="Creating is hard enough. We take care of the risk so you can focus on the work." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => (
              <div key={g.title} className="h-full rounded-2xl border border-line bg-ink/60 p-6">
                <div className="text-2xl text-amber">{g.icon}</div>
                <h3 className="mt-4 font-display text-lg font-bold">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
