import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaImage, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { AMENITIES, CATEGORIES } from '../lib/constants';
import { uploadImage } from '../lib/api';
import { SmartImage } from './ui';

const empty = {
  title: '', category: '', hourlyRate: '', securityDeposit: '', maxCapacity: '',
  location: '', image: '', gallery: '', amenities: [], overview: '',
};

/** Shared form for Add + Update studio. `initial` pre-fills when editing. */
export default function StudioForm({ initial, onSubmit, submitLabel, busyLabel }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() =>
    initial ? { ...empty, ...initial, gallery: (initial.gallery || []).slice(1).join('\n') } : empty
  );
  const [custom, setCustom] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (a) =>
    setForm((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    if (!form.amenities.includes(v)) setForm((f) => ({ ...f, amenities: [...f.amenities, v] }));
    setCustom('');
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Please choose a category.');
    if (form.amenities.length === 0) return toast.error('Select at least one amenity.');
    setBusy(true);
    try {
      await onSubmit({
        ...form,
        gallery: form.gallery.split(/\n|,/).map((s) => s.trim()).filter(Boolean),
      });
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-6 p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">Studio title</label>
          <input id="title" required minLength={3} value={form.title} onChange={set('title')} className="input" placeholder="e.g. Halo Cyclorama Loft" />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" required value={form.category} onChange={set('category')} className="input">
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.value}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="maxCapacity">Max capacity (people)</label>
          <input id="maxCapacity" type="number" min="1" required value={form.maxCapacity} onChange={set('maxCapacity')} className="input" placeholder="10" />
        </div>
        <div>
          <label className="label" htmlFor="hourlyRate">Hourly rate ($)</label>
          <input id="hourlyRate" type="number" min="1" step="1" required value={form.hourlyRate} onChange={set('hourlyRate')} className="input" placeholder="65" />
        </div>
        <div>
          <label className="label" htmlFor="securityDeposit">Security deposit ($)</label>
          <input id="securityDeposit" type="number" min="0" step="1" required value={form.securityDeposit} onChange={set('securityDeposit')} className="input" placeholder="150" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="location">Location / address</label>
          <input id="location" required minLength={3} value={form.location} onChange={set('location')} className="input" placeholder="Street, neighbourhood, city" />
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="image">Cover image URL</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="image" type="url" required value={form.image} onChange={set('image')} className="input" placeholder="https://…/studio.jpg" />
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <button type="button" onClick={() => fileRef.current.click()} disabled={uploading} className="btn-ghost shrink-0">
              <FaImage /> {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {form.image && <SmartImage src={form.image} alt="Cover preview" className="mt-3 h-40 w-full max-w-xs rounded-xl border border-line object-cover" />}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="gallery">Extra gallery images (one URL per line, optional)</label>
          <textarea id="gallery" rows={3} value={form.gallery} onChange={set('gallery')} className="input resize-none" placeholder="https://…/angle-2.jpg" />
        </div>
      </div>

      <div>
        <p className="label">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {[...new Set([...AMENITIES, ...form.amenities])].map((a) => {
            const on = form.amenities.includes(a);
            return (
              <button type="button" key={a} onClick={() => toggle(a)} aria-pressed={on} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${on ? 'border-amber bg-amber text-ink' : 'border-line text-cream/80 hover:border-amber'}`}>
                {a}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex max-w-sm gap-2">
          <input value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())} className="input" placeholder="Add your own amenity" />
          <button type="button" onClick={addCustom} className="btn-ghost btn-sm shrink-0" aria-label="Add amenity"><FaPlus /></button>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="overview">Detailed overview</label>
        <textarea id="overview" required minLength={20} rows={5} value={form.overview} onChange={set('overview')} className="input resize-none" placeholder="Describe the space, the light, the gear included and house rules." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Host name</label>
          <input readOnly value={user?.displayName || ''} className="input cursor-not-allowed opacity-70" />
        </div>
        <div>
          <label className="label">Host email</label>
          <input readOnly value={user?.email || ''} className="input cursor-not-allowed opacity-70" />
        </div>
      </div>

      <button disabled={busy} className="btn-primary w-full sm:w-auto">{busy ? busyLabel : submitLabel}</button>
    </form>
  );
}
