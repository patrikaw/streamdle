import { NextResponse } from 'next/server';
import { fetchClipsById } from '../../../../lib/twitch-server';

const cabecera = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{6,80}$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    if (id.startsWith('clip_')) {
      const r = await fetch(`https://kick.com/api/v2/clips/${id}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) });
      if (!r.ok) return NextResponse.json({ ok: false }, { headers: cabecera });
      const c = (await r.json()).clip || {};
      return NextResponse.json({ ok: !!c.thumbnail_url, plataforma: 'Kick', thumb: c.thumbnail_url || null, titulo: c.title || null, vistas: c.views ?? c.view_count ?? null, duracion: c.duration ?? null }, { headers: cabecera });
    }
    const [c] = await fetchClipsById([id]);
    if (!c) return NextResponse.json({ ok: false }, { headers: cabecera });
    return NextResponse.json({ ok: !!c.thumbnail_url, plataforma: 'Twitch', thumb: c.thumbnail_url, titulo: c.title, vistas: c.view_count, duracion: c.duration ?? null }, { headers: cabecera });
  } catch {
    return NextResponse.json({ ok: false }, { headers: cabecera });
  }
}
