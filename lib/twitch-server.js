// Server-only — no importar en client components

let _token = null;
let _tokenExpiry = 0;

export async function getTwitchToken() {
  if (_token && Date.now() < _tokenExpiry - 300_000) return _token;
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Twitch token failed');
  _token = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
  return _token;
}

export async function fetchTwitchGame(name) {
  const token = await getTwitchToken();
  const res = await fetch(
    `https://api.twitch.tv/helix/games?name=${encodeURIComponent(name)}`,
    {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 86400 },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0] ?? null;
}

const NON_GAMES = new Set([
  'Just Chatting', 'Sports', 'Variety', 'Slots', 'Poker',
  'Kings League', 'Music & Performing Arts', 'Art',
  'Talk Shows & Podcasts', 'Science & Technology',
]);

export async function fetchIGDBGame(name) {
  if (NON_GAMES.has(name)) return null;
  try {
    const token = await getTwitchToken();
    const res = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: `fields name,summary,genres.name,first_release_date,involved_companies.developer,involved_companies.company.name; search "${name.replace(/"/g, '')}"; limit 1; where category = 0;`,
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const list = await res.json();
    const g = list[0];
    if (!g) return null;
    return {
      summary: g.summary ?? null,
      genres: g.genres?.map(gn => gn.name) ?? [],
      releaseYear: g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : null,
      developer: g.involved_companies?.find(ic => ic.developer)?.company?.name ?? null,
    };
  } catch {
    return null;
  }
}

export async function fetchAvatarsBatch(logins) {
  if (!logins.length) return {};
  const token = await getTwitchToken();
  const avatars = {};
  for (let i = 0; i < logins.length; i += 100) {
    const batch = logins.slice(i, i + 100).filter(Boolean);
    if (!batch.length) continue;
    const query = batch.map(l => `login=${encodeURIComponent(l.trim())}`).join('&');
    try {
      const res = await fetch(`https://api.twitch.tv/helix/users?${query}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const u of data.data ?? []) {
        avatars[u.login.toLowerCase()] = u.profile_image_url;
      }
    } catch {
      continue;
    }
  }
  return avatars;
}
