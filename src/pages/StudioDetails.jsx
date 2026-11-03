import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaMapMarkerAlt, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { api } from '../lib/api';
import { money } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import useTitle from '../lib/useTitle';
import BookingModal from '../components/BookingModal';
import { EmptyState, RatingBadge, SmartImage, Spinner, Stars } from '../components/ui';

export default function StudioDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [booking, setBooking] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  useTitle(studio?.title || 'Studio');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/studios/${id}`)
      .then(setStudio)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Loading studio" />;
  if (notFound || !studio)
    return (
      <div className="container-x py-20">
        <EmptyState icon="🎞️" title="Studio not found" text="This listing may have been removed by its host." actionLabel="Browse studios" actionTo="/studios" />
      </div>
    );

  const isOwner = user?.email?.toLowerCase() === studio.ownerEmail;
  const gallery = studio.gallery?.length ? studio.gallery : [studio.image];

  const book = () => {
    if (!user) {
      toast('Please log in to book this studio.', { icon: '🔒' });
      return navigate('/login', { state: { from: `/studios/${id}` } });
    }
    setBooking(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await api.post(`/studios/${id}/reviews`, { rating, comment });
      setStudio((s) => ({ ...s, ...res }));
      setComment('');
      toast.success('Thanks! Your review has been posted.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="container-x py-10">
      <nav className="mb-6 text-xs text-mute">
        <Link to="/" className="hover:text-amber">Home</Link> / <Link to="/studios" className="hover:text-amber">Studios</Link> / <span className="text-cream">{studio.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="h-[320px] overflow-hidden rounded-2xl border border-line sm:h-[460px]">
            {gallery.map((g, i) => (
              <SwiperSlide key={g + i}>
                <SmartImage src={g} alt={`${studio.title} photo ${i + 1}`} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="badge bg-amber text-ink">{studio.category}</span>
            <RatingBadge rating={studio.rating} count={studio.reviewCount} />
          </div>
          <h1 className="section-title mt-4">{studio.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-mute"><FaMapMarkerAlt className="text-amber" /> {studio.location}</p>

          <h2 className="mt-10 font-display text-2xl font-bold">About this space</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-cream/80">{studio.overview}</p>

          <h2 className="mt-10 font-display text-2xl font-bold">Amenities</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {studio.amenities?.map((a) => (
              <li key={a} className="flex items-center gap-3 text-sm text-cream/85"><FaCheckCircle className="shrink-0 text-amber" /> {a}</li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl font-bold">Reviews ({studio.reviewCount || 0})</h2>
          {studio.reviews?.length ? (
            <div className="mt-5 space-y-4">
              {studio.reviews.map((r) => (
                <div key={r.email} className="card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-amber/15 font-bold text-amber">{r.name[0]}</span>
                      <div>
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-xs text-mute">{new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-cream/80">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-mute">No reviews yet. Be the first to share your experience.</p>
          )}

          {user && !isOwner && (
            <form onSubmit={submitReview} className="card mt-6 p-6">
              <h3 className="font-display text-lg font-bold">Leave a review</h3>
              <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? 'text-amber' : 'text-line'}`} aria-label={`${n} stars`}>★</button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} required minLength={5} maxLength={600} placeholder="How was the space, the gear and the host?" className="input mt-3 resize-none" />
              <button disabled={posting} className="btn-primary btn-sm mt-4">{posting ? 'Posting…' : 'Post review'}</button>
            </form>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-7">
            <p className="text-3xl font-bold">{money(studio.hourlyRate)} <span className="text-base font-normal text-mute">/ hour</span></p>
            <ul className="mt-5 space-y-3 text-sm text-cream/85">
              <li className="flex items-center gap-3"><FaShieldAlt className="text-amber" /> Security deposit: {money(studio.securityDeposit)}</li>
              <li className="flex items-center gap-3"><FaUsers className="text-amber" /> Up to {studio.maxCapacity} people</li>
            </ul>
            {isOwner ? (
              <Link to={`/studios/edit/${studio._id}`} className="btn-ghost mt-6 w-full">Edit your listing</Link>
            ) : (
              <button onClick={book} className="btn-primary mt-6 w-full">Book Workspace Now</button>
            )}
            <p className="mt-3 text-center text-xs text-mute">You won't be charged until the host confirms.</p>
          </div>

          <div className="card mt-6 p-6">
            <p className="label">Hosted by</p>
            <div className="mt-3 flex items-center gap-3">
              {studio.ownerPhoto ? (
                <img src={studio.ownerPhoto} alt={studio.ownerName} referrerPolicy="no-referrer" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-amber font-bold text-ink">{studio.ownerName?.[0]}</span>
              )}
              <div>
                <p className="font-semibold">{studio.ownerName}</p>
                <p className="text-xs text-mute">{studio.ownerEmail}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {booking && <BookingModal open={booking} onClose={() => setBooking(false)} studio={studio} />}
    </div>
  );
}
