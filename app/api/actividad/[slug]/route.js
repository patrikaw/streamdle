import { NextResponse } from 'next/server';
import { STREAMERS } from '../../../../data/streamers';
import actividadMensual from '../../../../data/actividad.json';
import { getTwitchToken } from '../../../../lib/twitch-server';
import { sesionesDe, resumen, NOMBRE_DIA } from '../../../../lib/actividad.mjs';
import { juegosDe } from '../../../../lib/muestreo';

const DIAS = 30;
const MS_DIA = 86400000;
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Historial guardado por el script mensual: últimos 6 meses, del más reciente al más viejo.
function mesesGuardados(slug) {
  const m = actividadMensual[slug] || {};
  return Object.keys(m).sort().reverse().slice(0, 6).map((k) => ({ clave: k, mes: MESES[+k.slice(5) - 1], horas: m[k].h, sesiones: m[k].s, diasActivos: m[k].d }));
}

export async function GET(_req, { params }) {
  const { slug } = await params;
  const s = STREAMERS.find((x) => slugDe(x) === slug.toLowerCase());
  if (!s) return NextResponse.json({ ok: false }, { status: 404 });

  const cabecera = { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' };
  const meses = mesesGuardados(slugDe(s));
  const token = s.twitch ? await getTwitchToken().catch(() => null) : null;
  const ses = await sesionesDe(s, { token, clientId: process.env.TWITCH_CLIENT_ID });
  const ahora = Date.now();
  const r = resumen(ses, ahora - DIAS * MS_DIA, ahora + MS_DIA, s.country);
  const jg = juegosDe(slugDe(s), 30);
  const juegos = jg.total >= 6 ? jg.juegos : [];
  if (!r && !meses.length) return NextResponse.json({ ok: false }, { headers: cabecera });

  return NextResponse.json({
    ok: true, dias: DIAS, meses, juegos,
    reciente: r && {
      sesiones: r.sesiones, horas: Math.round(r.horas), promHoras: Math.round((r.horas / r.sesiones) * 10) / 10, diasActivos: r.diasActivos,
      ultimo: new Date(r.ultimo).toISOString(), porDia: r.porDia.map((v) => Math.round(v * 10) / 10), nombresDia: NOMBRE_DIA,
      diaTop: r.diaTop, horaTipica: r.horaTipica, zona: r.zona, plataformas: r.plataformas,
    },
  }, { headers: cabecera });
}
