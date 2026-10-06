// GitHub Pages has no server-side routing. Serving index.html as 404.html makes direct links
// such as /<repo>/dashboard or a page refresh load the React app instead of a GitHub 404 page.
import { copyFileSync, writeFileSync, existsSync } from 'node:fs';
if (!existsSync('dist/index.html')) { console.error('dist/index.html missing'); process.exit(1); }
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('postbuild: created dist/404.html and dist/.nojekyll');
