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

export async function fetchClipsById(clipIds) {
  if (!clipIds.length) return [];
  const token = await getTwitchToken();
  const query = clipIds.slice(0, 50).map(id => `id=${encodeURIComponent(id)}`).join('&');
  try {
    const res = await fetch(`https://api.twitch.tv/helix/clips?${query}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? [])
      .sort((a, b) => b.view_count - a.view_count)
      .map(c => ({
        id: c.id, title: c.title, url: c.url,
        thumbnail_url: c.thumbnail_url ?? null,
        view_count: c.view_count,
        broadcaster_name: c.broadcaster_name,
        broadcaster_login: c.broadcaster_login,
      }));
  } catch {
    return [];
  }
}

export async function fetchClipsByGame(gameId, allowedLogins) {
  if (!gameId || !allowedLogins.length) return [];
  const token = await getTwitchToken();
  const loginSet = new Set(allowedLogins.map(l => l.toLowerCase()));
  try {
    const res = await fetch(
      `https://api.twitch.tv/helix/clips?game_id=${encodeURIComponent(gameId)}&first=100`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? [])
      .filter(c => loginSet.has(c.broadcaster_login?.toLowerCase()))
      .map(c => ({
        id: c.id, title: c.title, url: c.url,
        thumbnail_url: c.thumbnail_url ?? null,
        view_count: c.view_count,
        broadcaster_name: c.broadcaster_name,
        broadcaster_login: c.broadcaster_login,
      }));
  } catch {
    return [];
  }
}

// Returns { login: { url, id } }
export async function fetchAvatarsBatch(logins) {
  if (!logins.length) return {};
  const token = await getTwitchToken();
  const result = {};
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
        result[u.login.toLowerCase()] = { url: u.profile_image_url, id: u.id };
      }
    } catch {
      continue;
    }
  }
  return result;
}

// Fetch top clips per broadcaster, filtered client-side to gameId
export async function fetchClipsByBroadcastersForGame(broadcasterIds, gameId) {
  if (!broadcasterIds.length || !gameId) return [];
  const token = await getTwitchToken();
  const results = await Promise.allSettled(
    broadcasterIds.map(id =>
      fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=20`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => (d.data ?? []).filter(c => c.game_id === gameId))
    )
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .map(c => ({
      id: c.id, title: c.title, url: c.url,
      thumbnail_url: c.thumbnail_url ?? null,
      view_count: c.view_count,
      broadcaster_name: c.broadcaster_name,
      broadcaster_login: c.broadcaster_login,
    }))
    .sort((a, b) => b.view_count - a.view_count);
}
