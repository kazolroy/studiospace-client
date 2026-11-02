import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RatingBadge, SmartImage } from './ui';
import { money } from '../lib/constants';

/** Equal-height card used on Home and Explore pages. */
export default function StudioCard({ studio }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-amber/60">
      <div className="relative h-52 overflow-hidden">
        <SmartImage src={studio.image} alt={studio.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="badge absolute left-4 top-4 bg-amber text-ink">{studio.category}</span>
        <div className="absolute bottom-3 right-3">
          <RatingBadge rating={studio.rating} count={studio.reviewCount} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-display text-xl font-bold">{studio.title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-mute">
          <FaMapMarkerAlt className="shrink-0 text-amber" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-lg font-semibold">
            {money(studio.hourlyRate)} <span className="text-sm font-normal text-mute">/ hr</span>
          </p>
          <Link to={`/studios/${studio._id}`} className="btn-ghost btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
