import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import { fetchAvatarsBatch } from '../../../lib/twitch-server';
import MemberCards from './MemberCards';
import CommunityTrivia from './CommunityTrivia';
import CommunityFAQ from './CommunityFAQ';

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

const MEMBERS_BASE = [
  {
    login: 'coscu', displayName: 'Coscu', kick: 'coscu', twitch: 'coscu',
    twitter: 'https://x.com/Martinpdisalvo', instagram: 'https://www.instagram.com/martinpdisalvo/',
    tiktok: 'https://www.tiktok.com/@adictoalvegetal', youtube: null,
    followers: 4504221, role: 'Fundador',
    desc: 'El creador del gaming. Leyenda del streaming argentino y motor del grupo.',
  },
  {
    login: 'goncho', displayName: 'Goncho', kick: 'goncho', twitch: 'goncho',
    twitter: 'https://x.com/gonchobanzas', instagram: 'https://www.instagram.com/gonchobanzas/',
    tiktok: 'https://www.tiktok.com/@gonchotwm', youtube: null,
    followers: 1664179, role: 'El estratega',
    desc: 'FIFA, FPS y el que lleva la vibe del grupo. Siempre con algo para decir.',
  },
  {
    login: 'duendepablo', displayName: 'DuendePablo', kick: 'duendepablo', twitch: 'duendepablo',
    twitter: null, instagram: null, tiktok: null, youtube: null,
    followers: 1038786, role: 'El Doctor',
    desc: '"Creador del gaming" según él mismo. Sus compañeros no están del todo seguros.',
  },
  {
    login: 'c0ker', displayName: 'Coker', kick: 'coker', twitch: 'c0ker',
    twitter: 'https://x.com/c0ker_', instagram: 'https://www.instagram.com/c0ker_/',
    tiktok: null, youtube: 'https://www.youtube.com/@c0ker',
    followers: 963591, role: 'Streamer del Año 2026',
    desc: 'Ganó el premio en los Coscu Army Awards 2026. Nivel aura completamente desbloqueado.',
  },
  {
    login: 'zeko', displayName: 'Zeko', kick: 'zeko', twitch: 'zeko',
    twitter: 'https://x.com/fedecristalino', instagram: 'https://www.instagram.com/federicocristalino/',
    tiktok: 'https://www.tiktok.com/@federicocristalino', youtube: null,
    followers: 1407477, role: 'El tryhard',
    desc: 'FPS puro y competitivo. El que guarda botellas bajo la oficina.',
  },
];

const GUESTS_BASE = [
  {
    login: 'k1ng', displayName: 'K1ng', kick: 'k1ng', twitch: 'k1ng',
    twitter: 'https://x.com/k1ng', instagram: 'https://www.instagram.com/k1ngclips/',
    followers: 2160610, desc: 'Prodigio. Aparece en el stream y explota todo.',
  },
  {
    login: 'robergalati', displayName: 'Rober Galati', kick: 'robergalati', twitch: 'robergalati',
    twitter: null, instagram: null,
    followers: 769613, desc: 'Miembro oficial según TopGlo. Galán reconocido por la comunidad.',
  },
  {
    login: 'unicornio', displayName: 'Unicornio', kick: 'unicornio', twitch: 'unicornio',
    twitter: null, instagram: 'https://www.instagram.com/germanusinger/',
    followers: 1373539, desc: 'El chill del grupo. Siempre suma buena onda.',
  },
  {
    login: 'carreraaa', displayName: 'Carreraaa', kick: 'carreraaa', twitch: 'carreraaa',
    twitter: 'https://x.com/rodricarreraaa', instagram: 'https://www.instagram.com/rodricarreraaa/',
    followers: 5514712, desc: 'La visita más grande del grupo: 5.5M de seguidores.',
  },
  {
    login: 'momoladinastia', displayName: 'Momo', kick: 'momoladinastia', twitch: 'momoladinastia',
    twitter: 'https://x.com/momorelojero', instagram: 'https://www.instagram.com/gero.momo',
    followers: 1405247, desc: 'La Dinastía. Clips y caos garantizado cuando está en el stream.',
  },
];

const CLIPS = [
  {
    url: 'https://kick.com/coker/clips/clip_01KPS6QRV6D5571KS8HSWWAJYQ',
    title: '24 HORAS CONTRASTE',
    streamer: 'Coker',
    accent: '#7C3AED',
  },
  {
    url: 'https://kick.com/goncho/clips/clip_01KNR3PEF60Q5W84BVWNVY743D',
    title: 'Zeko sacando 5 botellas de abajo de la oficina',
    streamer: 'Goncho',
    accent: '#22C55E',
  },
  {
    url: 'https://kick.com/zeko/clips/clip_01KQBMBMXZ7QFXZ4WMBXM02KPQ',
    title: 'JASDJSDAJDASJDSAJSA QUEEEEE',
    streamer: 'Zeko',
    accent: '#EF4444',
  },
  {
    url: 'https://kick.com/duendepablo/clips/clip_01KNR2V77THZK75VJVY2DY6ZZ5',
    title: 'Mira como se reía el viejo',
    streamer: 'DuendePablo',
    accent: '#3B82F6',
  },
  {
    url: 'https://kick.com/coscu/clips/clip_01KPYQ0FHB8KXMEBGYY1F96XS5',
    title: 'asd',
    streamer: 'Coscu',
    accent: '#F59E0B',
  },
];

const COMMUNITY_SOCIALS = [
  { href: 'https://x.com/i/communities/2018712266821034398', label: 'X / Twitter' },
  { href: 'https://www.youtube.com/@TopGlobalesOficial', label: 'YouTube' },
  { href: 'https://www.instagram.com/topglobalesoficial/', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@topglobalesoficial', label: 'TikTok' },
];

const TAGS = ['variedad', 'tryhard', 'irl'];

function fmt(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toLocaleString('es');
}

export default async function TopGlobalesPage() {
  const allLogins = [
    ...MEMBERS_BASE.map(m => m.twitch),
    ...GUESTS_BASE.map(g => g.twitch).filter(Boolean),
  ].filter(Boolean);

  const userData = await fetchAvatarsBatch(allLogins).catch(() => ({}));
  const avatarOf = login => userData[login?.toLowerCase()]?.url ?? null;

  const members = MEMBERS_BASE.map(m => ({ ...m, avatarUrl: avatarOf(m.login) }));
  const guests = GUESTS_BASE.map(g => ({ ...g, avatarUrl: avatarOf(g.login) }));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://streamdle.net/' },
      { '@type': 'ListItem', position: 2, name: 'Comunidades', item: 'https://streamdle.net/comunidades' },
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
        .clip-card:hover { border-color: rgba(255,255,255,0.25) !important; transform: translateY(-1px); }
        .guest-card:hover { border-color: ${COLOR} !important; }
        .comm-social:hover { opacity: 0.8; }
        @media (max-width: 640px) {
          .hero-inner { flex-direction: column !important; }
          .hero-badge-col { width: 100% !important; flex-direction: row !important; align-items: center; gap: 16px !important; }
          .comm-badge { width: 60px !important; height: 60px !important; font-size: 22px !important; flex-shrink: 0; }
          .clips-grid { grid-template-columns: repeat(2, 1fr) !important; }
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

          {/* Badge + social */}
          <div className="hero-badge-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div className="comm-badge" style={{
              width: 90, height: 90, borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLOR}, #9D5FF5)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-1px',
              border: `3px solid ${COLOR}66`, flexShrink: 0,
            }}>
              TG
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', minWidth: 110 }}>
              {COMMUNITY_SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="comm-social"
                  style={{
                    display: 'block', fontSize: 11, fontWeight: 600, textAlign: 'center',
                    background: 'var(--bg-card)', border: `1px solid ${COLOR}44`, color: 'var(--color-text-secondary)',
                    borderRadius: 6, padding: '5px 10px', textDecoration: 'none',
                    transition: 'opacity 0.15s',
                  }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {/* Tags */}
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
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
              En una época donde gran parte del streaming hispano se había movido hacia slots, reacciones e IRL, el grupo empezó a destacar por algo bastante simple: volver a jugar videojuegos durante horas y hacer contenido como si fuese 2020 otra vez.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0 }}>
              Con series, momentos virales, invitados sorpresa y una futura casa en Miami, Top Globales se convirtió rápidamente en uno de los fenómenos más comentados del streaming argentino.
            </p>
          </div>
        </section>

        {/* ── 3. Clips virales ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Los clips más virales del grupo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Momentos out of context, jugadas imposibles, peleas, gritos — los clips que explotaron en Twitter, TikTok y Kick.
          </p>
          <div className="clips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {CLIPS.map((clip) => (
              <a
                key={clip.url}
                href={clip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="clip-card"
                style={{
                  display: 'block', textDecoration: 'none', color: 'inherit',
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s, transform 0.15s',
                }}
              >
                {/* Thumbnail placeholder with accent color */}
                <div style={{
                  height: 100, background: `linear-gradient(135deg, ${clip.accent}33, ${clip.accent}11)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: `1px solid ${clip.accent}33`, position: 'relative',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${clip.accent}33`, border: `2px solid ${clip.accent}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>
                    ▶
                  </div>
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 9, fontWeight: 700, color: '#53FC18',
                    background: 'rgba(0,0,0,0.6)', borderRadius: 3, padding: '2px 5px',
                  }}>
                    KICK
                  </span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: clip.accent, marginBottom: 3 }}>
                    {clip.streamer}
                  </div>
                  <div style={{ fontSize: 11, color: '#fff', lineHeight: 1.4, fontWeight: 600 }}>
                    {clip.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
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

        {/* ── 5. ¿Qué son los Top Globales? ── */}
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

        {/* ── 6. La casa de Miami ── */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            La futura casa de Miami
          </h2>
          <div style={{
            background: 'var(--bg-card)', border: `1px solid ${COLOR}33`,
            borderRadius: 12, padding: '22px 24px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 120, height: 120, borderRadius: '50%',
              background: `${COLOR}08`,
            }} />
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

        {/* ── 7. Invitados recurrentes ── */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Los invitados que ya deberían ser parte del grupo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Aparecen tan seguido que la comunidad ya los considera parte del multiverso Top Globales.
          </p>
          <div className="guests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
            {guests.map(g => (
              <div key={g.login} className="guest-card" style={{
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
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                  {g.desc}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {g.kick && (
                    <a href={`https://kick.com/${g.kick}`} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 10, fontWeight: 700, background: '#53FC18', color: '#0D0D14',
                      borderRadius: 4, padding: '2px 6px', textDecoration: 'none',
                    }}>Kick</a>
                  )}
                  {g.twitter && (
                    <a href={g.twitter} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 10, fontWeight: 700, background: 'rgba(29,161,242,0.15)', color: '#fff',
                      border: '1px solid rgba(29,161,242,0.3)', borderRadius: 4, padding: '2px 6px', textDecoration: 'none',
                    }}>X</a>
                  )}
                  {g.instagram && (
                    <a href={g.instagram} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 10, fontWeight: 700, background: 'rgba(225,48,108,0.15)', color: '#fff',
                      border: '1px solid rgba(225,48,108,0.3)', borderRadius: 4, padding: '2px 6px', textDecoration: 'none',
                    }}>IG</a>
                  )}
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
