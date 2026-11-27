import muestreo from '../data/muestreo.json';

const horasPorMuestra = () => (muestreo.cada || 60) / 60;

function diasDesde(n) {
  const corte = n ? new Date(Date.now() - n * 86400000).toISOString().slice(0, 10) : '0000-00-00';
  return Object.entries(muestreo.dias).filter(([dia]) => dia >= corte);
}


// En qué juegos pasó el tiempo un streamer (solo cuenta cuando estaba en vivo).
export function juegosDe(slug, n = 30) {
  const cuenta = {};
  let total = 0;
  for (const [, d] of diasDesde(n)) {
    for (const [juego, c] of Object.entries(d.s[slug] || {})) { cuenta[juego] = (cuenta[juego] || 0) + c; total += c; }
  }
  return {
    total,
    horas: Math.round(total * horasPorMuestra()),
    juegos: Object.entries(cuenta).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([juego, c]) => ({ juego, horas: Math.round(c * horasPorMuestra()), pct: Math.round((c / total) * 100) })),
  };
}

export const ultimaMuestra = () => Object.keys(muestreo.dias).sort().pop() || null;

// Ranking de GTA VI a partir del acumulado guardado desde que empezó la medición.
export function rankingsGta() {
  const lista = Object.entries(muestreo.gta6 || {}).map(([slug, a]) => ({
    slug, horas: Math.round(a.m * horasPorMuestra() * 10) / 10, pico: a.pico, horasVistas: Math.round(a.vh),
    seguidoresGanados: a.seg0 !== null && a.seg1 !== null ? a.seg1 - a.seg0 : null,
  }));
  return {
    total: lista.length,
    masHoras: [...lista].sort((a, b) => b.horas - a.horas),
    masPico: [...lista].sort((a, b) => b.pico - a.pico),
    masHorasVistas: [...lista].sort((a, b) => b.horasVistas - a.horasVistas),
    masSeguidores: lista.filter((x) => x.seguidoresGanados !== null && x.seguidoresGanados > 0).sort((a, b) => b.seguidoresGanados - a.seguidoresGanados),
  };
}

const GTA = 'Grand Theft Auto VI';
export const LANZAMIENTO_GTA = '2026-11-19';

// GTA VI día por día: cuántos streamers lo jugaron, horas estimadas, qué parte del tiempo en vivo fue GTA
// y el mayor pico del día. Además, los juegos más jugados desde el lanzamiento para comparar.
export function estadisticasGta() {
  const h = horasPorMuestra();
  const dias = Object.entries(muestreo.dias).sort(([a], [b]) => a.localeCompare(b)).map(([dia, d]) => {
    let jugadores = 0, mGta = 0, mTotal = 0;
    for (const juegos of Object.values(d.s)) {
      for (const [j, c] of Object.entries(juegos)) { mTotal += c; if (j === GTA) mGta += c; }
      if (juegos[GTA]) jugadores += 1;
    }
    const [picoSlug, pico] = Object.entries(d.g || {}).sort((a, b) => b[1] - a[1])[0] || [null, 0];
    return { dia, mediciones: d.m, jugadores, horas: Math.round(mGta * h), pct: mTotal ? Math.round((mGta / mTotal) * 100) : 0, pico, picoSlug };
  });
  const desde = dias.findIndex((x) => x.jugadores > 0);
  const conGta = desde < 0 ? [] : dias.slice(desde);

  const cuenta = {};
  let total = 0;
  for (const [dia, d] of Object.entries(muestreo.dias)) {
    if (dia < LANZAMIENTO_GTA) continue;
    for (const juegos of Object.values(d.s)) for (const [j, c] of Object.entries(juegos)) { cuenta[j] = (cuenta[j] || 0) + c; total += c; }
  }
  const juegos = Object.entries(cuenta).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([juego, c]) => ({ juego, horas: Math.round(c * h), pct: Math.round((c / total) * 100) }));

  return { dias: conGta, juegos, streamersDistintos: Object.keys(muestreo.gta6 || {}).length };
}
