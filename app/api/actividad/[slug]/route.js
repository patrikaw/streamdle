import { NextResponse } from 'next/server';
import { STREAMERS } from '../../../../data/streamers';
import { getTwitchToken } from '../../../../lib/twitch-server';

const DIAS = 30;
const MS_DIA = 86400000;
const ZONAS = {
  ES: ['Europe/Madrid', 'Madrid'], AR: ['America/Argentina/Buenos_Aires', 'Argentina'], MX: ['America/Mexico_City', 'México'],
  CO: ['America/Bogota', 'Colombia'], PE: ['America/Lima', 'Perú'], CL: ['America/Santiago', 'Chile'], VE: ['America/Caracas', 'Venezuela'],
  UY: ['America/Montevideo', 'Uruguay'], SV: ['America/El_Salvador', 'El Salvador'], GT: ['America/Guatemala', 'Guatemala'],
  PR: ['America/Puerto_Rico', 'Puerto Rico'], DO: ['America/Santo_Domingo', 'República Dominicana'], CU: ['America/Havana', 'Cuba'],
};
const NOMBRE_DIA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');

function duracionTwitch(txt) {
  const m = String(txt || '').match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  return ((+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0)) / 60; // minutos
}

async function sesionesTwitch(login) {
  const token = await getTwitchToken();
  const clientId = process.env.TWITCH_CLIENT_ID;
  const h = { 'Client-Id': clientId, Authorization: `Bearer ${token}` };
  const u = (await (await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`, { headers: h })).json()).data?.[0];
  if (!u) return [];
  const v = (await (await fetch(`https://api.twitch.tv/helix/videos?user_id=${u.id}&type=archive&first=100`, { headers: h })).json()).data || [];
  return v.map((x) => ({ inicio: new Date(x.created_at).getTime(), min: duracionTwitch(x.duration), plat: 'Twitch' }));
}

async function sesionesKick(slug) {
  const r = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(slug)}/videos`, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) });
  if (!r.ok) return [];
  const j = await r.json();
  return (Array.isArray(j) ? j : j.data || []).map((x) => ({ inicio: new Date(String(x.start_time || x.created_at).replace(' ', 'T') + 'Z').getTime(), min: (Number(x.duration) || 0) / 60000, plat: 'Kick' }));
}

// Si transmite en las dos plataformas a la vez, el tiempo superpuesto se cuenta una sola vez.
function unir(lista) {
  const orden = lista.filter((s) => s.min > 0).sort((a, b) => a.inicio - b.inicio);
  const out = [];
  for (const s of orden) {
    const fin = s.inicio + s.min * 60000;
    const ult = out[out.length - 1];
    if (ult && s.inicio <= ult.fin) { ult.fin = Math.max(ult.fin, fin); ult.plats.add(s.plat); }
    else out.push({ inicio: s.inicio, fin, plats: new Set([s.plat]) });
  }
  return out;
}

export async function GET(_req, { params }) {
  const { slug } = await params;
  const s = STREAMERS.find((x) => slugDe(x) === slug.toLowerCase());
  if (!s) return NextResponse.json({ ok: false }, { status: 404 });

  const [tw, kk] = await Promise.all([
    s.twitch ? sesionesTwitch(s.twitch).catch(() => []) : [],
    s.kick ? sesionesKick(s.kick.split('/')[0]).catch(() => []) : [],
  ]);
  const desde = Date.now() - DIAS * MS_DIA;
  const ses = unir([...tw, ...kk]).filter((x) => x.inicio >= desde);
  const cabecera = { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' };
  if (!ses.length) return NextResponse.json({ ok: false }, { headers: cabecera });

  const [zona, zonaNombre] = ZONAS[s.country] || ZONAS.AR;
  const partes = (ms) => {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: zona, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(ms));
    const g = (t) => f.find((p) => p.type === t)?.value;
    return { dia: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday')), min: +g('hour') * 60 + +g('minute') };
  };
  const porDia = Array(7).fill(0);
  const inicios = [];
  const diasUnicos = new Set();
  let horas = 0;
  for (const x of ses) {
    const p = partes(x.inicio);
    const h = (x.fin - x.inicio) / 3600000;
    horas += h; porDia[p.dia] += h; inicios.push(p.min);
    diasUnicos.add(new Date(x.inicio).toLocaleDateString('en-CA', { timeZone: zona }));
  }
  inicios.sort((a, b) => a - b);
  const med = inicios[Math.floor(inicios.length / 2)];
  const hhmm = `${String(Math.floor(med / 60)).padStart(2, '0')}:${String(med % 60).padStart(2, '0')}`;
  const diaTop = porDia.indexOf(Math.max(...porDia));
  const plataformas = [...new Set(ses.flatMap((x) => [...x.plats]))];

  return NextResponse.json({
    ok: true, dias: DIAS, sesiones: ses.length, horas: Math.round(horas), promHoras: Math.round((horas / ses.length) * 10) / 10,
    diasActivos: diasUnicos.size, ultimo: new Date(Math.max(...ses.map((x) => x.fin))).toISOString(),
    porDia: porDia.map((v) => Math.round(v * 10) / 10), nombresDia: NOMBRE_DIA, diaTop: NOMBRE_DIA[diaTop],
    horaTipica: hhmm, zona: zonaNombre, plataformas,
  }, { headers: cabecera });
}
