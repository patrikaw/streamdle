import { NextResponse } from 'next/server';
import { STREAMERS } from '../../../data/streamers';

const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');

// Quién cumple años hoy (fecha de Argentina, donde está la audiencia principal).
export async function GET() {
  const [dia, mes] = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Argentina/Buenos_Aires', day: 'numeric', month: 'numeric' })
    .format(new Date()).split('/').map(Number);
  const hoy = STREAMERS
    .filter((s) => s.is_active !== false && Number(s.birth_day) === dia && Number(s.birth_month) === mes)
    .map((s) => ({ slug: slugDe(s), nombre: s.display_name, anio: s.birth_year ? Number(s.birth_year) : null }));
  return NextResponse.json({ hoy }, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
}
