import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaRegCalendarTimes } from 'react-icons/fa';
import { api } from '../lib/api';
import { money, STATUS_STYLES } from '../lib/constants';
import useTitle from '../lib/useTitle';
import { ConfirmModal } from '../components/Modal';
import { EmptyState, PageHeader, SmartImage, Spinner } from '../components/ui';

export default function MyBookings() {
  useTitle('My Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/bookings/mine', true).then(setBookings).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const cancel = async () => {
    setBusy(true);
    try {
      await api.patch(`/bookings/${target._id}/status`, { status: 'Cancelled' });
      setBookings((b) => b.map((x) => (x._id === target._id ? { ...x, status: 'Cancelled' } : x)));
      toast.success('Your booking has been cancelled.');
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Your sessions" title="My Bookings" sub="Track every reservation from request to wrap." />
      <div className="container-x py-10">
        {loading ? (
          <Spinner label="Loading your bookings" />
        ) : bookings.length === 0 ? (
          <EmptyState icon={<FaRegCalendarTimes />} title="No bookings yet" text="When you reserve a studio it will appear here so you can follow its status." actionLabel="Explore Studios" actionTo="/studios" />
        ) : (
          <div className="grid gap-5">
            {bookings.map((b) => (
              <div key={b._id} className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                <SmartImage src={b.studioImage} alt={b.studioTitle} className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-40" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link to={`/studios/${b.studioId}`} className="font-display text-xl font-bold hover:text-amber">{b.studioTitle}</Link>
                    <span className={`badge ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-mute">{b.studioLocation}</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-cream/85">
                    <span className="flex items-center gap-2"><FaCalendarAlt className="text-amber" /> {new Date(`${b.date}T00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-2"><FaClock className="text-amber" /> {b.startTime} – {b.endTime} ({b.hours} hr)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-xl font-bold">{money(b.total)}</p>
                  {b.status === 'Pending' && <button onClick={() => setTarget(b)} className="btn-danger btn-sm">Cancel Booking</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!target}
        onClose={() => !busy && setTarget(null)}
        onConfirm={cancel}
        busy={busy}
        title="Cancel this booking?"
        message={`Your pending request for "${target?.studioTitle}" on ${target?.date} will be cancelled and the slot released for other creators.`}
        confirmLabel="Yes, cancel it"
      />
    </>
  );
}
