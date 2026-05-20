import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import VoteSection from './VoteSection';
import { fetchAvatarsBatch } from '../../../lib/twitch-server';

export const metadata = {
  title: 'La Velada del Año VI: Fecha, Hora, Lugar y Peleas | Streamdle',
  description: 'La Velada del Año VI se celebra el 25 de julio de 2026 en el Estadio de La Cartuja, Sevilla. Fecha, hora, lugar, combates, peleadores y predicciones.',
  keywords: [
    'velada del año 6 fecha', 'velada del año 6 hora', 'velada del año 6 lugar',
    'velada del año 6 donde', 'velada del año 6 cuando', 'velada del año 6 horario',
    'velada del año 6 capacidad', 'velada del año 6 peleas', 'velada del año 6 luchas',
    'velada del año 6 combates', 'velada del año 6 boxeo', 'velada del año 6 predicciones',
    'velada del año 6 participantes', 'velada del año 6 peleadores', 'velada del año 6 cronograma',
    'la velada del año vi', 'ibai llanos velada 2026',
  ],
  openGraph: {
    title: 'La Velada del Año VI | Streamdle',
    description: '25 de julio de 2026 · Estadio de La Cartuja, Sevilla · +80.000 espectadores. Combates, peleadores y predicciones.',
    images: [{ url: 'https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85', width: 1200, height: 1200 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Velada del Año VI | Streamdle',
    description: '25 de julio de 2026 · Estadio de La Cartuja, Sevilla',
    images: ['https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85'],
  },
  alternates: { canonical: 'https://streamdle.net/eventos/la-velada-del-ano-6' },
};

const SOCIAL_SVG = {
  instagram: { path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: '#E1306C', bg: 'rgba(225,48,108,0.12)', border: 'rgba(225,48,108,0.3)' },
  twitter:   { path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z', color: '#1DA1F2', bg: 'rgba(29,161,242,0.12)', border: 'rgba(29,161,242,0.3)' },
  web:       { path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', color: '#9D5FF5', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)' },
};

const OFFICIAL_SOCIALS = [
  { href: 'https://www.instagram.com/infolavelada/', type: 'instagram' },
  { href: 'https://x.com/infoLaVelada',             type: 'twitter'   },
  { href: 'https://www.infolavelada.com/',           type: 'web'       },
];

const FIGHTERS_WITH_PROFILES = [
  { twitch: 'nataliamx',      slug: 'nataliamx',      displayName: 'Natalia MX',    flag: '🇲🇽', fight: 3 },
  { twitch: 'litkillah',      slug: 'litkillah',      displayName: 'LITkillah',     flag: '🇦🇷', fight: 4 },
  { twitch: 'alondrissa',     slug: 'alondrissa',     displayName: 'Alondrissa',    flag: '🇵🇷', fight: 5 },
  { twitch: 'angievelasco08', slug: 'angievelasco08', displayName: 'Angie Velasco', flag: '🇦🇷', fight: 5 },
  { twitch: 'byviruzz',       slug: 'byviruzz',       displayName: 'byViruZz',      flag: '🇪🇸', fight: 6 },
  { twitch: 'rivers_gg',      slug: 'rivers-gg',      displayName: 'Samy Rivers',   flag: '🇲🇽', fight: 7 },
  { twitch: 'fernanfloo',     slug: 'fernanfloo',     displayName: 'Fernanfloo',    flag: '🇸🇻', fight: 9 },
];

const GAME_LINKS = [
  { href: '/classic',     label: '🎯 Classic'     },
  { href: '/avatardle',   label: '👤 Avatardle'   },
  { href: '/emojidle',    label: '😂 Emojidle'    },
  { href: '/categorydle', label: '🎮 Categorydle' },
  { href: '/chatdle',     label: '💬 Chatdle'     },
  { href: '/higherdle',   label: '📊 Higherdle'   },
];

const STATS = [
  { icon: '📅', value: '25 jul 2026',         label: 'fecha'        },
  { icon: '🕖', value: '19:00 (ES)',           label: 'hora'         },
  { icon: '📍', value: 'La Cartuja, Sevilla', label: 'lugar'        },
  { icon: '👥', value: '+80.000',             label: 'espectadores' },
];

export default async function VeladaPage() {
  const avatarData = await fetchAvatarsBatch(FIGHTERS_WITH_PROFILES.map(f => f.twitch)).catch(() => ({}));
  const fighterAvatar = (login) => avatarData[login?.toLowerCase()]?.url ?? null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio',              item: 'https://streamdle.net/' },
      { '@type': 'ListItem', position: 2, name: 'Eventos',             item: 'https://streamdle.net/eventos' },
      { '@type': 'ListItem', position: 3, name: 'La Velada del Año VI', item: 'https://streamdle.net/eventos/la-velada-del-ano-6' },
    ],
  };

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'La Velada del Año VI',
    startDate: '2026-07-25T19:00:00+02:00',
    endDate: '2026-07-26T03:00:00+02:00',
    location: { '@type': 'Place', name: 'Estadio de La Cartuja', address: { '@type': 'PostalAddress', addressLocality: 'Sevilla', addressCountry: 'ES' } },
    organizer: { '@type': 'Person', name: 'Ibai Llanos', url: 'https://streamdle.net/ibai' },
    description: 'La Velada del Año VI, evento de boxeo organizado por Ibai Llanos en el Estadio de La Cartuja, Sevilla.',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: 'https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85',
    url: 'https://streamdle.net/eventos/la-velada-del-ano-6',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--color-text)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <style>{`
        .fighter-card { transition: border-color 0.2s; }
        .fighter-card:hover { border-color: rgba(124,58,237,0.6) !important; }
        .velada-social { transition: opacity 0.2s; }
        .velada-social:hover { opacity: 0.75; }
        @media (max-width: 640px) {
          .hero-inner { flex-direction: column !important; }
          .hero-badge-col { width: 100% !important; flex-direction: row !important; align-items: center; gap: 16px !important; }
          .event-badge { width: 64px !important; height: 64px !important; flex-shrink: 0; }
          .velada-socials { flex-direction: row !important; }
          .header-icon { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10,
        gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
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
          {GAME_LINKS.map(g => (
            <Link key={g.href} href={g.href} style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'white',
              borderRadius: 8, padding: '5px 12px', fontSize: 10, fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</Link>
          ))}
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto', padding: '10px 24px 12px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: 'var(--color-text-secondary)', flexWrap: 'wrap',
        }}>
          {[
            { label: 'Explorar',             href: '/explorar' },
            { label: 'Eventos',              href: '/eventos'  },
            { label: 'La Velada del Año VI', href: null        },
          ].map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span>›</span>}
              {c.href
                ? <Link href={c.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>{c.label}</Link>
                : <span style={{ color: 'var(--color-purple-light)', fontWeight: 600 }}>{c.label}</span>
              }
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '44px 24px 40px',
      }}>
        <div className="hero-inner" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start' }}>

          {/* Left: image + socials */}
          <div className="hero-badge-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <img
              src="https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85"
              alt="La Velada del Año VI"
              className="event-badge"
              style={{ width: 90, height: 90, borderRadius: 12, objectFit: 'cover', display: 'block', border: '3px solid rgba(124,58,237,0.5)' }}
            />
            <div className="velada-socials" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {OFFICIAL_SOCIALS.map(({ href, type }) => {
                const s = SOCIAL_SVG[type];
                return (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="velada-social" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 9,
                    background: s.bg, border: `1px solid ${s.border}`,
                    color: s.color, textDecoration: 'none',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: text */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)', padding: '3px 10px', borderRadius: 20 }}>🎪 EVENTO</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.4)', padding: '3px 10px', borderRadius: 20 }}>🥊 BOXEO</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(83,252,24,0.1)', color: '#53FC18', border: '1px solid rgba(83,252,24,0.3)', padding: '3px 10px', borderRadius: 20 }}>📅 JUL 2026</span>
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, color: '#fff' }}>
              La Velada del Año VI
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 580, marginBottom: 20 }}>
              La Velada del Año VI se celebrará el sábado 25 de julio de 2026 en el Estadio de La Cartuja en Sevilla, España a partir de las 19:00 horas con más de 80.000 espectadores en directo.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {STATS.map(({ icon, value, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 10, padding: '8px 14px',
                }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{value}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{label}</div>
                  </div>
                </div>
              ))}
              <Link href="/ibai" style={{
                display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 10, padding: '8px 14px',
              }}>
                <span style={{ fontSize: 16 }}>🎤</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-purple-light)' }}>Ibai Llanos</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>organizador</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Combates */}
      <VoteSection />

      {/* Luchadores con ficha */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 72px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          🥊 Luchadores con ficha en Streamdle
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
          Hacé clic en cada tarjeta para ver el perfil completo del luchador
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
          {FIGHTERS_WITH_PROFILES.map(f => {
            const avatar = fighterAvatar(f.twitch);
            return (
              <Link key={f.twitch} href={`/${f.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fighter-card" style={{
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 12, padding: '16px 14px', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                }}>
                  {avatar ? (
                    <img src={avatar} alt={f.displayName} width={56} height={56} style={{
                      borderRadius: '50%', objectFit: 'cover', display: 'block',
                      border: '2px solid var(--color-border)',
                    }} />
                  ) : (
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED, #9D5FF5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 800, color: '#fff',
                      border: '2px solid var(--color-border)',
                    }}>
                      {f.displayName[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{f.displayName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{f.flag}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: '#60A5FA',
                    background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
                    borderRadius: 4, padding: '2px 8px', marginTop: 'auto',
                  }}>
                    Combate {f.fight}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
