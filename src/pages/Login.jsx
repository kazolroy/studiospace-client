import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import useTitle from '../lib/useTitle';
import { Logo } from '../components/ui';

export function authMessage(code) {
  const map = {
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/invalid-email': 'That email address does not look right.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect email or password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

export default function Login() {
  useTitle('Login');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back to StudioSpace!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = authMessage(err.code);
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    try {
      await googleLogin();
      toast.success('Signed in with Google.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(authMessage(err.code));
    }
  };

  return (
    <div className="container-x grid min-h-[calc(100vh-72px)] place-items-center py-12">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-6 text-center font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-mute">Log in to book studios and manage your listings.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@email.com" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="password">Password</label>
              <button type="button" onClick={() => toast('Password reset is coming soon. Contact support for help.', { icon: '🛠️' })} className="mb-1.5 text-xs text-amber hover:underline">Forgot password?</button>
            </div>
            <div className="relative">
              <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pr-12" placeholder="Your password" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-mute hover:text-amber" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button disabled={busy} className="btn-primary w-full">{busy ? 'Logging in…' : 'Login'}</button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-mute"><span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" /></div>
        <button onClick={onGoogle} className="btn-ghost w-full"><FcGoogle className="text-xl" /> Continue with Google</button>

        <p className="mt-8 text-center text-sm text-mute">
          New to StudioSpace? <Link to="/register" className="font-semibold text-amber hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
