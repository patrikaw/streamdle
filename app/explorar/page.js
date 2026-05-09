import Link from 'next/link';
import { STREAMERS } from '../../data/streamers';
import SearchBar from '../components/SearchBar';
import { getCategoriesWithMinStreamers } from '../../lib/categories';

export const metadata = {
  title: 'Explorar — Streamers, Juegos, Comunidades y más | Streamdle',
  description: 'Descubrí todo lo que tiene Streamdle: el ranking de streamers hispanohablantes, juegos por categoría, comunidades, equipos de esports y tipos de contenido.',
  keywords: 'streamers hispanos, juegos twitch español, comunidades streamers, esports hispano, contenido streaming latino',
  openGraph: {
    title: 'Explorar Streamdle — Streamers, Juegos, Comunidades y más',
    description: 'Todo el universo del streaming hispanohablante en un solo lugar.',
    url: 'https://streamdle.net/explorar',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explorar Streamdle',
    description: 'Todo el universo del streaming hispanohablante en un solo lugar.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/explorar' },
};

const GAME_NAV = [
  { href: '/classic',     label: '🎯 Classic' },
  { href: '/avatardle',   label: '👤 Avatardle' },
  { href: '/emojidle',    label: '😂 Emojidle' },
  { href: '/categorydle', label: '🎮 Categorydle' },
  { href: '/chatdle',     label: '💬 Chatdle' },
  { href: '/higherdle',   label: '📊 Higherdle' },
];

export default function ExplorarPage() {
  const totalStreamers = STREAMERS.length;
  const totalJuegos = getCategoriesWithMinStreamers(7).length;
  const totalEsports = STREAMERS.filter(s => s.esports_team).length;
  const totalComunidades = new Set(
    STREAMERS.flatMap(s => Array.isArray(s.community) ? s.community : s.community ? [s.community] : [])
  ).size;

  const SECTIONS = [
    {
      icon: '🎙️',
      title: 'Streamers',
      desc: 'Todos los streamers hispanohablantes de Twitch y Kick. Filtrá por país, ordená por seguidores, peak viewers u horas de transmisión.',
      href: '/streamers',
      live: true,
      color: '#7C3AED',
      stat: `${totalStreamers} streamers`,
    },
    {
      icon: '🎮',
      title: 'Juegos',
      desc: 'Explorá qué juegan los streamers hispanos. Fortnite, Minecraft, GTA V, League of Legends y más — con clips, stats y cultura.',
      href: '/juegos',
      live: true,
      color: '#53FC18',
      stat: `${totalJuegos} categorías`,
    },
    {
      icon: '🎉',
      title: 'Eventos',
      desc: 'La Velada del Año, Kings League, toreos, collabs masivas y los momentos más importantes de la escena hispana del streaming.',
      href: '/eventos',
      live: false,
      color: '#F59E0B',
      stat: 'Próximamente',
    },
    {
      icon: '🏆',
      title: 'Esports',
      desc: 'Equipos profesionales, jugadores con contratos activos y toda la escena competitiva hispanohablante en Twitch y Kick.',
      href: '/esports',
      live: false,
      color: '#EF4444',
      stat: `${totalEsports} streamers con equipo`,
    },
    {
      icon: '👥',
      title: 'Comunidades',
      desc: 'Coscu Army, QSMP, G2 House, Esos 4 y todas las comunidades que definen la cultura streamer hispana.',
      href: '/comunidades',
      live: false,
      color: '#38BDF8',
      stat: `${totalComunidades} comunidades`,
    },
    {
      icon: '🎯',
      title: 'Contenido',
      desc: 'Encontrá streamers por su tipo de contenido: Variedad, IRL, Lifestyle, Eventos, Pro Player, Tryhard, Reacción y más.',
      href: '/contenido',
      live: false,
      color: '#F472B6',
      stat: '8 tipos de contenido',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        .explorar-card { transition: transform 0.18s ease; }
        .explorar-card:hover { transform: translateY(-3px); }
        .explorar-card-inner { transition: border-color 0.18s ease, box-shadow 0.18s ease; }
        .explorar-card:hover .explorar-card-inner { box-shadow: 0 8px 32px rgba(0,0,0,0.35); }
        .explorar-card[data-live="true"]:hover .explorar-card-inner { border-color: var(--card-color) !important; }
        @media (max-width: 640px) { .header-icon { display: none !important; } }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="header-icon" style={{ fontSize: 20 }}>🎮</span>
            <span style={{
              fontSize: 18, fontWeight: 800,
              background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>STREAMDLE</span>
          </Link>
          <SearchBar />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {GAME_NAV.map(g => (
            <Link key={g.href} href={g.href} style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              color: 'white', borderRadius: 8, padding: '5px 12px',
              fontSize: 10, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</Link>
          ))}
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '52px 24px 40px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-card)', border: '1px solid var(--color-border)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 20,
          fontSize: 12, color: 'var(--color-text-secondary)',
        }}>
          🔍 Todo el universo del streaming hispano
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>
          Explorá{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Streamdle</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
          Streamers, juegos, comunidades, esports y más — toda la escena hispana en un solo lugar.
        </p>
      </div>

      {/* Grid */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {SECTIONS.map(sec => {
            const inner = (
              <div
                className="explorar-card-inner"
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${sec.live ? 'var(--color-border)' : 'var(--color-border)'}`,
                  borderRadius: 16, padding: '24px 22px',
                  position: 'relative', overflow: 'hidden',
                  opacity: sec.live ? 1 : 0.72,
                }}
              >
                {/* Top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: sec.live ? sec.color : 'var(--color-border)',
                  borderRadius: '16px 16px 0 0',
                }} />

                {/* Icon + stat */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, marginTop: 6 }}>
                  <span style={{ fontSize: 32 }}>{sec.icon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    background: sec.live ? `${sec.color}22` : 'var(--bg-secondary)',
                    color: sec.live ? sec.color : 'var(--color-text-secondary)',
                    border: `1px solid ${sec.live ? sec.color + '44' : 'var(--color-border)'}`,
                    borderRadius: 8, padding: '3px 9px',
                  }}>
                    {sec.stat}
                  </span>
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{sec.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                  {sec.desc}
                </p>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 700,
                  color: sec.live ? sec.color : 'var(--color-text-secondary)',
                }}>
                  {sec.live ? `Ver ${sec.title} →` : '🔒 Próximamente'}
                </div>
              </div>
            );

            return sec.live
              ? (
                <Link
                  key={sec.title}
                  href={sec.href}
                  className="explorar-card"
                  data-live="true"
                  style={{ textDecoration: 'none', color: 'inherit', '--card-color': sec.color }}
                >
                  {inner}
                </Link>
              )
              : (
                <div
                  key={sec.title}
                  className="explorar-card"
                  data-live="false"
                  style={{ cursor: 'default', '--card-color': sec.color }}
                >
                  {inner}
                </div>
              );
          })}
        </div>

        {/* Juegos diarios */}
        <div style={{
          marginTop: 52, background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(83,252,24,0.06))',
          border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '28px 24px',
        }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>🎯 Juegos diarios</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Nuevos desafíos cada día — ¿cuánto sabés de los streamers hispanos?
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GAME_NAV.map(g => (
              <Link key={g.href} href={g.href} style={{
                background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                color: 'white', borderRadius: 10, padding: '8px 16px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}>{g.label}</Link>
            ))}
          </div>
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-border)', background: 'var(--bg-secondary)',
        padding: '20px 24px', textAlign: 'center', fontSize: 12, color: 'var(--color-text-secondary)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          {[{ href: '/streamers', label: 'Streamers' }, { href: '/juegos', label: 'Juegos' }, { href: '/contacto', label: 'Contacto' }, { href: '/privacidad', label: 'Privacidad' }].map(l => (
            <a key={l.href} href={l.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
        <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-green)', textDecoration: 'none' }}>Pato Wnuk</a>.
      </footer>
    </div>
  );
}
