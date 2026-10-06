import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE is the public path the site is served from.
//  - Local dev / Render / Netlify / Vercel / custom domain: "/" (default)
//  - GitHub Pages project site: "/<repository-name>/"  (set automatically by the GitHub Actions workflow)
export default defineConfig(() => {
  let base = process.env.VITE_BASE || '/';
  if (!base.startsWith('/')) base = '/' + base;
  if (!base.endsWith('/')) base += '/';
  return { base, plugins: [react()], server: { port: 5173 } };
});
