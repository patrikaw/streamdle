import Link from 'next/link';
import Resultados from './Resultados';
import { fetchAvatarsBatch } from '../../../lib/twitch-server';
import { C } from '../../../lib/colores';
import { REDES as SOCIAL_SVG } from '../../../lib/redes';

export const metadata = {
  title: 'La Velada del Año VI: resultados y ganadores | Streamdle',
  description: 'Resultados de La Velada del Año VI (25 de julio de 2026, La Cartuja, Sevilla): TheGrefg venció a IlloJuan, Plex a Fernanfloo y más. Todos los combates.',
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
    description: '25 de julio de 2026 · Estadio de La Cartuja, Sevilla. Resultados y ganadores de los diez combates.',
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
  { twitch: 'thegrefg',       slug: 'thegrefg',       displayName: 'TheGrefg',      flag: '🇪🇸', fight: 10 },
  { twitch: 'illojuan',       slug: 'illojuan',       displayName: 'IlloJuan',      flag: '🇪🇸', fight: 10 },
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
    eventStatus: 'https://schema.org/EventScheduled', // el evento ya se realizó; el estado de Schema.org sigue siendo válido para eventos pasados
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: 'https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85',
    url: 'https://streamdle.net/eventos/la-velada-del-ano-6',
    performer: [
      'Gastón Edul', 'Edu Aguirre', 'La Parce', 'Fabiana Sevillano',
      'Natalia MX', 'Clersss', 'Lit Killah', 'Kidd Keo',
      'Alondrissa', 'Angie Velasco', 'Gero Arias', 'Viruzz',
      'Samy Rivers', 'Roro', 'Tatiana Kaer', 'Marta Díaz',
      'Fernanfloo', 'Yo Soy Plex',
    ].map(name => ({ '@type': 'Person', name })),
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
          .event-badge { width: 80px !important; height: 80px !important; flex-shrink: 0; }
          .velada-socials { flex-direction: row !important; }
          .header-icon { display: none !important; }
        }
      `}</style>

      {/* Header */}
      
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
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
        padding: '44px 24px 40px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(28px) brightness(0.12)',
          transform: 'scale(1.08)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(13,8,26,0.7) 100%)',
        }} />
        <div className="hero-inner" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative' }}>

          {/* Left: image + socials */}
          <div className="hero-badge-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <img
              src="https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85"
              alt="La Velada del Año VI"
              className="event-badge"
              style={{ width: 130, height: 130, borderRadius: 'var(--radius-md)', objectFit: 'cover', display: 'block', border: '3px solid rgba(124,58,237,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            />
            <div className="velada-socials" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {OFFICIAL_SOCIALS.map(({ href, type }) => {
                const s = SOCIAL_SVG[type];
                return (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="velada-social" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 'var(--radius-sm)',
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
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: C.warn, border: '1px solid rgba(245,158,11,0.4)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>🎪 EVENTO</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: C.live, border: '1px solid rgba(239,68,68,0.4)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>🥊 BOXEO</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(83,252,24,0.1)', color: C.kick, border: '1px solid rgba(83,252,24,0.3)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>📅 JUL 2026</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(148,163,184,0.15)', color: '#CBD5E1', border: '1px solid rgba(148,163,184,0.4)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>✅ FINALIZADO</span>
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, color: '#fff' }}>
              La Velada del Año VI
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 580, marginBottom: 20 }}>
              La Velada del Año VI, organizada por Ibai Llanos, se celebró el sábado 25 de julio de 2026 en el Estadio de La Cartuja de Sevilla, España, a partir de las 19:00 horas, con más de 80.000 espectadores en directo. Acá están los resultados de los diez combates.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {STATS.map(({ icon, value, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)', padding: '8px 14px',
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
                borderRadius: 'var(--radius-sm)', padding: '8px 14px',
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

      {/* Resultados */}
      <Resultados />

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
                  borderRadius: 'var(--radius-md)', padding: '16px 14px', height: '100%',
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
                      background: 'linear-gradient(135deg, var(--color-purple), #9D5FF5)',
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
                    fontSize: 10, fontWeight: 700, color: C.blueLight,
                    background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
                    borderRadius: 'var(--radius-xs)', padding: '2px 8px', marginTop: 'auto',
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
