import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { api } from '../lib/api';
import { money } from '../lib/constants';

const pad = (n) => String(n).padStart(2, '0');
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function BookingModal({ open, onClose, studio }) {
  const navigate = useNavigate();
  const [date, setDate] = useState(today());
  const [startHour, setStartHour] = useState(9);
  const [hours, setHours] = useState(2);
  const [note, setNote] = useState('');
  const [taken, setTaken] = useState([]);
  const [busy, setBusy] = useState(false);

  // Live availability for the chosen date
  useEffect(() => {
    if (!open || !date) return;
    let cancelled = false;
    api
      .get(`/studios/${studio._id}/availability?date=${date}`)
      .then((s) => !cancelled && setTaken(s))
      .catch(() => !cancelled && setTaken([]));
    return () => {
      cancelled = true;
    };
  }, [open, date, studio._id]);

  const isTaken = (h) => taken.some((t) => h >= t.startHour && h < t.endHour);
  const nowHour = new Date().getHours();
  const isPast = (h) => date === today() && h <= nowHour;

  const conflict = useMemo(() => {
    for (let h = startHour; h < startHour + hours; h++) if (isTaken(h)) return true;
    return startHour + hours > 24 || isPast(startHour);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startHour, hours, taken, date]);

  const total = studio.hourlyRate * hours + studio.securityDeposit;

  const submit = async (e) => {
    e.preventDefault();
    if (conflict) return toast.error('Those hours are not available. Please adjust your selection.');
    setBusy(true);
    try {
      await api.post('/bookings', { studioId: studio._id, date, startTime: `${pad(startHour)}:00`, hours, note });
      toast.success('Booking request sent! The host will confirm shortly.');
      onClose();
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book ${studio.title}`} wide>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="b-date">Date</label>
            <input id="b-date" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="b-hours">Duration</label>
            <select id="b-hours" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="input">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="label">Start time</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {Array.from({ length: 16 }, (_, i) => i + 7).map((h) => {
              const disabled = isTaken(h) || isPast(h);
              return (
                <button
                  type="button"
                  key={h}
                  disabled={disabled}
                  onClick={() => setStartHour(h)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    startHour === h ? 'border-amber bg-amber text-ink' : 'border-line text-cream hover:border-amber'
                  } ${disabled ? 'cursor-not-allowed line-through opacity-30 hover:border-line' : ''}`}
                >
                  {pad(h)}:00
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-mute">Struck-through hours are already reserved.</p>
        </div>

        <div>
          <label className="label" htmlFor="b-note">Note for the host (optional)</label>
          <textarea id="b-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={400} placeholder="Tell the host about your shoot, crew size or gear…" className="input resize-none" />
        </div>

        <div className="rounded-xl border border-line bg-raised p-4 text-sm">
          <div className="flex justify-between text-mute"><span>{money(studio.hourlyRate)} × {hours} hr</span><span>{money(studio.hourlyRate * hours)}</span></div>
          <div className="mt-1 flex justify-between text-mute"><span>Refundable security deposit</span><span>{money(studio.securityDeposit)}</span></div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Total</span><span className="text-amber">{money(total)}</span></div>
        </div>

        <button disabled={busy || conflict} className="btn-primary w-full">{busy ? 'Sending request…' : 'Confirm Booking Request'}</button>
      </form>
    </Modal>
  );
}
