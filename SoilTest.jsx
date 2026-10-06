import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import api, { errMsg } from '../services/api'; import { useAuth } from '../context/AuthContext';
export default function SoilTest() {
  const { user } = useAuth(), nav = useNavigate();
  const [f, setF] = useState({ farmerName: user.name, location: user.location || '', village: user.village || '', district: user.district || '', state: user.state || '', ph: '', nitrogen: '', phosphorus: '', potassium: '', organicCarbon: '', moisture: '', soilType: 'Loamy', crop: '', previousCrop: '', irrigationType: 'Canal', testDate: new Date().toISOString().slice(0, 10), notes: '' });
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false); const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setErr('');
    const nums = ['ph', 'nitrogen', 'phosphorus', 'potassium', 'organicCarbon', 'moisture']; if (nums.some(k => f[k] === '' || isNaN(f[k]) || +f[k] < 0)) return setErr('Enter valid non-negative numbers for all soil parameters');
    if (+f.ph > 14) return setErr('pH must be between 0 and 14'); if (+f.organicCarbon > 100 || +f.moisture > 100) return setErr('Organic carbon and moisture are percentages (0–100)');
    setBusy(true); try { const { data } = await api.post('/soil-tests', f); nav(`/test/${data._id}`); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  const T = (k, l, t = 'text', extra = {}) => <div key={k}><label>{l}</label><input type={t} value={f[k]} onChange={set(k)} {...extra} /></div>;
  const S = (k, l, opts) => <div key={k}><label>{l}</label><select value={f[k]} onChange={set(k)}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>;
  return (<form className="page" onSubmit={submit}><h2>New Soil Test</h2>{err && <div className="err">{err}</div>}
    <div className="card grid"><h3>Farmer & location</h3><div className="form">{T('farmerName', 'Farmer Name')}{T('location', 'Location')}{T('village', 'Village')}{T('district', 'District')}{T('state', 'State')}</div></div>
    <div className="card grid"><h3>Soil parameters</h3><div className="form">{T('ph', 'pH (0–14)', 'number', { step: '0.1' })}{T('nitrogen', 'Nitrogen N (kg/ha)', 'number')}{T('phosphorus', 'Phosphorus P (kg/ha)', 'number')}{T('potassium', 'Potassium K (kg/ha)', 'number')}{T('organicCarbon', 'Organic Carbon (%)', 'number', { step: '0.01' })}{T('moisture', 'Moisture (%)', 'number')}</div></div>
    <div className="card grid"><h3>Additional details</h3><div className="form">{S('soilType', 'Soil Type', ['Loamy', 'Sandy', 'Clay', 'Black', 'Red'])}{T('crop', 'Current Crop')}{T('previousCrop', 'Previous Crop')}{S('irrigationType', 'Irrigation', ['Canal', 'Drip', 'Sprinkler', 'Well/Borewell', 'Rainfed'])}{T('testDate', 'Test Date', 'date')}</div>
      <div><label>Notes</label><textarea rows="3" value={f.notes} onChange={set('notes')} /></div></div>
    <button className="btn" disabled={busy}>{busy ? 'Analyzing…' : 'Submit & Analyze'}</button></form>);
}
