import { NextResponse } from 'next/server';
import { getCategoryFromSlug } from '../../../../lib/categories';

let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry - 300_000) return _token;
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Token failed');
  _token = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
  return _token;
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const categoryName = getCategoryFromSlug(slug);
  if (!categoryName) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const token = await getToken();
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
    };

    // Get Twitch game ID
    const gameRes = await fetch(
      `https://api.twitch.tv/helix/games?name=${encodeURIComponent(categoryName)}`,
      { headers }
    );
    const gameData = await gameRes.json();
    const game = gameData.data?.[0] ?? null;

    let liveCount = 0;
    let totalViewers = 0;
    let topStreams = [];
    let topClips = [];

    if (game?.id) {
      // Live streams in Spanish for this game
      const [streamsRes, clipsRes] = await Promise.all([
        fetch(
          `https://api.twitch.tv/helix/streams?game_id=${game.id}&first=100&language=es`,
          { headers }
        ),
        fetch(
          `https://api.twitch.tv/helix/clips?game_id=${game.id}&first=6&language=es`,
          { headers }
        ),
      ]);

      const streamsData = await streamsRes.json();
      const streams = streamsData.data ?? [];
      liveCount = streams.length;
      totalViewers = streams.reduce((sum, s) => sum + (s.viewer_count || 0), 0);
      topStreams = streams.slice(0, 5).map(s => ({
        user_name: s.user_name,
        user_login: s.user_login,
        title: s.title,
        viewer_count: s.viewer_count,
        thumbnail_url: s.thumbnail_url
          ?.replace('{width}', '320')
          .replace('{height}', '180') ?? null,
      }));

      const clipsData = await clipsRes.json();
      topClips = (clipsData.data ?? []).map(c => ({
        id: c.id,
        title: c.title,
        url: c.url,
        thumbnail_url: c.thumbnail_url ?? null,
        view_count: c.view_count,
        creator_name: c.creator_name,
        broadcaster_name: c.broadcaster_name,
        created_at: c.created_at,
      }));
    }

    return NextResponse.json(
      { categoryName, liveCount, totalViewers, topStreams, topClips },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    console.error('game-meta error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
