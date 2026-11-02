import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import useTitle from '../lib/useTitle';
import { Logo } from '../components/ui';
import { authMessage } from './Login';

export function passwordError(pw) {
  if (pw.length < 6) return 'Password must be at least 6 characters long.';
  if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter.';
  if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter.';
  return '';
}

export default function Register() {
  useTitle('Register');
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pwErr, setPwErr] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = passwordError(form.password);
    setPwErr(err);
    if (err) return toast.error(err);
    setBusy(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim(), photoURL: form.photoURL.trim() });
      toast.success('Account created! Please log in to continue.');
      navigate('/login');
    } catch (error) {
      toast.error(authMessage(error.code));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    try {
      await googleLogin();
      toast.success('Signed in with Google.');
      navigate('/');
    } catch (err) {
      toast.error(authMessage(err.code));
    }
  };

  return (
    <div className="container-x grid min-h-[calc(100vh-72px)] place-items-center py-12">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-6 text-center font-display text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-center text-sm text-mute">Join creators and hosts booking studios worldwide.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" required value={form.name} onChange={set('name')} className="input" placeholder="Your full name" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={set('email')} className="input" placeholder="you@email.com" />
          </div>
          <div>
            <label className="label" htmlFor="photo">Photo URL</label>
            <input id="photo" type="url" value={form.photoURL} onChange={set('photoURL')} className="input" placeholder="https://…/your-photo.jpg" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={show ? 'text' : 'password'} required value={form.password} onChange={(e) => { set('password')(e); setPwErr(''); }} className="input pr-12" placeholder="Min 6 chars, upper & lower case" aria-invalid={!!pwErr} />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-mute hover:text-amber" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {pwErr && <p role="alert" className="mt-2 text-xs text-red-300">{pwErr}</p>}
          </div>
          <button disabled={busy} className="btn-primary w-full">{busy ? 'Creating account…' : 'Register'}</button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-mute"><span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" /></div>
        <button onClick={onGoogle} className="btn-ghost w-full"><FcGoogle className="text-xl" /> Continue with Google</button>

        <p className="mt-8 text-center text-sm text-mute">
          Already have an account? <Link to="/login" className="font-semibold text-amber hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
