export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const users = searchParams.get('users')?.split(',').filter(Boolean) ?? [];
  if (!users.length) return Response.json({});

  const results = {};
  await Promise.allSettled(
    users.map(async (u) => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${u}`, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const data = await res.json();
          results[u] = {
            live: !!data.livestream,
            viewers: data.livestream?.viewer_count ?? 0,
          };
        } else {
          results[u] = { live: false, viewers: 0 };
        }
      } catch {
        results[u] = { live: false, viewers: 0 };
      }
    })
  );

  return Response.json(results, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  });
}
