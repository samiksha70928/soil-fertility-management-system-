import { Routes, Route, Navigate } from 'react-router-dom'; import { useAuth } from './context/AuthContext';
import Layout from './components/Layout'; import Landing from './pages/Landing'; import { Login, Register } from './pages/Auth';
import Dashboard from './pages/Dashboard'; import SoilTest from './pages/SoilTest'; import Result from './pages/Result'; import History from './pages/History'; import Admin from './pages/Admin';
const Guard = ({ admin, children }) => { const { user } = useAuth(); if (!user) return <Navigate to="/login" replace />; if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />; return children; };
export default function App() {
  return (<Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route element={<Guard><Layout /></Guard>}>
      <Route path="/dashboard" element={<Dashboard />} /><Route path="/test" element={<SoilTest />} /><Route path="/test/:id" element={<Result />} /><Route path="/history" element={<History />} />
      <Route path="/admin" element={<Guard admin><Admin /></Guard>} />
    </Route><Route path="*" element={<Navigate to="/" />} /></Routes>);
}
