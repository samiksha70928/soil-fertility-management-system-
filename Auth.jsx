import { useState } from 'react'; import { Link, useNavigate } from 'react-router-dom'; import { Eye, EyeOff } from 'lucide-react'; import api, { errMsg } from '../services/api'; import { useAuth } from '../context/AuthContext';
export function Login() {
  const { login } = useAuth(), nav = useNavigate(); const [f, setF] = useState({ email: '', password: '' }), [show, setShow] = useState(false), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const submit = async e => { e.preventDefault(); setErr(''); if (!f.email || !f.password) return setErr('Email and password are required'); setBusy(true);
    try { const u = await login(f.email, f.password); nav(u.role === 'admin' ? '/admin' : '/dashboard'); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  return (<div className="auth"><form className="card grid" onSubmit={submit}><h2>Login to SoilCare</h2>{err && <div className="err">{err}</div>}
    <div><label>Email</label><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
    <div><label>Password</label><div style={{ position: 'relative' }}><input type={show ? 'text' : 'password'} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
      <span onClick={() => setShow(!show)} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</span></div></div>
    <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button><p>New farmer? <Link to="/register" style={{ color: 'var(--g)' }}>Register</Link></p></form></div>);
}
const init = { name: '', email: '', phone: '', password: '', confirm: '', location: '', village: '', district: '', state: '' };
export function Register() {
  const nav = useNavigate(), [f, setF] = useState(init), [err, setErr] = useState(''), [busy, setBusy] = useState(false); const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setErr('');
    if (!f.name || !f.email || !f.phone || !f.password) return setErr('Please fill all required fields'); if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Invalid email');
    if (!/^[0-9+\-\s]{7,15}$/.test(f.phone)) return setErr('Invalid phone number'); if (f.password.length < 6) return setErr('Password must be at least 6 characters'); if (f.password !== f.confirm) return setErr('Passwords do not match');
    setBusy(true); try { const { confirm, ...body } = f; await api.post('/auth/register', body); nav('/login'); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  const I = (k, l, t = 'text') => <div key={k}><label>{l}</label><input type={t} value={f[k]} onChange={set(k)} /></div>;
  return (<div className="auth"><form className="card grid" style={{ maxWidth: 640 }} onSubmit={submit}><h2>Create your account</h2>{err && <div className="err">{err}</div>}
    <div className="form">{I('name', 'Full Name *')}{I('email', 'Email *', 'email')}{I('phone', 'Phone *')}{I('password', 'Password *', 'password')}{I('confirm', 'Confirm Password *', 'password')}{I('location', 'Location')}{I('village', 'Village')}{I('district', 'District')}{I('state', 'State')}</div>
    <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button><p>Already registered? <Link to="/login" style={{ color: 'var(--g)' }}>Login</Link></p></form></div>);
}
