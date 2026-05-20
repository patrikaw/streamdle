import VoteSection from './VoteSection';

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

const INFO = [
  { icon: '📅', label: 'Fecha',      value: '25 de julio de 2026' },
  { icon: '🕖', label: 'Hora',       value: '19:00 (España peninsular)' },
  { icon: '📍', label: 'Lugar',      value: 'Estadio de La Cartuja, Sevilla' },
  { icon: '👥', label: 'Capacidad',  value: '+80.000 espectadores' },
];

export default function VeladaPage() {
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

        {/* Organizer */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '16px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 28 }}>🎤</div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Organizador</div>
            <a href="/ibai" style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-purple-light)', textDecoration: 'none' }}>
              Ibai Llanos →
            </a>
          </div>
        </div>

        {/* Social links */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '16px 18px', marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Redes oficiales</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/infolavelada/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', padding: '7px 14px', borderRadius: 8 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
            <a
              href="https://x.com/infoLaVelada"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: '#000', border: '1px solid rgba(255,255,255,0.15)', padding: '7px 14px', borderRadius: 8 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X / Twitter
            </a>
            <a
              href="https://www.infolavelada.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.5)', padding: '7px 14px', borderRadius: 8 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
              Web oficial
            </a>
          </div>
        </div>
      </div>

      {/* Vote section */}
      <VoteSection />

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
