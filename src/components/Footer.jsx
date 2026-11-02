import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Logo, XIcon } from './ui';
import { CATEGORIES } from '../lib/constants';

const social = [
  { label: 'X', href: 'https://x.com', icon: <XIcon /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <FaInstagram /> },
  { label: 'Facebook', href: 'https://facebook.com', icon: <FaFacebookF /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: <FaLinkedinIn /> },
  { label: 'YouTube', href: 'https://youtube.com', icon: <FaYoutube /> },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email address.');
    toast.success('You are on the list! Watch your inbox for new studios.');
    setEmail('');
  };

  return (
    <footer className="mt-24 border-t border-line bg-panel">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
            Our mission is simple: put every great creative space within reach of every creator, with honest prices and instant booking.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full border border-line text-cream/80 transition hover:border-amber hover:text-amber">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">Quick Links</h4>
          <ul className="space-y-3 text-sm text-mute">
            {[['/', 'Home'], ['/studios', 'Explore Studios'], ['/how-it-works', 'How It Works'], ['/about', 'About Us'], ['/add-studio', 'Host Your Space']].map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-amber">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">Popular Categories</h4>
          <ul className="space-y-3 text-sm text-mute">
            {CATEGORIES.map((c) => (
              <li key={c.value}><Link to={`/studios?category=${encodeURIComponent(c.value)}`} className="hover:text-amber">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">Studio Newsletter</h4>
          <p className="text-sm text-mute">New spaces and host tips, once a fortnight.</p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input" aria-label="Email address" />
            <button className="btn-primary btn-sm shrink-0">Join</button>
          </form>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-mute sm:flex-row">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}
