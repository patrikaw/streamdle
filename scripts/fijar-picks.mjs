// Fija en data/picks-fijos.json quién es el streamer de cada día en cada juego, para que sumar streamers
// o cambiar datos NO reordene días ya publicados. El juego lee ese archivo antes de calcular nada.
//
//   node scripts/fijar-picks.mjs               -> agrega los días que falten hasta hoy + 14 (lo corre el flujo diario)
//   node scripts/fijar-picks.mjs --historia    -> reconstruye el pasado con el listado que había hasta el 16-11-2026
//                                                 (ids <= 192) y fija también los próximos días con el listado actual

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVO = path.join(RAIZ, 'data', 'picks-fijos.json');
const HISTORIA = process.argv.includes('--historia');
const EPOCA = '2026-05-03';
const ULTIMO_DIA_LISTADO_VIEJO = '2026-11-16';
const MAX_ID_VIEJO = 192;
const HORIZONTE_DIAS = 14;

// Mismos juegos, desfases y filtros que usan las páginas de cada juego.
const emojisSrc = fs.readFileSync(path.join(RAIZ, 'app', 'emojidle', 'page.js'), 'utf8');
const ini = emojisSrc.indexOf('const STREAMER_EMOJIS = {');
const fin = emojisSrc.indexOf('\n};', ini) + 3;
const STREAMER_EMOJIS = new Function(`${emojisSrc.slice(ini, fin)}; return STREAMER_EMOJIS;`)();
const getStreamEmojis = (s) => {
  for (const k of [s.name?.toLowerCase(), s.display_name?.toLowerCase(), s.twitch?.toLowerCase()]) if (k && STREAMER_EMOJIS[k]) return STREAMER_EMOJIS[k];
  return null;
};
const JUEGOS = [
  ['classic', 0, null],
  ['avatardle', 17, null],
  ['categorydle', 41, (s) => s.top_category && s.second_category && s.second_category !== ''],
  ['chatdle', 67, (s) => s.catchphrase && s.catchphrase.trim() !== ''],
  ['emojidle', 83, (s) => !!getStreamEmojis(s)],
  ['edadle', 97, (s) => !!(s.birth_year && s.birth_month && s.birth_day)],
];

const fijos = HISTORIA || !fs.existsSync(ARCHIVO) ? {} : JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
globalThis.__PICKS_FIJOS__ = fijos;

let codigo = fs.readFileSync(path.join(RAIZ, 'data', 'streamers.js'), 'utf8');
if (!codigo.includes("import PICKS_FIJOS from './picks-fijos.json';")) throw new Error('data/streamers.js no importa picks-fijos.json');
codigo = codigo.replace("import PICKS_FIJOS from './picks-fijos.json';", 'const PICKS_FIJOS = globalThis.__PICKS_FIJOS__ || {};') + '\nexport { _computeDayPicks as __calc };\n';
const tmp = path.join(os.tmpdir(), `streamers-picks-${Date.now()}.mjs`);
fs.writeFileSync(tmp, codigo);
const M = await import(pathToFileURL(tmp).href);

const fecha = (iso) => new Date(`${iso}T12:00:00`);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dias = (desde, hasta) => { const out = []; for (let d = fecha(desde); iso(d) <= hasta; d.setDate(d.getDate() + 1)) out.push(iso(d)); return out; };

const hoy = new Date();
const limite = new Date(hoy); limite.setDate(limite.getDate() + HORIZONTE_DIAS);
const hasta = iso(limite);
const salida = JSON.parse(JSON.stringify(fijos));
const completo = [...M.STREAMERS];

function fijar(rango) {
  let n = 0;
  for (const [juego, offset, filtro] of JUEGOS) {
    salida[juego] = salida[juego] || {};
    for (const dia of rango) {
      if (salida[juego][dia]) continue;
      const picks = M.__calc(juego, offset, filtro, fecha(dia));
      salida[juego][dia] = Object.fromEntries(Object.entries(picks).map(([c, s]) => [c, s ? s.id : null]));
      n++;
    }
  }
  return n;
}

let agregados = 0;
if (HISTORIA) {
  M.STREAMERS.splice(0, M.STREAMERS.length, ...completo.filter((s) => s.id <= MAX_ID_VIEJO));
  agregados += fijar(dias(EPOCA, ULTIMO_DIA_LISTADO_VIEJO));
  M.STREAMERS.splice(0, M.STREAMERS.length, ...completo);
  const siguiente = fecha(ULTIMO_DIA_LISTADO_VIEJO); siguiente.setDate(siguiente.getDate() + 1);
  agregados += fijar(dias(iso(siguiente), hasta));
} else {
  agregados += fijar(dias(EPOCA, hasta));
}

for (const j of Object.keys(salida)) salida[j] = Object.fromEntries(Object.entries(salida[j]).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(ARCHIVO, JSON.stringify(salida));
fs.rmSync(tmp, { force: true });
console.log(`Picks fijados: ${agregados} nuevos. Juegos: ${Object.keys(salida).length}. Hasta ${hasta}.`);
