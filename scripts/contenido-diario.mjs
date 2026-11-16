// Genera data/contenido.json: los mejores clips de GTA VI en español y de los streamers de Streamdle,
// del último día, la última semana y el último mes. Lo ejecuta un flujo diario y las páginas /clips y /gta-6/clips lo leen.
//
//   node scripts/contenido-diario.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'data', 'contenido.json');

function cargarEnv() {
  const ruta = path.join(RAIZ, '.env.local');
  if (!fs.existsSync(ruta)) return;
  for (const l of fs.readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
cargarEnv();
const { TWITCH_CLIENT_ID: id, TWITCH_CLIENT_SECRET: secreto } = process.env;
if (!id || !secreto) { console.error('Faltan las claves de Twitch.'); process.exit(1); }

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const t = await (await fetch('https://id.twitch.tv/oauth2/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: id, client_secret: secreto, grant_type: 'client_credentials' }),
})).json();
const H = { 'Client-Id': id, Authorization: `Bearer ${t.access_token}` };
const helix = async (ruta) => {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(`https://api.twitch.tv/helix/${ruta}`, { headers: H });
    if (r.ok) return r.json();
    if (![429, 500, 502, 503].includes(r.status)) return null;
    await dormir(1500 * (i + 1));
  }
  return null;
};

const streamers = [];
for (const l of fs.readFileSync(path.join(RAIZ, 'data', 'streamers.js'), 'utf8').split(/\r?\n/)) {
  if (/^  \{id:\d+,/.test(l)) streamers.push(new Function(`return ${l.trim().replace(/,$/, '')}`)());
}
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const propios = streamers.filter((s) => s.twitch);

const VENTANAS = { dia: 1, semana: 7, mes: 30 };
const ahora = Date.now();
const iso = (ms) => new Date(ms).toISOString();
const limpiar = (c, ficha) => ({
  id: c.id, titulo: c.title, url: c.url, miniatura: c.thumbnail_url, vistas: c.view_count, duracion: Math.round(c.duration || 0),
  canal: c.broadcaster_name, login: c.broadcaster_login, idioma: c.language, creado: c.created_at,
  ficha: ficha ? { slug: slugDe(ficha), nombre: ficha.display_name } : null,
});

// ── Ids de los streamers de Streamdle ──
const idsPorLogin = new Map();
for (let i = 0; i < propios.length; i += 100) {
  const q = propios.slice(i, i + 100).map((s) => `login=${encodeURIComponent(s.twitch)}`).join('&');
  const d = await helix(`users?${q}`);
  for (const u of d?.data || []) idsPorLogin.set(u.login.toLowerCase(), u.id);
}
const fichaPorLogin = new Map(propios.map((s) => [s.twitch.toLowerCase(), s]));
console.log(`Streamers con ficha en Twitch: ${propios.length}, con id: ${idsPorLogin.size}`);

// ── GTA VI ──
const cat = await helix(`search/categories?query=${encodeURIComponent('Grand Theft Auto VI')}&first=10`);
const juego = (cat?.data || []).find((c) => c.name === 'Grand Theft Auto VI');
const gta6 = {};
for (const [nombre, dias] of Object.entries(VENTANAS)) {
  gta6[nombre] = [];
  if (!juego) continue;
  const d = await helix(`clips?game_id=${juego.id}&started_at=${iso(ahora - dias * 86400000)}&ended_at=${iso(ahora)}&first=100`);
  gta6[nombre] = (d?.data || []).filter((c) => c.language === 'es' || fichaPorLogin.has((c.broadcaster_login || '').toLowerCase()))
    .sort((a, b) => b.view_count - a.view_count).slice(0, 12)
    .map((c) => limpiar(c, fichaPorLogin.get((c.broadcaster_login || '').toLowerCase())));
}
console.log('GTA VI:', Object.fromEntries(Object.entries(gta6).map(([k, v]) => [k, v.length])));

// ── Mejores clips de los streamers de Streamdle (cualquier juego) ──
const acumulado = { dia: [], semana: [], mes: [] };
for (const s of propios) {
  const bid = idsPorLogin.get(s.twitch.toLowerCase());
  if (!bid) continue;
  for (const [nombre, dias] of Object.entries(VENTANAS)) {
    const d = await helix(`clips?broadcaster_id=${bid}&started_at=${iso(ahora - dias * 86400000)}&ended_at=${iso(ahora)}&first=3`);
    for (const c of d?.data || []) acumulado[nombre].push(limpiar(c, s));
  }
  await dormir(70);
}
const destacados = Object.fromEntries(Object.entries(acumulado).map(([k, v]) => [k, v.sort((a, b) => b.vistas - a.vistas).slice(0, 18)]));
console.log('Destacados:', Object.fromEntries(Object.entries(destacados).map(([k, v]) => [k, v.length])));

if (!destacados.semana.length) { console.error('No se obtuvieron clips: no se escribe el archivo.'); process.exit(1); }
fs.writeFileSync(SALIDA, JSON.stringify({ actualizado: iso(ahora), gta6, destacados, juegoGta6: juego ? { id: juego.id, nombre: juego.name } : null }));
console.log('Guardado:', SALIDA);
