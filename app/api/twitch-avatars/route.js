import { NextResponse } from 'next/server';

async function getTwitchToken() {
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
  return data.access_token;
}

async function fetchBatch(logins, token) {
  const query = logins.map(l => `login=${l.trim()}`).join('&');
  const res = await fetch(`https://api.twitch.tv/helix/users?${query}`, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.data || [];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const logins = searchParams.get('logins');

    if (!logins) {
      return NextResponse.json({ error: 'No logins provided' }, { status: 400 });
    }

    const token = await getTwitchToken();
    const loginList = logins.split(',').map(l => l.trim()).filter(Boolean);

    // Dividir en lotes de 100
    const batches = [];
    for (let i = 0; i < loginList.length; i += 100) {
      batches.push(loginList.slice(i, i + 100));
    }

    // Fetch de todos los lotes
    const results = await Promise.all(batches.map(batch => fetchBatch(batch, token)));
    const allUsers = results.flat();

    const avatars = {};
    allUsers.forEach(user => {
      avatars[user.login.toLowerCase()] = {
        avatar: user.profile_image_url,
        display_name: user.display_name,
        created_at: user.created_at,
      };
    });

    return NextResponse.json(avatars, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json({ error: 'Failed to fetch avatars' }, { status: 500 });
  }
}