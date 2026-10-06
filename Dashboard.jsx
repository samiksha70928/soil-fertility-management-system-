import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { FlaskConical, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'; import api, { errMsg } from '../services/api'; import { Spinner } from '../components/Layout';
export const COLORS = { Excellent: '#15803d', Good: '#65a30d', Moderate: '#eab308', Poor: '#f97316', Critical: '#dc2626' };
export const Stat = ({ icon: I, v, l }) => <div className="card stat"><div className="ic"><I /></div><div><b>{v ?? 0}</b><span>{l}</span></div></div>;
export const toArr = o => Object.entries(o || {}).map(([name, value]) => ({ name, value }));
export default function Dashboard() {
  const [s, setS] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api.get('/dashboard/stats').then(r => setS(r.data)).catch(e => setErr(errMsg(e))); }, []);
  if (err) return <div className="page"><div className="err">{err}</div></div>; if (!s) return <Spinner />;
  const L = s.latest, nut = L ? [['pH', L.ph], ['N', L.nitrogen], ['P', L.phosphorus], ['K', L.potassium], ['OC', L.organicCarbon], ['Moist', L.moisture]].map(([name, value]) => ({ name, value })) : [];
  return (<div className="page"><h2>Welcome, Farmer</h2>
    <div className="grid g4"><Stat icon={FlaskConical} v={s.totalTests} l="Total Soil Tests" /><Stat icon={ShieldCheck} v={s.healthy} l="Healthy Soil Tests" /><Stat icon={AlertTriangle} v={s.deficient} l="Nutrient Deficient Tests" /><Stat icon={FileText} v={s.reports} l="Reports Generated" /></div>
    {!L ? <div className="card empty">No soil tests yet. <Link to="/test" className="btn sm">Add your first soil test</Link></div> : <>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}><div><span style={{ color: 'var(--mu)' }}>Latest soil health</span><h2>{L.healthScore}/100 <span className={`badge ${L.fertilityLevel}`}>{L.fertilityLevel}</span></h2><p>Deficiencies: {L.deficiencies.join(', ') || 'None'}</p></div><Link className="btn" to={`/test/${L._id}`}>View crops, fertilizers & tips</Link></div>
      <div className="grid g2"><div className="card"><h3>Nutrient overview (latest)</h3><ResponsiveContainer height={240}><BarChart data={nut}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="card"><h3>Soil health status</h3><ResponsiveContainer height={240}><PieChart><Pie data={toArr(s.distribution)} dataKey="value" nameKey="name" outerRadius={85} label>{toArr(s.distribution).map(d => <Cell key={d.name} fill={COLORS[d.name]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>
      <div className="card"><h3>Test history (tests per month)</h3><ResponsiveContainer height={220}><BarChart data={toArr(s.testsPerMonth)}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <div className="card"><h3>Recent soil tests</h3><div className="tw"><table><tbody>{s.recent.map(t => <tr key={t._id}><td>{new Date(t.testDate).toLocaleDateString()}</td><td>{t.village || t.location}</td><td>{t.healthScore}/100</td><td><span className={`badge ${t.fertilityLevel}`}>{t.fertilityLevel}</span></td><td><Link to={`/test/${t._id}`} style={{ color: 'var(--g)' }}>View</Link></td></tr>)}</tbody></table></div></div></>}</div>);
}
