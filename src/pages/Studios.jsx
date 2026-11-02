import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaSearchMinus } from 'react-icons/fa';
import { api, buildQuery } from '../lib/api';
import useTitle from '../lib/useTitle';
import { CATEGORIES } from '../lib/constants';
import StudioCard from '../components/StudioCard';
import { EmptyState, GridSkeleton, PageHeader } from '../components/ui';

export default function Studios() {
  useTitle('Explore Studios');
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const sort = params.get('sort') || 'newest';
  const maxPrice = params.get('maxPrice') || '';
  const q = params.get('q') || '';

  const [text, setText] = useState(q);
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v && v !== 'All' ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => text !== q && update({ q: text.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/studios${buildQuery({ q, category, sort, maxPrice })}`)
      .then(setStudios)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, category, sort, maxPrice]);

  const reset = () => {
    setText('');
    setParams({}, { replace: true });
  };

  return (
    <>
      <PageHeader eyebrow="Explore" title="Find Your Perfect Studio" sub="Filter by category, budget and rating to find a space that fits the shoot." />
      <div className="container-x py-10">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search by name, city or amenity" className="input pl-11" aria-label="Search studios" />
          </div>
          <select value={maxPrice} onChange={(e) => update({ maxPrice: e.target.value })} className="input" aria-label="Maximum hourly rate">
            <option value="">Any price</option>
            <option value="50">Up to $50 / hr</option>
            <option value="100">Up to $100 / hr</option>
            <option value="150">Up to $150 / hr</option>
          </select>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="input" aria-label="Sort studios">
            <option value="newest">Newest first</option>
            <option value="rating">Top rated</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[{ value: 'All', label: 'All Studios' }, ...CATEGORIES].map((c) => (
            <button key={c.value} onClick={() => update({ category: c.value })} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${category === c.value ? 'border-amber bg-amber text-ink' : 'border-line text-cream/80 hover:border-amber'}`}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading ? (
            <GridSkeleton count={6} />
          ) : error ? (
            <EmptyState icon="!" title="We couldn't load studios" text={error} actionLabel="Try again" onAction={() => window.location.reload()} />
          ) : studios.length === 0 ? (
            <EmptyState icon={<FaSearchMinus />} title="No studios match your search" text="Try a different keyword, widen your budget or clear the filters to see every studio." actionLabel="Clear all filters" onAction={reset} />
          ) : (
            <>
              <p className="mb-5 text-sm text-mute">{studios.length} studio{studios.length > 1 ? 's' : ''} found</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
