import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { money, STATUS_STYLES } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import useTitle from '../lib/useTitle';
import { EmptyState, PageHeader, Spinner } from '../components/ui';

export default function Dashboard() {
  useTitle('Dashboard');
  const { user } = useAuth();
  const [studios, setStudios] = useState([]);
  const [mine, setMine] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');

  useEffect(() => {
    Promise.all([api.get('/studios/mine', true), api.get('/bookings/mine', true), api.get('/bookings/requests', true)])
      .then(([s, m, r]) => {
        setStudios(s);
        setMine(m);
        setRequests(r);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const earnings = useMemo(
    () => requests.filter((r) => r.status === 'Completed' || r.status === 'Confirmed').reduce((s, r) => s + r.hourlyRate * r.hours, 0),
    [requests]
  );

  const setStatus = async (b, status) => {
    setWorking(b._id + status);
    try {
      await api.patch(`/bookings/${b._id}/status`, { status });
      setRequests((rs) => rs.map((r) => (r._id === b._id ? { ...r, status } : r)));
      toast.success(`Booking marked as ${status.toLowerCase()}.`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setWorking('');
    }
  };

  if (loading) return <Spinner label="Loading dashboard" />;

  const stats = [
    { label: 'Active listings', value: studios.length },
    { label: 'Pending requests', value: requests.filter((r) => r.status === 'Pending').length },
    { label: 'My bookings', value: mine.length },
    { label: 'Host earnings', value: money(earnings) },
  ];

  return (
    <>
      <PageHeader eyebrow="Overview" title={`Hello, ${user.displayName?.split(' ')[0] || 'creator'}`} sub="Everything about your studios and sessions in one place.">
        <Link to="/add-studio" className="btn-primary btn-sm">Add New Studio</Link>
      </PageHeader>
      <div className="container-x py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-mute">{s.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-amber">{s.value}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold">Booking requests for your studios</h2>
        <div className="mt-5">
          {requests.length === 0 ? (
            <EmptyState icon="📥" title="No requests yet" text="When creators book your studios, their requests will land here for you to confirm." actionLabel="Manage listings" actionTo="/my-listings" />
          ) : (
            <div className="card divide-y divide-line">
              {requests.map((r) => (
                <div key={r._id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold">{r.studioTitle}</p>
                      <span className={`badge ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-mute">{r.bookerName} · {r.bookerEmail}</p>
                    <p className="mt-1 text-sm text-cream/80">{r.date} · {r.startTime}–{r.endTime} · {money(r.total)}</p>
                    {r.note && <p className="mt-2 text-sm italic text-mute">“{r.note}”</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.status === 'Pending' && (
                      <>
                        <button disabled={!!working} onClick={() => setStatus(r, 'Confirmed')} className="btn-primary btn-sm">{working === r._id + 'Confirmed' ? 'Saving…' : 'Confirm'}</button>
                        <button disabled={!!working} onClick={() => setStatus(r, 'Cancelled')} className="btn-danger btn-sm">Decline</button>
                      </>
                    )}
                    {r.status === 'Confirmed' && (
                      <>
                        <button disabled={!!working} onClick={() => setStatus(r, 'Completed')} className="btn-primary btn-sm">Mark Completed</button>
                        <button disabled={!!working} onClick={() => setStatus(r, 'Cancelled')} className="btn-danger btn-sm">Cancel</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
