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

const FIGHTERS_WITH_PROFILES = [
  { twitch: 'nataliamx',      slug: 'nataliamx',       displayName: 'Natalia MX',    flag: '🇲🇽', fight: 3 },
  { twitch: 'litkillah',      slug: 'litkillah',       displayName: 'LITkillah',     flag: '🇦🇷', fight: 4 },
  { twitch: 'alondrissa',     slug: 'alondrissa',      displayName: 'Alondrissa',    flag: '🇵🇷', fight: 5 },
  { twitch: 'angievelasco08', slug: 'angievelasco08',  displayName: 'Angie Velasco', flag: '🇦🇷', fight: 5 },
  { twitch: 'byviruzz',       slug: 'byviruzz',        displayName: 'byViruZz',      flag: '🇪🇸', fight: 6 },
  { twitch: 'rivers_gg',      slug: 'rivers-gg',       displayName: 'Samy Rivers',   flag: '🇲🇽', fight: 7 },
  { twitch: 'fernanfloo',     slug: 'fernanfloo',      displayName: 'Fernanfloo',    flag: '🇸🇻', fight: 9 },
];

const INFO = [
  { icon: '📅', label: 'Fecha',      value: '25 de julio de 2026' },
  { icon: '🕖', label: 'Hora',       value: '19:00 (España peninsular)' },
  { icon: '📍', label: 'Lugar',      value: 'Estadio de La Cartuja, Sevilla' },
  { icon: '👥', label: 'Capacidad',  value: '+80.000 espectadores' },
];

export default async function VeladaPage() {
  const fighterLogins = FIGHTERS_WITH_PROFILES.map(f => f.twitch);
  const avatarData = await fetchAvatarsBatch(fighterLogins).catch(() => ({}));
  const fighterAvatar = (login) => avatarData[login?.toLowerCase()]?.url ?? null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--color-text)' }}>

      {/* Hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #0d0618 0%, #1a0a2e 50%, var(--bg-primary) 100%)',
        paddingBottom: 40,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85)`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.12, filter: 'blur(2px)',
        }} />

        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '60px 20px 0' }}>
          <a href="/" style={{ fontSize: 12, color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
            ← Streamdle
          </a>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <img
              src="https://www.infobae.com/resizer/v2/FQGHRHFGH5CM7HTZZNKSBK36E4.jpg?auth=07dcd7c19353c7a54f4b1f4fc291576b012d7e3e85d43e492c641181ccec1996&smart=true&width=1200&height=1200&quality=85"
              alt="La Velada del Año VI"
              style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 14, border: '2px solid rgba(124,58,237,0.5)', flexShrink: 0 }}
            />
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)', padding: '3px 10px', borderRadius: 20 }}>🎪 EVENTO</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.4)', padding: '3px 10px', borderRadius: 20 }}>🥊 BOXEO</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(83,252,24,0.1)', color: '#53FC18', border: '1px solid rgba(83,252,24,0.3)', padding: '3px 10px', borderRadius: 20 }}>📅 JUL 2026</span>
              </div>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
                La Velada del Año VI
              </h1>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 500 }}>
                La Velada del Año VI se celebrará el sábado 25 de julio de 2026 en el Estadio de La Cartuja en Sevilla, España a partir de las 19:00 horas (horario peninsular) con una capacidad de más de 80.000 espectadores en directo. Se estima que durará hasta altas horas de la madrugada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 32 }}>
          {INFO.map(item => (
            <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Organización + Redes (compacto) */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '12px 16px', marginBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Organización</div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 5, fontWeight: 600 }}>Organizador</div>
              <a href="/ibai" style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(124,58,237,0.15)', color: 'var(--color-purple-light)', border: '1px solid rgba(124,58,237,0.3)', textDecoration: 'none' }}>
                🎤 Ibai Llanos
              </a>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 5, fontWeight: 600 }}>Redes oficiales</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { href: 'https://www.instagram.com/infolavelada/', s: SOCIAL_SVG.instagram },
                  { href: 'https://x.com/infoLaVelada', s: SOCIAL_SVG.twitter },
                  { href: 'https://www.infolavelada.com/', s: SOCIAL_SVG.web },
                ].map(({ href, s }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 30, height: 30, borderRadius: 7,
                    background: s.bg, border: `1px solid ${s.border}`,
                    color: s.color, textDecoration: 'none', flexShrink: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vote section */}
      <VoteSection />

      {/* Fighters with profiles */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 60px' }}>
        <style>{`.fighter-card { transition: border-color 0.2s, transform 0.15s; } .fighter-card:hover { border-color: rgba(124,58,237,0.6) !important; transform: translateY(-2px); }`}</style>
        <h2 style={{ fontSize: 'clamp(18px, 3.5vw, 24px)', fontWeight: 800, marginBottom: 6 }}>
          🥊 Luchadores con ficha en Streamdle
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 20 }}>
          Hacé clic en cada tarjeta para ver el perfil completo del luchador
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12,
        }}>
          {FIGHTERS_WITH_PROFILES.map(f => {
            const avatar = fighterAvatar(f.twitch);
            return (
              <a key={f.twitch} href={`/${f.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fighter-card" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 14, padding: '16px 12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, cursor: 'pointer',
                }}>
                  {avatar ? (
                    <img src={avatar} alt={f.displayName} width={68} height={68} style={{
                      borderRadius: '50%', objectFit: 'cover', display: 'block',
                      border: '2px solid var(--color-border)',
                    }} />
                  ) : (
                    <div style={{
                      width: 68, height: 68, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED, #9D5FF5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, fontWeight: 800, color: '#fff',
                      border: '2px solid var(--color-border)',
                    }}>
                      {f.displayName[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{f.displayName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3 }}>{f.flag}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: '#60A5FA',
                    background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
                    borderRadius: 4, padding: '2px 8px',
                  }}>
                    Combate {f.fight}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
        })}}
      />
    </div>
  );
}
