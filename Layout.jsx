import { NavLink, Outlet, useNavigate } from 'react-router-dom'; import { Sprout, LayoutDashboard, FlaskConical, History, Shield, LogOut } from 'lucide-react'; import { useAuth } from '../context/AuthContext';
export const Spinner = () => <div className="spin" />;
export default function Layout() {
  const { user, logout } = useAuth(), nav = useNavigate();
  const L = ({ to, icon: I, children }) => <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}><I size={18} />{children}</NavLink>;
  return (<div className="shell"><aside className="side"><div className="logo"><Sprout />SoilCare</div>
    <L to="/dashboard" icon={LayoutDashboard}>Dashboard</L><L to="/test" icon={FlaskConical}>New Soil Test</L><L to="/history" icon={History}>Test History</L>
    {user.role === 'admin' && <L to="/admin" icon={Shield}>Admin</L>}</aside>
    <div className="main"><div className="top"><b>Welcome, {user.name}</b><button className="btn out sm" onClick={() => { logout(); nav('/'); }}><LogOut size={14} />Logout</button></div><Outlet /></div></div>);
}
