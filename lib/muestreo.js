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
