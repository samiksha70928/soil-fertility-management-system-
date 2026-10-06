import React from 'react'; import { createRoot } from 'react-dom/client'; import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'; import { AuthProvider } from './context/AuthContext.jsx'; import './index.css';
// BASE_URL is "/" locally and "/<repo>/" on GitHub Pages, so routes work under both.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
createRoot(document.getElementById('root')).render(<BrowserRouter basename={basename}><AuthProvider><App /></AuthProvider></BrowserRouter>);
