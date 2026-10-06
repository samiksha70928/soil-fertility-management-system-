import { useEffect, useState } from 'react'; import { Users, FlaskConical, FileText, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'; import api, { errMsg } from '../services/api'; import { Spinner } from '../components/Layout'; import { Stat, toArr } from './Dashboard';
export default function Admin() {
  const [s, setS] = useState(null), [users, setUsers] = useState([]), [q, setQ] = useState(''), [err, setErr] = useState('');
  const load = () => Promise.all([api.get('/dashboard/stats'), api.get('/users', { params: { search: q } })]).then(([a, b]) => { setS(a.data); setUsers(b.data); }).catch(e => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);
  const toggle = async u => { await api.put(`/users/${u._id}`, { status: u.status === 'active' ? 'disabled' : 'active' }); load(); };
  const del = async u => { if (confirm(`Delete ${u.name}?`)) { try { await api.delete(`/users/${u._id}`); load(); } catch (e) { setErr(errMsg(e)); } } };
  if (!s) return err ? <div className="page"><div className="err">{err}</div></div> : <Spinner />;
  return (<div className="page"><h2>Admin Dashboard</h2>{err && <div className="err">{err}</div>}
    <div className="grid g4"><Stat icon={Users} v={s.totalUsers} l="Total Users" /><Stat icon={FlaskConical} v={s.totalTests} l="Total Soil Tests" /><Stat icon={FileText} v={s.reports} l="Reports" /><Stat icon={ShieldCheck} v={s.healthy} l="Healthy Soils" /><Stat icon={AlertTriangle} v={s.deficient} l="Deficient Soils" /></div>
    <div className="grid g2"><div className="card"><h3>Nutrient deficiency statistics</h3><ResponsiveContainer height={230}><BarChart data={toArr(s.deficiencyStats)}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <div className="card"><h3>Tests per month</h3><ResponsiveContainer height={230}><BarChart data={toArr(s.testsPerMonth)}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    <div className="card grid"><h3>User management</h3><div style={{ display: 'flex', gap: 8 }}><input placeholder="Search users…" value={q} onChange={e => setQ(e.target.value)} /><button className="btn" onClick={load}>Search</button></div>
      <div className="tw"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Role</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map(u => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{u.village || u.location}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td><td><span className={`badge ${u.status}`}>{u.status}</span></td>
        <td style={{ whiteSpace: 'nowrap' }}><button className="btn sm out" onClick={() => toggle(u)}>{u.status === 'active' ? 'Disable' : 'Enable'}</button> <button className="btn sm red" onClick={() => del(u)}>Delete</button></td></tr>)}</tbody></table></div></div></div>);
}
