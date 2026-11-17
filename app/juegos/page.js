import Link from 'next/link';
import { getCategoriesWithMinStreamers } from '../../lib/categories';
import { fetchTwitchGame } from '../../lib/twitch-server';
import { fmtNum } from '../../lib/formato';
import { colorCategoria } from '../../lib/colores';
import { plural } from '../../lib/plural';

export const revalidate = 86400;

export const metadata = {
  title: 'Juegos — Streamers Hispanos por Categoría | Streamdle',
  description: 'Explorá qué streamers hispanos juegan Minecraft, Fortnite, GTA V, LoL y más. Ranking, clips y cultura de cada juego en Twitch y Kick.',
  keywords: ['streamers por juego', 'streamers minecraft español', 'streamers fortnite hispanos', 'streamers gta v twitch', 'categorias streamers twitch', 'comunidad streaming latina'],
  openGraph: {
    title: 'Juegos · La cultura streamer hispana alrededor de cada juego',
    description: 'Minecraft, Fortnite, GTA V, LoL y más. Descubrí los streamers hispanos de cada juego con clips, stats y trivia.',
    url: 'https://streamdle.net/juegos',
  },
  twitter: {
    card: 'summary',
    title: 'Juegos · La cultura streamer hispana alrededor de cada juego',
    description: 'Minecraft, Fortnite, GTA V, LoL y más. Descubrí los streamers hispanos de cada juego con clips, stats y trivia.',
  },
  alternates: { canonical: 'https://streamdle.net/juegos' },
};

const getColor = colorCategoria;

const fmt = (n) => fmtNum(n, '—');

function flagOf(code) {
  const m = { ES:'🇪🇸', AR:'🇦🇷', MX:'🇲🇽', PE:'🇵🇪', CO:'🇨🇴', CL:'🇨🇱', SV:'🇸🇻', PR:'🇵🇷', VE:'🇻🇪', UY:'🇺🇾', GT:'🇬🇹', DO:'🇩🇴', CU:'🇨🇺', FR:'🇫🇷', NO:'🇳🇴' };
  return m[code] ?? '🌍';
}

export default async function JuegosPage() {
  const categories = getCategoriesWithMinStreamers(7);

  const artResults = await Promise.allSettled(
    categories.map(cat => fetchTwitchGame(cat.name))
  );
  const artMap = {};
  artResults.forEach((res, i) => {
    if (res.status === 'fulfilled' && res.value?.box_art_url) {
      artMap[categories[i].name] = res.value.box_art_url
        .replace('{width}', '120').replace('{height}', '160');
    }
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        .juegos-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .juegos-card:hover { transform: translateY(-2px); }
        .breadcrumb-link:hover { color: #fff !important; }
        .juegos-card:hover .juegos-card-inner {
          border-color: var(--card-color) !important;
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
        }
        .juegos-card-accent { transition: opacity 0.18s ease; opacity: 0.5; }
        .juegos-card:hover .juegos-card-accent { opacity: 1; }
        @media (max-width: 640px) { .header-icon { display: none !important; } }
      `}</style>

      {/* Header */}
      
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
        <Link href="/explorar" className="breadcrumb-link" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Explorar</Link>
        <span>›</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>Juegos</span>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '32px 24px 36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-card)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)', padding: '4px 14px', marginBottom: 18,
          fontSize: 12, color: 'var(--color-text-secondary)',
        }}>
          🎮 {categories.length} categorías · {categories.reduce((s, c) => s + c.totalCount, 0)} participaciones
        </div>
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 14,
        }}>
          La cultura streamer{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--color-purple), var(--color-kick))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>alrededor del juego</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
          Cada juego tiene su comunidad de streamers hispanos. Explorá quiénes los juegan, cuántos hay y toda la cultura que se genera alrededor.
        </p>
      </div>

      {/* Grid */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {categories.map(cat => {
            const color = getColor(cat.name);
            return (
              <Link
                key={cat.slug}
                href={`/juegos/${cat.slug}`}
                className="juegos-card"
                style={{ textDecoration: 'none', color: 'inherit', '--card-color': color }}
              >
                <div
                  className="juegos-card-inner"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', padding: '16px 18px',
                    position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.18s ease',
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                  }}
                >
                  <div
                    className="juegos-card-accent"
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 3, background: color, borderRadius: '14px 14px 0 0',
                    }}
                  />

                  {/* Key art */}
                  <div style={{
                    width: 60, height: 80, flexShrink: 0, borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden', marginTop: 4,
                    background: `${color}22`,
                    border: `1px solid ${color}33`,
                  }}>
                    {artMap[cat.name]
                      ? <img src={artMap[cat.name]} alt={cat.name} width={60} height={80}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22, color,
                        }}>🎮</div>
                    }
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0, marginTop: 4 }}>
                    <div style={{ marginBottom: 10 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 5, lineHeight: 1.2 }}>
                        {cat.name}
                      </h2>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          background: `${color}22`, color,
                          border: `1px solid ${color}44`,
                          borderRadius: 'var(--radius-sm)', padding: '2px 8px',
                        }}>
                          {plural(cat.totalCount, 'streamer')}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                          {cat.primaryCount} principal · {cat.secondaryCount} sec.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {cat.topStreamers.map(s => (
                        <span key={s.id} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 11, color: 'var(--color-text-secondary)',
                          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', padding: '3px 7px',
                        }}>
                          {flagOf(s.country)} {s.display_name}
                          <span style={{ color: '#555', fontSize: 10 }}>{fmt(s.total_followers)}</span>
                        </span>
                      ))}
                      {cat.totalCount > 2 && (
                        <span style={{
                          fontSize: 11, color: 'var(--color-text-secondary)',
                          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', padding: '3px 7px',
                        }}>
                          +{cat.totalCount - 2} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
