import { STREAMERS } from '../data/streamers';
import { streamerSlug } from './agrupaciones';
import { C } from './colores';

export const SITE = 'https://streamdle.net';
export const MIN_INDEXAR = 4;

// token = valor del campo `community` en data/streamers.js (puede haber varios separados por coma).
// extra = integrantes o ex integrantes que no figuran con ese valor en `community`.
export const COMUNIDADES = [
  {
    slug: 'coscu-army', nombre: 'Coscu Army', token: 'Coscu Army', emoji: '⚔️', color: C.purple,
    resumen: 'La comunidad de streamers argentinos que gira alrededor de Coscu.',
    descripcion: 'La Coscu Army reúne a streamers argentinos del entorno de Coscu, uno de los más seguidos del país. Acá están los que figuran en Streamdle, con sus seguidores y su edad.',
    enlaceExtra: { href: '/comunidades/top-globales', label: 'Ver Top Globales, el núcleo del grupo en Kick →' },
  },
  {
    slug: 'esos-4', nombre: 'Esos 4', token: 'Esos 4', emoji: '4️⃣', color: C.warn,
    resumen: 'El grupo de creadores formado por Juan Guarnizo, Elded, BarcaGamer y RobertoCein.',
    descripcion: 'Esos 4 es el grupo de creadores hispanos formado por JuanSGuarnizo, Elded, BarcaGamer y RobertoCein, que coinciden en proyectos y eventos de Twitch y YouTube.',
  },
  {
    slug: 'escuadron-salchichon', nombre: 'Escuadrón Salchichón', token: 'Escuadrón Salchichón', emoji: '🌭', color: C.error,
    resumen: 'El histórico grupo de YouTubers españoles de TheGrefg, Ampeter, Agustín51 y Vicens.',
    descripcion: 'El Escuadrón Salchichón es el grupo de YouTubers españoles que compartió contenido y vivió junto durante años. Entre sus integrantes están TheGrefg, Ampeter, Agustín51 y Vicens; ByTarifa también formó parte.',
    extra: [{ slug: 'bytarifaaa', nota: 'Ex integrante' }],
  },
  {
    slug: 'la-comarca', nombre: 'La Comarca', token: 'La Comarca', emoji: '🏡', color: C.ok,
    resumen: 'La comunidad argentina de DuendePablo, Goncho y compañía.',
    descripcion: 'La Comarca es el equipo de streamers argentinos que lidera DuendePablo, cuyo canal da la bienvenida con "Bienvenidos a La Comarca". Acá están los miembros que figuran en Streamdle.',
    enlaceExtra: { href: '/comunidades/top-globales', label: 'Ver Top Globales →' },
  },
  {
    slug: 'w-crew', nombre: 'W Crew', token: 'W Crew', emoji: '🎙️', color: C.info,
    resumen: 'El equipo de creadores y amigos cercanos de WestCOL, el streamer de Kick más visto de habla hispana.',
    descripcion: 'La W Crew, también llamada la Crew de WestCOL, es el equipo de creadores y amigos cercanos del streamer colombiano WestCOL. Colaboran en sus transmisiones y en proyectos como Stream Fighters y La Mansión de los Streamers.',
    extra: [
      { slug: 'westcol', nota: 'Líder' },
      { slug: 'lonche', nota: 'Peleó en Stream Fighters 5' },
      { slug: 'jhdelacruz777', nota: 'Peleó en Stream Fighters 5' },
      { slug: 'chanty', nota: 'Peleó en Stream Fighters 5' },
      { slug: 'samulx', nota: 'Peleó en Stream Fighters 5' },
      { slug: 'willito', nota: 'Peleó en Stream Fighters 5' },
    ],
    sinFicha: [
      { nombre: 'Daren', nota: 'Del círculo cercano de WestCOL. Venció a El Agropecuario en Stream Fighters 5.' },
      { nombre: 'Leandro Loaiza', nota: 'Venció a Sebastucho por nocaut técnico en el tercer asalto de Stream Fighters 5.' },
      { nombre: 'Natalia', nota: 'Ganadora de la primera edición de La Mansión de los Streamers (diciembre de 2025).' },
      { nombre: 'EDM', nota: 'Ganador de la primera edición de La Mansión de los Streamers (diciembre de 2025).' },
    ],
    hechos: [
      ['La Mansión de los Streamers', 'Reality producido por WestCOL y emitido en Kick del 3 al 10 de diciembre de 2025. Quien ganaba aseguraba un lugar en la crew. Los dos ganadores de la primera edición fueron EDM y Natalia.'],
      ['Stream Fighters', 'Evento de boxeo entre creadores organizado por WestCOL y transmitido en su canal de Kick. Stream Fighters 4, el 18 de octubre de 2025 en Bogotá, fue récord de la plataforma con un pico de 4,6 millones de espectadores simultáneos.'],
      ['Stream Fighters 5: resultados', 'Se realizó el sábado 14 de noviembre de 2026 en el Coliseo MedPlus de Bogotá. Resultados: Daren venció a El Agropecuario (el combate duró unos cinco segundos por una lesión de hombro), Leandro Loaiza venció a Sebastucho por nocaut técnico, Andrea Valdiri venció a La Divaza por decisión unánime, Samantha Correa venció a Cami Pulgarín por decisión dividida, Emiro Navarro venció a Valentino Lázaro, Reydelacity venció a WeGotKicks, y Willito y Lonche vencieron a Chanty y Samulx en el combate por parejas. JH de la Cruz ganó por incomparecencia de su rival, y Yaya Muñoz ganó el cuadrangular femenino. En la exhibición de robots, el de Blessd derrotó al de WestCOL.'],
    ],
  },
];

const tokensDe = (s) => (Array.isArray(s.community) ? s.community : String(s.community || '').split(',')).map((x) => x.trim());
const slugsPorToken = (token) => STREAMERS.filter((s) => s.community && tokensDe(s).includes(token));

export function miembrosDe(c) {
  const base = slugsPorToken(c.token).map((s) => ({ s, slug: streamerSlug(s), nota: null }));
  const extras = (c.extra || []).map((e) => {
    const s = STREAMERS.find((x) => streamerSlug(x) === e.slug);
    return s ? { s, slug: e.slug, nota: e.nota } : null;
  }).filter(Boolean);
  return [...base, ...extras].sort((a, b) => b.s.total_followers - a.s.total_followers);
}

export function edadDe(s) {
  if (!s.birth_year || !s.birth_month || !s.birth_day) return null;
  const h = new Date();
  let e = h.getUTCFullYear() - s.birth_year;
  if (h.getUTCMonth() + 1 < s.birth_month || (h.getUTCMonth() + 1 === s.birth_month && h.getUTCDate() < s.birth_day)) e--;
  return e;
}

export const comunidadPorSlug = (slug) => COMUNIDADES.find((c) => c.slug === slug) || null;
export const sinFichaDe = (c) => c.sinFicha || [];
export const esIndexable = (c) => miembrosDe(c).length + sinFichaDe(c).length >= MIN_INDEXAR;
