import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Logo } from './ui';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/studios', label: 'Explore Studios' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About Us' },
];

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/add-studio', label: 'Add New Studio' },
  { to: '/my-listings', label: 'My Studio Listings' },
  { to: '/my-bookings', label: 'My Bookings' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    setDrop(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setDrop(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('You have been signed out.');
    navigate('/');
  };

  const linkCls = ({ isActive }) =>
    `relative py-2 text-sm font-medium transition hover:text-amber ${isActive ? 'text-amber after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded after:bg-amber' : 'text-cream/80'}`;

  const initial = (user?.displayName || user?.email || '?')[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-lg">
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={ref} onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
              <button onClick={() => setDrop((d) => !d)} className="flex items-center gap-2 rounded-full border border-line p-1 pr-3 hover:border-amber" aria-haspopup="menu" aria-expanded={drop}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Profile'} referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-amber font-bold text-ink">{initial}</span>
                )}
                <FaChevronDown className="text-[10px] text-mute" />
              </button>
              {drop && (
                <div className="absolute right-0 top-full w-64 pt-2">
                  <div className="card overflow-hidden shadow-2xl" role="menu">
                    <div className="border-b border-line px-4 py-3">
                      <p className="truncate font-semibold">{user.displayName || 'Creator'}</p>
                      <p className="truncate text-xs text-mute">{user.email}</p>
                    </div>
                    {menu.map((m) => (
                      <Link key={m.to} to={m.to} role="menuitem" className="block px-4 py-2.5 text-sm text-cream/90 hover:bg-raised hover:text-amber">{m.label}</Link>
                    ))}
                    <button onClick={handleLogout} role="menuitem" className="block w-full border-t border-line px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10">Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Register</Link>
            </div>
          )}
          <button className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-panel lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-lg px-3 py-3 text-sm font-medium ${isActive ? 'bg-amber/10 text-amber' : 'text-cream/85'}`}>{l.label}</NavLink>
            ))}
            {!user && (
              <div className="mt-3 flex gap-3">
                <Link to="/login" className="btn-ghost btn-sm flex-1">Login</Link>
                <Link to="/register" className="btn-primary btn-sm flex-1">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
