import { STREAMERS } from '../data/streamers';
import { streamerSlug } from './agrupaciones';

export const SITE = 'https://streamdle.net';
export const MIN_INDEXAR = 4;

// token = valor del campo `community` en data/streamers.js (puede haber varios separados por coma).
// extra = integrantes o ex integrantes que no figuran con ese valor en `community`.
export const COMUNIDADES = [
  {
    slug: 'coscu-army', nombre: 'Coscu Army', token: 'Coscu Army', emoji: '⚔️', color: '#7C3AED',
    resumen: 'La comunidad de streamers argentinos que gira alrededor de Coscu.',
    descripcion: 'La Coscu Army reúne a streamers argentinos del entorno de Coscu, uno de los más seguidos del país. Acá están los que figuran en Streamdle, con sus seguidores y su edad.',
    enlaceExtra: { href: '/comunidades/top-globales', label: 'Ver Top Globales, el núcleo del grupo en Kick →' },
  },
  {
    slug: 'esos-4', nombre: 'Esos 4', token: 'Esos 4', emoji: '4️⃣', color: '#F59E0B',
    resumen: 'El grupo de creadores formado por Juan Guarnizo, Elded, BarcaGamer y RobertoCein.',
    descripcion: 'Esos 4 es el grupo de creadores hispanos formado por JuanSGuarnizo, Elded, BarcaGamer y RobertoCein, que coinciden en proyectos y eventos de Twitch y YouTube.',
  },
  {
    slug: 'escuadron-salchichon', nombre: 'Escuadrón Salchichón', token: 'Escuadrón Salchichón', emoji: '🌭', color: '#DC2626',
    resumen: 'El histórico grupo de YouTubers españoles de TheGrefg, Ampeter, Agustín51 y Vicens.',
    descripcion: 'El Escuadrón Salchichón es el grupo de YouTubers españoles que compartió contenido y vivió junto durante años. Entre sus integrantes están TheGrefg, Ampeter, Agustín51 y Vicens; ByTarifa también formó parte.',
    extra: [{ slug: 'bytarifaaa', nota: 'Ex integrante' }],
  },
  {
    slug: 'la-comarca', nombre: 'La Comarca', token: 'La Comarca', emoji: '🏡', color: '#16A34A',
    resumen: 'La comunidad argentina de DuendePablo, Goncho y compañía.',
    descripcion: 'La Comarca es el equipo de streamers argentinos que lidera DuendePablo, cuyo canal da la bienvenida con "Bienvenidos a La Comarca". Acá están los miembros que figuran en Streamdle.',
    enlaceExtra: { href: '/comunidades/top-globales', label: 'Ver Top Globales →' },
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
export const esIndexable = (c) => miembrosDe(c).length >= MIN_INDEXAR;
