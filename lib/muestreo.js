import muestreo from '../data/muestreo.json';

export const GTA = 'Grand Theft Auto VI';
const horasPorMuestra = () => (muestreo.cada || 60) / 60;

function diasDesde(n) {
  const corte = n ? new Date(Date.now() - n * 86400000).toISOString().slice(0, 10) : '0000-00-00';
  return Object.entries(muestreo.dias).filter(([dia]) => dia >= corte);
}

export const muestrasTotales = (n) => diasDesde(n).reduce((a, [, d]) => a + d.m, 0);
export const hayDatos = () => Object.keys(muestreo.dias).length > 0;

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

// Ranking de quién más jugó un juego (horas estimadas, % de su tiempo en vivo y pico de espectadores en GTA VI).
export function rankingJuego(juego, n) {
  const por = {};
  for (const [, d] of diasDesde(n)) {
    for (const [slug, juegos] of Object.entries(d.s)) {
      const r = (por[slug] = por[slug] || { slug, muestras: 0, enVivo: 0, pico: 0 });
      for (const [j, c] of Object.entries(juegos)) { r.enVivo += c; if (j === juego) r.muestras += c; }
      if (juego === GTA) r.pico = Math.max(r.pico, d.g[slug] || 0);
    }
  }
  return Object.values(por).filter((r) => r.muestras > 0)
    .map((r) => ({ ...r, horas: Math.round(r.muestras * horasPorMuestra() * 10) / 10, pct: Math.round((r.muestras / r.enVivo) * 100) }))
    .sort((a, b) => b.muestras - a.muestras);
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
