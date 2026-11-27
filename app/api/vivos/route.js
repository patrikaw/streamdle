import { STREAMERS } from '../../../data/streamers';
import { getTwitchToken } from '../../../lib/twitch-server';

const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const activos = STREAMERS.filter((s) => s.is_active !== false);
const base = (s) => ({ n: s.display_name, c: s.country });

export const dynamic = 'force-dynamic';

async function vivosTwitch() {
  const out = {};
  try {
    const token = await getTwitchToken();
    const con = activos.filter((s) => s.twitch);
    const porLogin = new Map(con.map((s) => [s.twitch.toLowerCase(), s]));
    await Promise.all(Array.from({ length: Math.ceil(con.length / 100) }, async (_, i) => {
      const q = con.slice(i * 100, i * 100 + 100).map((s) => `user_login=${encodeURIComponent(s.twitch)}`).join('&');
      const r = await fetch(`https://api.twitch.tv/helix/streams?${q}&first=100`, {
        headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000), cache: 'no-store',
      });
      if (!r.ok) return;
      for (const v of (await r.json()).data || []) {
        const s = porLogin.get(v.user_login.toLowerCase());
        if (!s) continue;
        out[slugDe(s)] = {
          ...base(s), p: 'Twitch', v: v.viewer_count, j: v.game_name || '', t: v.title || '',
          img: v.thumbnail_url?.replace('{width}', '320').replace('{height}', '180') || null,
          url: `https://twitch.tv/${v.user_login}`,
        };
      }
    }));
  } catch { /* Twitch caído: se devuelve lo que haya */ }
  return out;
}

const guardar = (canal, v) => { ultimoKick.set(canal, { v, hora: Date.now() }); return v; };
const previo = (canal) => { const u = ultimoKick.get(canal); return u && Date.now() - u.hora < 300000 ? u.v : null; };

// Kick limita pedidos seguidos: si un canal falla se usa su último estado conocido (hasta 5 min).
const ultimoKick = new Map();

async function vivoKick(s) {
  const canal = s.kick.split('/')[0];
  try {
    const r = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(canal)}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(4000), cache: 'no-store',
    });
    if (!r.ok) return previo(canal);
    const d = await r.json();
    const ls = d.livestream;
    if (!ls) { ultimoKick.set(canal, { v: null, hora: Date.now() }); return null; }
    return guardar(canal, {
      ...base(s), p: 'Kick', v: Number(ls.viewer_count) || 0, j: ls.categories?.[0]?.name || '', t: ls.session_title || '',
      img: ls.thumbnail?.url || d.user?.profile_pic || null, url: `https://kick.com/${canal}`,
    });
  } catch { return previo(canal); }
}

// Todos los streamers con ficha que están en vivo ahora. Una sola URL para todo el sitio,
// así la CDN la sirve cacheada y Twitch/Kick reciben como mucho una ráfaga por minuto.
export async function GET() {
  const vivos = await vivosTwitch();
  const kick = activos.filter((s) => s.kick);
  for (let i = 0; i < kick.length; i += 10) {
    const lote = kick.slice(i, i + 10);
    const res = await Promise.all(lote.map(vivoKick));
    lote.forEach((s, k) => {
      const v = res[k], slug = slugDe(s);
      if (v && (!vivos[slug] || v.v > vivos[slug].v)) vivos[slug] = v;
    });
  }
  return Response.json({ actualizado: new Date().toISOString(), vivos }, {
    headers: { 'Cache-Control': 'public, s-maxage=90, stale-while-revalidate=180' },
  });
}
