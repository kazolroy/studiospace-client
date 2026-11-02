import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FALLBACK_IMG } from '../lib/constants';

/** Aperture logo mark + wordmark – identical in navbar and footer. */
export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="StudioSpace home">
      <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" stroke="#f2a33a" strokeWidth="2" strokeLinecap="round">
        <circle cx="16" cy="16" r="12" />
        <path d="M16 4l5 9M28 12l-11 2M25 25l-5-8M10 27l4-10M4 20l10-4M7 7l9 7" />
      </svg>
      <span className="font-display text-2xl font-bold tracking-tight text-cream">
        Studio<span className="text-amber">Space</span>
      </span>
    </Link>
  );
}

/** The new X logo (not the old Twitter bird). */
export function XIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SmartImage({ src, alt, className = '' }) {
  return (
    <img
      src={src || FALLBACK_IMG}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK_IMG;
      }}
    />
  );
}

export function Stars({ value = 0, size = 'text-sm' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-amber ${size}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(value) ? <FaStar key={n} /> : <FaRegStar key={n} />))}
    </span>
  );
}

export function RatingBadge({ rating, count }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-cream backdrop-blur">
      <FaStar className="text-amber" />
      {rating ? rating.toFixed(1) : 'New'}
      {count > 0 && <span className="font-normal text-mute">({count})</span>}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, sub, center = false }) {
  return (
    <div className={center ? 'mx-auto text-center' : ''}>
      {eyebrow && <p className="section-eyebrow mb-3">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {sub && <p className={`section-sub ${center ? 'mx-auto' : ''}`}>{sub}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, text, actionLabel, actionTo, onAction }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-amber/10 text-3xl text-amber">{icon}</div>
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-mute">{text}</p>
      {actionLabel &&
        (actionTo ? (
          <Link to={actionTo} className="btn-primary mt-6">{actionLabel}</Link>
        ) : (
          <button onClick={onAction} className="btn-primary mt-6">{actionLabel}</button>
        ))}
    </div>
  );
}

/* ---------- Loading states ---------- */
export function Spinner({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 32 32" className="h-14 w-14 animate-spin" fill="none" stroke="#f2a33a" strokeWidth="2" strokeLinecap="round" style={{ animationDuration: '1.6s' }}>
          <circle cx="16" cy="16" r="12" opacity=".35" />
          <path d="M16 4l5 9M28 12l-11 2M25 25l-5-8M10 27l4-10M4 20l10-4M7 7l9 7" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mute">{label}…</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, children }) {
  return (
    <div className="border-b border-line bg-gradient-to-b from-raised/60 to-transparent">
      <div className="container-x flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-end">
        <div>
          {eyebrow && <p className="section-eyebrow mb-3">{eyebrow}</p>}
          <h1 className="section-title">{title}</h1>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
