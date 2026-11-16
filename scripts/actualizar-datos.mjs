// Actualiza seguidores y tipo de cuenta de data/streamers.js desde Twitch (API oficial)
// y Kick (followers_count del endpoint público de canal, la API oficial no lo expone).
//
//   node scripts/actualizar-datos.mjs              -> simula y muestra el reporte
//   node scripts/actualizar-datos.mjs --write      -> aplica los cambios al archivo
//   node scripts/actualizar-datos.mjs --solo=twitch|kick
//   node scripts/actualizar-datos.mjs --force      -> acepta caídas >50% (por defecto se saltean)
//
// Solo toca: twitch_followers, kick_followers, total_followers y broadcaster_type.
// Nunca toca bio, trivia, frases, fechas ni ningún otro campo.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVO = path.join(RAIZ, 'data', 'streamers.js');
const REPORTE = path.join(RAIZ, 'scripts', 'ultimo-reporte.md');

const args = process.argv.slice(2);
const ESCRIBIR = args.includes('--write');
const FORZAR = args.includes('--force');
const SOLO = (args.find((a) => a.startsWith('--solo=')) || '').split('=')[1];

function cargarEnv() {
  const ruta = path.join(RAIZ, '.env.local');
  if (!fs.existsSync(ruta)) return;
  for (const l of fs.readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
cargarEnv();

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// ── Leer el archivo de datos ────────────────────────────────────────────────
const texto = fs.readFileSync(ARCHIVO, 'utf8');
const registros = new Map();
for (const linea of texto.split(/\r?\n/)) {
  if (!/^  \{id:\d+,/.test(linea)) continue;
  const obj = new Function(`return ${linea.trim().replace(/,$/, '')}`)();
  registros.set(obj.id, obj);
}
console.log(`Streamers leídos: ${registros.size}`);

const cambios = new Map(); // id -> { campo: [viejo, nuevo] }
const avisos = [];
const anotar = (s, campo, viejo, nuevo) => {
  if (viejo === nuevo) return;
  if (!cambios.has(s.id)) cambios.set(s.id, {});
  cambios.get(s.id)[campo] = [viejo, nuevo];
};

// Una caída brusca casi siempre es un dato roto, no una baja real.
function numeroCreible(s, campo, viejo, nuevo) {
  if (!Number.isFinite(nuevo) || nuevo < 0) return false;
  if (!FORZAR && viejo > 1000 && nuevo < viejo * 0.5) {
    avisos.push(`${s.display_name}: ${campo} bajaría de ${viejo} a ${nuevo} (más de 50%). Se deja el valor anterior; usá --force si es real.`);
    return false;
  }
  return true;
}

// ── Twitch ──────────────────────────────────────────────────────────────────
async function actualizarTwitch() {
  const { TWITCH_CLIENT_ID: id, TWITCH_CLIENT_SECRET: secreto } = process.env;
  if (!id || !secreto) { avisos.push('Faltan TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET: se saltea Twitch.'); return; }
  const t = await (await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secreto, grant_type: 'client_credentials' }),
  })).json();
  if (!t.access_token) { avisos.push('No se pudo obtener el token de Twitch: se saltea Twitch.'); return; }
  const h = { 'Client-Id': id, Authorization: `Bearer ${t.access_token}` };

  const con = [...registros.values()].filter((s) => s.twitch);
  const usuarios = new Map();
  for (let i = 0; i < con.length; i += 100) {
    const q = con.slice(i, i + 100).map((s) => `login=${encodeURIComponent(s.twitch)}`).join('&');
    const r = await fetch(`https://api.twitch.tv/helix/users?${q}`, { headers: h });
    if (!r.ok) { avisos.push(`Twitch /users respondió ${r.status}.`); continue; }
    for (const u of (await r.json()).data || []) usuarios.set(u.login.toLowerCase(), u);
  }

  for (const s of con) {
    const u = usuarios.get(s.twitch.toLowerCase());
    if (!u) { avisos.push(`${s.display_name}: el login de Twitch "${s.twitch}" ya no existe (¿cambió de nombre o lo borraron?).`); continue; }
    const r = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${u.id}`, { headers: h });
    if (r.ok) {
      const total = (await r.json()).total;
      if (numeroCreible(s, 'twitch_followers', s.twitch_followers, total)) anotar(s, 'twitch_followers', s.twitch_followers, total);
    } else avisos.push(`${s.display_name}: seguidores de Twitch respondió ${r.status}.`);
    if (['partner', 'affiliate'].includes(u.broadcaster_type) && u.broadcaster_type !== s.broadcaster_type) {
      anotar(s, 'broadcaster_type', s.broadcaster_type, u.broadcaster_type);
    }
    await dormir(60);
  }
}

// ── Kick ────────────────────────────────────────────────────────────────────
async function kickSeguidores(slug) {
  for (let intento = 0; intento < 2; intento++) {
    try {
      const r = await fetch(`https://kick.com/api/v2/channels/${slug}`, { headers: { 'User-Agent': UA } });
      if (r.status === 404) return { error: '404 (el canal no existe con ese nombre)' };
      if (r.ok) {
        const n = Number((await r.json()).followers_count); // a veces llega como texto
        if (Number.isFinite(n)) return { n };
      }
    } catch { /* se reintenta */ }
    await dormir(1500);
  }
  return { error: 'no respondió con seguidores' };
}

async function actualizarKick() {
  for (const s of [...registros.values()].filter((x) => x.kick)) {
    const slug = s.kick.split('/')[0].trim();
    if (slug !== s.kick) avisos.push(`${s.display_name}: el campo kick vale "${s.kick}" (se consultó "${slug}"). Conviene corregirlo en los datos.`);
    const r = await kickSeguidores(slug);
    if (r.error) avisos.push(`${s.display_name}: Kick "${slug}" ${r.error}. Se deja el valor anterior.`);
    else if (numeroCreible(s, 'kick_followers', s.kick_followers, r.n)) anotar(s, 'kick_followers', s.kick_followers, r.n);
    await dormir(400);
  }
}

if (SOLO !== 'kick') await actualizarTwitch();
if (SOLO !== 'twitch') await actualizarKick();

// total_followers siempre = twitch + kick, con los valores ya actualizados
for (const s of registros.values()) {
  const c = cambios.get(s.id) || {};
  const tw = c.twitch_followers ? c.twitch_followers[1] : s.twitch_followers;
  const kk = c.kick_followers ? c.kick_followers[1] : s.kick_followers;
  anotar(s, 'total_followers', s.total_followers, (tw || 0) + (kk || 0));
}

// ── Reporte ─────────────────────────────────────────────────────────────────
const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('es-AR') : String(n));
const pct = (a, b) => (a ? `${b >= a ? '+' : ''}${(((b - a) / a) * 100).toFixed(1)}%` : '');
const lineas = [`# Reporte de actualización (${new Date().toISOString().slice(0, 10)})`, '', ESCRIBIR ? 'Modo: **aplicado**' : 'Modo: **simulación** (no se cambió nada)', ''];
const filas = [];
for (const [id, c] of cambios) {
  const s = registros.get(id);
  for (const [campo, [v, n]] of Object.entries(c)) {
    if (campo === 'total_followers') continue;
    filas.push(`| ${s.display_name} | ${campo} | ${fmt(v)} | ${fmt(n)} | ${typeof n === 'number' ? pct(v, n) : ''} |`);
  }
}
lineas.push(`## Cambios (${filas.length})`, '', '| Streamer | Campo | Antes | Ahora | Variación |', '|---|---|---|---|---|', ...filas, '');
if (avisos.length) lineas.push(`## Avisos (${avisos.length})`, '', ...avisos.map((a) => `- ${a}`), '');
fs.writeFileSync(REPORTE, lineas.join('\n'));

// ── Aplicar ─────────────────────────────────────────────────────────────────
if (ESCRIBIR) {
  const nuevo = texto.replace(/^  \{id:(\d+),.*$/gm, (linea, id) => {
    const c = cambios.get(Number(id));
    if (!c) return linea;
    let out = linea;
    for (const [campo, [, n]] of Object.entries(c)) {
      const re = campo === 'broadcaster_type' ? /broadcaster_type:"[a-z]*"/ : new RegExp(`\\b${campo}:\\d+`);
      const reemplazo = campo === 'broadcaster_type' ? `broadcaster_type:"${n}"` : `${campo}:${n}`;
      if (!re.test(out)) { avisos.push(`id ${id}: no se encontró "${campo}" en la línea; no se cambió.`); continue; }
      out = out.replace(re, reemplazo);
    }
    return out;
  });
  fs.writeFileSync(ARCHIVO, nuevo);
}

console.log(`${ESCRIBIR ? 'Aplicado' : 'Simulación'}: ${filas.length} cambios, ${avisos.length} avisos. Reporte: scripts/ultimo-reporte.md`);
