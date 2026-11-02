import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrash, FaCameraRetro } from 'react-icons/fa';
import { api } from '../lib/api';
import { money } from '../lib/constants';
import useTitle from '../lib/useTitle';
import { ConfirmModal } from '../components/Modal';
import { EmptyState, PageHeader, SmartImage, Spinner } from '../components/ui';

export default function MyListings() {
  useTitle('My Studio Listings');
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/studios/mine', true).then(setStudios).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const remove = async () => {
    setBusy(true);
    try {
      await api.del(`/studios/${target._id}`);
      setStudios((s) => s.filter((x) => x._id !== target._id));
      toast.success(`"${target.title}" has been deleted.`);
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Host dashboard" title="My Studio Listings" sub="Update pricing, refresh photos or remove spaces you no longer offer.">
        <Link to="/add-studio" className="btn-primary btn-sm"><FaPlus /> Add New Studio</Link>
      </PageHeader>
      <div className="container-x py-10">
        {loading ? (
          <Spinner label="Loading your listings" />
        ) : studios.length === 0 ? (
          <EmptyState icon={<FaCameraRetro />} title="You haven't listed a studio yet" text="Share your space with creators and start earning from the hours it sits empty." actionLabel="List your first studio" actionTo="/add-studio" />
        ) : (
          <div className="card overflow-hidden">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-line px-6 py-4 text-xs font-semibold uppercase tracking-wider text-mute md:grid">
              <span>Studio</span><span>Category</span><span>Rate</span><span>Rating</span><span className="w-44 text-right">Actions</span>
            </div>
            {studios.map((s) => (
              <div key={s._id} className="grid items-center gap-4 border-b border-line px-6 py-5 last:border-0 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                <div className="flex items-center gap-4">
                  <SmartImage src={s.image} alt={s.title} className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <Link to={`/studios/${s._id}`} className="line-clamp-1 font-semibold hover:text-amber">{s.title}</Link>
                    <p className="line-clamp-1 text-xs text-mute">{s.location}</p>
                  </div>
                </div>
                <span className="text-sm text-cream/85">{s.category}</span>
                <span className="text-sm font-semibold">{money(s.hourlyRate)} / hr</span>
                <span className="text-sm text-cream/85">{s.rating ? `${s.rating.toFixed(1)} ★ (${s.reviewCount})` : 'No reviews'}</span>
                <div className="flex gap-2 md:w-44 md:justify-end">
                  <Link to={`/studios/edit/${s._id}`} className="btn-ghost btn-sm"><FaEdit /> Update</Link>
                  <button onClick={() => setTarget(s)} className="btn-danger btn-sm"><FaTrash /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!target}
        onClose={() => !busy && setTarget(null)}
        onConfirm={remove}
        busy={busy}
        title="Delete this studio?"
        message={`"${target?.title}" will be permanently removed and any pending or confirmed bookings will be cancelled. This can't be undone.`}
        confirmLabel="Yes, delete it"
      />
    </>
  );
}
