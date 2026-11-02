import { Link } from 'react-router-dom';
import useTitle from '../lib/useTitle';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        {/* Clapperboard illustration */}
        <svg viewBox="0 0 240 200" className="mx-auto h-52 w-60" fill="none" aria-hidden="true">
          <ellipse cx="120" cy="186" rx="80" ry="8" fill="#2d2921" />
          <rect x="30" y="76" width="180" height="104" rx="10" fill="#1f1c18" stroke="#f2a33a" strokeWidth="3" />
          <g transform="rotate(-14 30 76)">
            <rect x="30" y="44" width="180" height="32" rx="6" fill="#f2a33a" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M${52 + i * 36} 44 l-14 32 h18 l14 -32z`} fill="#0d0c0a" />
            ))}
          </g>
          <text x="120" y="142" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="44" fill="#f6f0e4">404</text>
          <circle cx="188" cy="100" r="5" fill="#f2a33a" />
        </svg>
        <p className="section-eyebrow mt-6">Cut! Wrong set.</p>
        <h1 className="section-title mt-3">This page isn't on the call sheet</h1>
        <p className="section-sub mx-auto">The page you're looking for was moved, removed or never existed. Let's get you back to the studio.</p>
        <Link to="/" className="btn-primary mt-8">Return to Home</Link>
      </div>
    </div>
  );
}
