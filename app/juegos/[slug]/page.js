import Link from 'next/link';
import { notFound } from 'next/navigation';
import gameSeoOverrides from '../../../data/game-seo-overrides.json';
import SearchBar from '../../components/SearchBar';
import {
  getCategoryFromSlug,
  getCategoriesWithMinStreamers,
  getStreamersByCategory,
} from '../../../lib/categories';
import { fetchTwitchGame, fetchIGDBGame, fetchAvatarsBatch, fetchClipsById, fetchClipsByBroadcastersForGame } from '../../../lib/twitch-server';
import { getEventsForCategory } from '../../../data/events';
import { GAME_TRIVIA } from '../../../data/game-trivia';
import LiveStats from './LiveStats';
import StreamerGrid from './StreamerGrid';
import GameTrivia from './GameTrivia';

export const revalidate = 86400;

export async function generateStaticParams() {
  return getCategoriesWithMinStreamers(7).map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = getCategoryFromSlug(slug);
  if (!name) return {};

  const seo = gameSeoOverrides[slug];
  if (seo) {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.openGraphTitle,
        description: seo.openGraphDescription,
        url: `https://streamdle.net/juegos/${slug}`,
      },
      twitter: {
        card: 'summary',
        title: seo.openGraphTitle,
        description: seo.openGraphDescription,
      },
      alternates: { canonical: `https://streamdle.net/juegos/${slug}` },
    };
  }

  return {
    title: `Streamers de ${name} en Español — Comunidad Hispana | Streamdle`,
    description: `Descubrí quiénes son los streamers hispanohablantes de ${name}. Ranking, clips virales y toda la cultura streamer alrededor de ${name} en Twitch y Kick.`,
    keywords: `streamers ${name.toLowerCase()} español, streamers de ${name.toLowerCase()}, ${name.toLowerCase()} streamers hispanos, quien juega ${name.toLowerCase()} twitch, ${name.toLowerCase()} twitch hispano`,
    openGraph: {
      title: `Streamers de ${name} en Español | Streamdle`,
      description: `Comunidad hispana de ${name}: ranking de streamers, clips y cultura.`,
      url: `https://streamdle.net/juegos/${slug}`,
    },
    alternates: { canonical: `https://streamdle.net/juegos/${slug}` },
  };
}

const CATEGORY_COLORS = {
  'Just Chatting': '#7C3AED',
  'Minecraft': '#53FC18',
  'Grand Theft Auto V': '#F97316',
  'Fortnite': '#38BDF8',
  'League of Legends': '#EAB308',
  'Counter-Strike': '#EF4444',
  'Valorant': '#FF4655',
  'World of Warcraft': '#AAE0FA',
  'Kings League': '#F59E0B',
  'EA Sports FC 26': '#16A34A',
  'Sports': '#22C55E',
  'Variety': '#8B5CF6',
  'Rust': '#D97706',
  'Clash Royale': '#6366F1',
};

function getColor(name) { return CATEGORY_COLORS[name] ?? '#7C3AED'; }

function fmt(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toLocaleString('es');
}


const EVENT_ICONS = { tournament: '🏆', collab: '🤝', charity: '❤️', event: '🎉', series: '📺' };

function EventCard({ event }) {
  const icon = EVENT_ICONS[event.type] ?? '📅';
  const dateStr = event.date?.includes('/')
    ? event.date.split('/').map(d => new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })).join(' → ')
    : event.date ? new Date(event.date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <div className="event-card" style={{
      background: 'var(--bg-card)', border: '1px solid var(--color-border)',
      borderLeft: '3px solid var(--game-color)',
      borderRadius: 12, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{event.title}</span>
        {event.subtitle && (
          <span style={{ fontSize: 11, background: 'var(--game-color-bg)', color: 'var(--game-color)', border: '1px solid var(--game-color-border)', borderRadius: 4, padding: '1px 7px' }}>
            {event.subtitle}
          </span>
        )}
      </div>
      {dateStr && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>📅 {dateStr}</div>}
      {event.description && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: event.streamers?.length ? 10 : 0 }}>{event.description}</p>}
      {event.streamers?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {event.streamers.map(s => (
            <span key={s} style={{ fontSize: 11, background: 'var(--bg-secondary)', borderRadius: 4, padding: '2px 7px', color: 'var(--color-text-secondary)' }}>{s}</span>
          ))}
        </div>
      )}
      {event.url && (
        <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 10, fontSize: 12, color: 'var(--game-color)', textDecoration: 'none' }}>
          Ver más →
        </a>
      )}
    </div>
  );
}

const GAME_MODES = [
  { slug: 'categorydle', name: 'Categorydle', emoji: '🎮', desc: 'Adiviná las 2 categorías del streamer' },
  { slug: 'classic', name: 'Streamdle', emoji: '🎯', desc: 'Adiviná el streamer del día' },
];

export default async function JuegoPage({ params }) {
  const { slug } = await params;
  const categoryName = getCategoryFromSlug(slug);
  if (!categoryName) notFound();

  const { primary, secondary } = getStreamersByCategory(categoryName);
  const events = getEventsForCategory(categoryName);
  const color = getColor(categoryName);
  const allStreamers = [...primary, ...secondary];

  const logins = allStreamers.map(s => s.twitch).filter(Boolean);

  // Fallback clip IDs for non-game categories (Just Chatting, Sports, etc.)
  const topClipIds = allStreamers
    .filter(s => s.top_clip_id)
    .sort((a, b) => (b.top_clip_views || 0) - (a.top_clip_views || 0))
    .slice(0, 20)
    .map(s => s.top_clip_id);

  // Resolve game info first so we can use game_id for category-accurate clips
  const gameInfo = await fetchTwitchGame(categoryName).catch(() => null);

  const [igdbInfo, userData] = await Promise.all([
    fetchIGDBGame(categoryName).catch(() => null),
    fetchAvatarsBatch(logins).catch(() => ({})),
  ]);

  // avatars map: login → url (for streamer cards)
  const avatars = Object.fromEntries(Object.entries(userData).map(([k, v]) => [k, v.url ?? v]));

  // Top 8 primary streamers by followers → broadcaster IDs for game-specific clips
  const topBroadcasterIds = primary
    .slice().sort((a, b) => (b.total_followers || 0) - (a.total_followers || 0))
    .slice(0, 8)
    .map(s => userData[s.twitch?.toLowerCase()]?.id)
    .filter(Boolean);

  const clips = await (
    gameInfo?.id && topBroadcasterIds.length
      ? fetchClipsByBroadcastersForGame(topBroadcasterIds, gameInfo.id)
          .then(c => c.length ? c : fetchClipsById(topClipIds))
          .catch(() => fetchClipsById(topClipIds).catch(() => []))
      : fetchClipsById(topClipIds).catch(() => [])
  );

  const boxArt = gameInfo?.box_art_url?.replace('{width}', '285').replace('{height}', '380') ?? null;
  const total = primary.length + secondary.length;

  // Slim data for client components — only fields needed for the cards
  const slim = list => list.map(s => ({
    id: s.id, display_name: s.display_name, country: s.country,
    total_followers: s.total_followers, broadcaster_type: s.broadcaster_type,
    personality: s.personality, twitch: s.twitch, kick: s.kick,
    avatarUrl: avatars[s.twitch?.toLowerCase()] ?? null,
  }));
  const primarySlim = slim(primary);
  const secondarySlim = slim(secondary);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', '--game-color': color, '--game-color-bg': `${color}22`, '--game-color-border': `${color}44` }}>
      <style>{`
        .streamer-card:hover { border-color: var(--game-color) !important; transform: translateY(-1px); }
        .game-mode-link:hover { border-color: var(--game-color) !important; background: var(--game-color-bg) !important; }
        .clip-card:hover { border-color: var(--game-color) !important; }
        .juego-stats-mobile { display: none; }
        @media (max-width: 640px) {
          .juego-hero-outer { flex-direction: column !important; }
          .juego-art-col { display: flex !important; gap: 14px; align-items: flex-start; width: 100%; }
          .juego-stats-mobile { display: flex !important; flex-direction: column; gap: 8px; justify-content: center; flex: 1; min-width: 0; }
          .juego-stats-desktop { display: none !important; }
          .juego-text-col { min-width: 0 !important; width: 100%; }
          .header-icon { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        position: 'sticky', top: 0, zIndex: 10,
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
          {[{href:'/classic',label:'🎯 Classic'},{href:'/avatardle',label:'👤 Avatardle'},{href:'/emojidle',label:'😂 Emojidle'},{href:'/categorydle',label:'🎮 Categorydle'},{href:'/chatdle',label:'💬 Chatdle'},{href:'/higherdle',label:'📊 Higherdle'}].map(g=>(
            <Link key={g.href} href={g.href} style={{background:'var(--bg-card)',border:'1px solid var(--color-border)',color:'white',borderRadius:8,padding:'5px 12px',fontSize:10,fontWeight:600,textDecoration:'none',whiteSpace:'nowrap'}}>{g.label}</Link>
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
            { label: 'Juegos', href: '/juegos' },
            { label: categoryName, href: null },
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
        background: `linear-gradient(180deg, ${color}14 0%, transparent 100%)`,
        borderBottom: '1px solid var(--color-border)',
        padding: '40px 24px',
      }}>
        <div className="juego-hero-outer" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Key art + stats mobile */}
          <div className="juego-art-col" style={{ flexShrink: 0 }}>
            {boxArt && (
              <img src={boxArt} alt={categoryName} width={130} height={174}
                style={{ borderRadius: 10, objectFit: 'cover', display: 'block', border: `2px solid ${color}44` }} />
            )}
            <div className="juego-stats-mobile">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: `1px solid ${color}44`, borderRadius: 10, padding: '8px 12px' }}>
                <span style={{ fontSize: 16 }}>🎙️</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{total}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>streamers hispanos</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '8px 12px' }}>
                <span style={{ fontSize: 16 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{primary.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>categoría principal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text + stats desktop */}
          <div className="juego-text-col" style={{ flex: 1, minWidth: 260 }}>
            {(igdbInfo?.genres?.length > 0 || igdbInfo?.releaseYear || igdbInfo?.developer) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {igdbInfo?.genres?.slice(0, 3).map(g => (
                  <span key={g} style={{ fontSize: 11, background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 9px' }}>
                    {g}
                  </span>
                ))}
                {igdbInfo?.releaseYear && (
                  <span style={{ fontSize: 11, background: 'var(--bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '2px 9px' }}>
                    {igdbInfo.releaseYear}
                  </span>
                )}
                {igdbInfo?.developer && (
                  <span style={{ fontSize: 11, background: 'var(--bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '2px 9px' }}>
                    {igdbInfo.developer}
                  </span>
                )}
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 10, color: '#fff' }}>
              {categoryName}
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 600, marginBottom: 20 }}>
              {igdbInfo?.summary
                ? igdbInfo.summary.length > 280
                  ? igdbInfo.summary.slice(0, 277) + '...'
                  : igdbInfo.summary
                : `La comunidad hispanohablante de ${categoryName} en Twitch y Kick reúne a ${total} streamers que han construido culturas únicas, comunidades fieles y momentos virales alrededor de este contenido.`
              }
            </p>

            <div className="juego-stats-desktop" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: `1px solid ${color}44`, borderRadius: 10, padding: '8px 16px',
              }}>
                <span style={{ fontSize: 18 }}>🎙️</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{total}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>streamers hispanos</div>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '8px 16px',
              }}>
                <span style={{ fontSize: 18 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{primary.length}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>categoría principal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Live stats — client component */}
        <LiveStats slug={slug} color={color} />

        {/* Trivia de la categoría */}
        {GAME_TRIVIA[slug]?.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              ¿Cuánto sabés de {categoryName}?
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
              Poné a prueba tu conocimiento de la comunidad hispana
            </p>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              borderTop: `3px solid ${color}`,
              borderRadius: 12, padding: '20px 20px 22px',
            }}>
              <GameTrivia questions={GAME_TRIVIA[slug]} color={color} />
            </div>
          </section>
        )}

        {/* Clips — server-rendered, guaranteed Hispanic streamers */}
        {clips.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Clips virales de la comunidad
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
              Los momentos más vistos de los streamers de {categoryName}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {clips.slice(0, 6).map(clip => (
                <a
                  key={clip.id}
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clip-card"
                  style={{
                    display: 'block', textDecoration: 'none', color: 'inherit',
                    background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 10, overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {clip.thumbnail_url && (
                    <div style={{ position: 'relative' }}>
                      <img src={clip.thumbnail_url} alt={clip.title}
                        style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                      <span style={{
                        position: 'absolute', bottom: 6, right: 6,
                        background: 'rgba(0,0,0,0.78)', color: '#fff',
                        fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                      }}>
                        {clip.view_count >= 1_000_000
                          ? (clip.view_count / 1_000_000).toFixed(1) + 'M'
                          : clip.view_count >= 1_000
                          ? Math.round(clip.view_count / 1_000) + 'K'
                          : clip.view_count} views
                      </span>
                    </div>
                  )}
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                      {clip.broadcaster_name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {clip.title}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Primary streamers */}
        {primary.length > 0 && (
          <section style={{ marginTop: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                Top streamers de {categoryName}
              </h2>
              <span style={{ fontSize: 12, fontWeight: 700, background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: 8, padding: '2px 9px' }}>
                {primary.length}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              {categoryName} es su categoría principal en Twitch o Kick
            </p>
            <StreamerGrid streamers={primarySlim} isPrimary={true} />
          </section>
        )}

        {/* Secondary streamers */}
        {secondary.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                También juegan {categoryName}
              </h2>
              <span style={{ fontSize: 12, background: 'var(--bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '2px 9px' }}>
                {secondary.length}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              Su segunda categoría más frecuente en el canal
            </p>
            <StreamerGrid streamers={secondarySlim} isPrimary={false} />
          </section>
        )}

        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 18 }}>
            Eventos importantes
          </h2>
          {events.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map(ev => <EventCard key={ev.id} event={ev} />)}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)', border: '1px dashed var(--color-border)',
              borderRadius: 12, padding: '28px 24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🏆</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Próximamente: torneos, collabs y eventos históricos de la comunidad hispana de {categoryName}.
              </div>
            </div>
          )}
        </section>

        {/* Related game modes */}
        <section style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Jugá en Streamdle</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            Poné a prueba tu conocimiento de los streamers de {categoryName}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {GAME_MODES.map(mode => (
              <Link
                key={mode.slug}
                href={`/${mode.slug}`}
                className="game-mode-link"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 12, padding: '12px 18px', textDecoration: 'none', color: 'inherit',
                  transition: 'all 0.15s', minWidth: 200,
                }}
              >
                <span style={{ fontSize: 22 }}>{mode.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{mode.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{mode.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
