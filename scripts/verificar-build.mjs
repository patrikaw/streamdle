// Se ejecuta solo después de `npm run build` (postbuild). Si algo esencial falta en el sitio generado,
// el build falla y no se publica. Nació de dos errores reales: una ficha sin sus secciones y un 500 en URLs inexistentes.

import fs from 'node:fs';
import path from 'node:path';

const APP = path.join('.next', 'server', 'app');
if (!fs.existsSync(APP)) { console.log('verificar-build: no hay .next/server/app, se omite.'); process.exit(0); }

const errores = [];
const leer = (ruta) => { const f = path.join(APP, ruta); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; };
const exige = (ruta, marcas) => {
  const t = leer(ruta);
  if (t === null) { errores.push(`Falta la página ${ruta}`); return; }
  for (const m of marcas) if (!t.includes(m)) errores.push(`${ruta}: no contiene "${m}"`);
};

// Fichas: secciones que no pueden faltar
for (const f of ['ibai', 'peereira7', 'westcol', 'jelty']) {
  exige(`${f}.html`, ['<h1', 'Sobre ', 'Cuánto sabés de', 'Jugá con streamers']);
}
exige('ibai.html', ['Clip más visto']);

// Juegos: título principal visible para Google en el HTML inicial
for (const g of ['classic', 'chatdle', 'avatardle', 'emojidle', 'edadle', 'higherdle', 'categorydle']) {
  exige(`${g}.html`, ['<h1', 'Preguntas frecuentes']);
}

// Páginas clave
exige('index.html', ['id="novedades"', '<h1', '/ruleta']);
exige('tendencias.html', ['<h1']);
exige('ruleta.html', ['<h1', 'Ruleta de streamers']);
exige('comunidades.html', ['<h1']);

// Una URL inexistente tiene que dar 404 real (el layout de las fichas llama a notFound())
const layout = fs.readFileSync(path.join('app', '[slug]', 'layout.js'), 'utf8');
if (!layout.includes('notFound()')) errores.push('app/[slug]/layout.js ya no llama a notFound(): las URLs inexistentes darían 200 o 500');

// Sitemap coherente: sin páginas noindex y con una cantidad razonable de URLs
const sm = leer('sitemap.xml.body');
if (sm === null) errores.push('Falta sitemap.xml');
else {
  const urls = [...sm.matchAll(/<loc>https:\/\/streamdle\.net([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
  if (urls.length < 250) errores.push(`El sitemap tiene solo ${urls.length} URLs (se esperaban 250 o más)`);
  for (const u of urls) {
    const t = leer(u === '/' ? 'index.html' : `${u.replace(/^\//, '')}.html`);
    if (t && /<meta name="robots" content="[^"]*noindex/.test(t)) errores.push(`En el sitemap pero con noindex: ${u}`);
  }
}

if (errores.length) {
  console.error('\nverificar-build: FALLÓ\n - ' + errores.join('\n - ') + '\n');
  process.exit(1);
}
console.log('verificar-build: todo en orden.');
