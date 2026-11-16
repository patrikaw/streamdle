// Guarda en data/actividad.json el resumen de un mes de cada streamer (horas, directos, días activos),
// porque Twitch y Kick solo conservan los directos ~60 días y así el historial no se pierde.
//
//   node scripts/actividad-mensual.mjs                  -> mes anterior (calendario UTC)
//   node scripts/actividad-mensual.mjs --mes=2026-10    -> un mes puntual
//   node scripts/actividad-mensual.mjs --solo=ibai,zeling

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sesionesDe, resumen } from '../lib/actividad.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVO = path.join(RAIZ, 'data', 'actividad.json');
const args = process.argv.slice(2);
const SOLO = new Set((args.find((a) => a.startsWith('--solo=')) || '').split('=')[1]?.toLowerCase().split(',').filter(Boolean));

function cargarEnv() {
  const ruta = path.join(RAIZ, '.env.local');
  if (!fs.existsSync(ruta)) return;
  for (const l of fs.readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
cargarEnv();

const hoy = new Date();
const porDefecto = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - 1, 1));
const mes = (args.find((a) => a.startsWith('--mes=')) || '').split('=')[1] || `${porDefecto.getUTCFullYear()}-${String(porDefecto.getUTCMonth() + 1).padStart(2, '0')}`;
const [anio, nMes] = mes.split('-').map(Number);
const desde = Date.UTC(anio, nMes - 1, 1);
const hasta = Date.UTC(anio, nMes, 1);

const { TWITCH_CLIENT_ID: clientId, TWITCH_CLIENT_SECRET: secreto } = process.env;
let token = null;
if (clientId && secreto) {
  const t = await (await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: secreto, grant_type: 'client_credentials' }),
  })).json();
  token = t.access_token || null;
}
if (!token) console.log('Aviso: sin token de Twitch, solo se consulta Kick.');

const streamers = [];
for (const l of fs.readFileSync(path.join(RAIZ, 'data', 'streamers.js'), 'utf8').split(/\r?\n/)) {
  if (/^  \{id:\d+,/.test(l)) streamers.push(new Function(`return ${l.trim().replace(/,$/, '')}`)());
}
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');

const datos = fs.existsSync(ARCHIVO) ? JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')) : {};
let guardados = 0;
for (const s of streamers) {
  const slug = slugDe(s);
  if (SOLO.size && !SOLO.has(slug)) continue;
  if (!s.is_active && !SOLO.size) continue;
  try {
    const ses = await sesionesDe(s, { token, clientId });
    const r = resumen(ses, desde, hasta, s.country);
    if (r) {
      datos[slug] = { ...(datos[slug] || {}), [mes]: { h: Math.round(r.horas), s: r.sesiones, d: r.diasActivos } };
      guardados++;
    }
  } catch { /* se sigue con el siguiente */ }
  await new Promise((r) => setTimeout(r, s.kick ? 400 : 80));
}
fs.writeFileSync(ARCHIVO, JSON.stringify(datos));
console.log(`Mes ${mes}: ${guardados} streamers guardados.`);
