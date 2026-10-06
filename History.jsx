import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { Eye, Trash2 } from 'lucide-react'; import api, { errMsg } from '../services/api'; import { Spinner } from '../components/Layout';
export default function History() {
  const [tests, setTests] = useState(null), [q, setQ] = useState(''), [lvl, setLvl] = useState(''), [err, setErr] = useState('');
  const load = () => api.get('/soil-tests').then(r => setTests(r.data)).catch(e => setErr(errMsg(e))); useEffect(() => { load(); }, []);
  const del = async id => { if (!confirm('Delete this test?')) return; try { await api.delete(`/soil-tests/${id}`); load(); } catch (e) { setErr(errMsg(e)); } };
  if (!tests) return err ? <div className="page"><div className="err">{err}</div></div> : <Spinner />;
  const rows = tests.filter(t => (!lvl || t.fertilityLevel === lvl) && (t.location + t.village + t.district + t.farmerName).toLowerCase().includes(q.toLowerCase()));
  return (<div className="page"><h2>Test History</h2>{err && <div className="err">{err}</div>}
    <div className="card grid"><div className="form"><input placeholder="Search location / name…" value={q} onChange={e => setQ(e.target.value)} /><select value={lvl} onChange={e => setLvl(e.target.value)}><option value="">All statuses</option>{['Excellent', 'Good', 'Moderate', 'Poor', 'Critical'].map(l => <option key={l}>{l}</option>)}</select></div>
      {rows.length ? <div className="tw"><table><thead><tr><th>Date</th><th>Location</th><th>pH</th><th>N</th><th>P</th><th>K</th><th>OC</th><th>Moist.</th><th>Score</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{rows.map(t => <tr key={t._id}><td>{new Date(t.testDate).toLocaleDateString()}</td><td>{t.village || t.location}</td><td>{t.ph}</td><td>{t.nitrogen}</td><td>{t.phosphorus}</td><td>{t.potassium}</td><td>{t.organicCarbon}</td><td>{t.moisture}</td><td><b>{t.healthScore}</b></td><td><span className={`badge ${t.fertilityLevel}`}>{t.fertilityLevel}</span></td>
          <td style={{ whiteSpace: 'nowrap' }}><Link className="btn sm" to={`/test/${t._id}`}><Eye size={13} />View / Report</Link> <button className="btn sm red" onClick={() => del(t._id)}><Trash2 size={13} /></button></td></tr>)}</tbody></table></div> : <p className="empty">No soil tests found. <Link to="/test" style={{ color: 'var(--g)' }}>Add your first test</Link></p>}</div></div>);
}
