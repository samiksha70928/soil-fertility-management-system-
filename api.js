import axios from 'axios';

// Development (npm run dev): falls back to http://localhost:5000/api
// Production build: uses VITE_API_URL (e.g. https://your-backend.onrender.com/api). No localhost in production.
const clean = u => (u || '').trim().replace(/\/+$/, '');
export const API_URL = clean(import.meta.env.VITE_API_URL) || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');
const MISSING = !API_URL;
if (MISSING) console.error('VITE_API_URL is not set. Set it to your deployed backend, e.g. https://your-backend.onrender.com/api');

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

api.interceptors.request.use(c => {
  if (MISSING) return Promise.reject(new Error('The app is not connected to a backend: VITE_API_URL was not set when the site was built.'));
  const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c;
});

// Expired / invalid token -> clear session and send the user to login (not for the login form itself)
api.interceptors.response.use(r => r, e => {
  const url = e.config?.url || '';
  if (e.response?.status === 401 && !url.startsWith('/auth/login') && localStorage.getItem('token')) {
    localStorage.clear();
    window.location.replace(import.meta.env.BASE_URL + 'login');
  }
  return Promise.reject(e);
});

export const errMsg = e => e.response?.data?.message
  || (e.code === 'ECONNABORTED' ? 'The server took too long to respond. It may be waking up (free hosting) — please try again in a minute.'
  : e.request ? 'Cannot reach server. If this is the live site, the backend may be waking up — wait ~1 minute and retry.' : e.message);
export default api;
