// Mira qué está jugando cada streamer de Streamdle en este momento (Twitch y Kick) y lo acumula por día
// en data/muestreo.json. Con esas "fotos" se calcula en qué juegos pasa el tiempo cada streamer.
//
//   node scripts/muestreo.mjs                       -> una muestra
//   node scripts/muestreo.mjs --veces=6 --cada=60   -> 6 muestras, una por hora

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVO = path.join(RAIZ, 'data', 'muestreo.json');
const args = process.argv.slice(2);
const num = (k, def) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? Number(a.split('=')[1]) : def; };
const VECES = num('veces', 1);
const CADA = num('cada', 60);
const GTA = 'Grand Theft Auto VI';
const DIAS_GUARDADOS = 62;

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
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const streamers = [];
for (const l of fs.readFileSync(path.join(RAIZ, 'data', 'streamers.js'), 'utf8').split(/\r?\n/)) {
  if (/^  \{id:\d+,/.test(l)) streamers.push(new Function(`return ${l.trim().replace(/,$/, '')}`)());
}
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const activos = streamers.filter((s) => s.is_active !== false);

async function seguidoresTwitch(userId, token) {
  try {
    const r = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, { headers: { 'Client-Id': id, Authorization: `Bearer ${token}` } });
    return r.ok ? (await r.json()).total : null;
  } catch { return null; }
}

async function tokenTwitch() {
  if (!id || !secreto) return null;
  const t = await (await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secreto, grant_type: 'client_credentials' }),
  })).json();
  return t.access_token || null;
}

// Devuelve Map slug -> { juego, espectadores } de los que están en vivo ahora.
async function muestra(token) {
  const vivos = new Map();
  if (token) {
    const conTwitch = activos.filter((s) => s.twitch);
    for (let i = 0; i < conTwitch.length; i += 100) {
      const lote = conTwitch.slice(i, i + 100);
      const q = lote.map((s) => `user_login=${encodeURIComponent(s.twitch)}`).join('&');
      try {
        const r = await fetch(`https://api.twitch.tv/helix/streams?${q}&first=100`, { headers: { 'Client-Id': id, Authorization: `Bearer ${token}` } });
        if (!r.ok) continue;
        for (const v of (await r.json()).data || []) {
          const s = lote.find((x) => x.twitch.toLowerCase() === v.user_login.toLowerCase());
          if (s && v.game_name) vivos.set(slugDe(s), { juego: v.game_name, esp: v.viewer_count, twitchId: v.user_id });
        }
      } catch { /* sigue */ }
    }
  }
  for (const s of activos.filter((x) => x.kick)) {
    if (vivos.has(slugDe(s))) continue; // ya está contado por Twitch
    try {
      const r = await fetch(`https://kick.com/api/v2/channels/${s.kick.split('/')[0]}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) });
      if (!r.ok) continue;
      const d = await r.json();
      const ls = d.livestream;
      const juego = ls?.categories?.[0]?.name;
      if (ls && juego) vivos.set(slugDe(s), { juego, esp: Number(ls.viewer_count) || 0, kickSeguidores: Number(d.followers_count) || null });
    } catch { /* sigue */ }
    await dormir(250);
  }
  return vivos;
}

const datos = fs.existsSync(ARCHIVO) ? JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')) : { cada: CADA, dias: {} };
datos.cada = CADA;
datos.gta6 = datos.gta6 || {};
const token = await tokenTwitch();

for (let i = 0; i < VECES; i++) {
  const vivos = await muestra(token);
  const dia = new Date().toISOString().slice(0, 10);
  const d = (datos.dias[dia] = datos.dias[dia] || { m: 0, s: {}, g: {} });
  d.m += 1;
  for (const [slug, v] of vivos) {
    d.s[slug] = d.s[slug] || {};
    d.s[slug][v.juego] = (d.s[slug][v.juego] || 0) + 1;
    if (v.juego === GTA) {
      d.g[slug] = Math.max(d.g[slug] || 0, v.esp);
      // Acumulado de GTA VI desde que empezamos a medir
      const a = (datos.gta6[slug] = datos.gta6[slug] || { m: 0, vh: 0, pico: 0, primera: new Date().toISOString(), seg0: null, seg1: null });
      a.m += 1;
      a.vh = Math.round((a.vh + v.esp * (CADA / 60)) * 10) / 10; // espectadores acumulados, en "horas vistas"
      a.pico = Math.max(a.pico, v.esp);
      const seg = v.kickSeguidores ?? (token && v.twitchId ? await seguidoresTwitch(v.twitchId, token) : null);
      if (seg) { if (a.seg0 === null) a.seg0 = seg; a.seg1 = seg; }
    }
  }
  console.log(`Muestra ${i + 1}/${VECES}: ${vivos.size} streamers en vivo, ${[...vivos.values()].filter((v) => v.juego === GTA).length} en ${GTA}`);
  if (i < VECES - 1) await dormir(CADA * 60000);
}

// Solo se guardan los últimos días
const corte = new Date(Date.now() - DIAS_GUARDADOS * 86400000).toISOString().slice(0, 10);
for (const dia of Object.keys(datos.dias)) if (dia < corte) delete datos.dias[dia];
fs.writeFileSync(ARCHIVO, JSON.stringify(datos));
console.log('Guardado', ARCHIVO);
