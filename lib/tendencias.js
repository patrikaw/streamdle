import { STREAMERS } from '../data/streamers';
import historial from '../data/historial.json';
import { streamerSlug } from './agrupaciones';

export const SITE = 'https://streamdle.net';
const DIA = 86400000;
const BASE_MIN_PORCENTAJE = 20000; // sin esto, un canal de 500 seguidores "crece 900%"
export const MIN_INDEXAR = 4;

const SUDAMERICA = ['AR', 'CL', 'CO', 'PE', 'UY', 'VE', 'EC', 'BO', 'PY', 'BR'];
const LATAM = [...SUDAMERICA, 'MX', 'GT', 'DO', 'SV', 'PR', 'CU', 'HN', 'NI', 'CR', 'PA'];

export const REGIONES = [
  { slug: '', label: 'Habla hispana', nombre: 'de habla hispana', paises: null },
  { slug: 'latam', label: 'Latam y Sudamérica', nombre: 'de Latinoamérica y Sudamérica', paises: LATAM },
  { slug: 'espana', label: 'España', nombre: 'de España', paises: ['ES'] },
  { slug: 'argentina', label: 'Argentina', nombre: 'de Argentina', paises: ['AR'] },
  { slug: 'mexico', label: 'México', nombre: 'de México', paises: ['MX'] },
  { slug: 'peru', label: 'Perú', nombre: 'de Perú', paises: ['PE'] },
  { slug: 'colombia', label: 'Colombia', nombre: 'de Colombia', paises: ['CO'] },
  { slug: 'chile', label: 'Chile', nombre: 'de Chile', paises: ['CL'] },
];

const fechaLarga = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const mesAnio = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

// Foto más reciente y foto de referencia (la más cercana a 30 días antes, o la más vieja).
export function periodo() {
  const fotos = [...historial.snapshots].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const fin = fotos[fotos.length - 1];
  const previas = fotos.slice(0, -1).filter((f) => (new Date(fin.fecha) - new Date(f.fecha)) / DIA >= 7);
  if (!previas.length) return null;
  const objetivo = new Date(fin.fecha).getTime() - 30 * DIA;
  const ini = previas.reduce((m, f) => (Math.abs(new Date(f.fecha) - objetivo) < Math.abs(new Date(m.fecha) - objetivo) ? f : m));
  const dias = Math.round((new Date(fin.fecha) - new Date(ini.fecha)) / DIA);
  const mes = dias > 45 ? `${Math.round(dias / 30)} meses hasta ${mesAnio(fin.fecha)}` : mesAnio(fin.fecha);
  return { ini, fin, dias, mes, desde: fechaLarga(ini.fecha), hasta: fechaLarga(fin.fecha) };
}

// ── Archivo permanente: meses y años cerrados, calculados solo con las fotos guardadas ──
const fotosOrdenadas = () => [...historial.snapshots].sort((a, b) => a.fecha.localeCompare(b.fecha));
const diasEntre = (a, b) => (new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / DIA;
const ultimaHasta = (fotos, iso) => [...fotos].reverse().find((f) => f.fecha <= iso);
const armar = (ini, fin, clave, tipo, mes) => ({
  clave, tipo, ini, fin, dias: Math.round(diasEntre(ini.fecha, fin.fecha)), mes,
  desde: fechaLarga(ini.fecha), hasta: fechaLarga(fin.fecha),
});

// Un mes se archiva cuando hay foto cerca del día 1 de ese mes y del día 1 del siguiente.
// Un año, cuando hay foto cerca del 1 de enero siguiente; empieza en la primera foto del año.
export function periodosArchivo() {
  const fotos = fotosOrdenadas();
  const out = [];
  if (fotos.length < 2) return out;
  const primera = fotos[0].fecha.slice(0, 7), ultima = fotos[fotos.length - 1].fecha.slice(0, 7);
  const sig = (ym) => { const [y, m] = ym.split('-').map(Number); return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`; };
  for (let ym = primera; ym <= ultima; ym = sig(ym)) {
    const ini = ultimaHasta(fotos, `${ym}-01`), fin = ultimaHasta(fotos, `${sig(ym)}-01`);
    if (!ini || !fin || diasEntre(ini.fecha, `${ym}-01`) > 6 || diasEntre(fin.fecha, `${sig(ym)}-01`) > 6) continue;
    if (fin.fecha <= ini.fecha || diasEntre(ini.fecha, fin.fecha) < 20) continue;
    out.push(armar(ini, fin, ym, 'mes', mesAnio(`${ym}-01`)));
  }
  for (let y = +primera.slice(0, 4); y <= +ultima.slice(0, 4); y++) {
    const delAnio = fotos.filter((f) => f.fecha.startsWith(String(y)));
    const fin = ultimaHasta(fotos, `${y + 1}-01-01`);
    if (!delAnio.length || !fin || diasEntre(fin.fecha, `${y + 1}-01-01`) > 20 || fotos[fotos.length - 1].fecha < `${y + 1}-01-01`) continue;
    if (diasEntre(delAnio[0].fecha, fin.fecha) < 60) continue;
    out.push(armar(delAnio[0], fin, String(y), 'año', String(y)));
  }
  return out.sort((a, b) => b.clave.localeCompare(a.clave));
}

// Si alguna de las dos fotos tiene Kick poco fiable, se compara solo Twitch.
export function crecimientos(pDado) {
  const p = pDado || periodo();
  if (!p) return { p: null, filas: [], soloTwitch: true };
  const soloTwitch = !(p.ini.kickFiable && p.fin.kickFiable);
  const filas = [];
  for (const s of STREAMERS) {
    const id = String(s.id);
    const tw0 = p.ini.tw[id], tw1 = p.fin.tw[id];
    if (!tw0 || !tw1) continue;
    const k0 = p.ini.kick[id] || 0, k1 = p.fin.kick[id] || 0;
    // Si la foto inicial no tenía su Kick (lo sumamos después), se compara solo Twitch para no inventar un salto.
    const soloTw = soloTwitch || (k1 > 0 && !k0);
    const base = soloTw ? tw0 : tw0 + k0;
    const ahora = soloTw ? tw1 : tw1 + k1;
    if (soloTwitch && s.kick && !s.twitch) continue;
    const ganancia = ahora - base;
    filas.push({ s, slug: streamerSlug(s), base, ahora, ganancia, pct: base ? (ganancia / base) * 100 : 0 });
  }
  return { p, filas, soloTwitch };
}

export function tendenciasDe(regionSlug, pDado) {
  const region = REGIONES.find((r) => r.slug === regionSlug);
  const { p, filas, soloTwitch } = crecimientos(pDado);
  if (!region || !p) return null;
  const f = filas.filter((x) => !region.paises || region.paises.includes(x.s.country));
  const porGanancia = [...f].filter((x) => x.ganancia > 0).sort((a, b) => b.ganancia - a.ganancia).slice(0, 15);
  const porPct = [...f].filter((x) => x.base >= BASE_MIN_PORCENTAJE && x.ganancia > 0).sort((a, b) => b.pct - a.pct).slice(0, 15);
  return { region, p, soloTwitch, porGanancia, porPct, total: f.length, indexable: porGanancia.length >= MIN_INDEXAR };
}

export function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',') + ' M';
  if (n >= 1_000) return Math.round(n / 1_000).toLocaleString('es-AR') + ' K';
  return String(n);
}

// Insignias para la ficha: quien está arriba en alguna lista de tendencias (máx. 2, las mejores).
export function badgesDe(s) {
  const out = [];
  for (const r of REGIONES) {
    if (r.paises && !r.paises.includes(s.country)) continue;
    const t = tendenciasDe(r.slug);
    if (!t) continue;
    const href = r.slug ? `/tendencias/${r.slug}` : '/tendencias';
    const corte = Math.min(10, Math.max(3, Math.floor(t.total * 0.3)));
    const periodoTxt = `Entre ${t.p.desde} y ${t.p.hasta}`;
    const i = t.porGanancia.findIndex((f) => f.s.id === s.id);
    if (i >= 0 && i < corte) out.push({ orden: i + 1, texto: `🔥 #${i + 1} en tendencia · ${r.label}`, href, title: `${periodoTxt}: más seguidores ganados ${r.nombre}` });
    const j = t.porPct.findIndex((f) => f.s.id === s.id);
    if (j >= 0 && j < Math.min(5, corte)) out.push({ orden: j + 1.5, texto: `🚀 #${j + 1} en crecimiento % · ${r.label}`, href, title: `${periodoTxt}: mayor crecimiento porcentual ${r.nombre}` });
  }
  return out.sort((a, b) => a.orden - b.orden).slice(0, 2);
}
