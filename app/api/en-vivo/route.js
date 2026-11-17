import { getTwitchToken } from '../../../lib/twitch-server';

const LOGIN = /^[a-z0-9_-]{1,40}$/;

async function twitchVivo(login) {
  try {
    const token = await getTwitchToken();
    const r = await fetch(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(login)}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return null;
    const s = (await r.json()).data?.[0];
    return s ? { plataforma: 'Twitch', viewers: s.viewer_count, juego: s.game_name || '', url: `https://twitch.tv/${login}` } : null;
  } catch { return null; }
}

async function kickVivo(login) {
  try {
    const r = await fetch(`https://kick.com/api/v2/channels/${login}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.livestream ? { plataforma: 'Kick', viewers: d.livestream.viewer_count ?? 0, juego: d.livestream.categories?.[0]?.name || '', url: `https://kick.com/${login}` } : null;
  } catch { return null; }
}

// ¿Está en vivo ahora? Mira Twitch y Kick; devuelve el que esté al aire (el de más espectadores).
export async function GET(request) {
  const p = new URL(request.url).searchParams;
  const tw = (p.get('twitch') || '').toLowerCase(), ki = (p.get('kick') || '').toLowerCase();
  const [a, b] = await Promise.all([LOGIN.test(tw) ? twitchVivo(tw) : null, LOGIN.test(ki) ? kickVivo(ki) : null]);
  const vivo = [a, b].filter(Boolean).sort((x, y) => y.viewers - x.viewers)[0] || null;
  return Response.json({ vivo }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
}
