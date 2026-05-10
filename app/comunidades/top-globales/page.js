import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import { fetchAvatarsBatch } from '../../../lib/twitch-server';
import MemberCards from './MemberCards';
import CommunityTrivia from './CommunityTrivia';
import CommunityFAQ from './CommunityFAQ';
import CommunitySocials from './CommunitySocials';
import ClipCards from './ClipCards';

export const revalidate = 86400;

export async function generateMetadata() {
  return {
    title: 'Top Globales: el boom del gaming en Kick Argentina',
    description: 'Coscu, Goncho, DuendePablo, Zeko, Coker y más streamers argentinos que están reviviendo el gaming en Kick con streams diarios y momentos virales.',
    keywords: [
      'top globales', 'topglo', 'kick argentina', 'streamers argentinos',
      'coscu', 'goncho', 'duendepablo', 'zeko', 'coker',
      'gaming argentino', 'kick hispano', 'streamers kick',
    ],
    openGraph: {
      title: 'Top Globales: el boom del gaming en Kick Argentina',
      description: 'Coscu, Goncho, DuendePablo, Zeko, Coker y más streamers argentinos reviviendo el gaming en Kick.',
      url: 'https://streamdle.net/comunidades/top-globales',
    },
    twitter: {
      card: 'summary',
      title: 'Top Globales: el boom del gaming en Kick Argentina',
      description: 'Coscu, Goncho, DuendePablo, Zeko, Coker y más streamers argentinos reviviendo el gaming en Kick.',
    },
    alternates: { canonical: 'https://streamdle.net/comunidades/top-globales' },
  };
}

const COLOR = '#7C3AED';

// login = Twitch username usado solo para fetchAvatarsBatch (no se muestra)
const MEMBERS_BASE = [
  {
    login: 'coscu', displayName: 'Coscu', kick: 'coscu',
    twitter: 'https://x.com/Martinpdisalvo', instagram: 'https://www.instagram.com/martinpdisalvo/',
    tiktok: 'https://www.tiktok.com/@adictoalvegetal', youtube: null,
    followers: 4504221, role: 'Fundador',
    desc: 'El creador del gaming. Leyenda del streaming argentino y motor del grupo.',
  },
  {
    login: 'goncho', displayName: 'Goncho', kick: 'goncho',
    twitter: 'https://x.com/gonchobanzas', instagram: 'https://www.instagram.com/gonchobanzas/',
    tiktok: 'https://www.tiktok.com/@gonchotwm', youtube: null,
    followers: 1664179, role: 'El estratega',
    desc: 'FIFA, FPS y el que lleva la vibe del grupo. Siempre con algo para decir.',
  },
  {
    login: 'duendepablo', displayName: 'DuendePablo', kick: 'duendepablo',
    twitter: null, instagram: null, tiktok: null, youtube: null,
    followers: 1038786, role: 'El Doctor',
    desc: '"Creador del gaming" según él mismo. Sus compañeros no están del todo seguros.',
  },
  {
    login: 'c0ker', displayName: 'Coker', kick: 'coker',
    twitter: 'https://x.com/c0ker_', instagram: 'https://www.instagram.com/c0ker_/',
    tiktok: null, youtube: 'https://www.youtube.com/@c0ker',
    followers: 963591, role: 'Streamer del Año 2026',
    desc: 'Ganó el premio en los Coscu Army Awards 2026. Nivel aura completamente desbloqueado.',
  },
  {
    login: 'zeko', displayName: 'Zeko', kick: 'zeko',
    twitter: 'https://x.com/fedecristalino', instagram: 'https://www.instagram.com/federicocristalino/',
    tiktok: 'https://www.tiktok.com/@federicocristalino', youtube: null,
    followers: 1407477, role: 'El tryhard',
    desc: 'FPS puro y competitivo. El que guarda botellas bajo la oficina.',
  },
];

const GUESTS_BASE = [
  {
    login: 'k1ng', displayName: 'K1ng', kick: 'k1ng',
    twitter: 'https://x.com/k1ng', instagram: 'https://www.instagram.com/k1ngclips/',
    followers: 2160610, desc: 'Prodigio. Aparece en el stream y explota todo.',
  },
  {
    login: 'robergalati', displayName: 'Rober Galati', kick: 'robergalati',
    twitter: null, instagram: null,
    followers: 769613, desc: 'Miembro oficial según TopGlo. Galán reconocido por la comunidad.',
  },
  {
    login: 'unicornio', displayName: 'Unicornio', kick: 'unicornio',
    twitter: null, instagram: 'https://www.instagram.com/germanusinger/',
    followers: 1373539, desc: 'El chill del grupo. Siempre suma buena onda.',
  },
  {
    login: 'carreraaa', displayName: 'Carreraaa', kick: 'carreraaa',
    twitter: 'https://x.com/rodricarreraaa', instagram: 'https://www.instagram.com/rodricarreraaa/',
    followers: 5514712, desc: 'La visita más grande del grupo: 5.5M de seguidores.',
  },
  {
    login: 'momoladinastia', displayName: 'Momo', kick: 'momoladinastia',
    twitter: 'https://x.com/momorelojero', instagram: 'https://www.instagram.com/gero.momo',
    followers: 1405247, desc: 'La Dinastía. Clips y caos garantizado cuando está en el stream.',
  },
];

const CLIPS = [
  { id: 'clip_01KPS6QRV6D5571KS8HSWWAJYQ', title: '24 HORAS CONTRASTE', streamer: 'Coker' },
  { id: 'clip_01KNR3PEF60Q5W84BVWNVY743D', title: 'Zeko sacando 5 botellas de abajo de la oficina', streamer: 'Goncho' },
  { id: 'clip_01KQBMBMXZ7QFXZ4WMBXM02KPQ', title: 'JASDJSDAJDASJDSAJSA QUEEEEE', streamer: 'Zeko' },
  { id: 'clip_01KNR2V77THZK75VJVY2DY6ZZ5', title: 'Mira como se reía el viejo', streamer: 'DuendePablo' },
  { id: 'clip_01KPYQ0FHB8KXMEBGYY1F96XS5', title: 'asd', streamer: 'Coscu' },
];

const COMMUNITY_SOCIALS = [
  { type: 'twitter',   href: 'https://x.com/i/communities/2018712266821034398' },
  { type: 'youtube',   href: 'https://www.youtube.com/@TopGlobalesOficial' },
  { type: 'instagram', href: 'https://www.instagram.com/topglobalesoficial/' },
  { type: 'tiktok',    href: 'https://www.tiktok.com/@topglobalesoficial' },
];

const TAGS = ['variedad', 'tryhard', 'irl'];

// SVG paths for guest social icons (server-rendered, no hover state needed)
const SOCIAL_SVG = {
  kick:      { path: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm3 4v12h2.5v-4l4.5 4H17l-5-5 4.5-4.5h-2.8L9.5 12.5V6H7z', color: '#53FC18', bg: 'rgba(83,252,24,0.12)', border: 'rgba(83,252,24,0.3)' },
  twitter:   { path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z', color: '#1DA1F2', bg: 'rgba(29,161,242,0.12)', border: 'rgba(29,161,242,0.3)' },
  instagram: { path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: '#E1306C', bg: 'rgba(225,48,108,0.12)', border: 'rgba(225,48,108,0.3)' },
};

function GuestSocialIcon({ href, type }) {
  if (!href) return null;
  const d = SOCIAL_SVG[type];
  if (!d) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: 8,
      background: d.bg, border: `1px solid ${d.border}`,
      color: d.color, textDecoration: 'none', flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d={d.path} />
      </svg>
    </a>
  );
}

function fmt(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toLocaleString('es');
}

export default async function TopGlobalesPage() {
  const allLogins = [
    ...MEMBERS_BASE.map(m => m.login),
    ...GUESTS_BASE.map(g => g.login),
  ].filter(Boolean);

  const userData = await fetchAvatarsBatch(allLogins).catch(() => ({}));
  const avatarOf = login => userData[login?.toLowerCase()]?.url ?? null;

  // Strip internal `login` field before passing to client components
  const members = MEMBERS_BASE.map(({ login, ...rest }) => ({ ...rest, avatarUrl: avatarOf(login) }));
  const guests  = GUESTS_BASE.map(({ login, ...rest })  => ({ ...rest, avatarUrl: avatarOf(login) }));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio',       item: 'https://streamdle.net/' },
      { '@type': 'ListItem', position: 2, name: 'Comunidades',  item: 'https://streamdle.net/comunidades' },
      { '@type': 'ListItem', position: 3, name: 'Top Globales', item: 'https://streamdle.net/comunidades/top-globales' },
    ],
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Top Globales',
    url: 'https://streamdle.net/comunidades/top-globales',
    sameAs: COMMUNITY_SOCIALS.map(s => s.href),
    description: 'Comunidad de streamers argentinos formada por Coscu, Goncho, DuendePablo, Zeko y Coker que lidera el gaming en Kick Argentina.',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <style>{`
        .member-card:hover { border-color: ${COLOR} !important; transform: translateY(-2px); }
        .guest-card:hover  { border-color: ${COLOR} !important; }
        .comm-social:hover { opacity: 0.75; }
        @media (max-width: 640px) {
          .hero-inner  { flex-direction: column !important; }
          .hero-badge-col { width: 100% !important; flex-direction: row !important; align-items: center; gap: 16px !important; }
          .comm-badge  { width: 64px !important; height: 64px !important; flex-shrink: 0; }
          .comm-socials { flex-direction: row !important; flex-wrap: wrap !important; }
          .clips-grid  { grid-template-columns: 1fr !important; }
          .guests-grid { grid-template-columns: repeat(2, 1fr) !important; }
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
          {[
            { href: '/classic', label: '🎯 Classic' }, { href: '/avatardle', label: '👤 Avatardle' },
            { href: '/emojidle', label: '😂 Emojidle' }, { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle', label: '💬 Chatdle' }, { href: '/higherdle', label: '📊 Higherdle' },
          ].map(g => (
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
            { label: 'Explorar', href: '/explorar' },
            { label: 'Comunidades', href: '/comunidades' },
            { label: 'Top Globales', href: null },
          ].map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span>›</span>}
              {c.href ? (
                <Link href={c.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>{c.label}</Link>
              ) : (
                <span style={{ color: 'var(--color-purple-light)', fontWeight: 600 }}>{c.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(180deg, ${COLOR}14 0%, transparent 100%)`,
        borderBottom: '1px solid var(--color-border)',
        padding: '44px 24px 40px',
      }}>
        <div className="hero-inner" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start' }}>

          {/* Logo + social links */}
          <div className="hero-badge-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <img
              src="/top-globales-logo.jpg"
              alt="Top Globales"
              className="comm-badge"
              style={{
                width: 90, height: 90, borderRadius: '50%',
                objectFit: 'cover', display: 'block',
                border: `3px solid ${COLOR}66`,
              }}
            />
            <CommunitySocials socials={COMMUNITY_SOCIALS} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {TAGS.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, background: `${COLOR}22`, color: COLOR,
                  border: `1px solid ${COLOR}44`, borderRadius: 6, padding: '2px 9px',
                }}>
                  {tag}
                </span>
              ))}
              <span style={{
                fontSize: 11, background: 'rgba(83,252,24,0.1)', color: '#53FC18',
                border: '1px solid rgba(83,252,24,0.25)', borderRadius: 6, padding: '2px 9px',
              }}>
                Kick AR
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, color: '#fff' }}>
              Top Globales: el grupo que volvió a poner gaming en el streaming argentino
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 580, marginBottom: 20 }}>
              Mientras todo era slots, reacciones y puro IRL, un grupo de streamers argentinos decidió volver a lo importante: vicear durante 12 horas y cagarse de risa con la comunidad.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: `1px solid ${COLOR}44`, borderRadius: 10, padding: '8px 16px',
              }}>
                <span style={{ fontSize: 16 }}>👥</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>5</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>integrantes</div>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '8px 16px',
              }}>
                <span style={{ fontSize: 16 }}>🇦🇷</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Argentina</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>origen</div>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid rgba(83,252,24,0.2)', borderRadius: 10, padding: '8px 16px',
              }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#53FC18' }}>Kick</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>plataforma principal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '44px 24px 72px' }}>

        {/* ── 1. Integrantes ── */}
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Los 5 integrantes
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            El núcleo del grupo — mirá quién está en vivo ahora mismo
          </p>
          <MemberCards members={members} />
        </section>

        {/* ── 2. Intro SEO ── */}
        <section style={{ marginTop: 48 }}>
          <div style={{
            background: 'var(--bg-card)', border: `1px solid ${COLOR}33`,
            borderLeft: `3px solid ${COLOR}`, borderRadius: 12, padding: '22px 24px',
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
              Top Globales es una comunidad de streamers argentinos formada por Coscu, Goncho, DuendePablo, Zeko, Coker y varios invitados recurrentes que explotó en Kick gracias a sus streams diarios, el gaming constante y el caos total que manejan juntos.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0 }}>
              En una época donde gran parte del streaming hispano se había movido hacia slots, reacciones e IRL, el grupo empezó a destacar por algo bastante simple: volver a jugar videojuegos durante horas y hacer contenido como si fuese 2020 otra vez.
            </p>
          </div>
        </section>

        {/* ── 3. Clips virales (embeds) ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Los clips más virales del grupo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Momentos out of context, jugadas imposibles, gritos y escenas que explotaron en TikTok y Kick. Hacé click para verlos directamente en Kick.
          </p>
          <ClipCards clips={CLIPS} />
        </section>

        {/* ── 4. Trivia ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            ¿Cuánto sabés de los Top Globales?
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Ponete a prueba con preguntas sobre el lore del grupo, sus streamers y el caos diario.
          </p>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--color-border)',
            borderTop: `3px solid ${COLOR}`, borderRadius: 12, padding: '20px 20px 22px',
          }}>
            <CommunityTrivia color={COLOR} />
          </div>
        </section>

        {/* ── 5. ¿Qué son? ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            ¿Qué son los Top Globales?
          </h2>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 12, padding: '22px 24px',
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
              Más que un team, Top Globales terminó funcionando como una especie de "universo compartido" del streaming argentino. Cada streamer tiene su comunidad, sus memes y su forma de hacer contenido, pero juntos encontraron algo que hacía rato faltaba: streams grupales diarios donde siempre pasa algo.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0 }}>
              Ya sea jugando FIFA, shooters o simplemente boludeando en Discord, el grupo logró generar ese tipo de contenido donde la gente siente que "si no entra hoy, se pierde lore".
            </p>
          </div>
        </section>

        {/* ── 6. Casa de Miami ── */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            La futura casa de Miami
          </h2>
          <div style={{
            background: 'var(--bg-card)', border: `1px solid ${COLOR}33`,
            borderRadius: 12, padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>🏠</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLOR, marginBottom: 6 }}>PROYECTO EN DESARROLLO</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0 }}>
                  Uno de los proyectos más comentados dentro de la comunidad es la futura casa de Top Globales en Miami. Aunque todavía no está completamente definida, la idea ya generó muchísimo hype entre los viewers por el potencial de streams diarios, eventos, IRL y contenido grupal prácticamente 24/7.
                </p>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0 }}>
              Para muchos viewers, la posibilidad de ver a todos conviviendo recuerda directamente a algunas de las épocas más icónicas del streaming argentino.
            </p>
          </div>
        </section>

        {/* ── 7. Invitados ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Los invitados que ya deberían ser parte del grupo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Aparecen tan seguido que la comunidad ya los considera parte del multiverso Top Globales.
          </p>
          <div className="guests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
            {guests.map(g => (
              <div key={g.kick} className="guest-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                borderRadius: 12, padding: '16px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'border-color 0.2s',
              }}>
                {g.avatarUrl ? (
                  <img src={g.avatarUrl} alt={g.displayName} width={56} height={56} style={{
                    borderRadius: '50%', objectFit: 'cover', display: 'block',
                    border: '2px solid var(--color-border)',
                  }} />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2A2A40, #3A3A60)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 800, color: '#fff',
                    border: '2px solid var(--color-border)',
                  }}>
                    {g.displayName[0]}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{g.displayName}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {fmt(g.followers)} seguidores
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: 1.5, flex: 1 }}>
                  {g.desc}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', marginTop: 'auto' }}>
                  <GuestSocialIcon href={`https://kick.com/${g.kick}`} type="kick" />
                  <GuestSocialIcon href={g.twitter} type="twitter" />
                  <GuestSocialIcon href={g.instagram} type="instagram" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. FAQs ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Preguntas frecuentes
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Todo lo que necesitás saber sobre el grupo
          </p>
          <CommunityFAQ />
        </section>

      </main>
    </div>
  );
}
