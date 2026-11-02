import { auth } from '../firebase/firebase';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, authed = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (authed) {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Please sign in to continue.');
    headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

export const api = {
  get: (path, authed = false) => request(path, { authed }),
  post: (path, body, authed = true) => request(path, { method: 'POST', body, authed }),
  put: (path, body) => request(path, { method: 'PUT', body, authed: true }),
  patch: (path, body) => request(path, { method: 'PATCH', body, authed: true }),
  del: (path) => request(path, { method: 'DELETE', authed: true }),
};

export function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null && v !== 'All') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** Upload an image file to imgbb and return its hosted URL. */
export async function uploadImage(file) {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error('Image upload is not configured. Paste an image URL instead.');
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok || !data?.data?.url) throw new Error('Image upload failed. Please try another file.');
  return data.data.url;
}
