import { NextResponse } from 'next/server';
import { STREAMERS } from '../../../data/streamers';
import { getAvatarUrl } from '../../../data/avatars';
import { fetchTwitchAvatars } from '../../../lib/twitch-server';
import { actividadLarga } from '../../../lib/categorias';

const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const PAISES = {
  ES: ['🇪🇸', 'España'], AR: ['🇦🇷', 'Argentina'], MX: ['🇲🇽', 'México'], CO: ['🇨🇴', 'Colombia'], PE: ['🇵🇪', 'Perú'], CL: ['🇨🇱', 'Chile'],
  VE: ['🇻🇪', 'Venezuela'], UY: ['🇺🇾', 'Uruguay'], SV: ['🇸🇻', 'El Salvador'], GT: ['🇬🇹', 'Guatemala'], PR: ['🇵🇷', 'Puerto Rico'],
  DO: ['🇩🇴', 'República Dominicana'], CU: ['🇨🇺', 'Cuba'], NO: ['🇳🇴', 'Noruega'],
};

// "Completa o más o menos completa": tiene bio, o al menos 4 de estos datos.
function puntaje(s) {
  return [s.real_name, s.birth_year, s.trivia_q1, s.top_clip_url, s.personality, [s.instagram_url, s.twitter_url, s.tiktok_url, s.youtube_url].filter(Boolean).length >= 2].filter(Boolean).length;
}

function edadDe(s) {
  if (!s.birth_year || !s.birth_month || !s.birth_day) return null;
  const h = new Date();
  let e = h.getUTCFullYear() - s.birth_year;
  if (h.getUTCMonth() + 1 < s.birth_month || (h.getUTCMonth() + 1 === s.birth_month && h.getUTCDate() < s.birth_day)) e--;
  return e;
}

function bajadaDe(s) {
  if (s.bio && s.bio.trim()) {
    const t = s.bio.trim();
    const corte = t.slice(0, 190);
    const punto = corte.lastIndexOf('. ');
    return punto > 80 ? corte.slice(0, punto + 1) : (t.length > 190 ? corte.trimEnd() + '…' : t);
  }
  const edad = edadDe(s);
  return `${s.display_name} es un streamer de ${(PAISES[s.country] || ['', s.country])[1]}${edad ? ` de ${edad} años` : ''}${actividadLarga(s.top_category)}.`;
}

export async function GET() {
  const pool = STREAMERS.filter((s) => s.is_active !== false && (s.bio || puntaje(s) >= 4));
  const avatares = await fetchTwitchAvatars(pool.map((s) => s.twitch).filter(Boolean)).catch(() => ({}));
  const items = pool.map((s) => ({
    id: slugDe(s), nombre: s.display_name, slug: slugDe(s),
    flag: (PAISES[s.country] || ['🌍'])[0], pais: (PAISES[s.country] || ['', s.country])[1],
    seguidores: s.total_followers, categoria: s.top_category || '', bajada: bajadaDe(s), edad: edadDe(s),
    avatar: getAvatarUrl(s, avatares),
  }));
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } });
}
