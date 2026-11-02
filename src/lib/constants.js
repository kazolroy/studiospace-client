export const CATEGORIES = [
  { value: 'Photo Studio', label: 'Photo Studios', blurb: 'Cyc walls, daylight lofts & rooftops', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
  { value: 'Film Stage', label: 'Sound Stages', blurb: 'Soundproofed stages with lighting grids', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { value: 'Podcast Lounge', label: 'Podcast Rooms', blurb: 'Camera-ready lounges & booths', img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80' },
  { value: 'Music Suite', label: 'Music Suites', blurb: 'Recording, mixing & rehearsal rooms', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' },
  { value: 'Workshop', label: 'Art Workshops', blurb: 'Pottery, print & painting spaces', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' },
];

export const AMENITIES = [
  'Wi-Fi', 'Natural light', 'Strobe kit', 'Green screen', 'Soundproofing', 'Makeup station',
  'Air conditioning', 'Parking', 'Loading dock', 'Backdrops', 'Monitors', 'Kitchenette',
];

export const STATUS_STYLES = {
  Pending: 'bg-amber/15 text-amber',
  Confirmed: 'bg-emerald-500/15 text-emerald-300',
  Completed: 'bg-sky-500/15 text-sky-300',
  Cancelled: 'bg-red-500/15 text-red-300',
};

export const money = (n) => `$${Number(n || 0).toLocaleString()}`;

export const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#1f1c18"/><g fill="none" stroke="#f2a33a" stroke-width="4" opacity=".6"><circle cx="400" cy="300" r="70"/><path d="M400 230l40 70M470 290l-80 10M450 360l-40-60M380 370l30-80"/></g></svg>`
  );
