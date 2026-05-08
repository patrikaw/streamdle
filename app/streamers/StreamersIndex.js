'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { STREAMERS } from '../../data/streamers';
import { getAvatarsForLogins, getAvatarUrl } from '../../data/avatars';

// ── helpers ───────────────────────────────────────────────────────────────────

const ALL_COUNTRIES = [
  { code: 'ALL',   label: '🌎 Todos',     slug: '' },
  { code: 'ES',    label: '🇪🇸 España',   slug: 'espana' },
  { code: 'AR',    label: '🇦🇷 Argentina', slug: 'argentina' },
  { code: 'MX',    label: '🇲🇽 México',   slug: 'mexico' },
  { code: 'PE',    label: '🇵🇪 Perú',     slug: 'peru' },
  { code: 'CO',    label: '🇨🇴 Colombia', slug: 'colombia' },
  { code: 'CL',    label: '🇨🇱 Chile',    slug: 'chile' },
  { code: 'LATAM', label: '🌎 LATAM',     slug: 'latam' },
];

const SORT_OPTIONS = [
  { value: 'followers_desc', label: '👥 Más seguidores' },
  { value: 'followers_asc',  label: '👥 Menos seguidores' },
  { value: 'peak_desc',      label: '🏆 Mayor peak' },
  { value: 'hours_desc',     label: '⏱️ Más horas' },
  { value: 'alpha_asc',      label: '🔤 A → Z' },
  { value: 'alpha_desc',     label: '🔤 Z → A' },
  { value: 'newest',         label: '🆕 Más nuevos' },
  { value: 'oldest',         label: '📅 Más antiguos' },
  { value: 'random',         label: '🎲 Aleatorio' },
];

// Qué stat mostrar en la card según el sort activo
const STAT_BY_SORT = {
  followers_desc: { key: 'total_followers', label: 'segs' },
  followers_asc:  { key: 'total_followers', label: 'segs' },
  peak_desc:      { key: 'peak_viewers',    label: 'peak' },
  hours_desc:     { key: 'total_hours',     label: 'hs' },
  alpha_asc:      { key: 'total_followers', label: 'segs' },
  alpha_desc:     { key: 'total_followers', label: 'segs' },
  newest:         { key: 'created_at',      label: 'desde' },
  oldest:         { key: 'created_at',      label: 'desde' },
  random:         { key: 'total_followers', label: 'segs' },
};

const PAGE_SIZE = 24;
const LATAM_CODES = ['AR','MX','PE','CO','CL','SV','PR','VE','UY','GT','DO','FR','NO'];

function fmt(n) {
  if (!n) return '—';
  const num = typeof n === 'string' ? parseInt(n.replace(/,/g, ''), 10) : Number(n);
  if (isNaN(num) || num === 0) return '—';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1_000)     return (num / 1_000).toFixed(1).replace('.0', '') + 'K';
  return num.toString();
}

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).getFullYear().toString();
  } catch { return '—'; }
}

function getInitials(name) {
  return (name || '?').slice(0, 2).toUpperCase();
}

function flagOf(code) {
  const map = { ES:'🇪🇸', AR:'🇦🇷', MX:'🇲🇽', PE:'🇵🇪', CO:'🇨🇴', CL:'🇨🇱',
                SV:'🇸🇻', PR:'🇵🇷', VE:'🇻🇪', UY:'🇺🇾', GT:'🇬🇹', DO:'🇩🇴',
                FR:'🇫🇷', NO:'🇳🇴' };
  return map[code] || '🌍';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toNum(v) {
  return parseInt(String(v || '0').replace(/,/g, ''), 10) || 0;
}

// Rank global pre-calculado una sola vez (no dentro del componente)
const RANK_MAP = (() => {
  const sorted = [...STREAMERS].sort((a, b) => toNum(b.total_followers) - toNum(a.total_followers));
  const map = {};
  sorted.forEach((s, i) => { map[s.id] = i + 1; });
  return map;
})();

function sortStreamers(list, sort) {
  if (sort === 'random') return shuffle(list);
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'followers_desc': return toNum(b.total_followers) - toNum(a.total_followers);
      case 'followers_asc':  return toNum(a.total_followers) - toNum(b.total_followers);
      case 'peak_desc':      return toNum(b.peak_viewers)    - toNum(a.peak_viewers);
      case 'hours_desc':     return toNum(b.total_hours)     - toNum(a.total_hours);
      case 'alpha_asc':      return a.display_name.localeCompare(b.display_name);
      case 'alpha_desc':     return b.display_name.localeCompare(a.display_name);
      case 'newest':
        return new Date(b.created_at || '2000-01-01') - new Date(a.created_at || '2000-01-01');
      case 'oldest':
        return new Date(a.created_at || '2000-01-01') - new Date(b.created_at || '2000-01-01');
      default: return 0;
    }
  });
}

// ── sub-components ────────────────────────────────────────────────────────────

function AvatarImg({ streamer, size = 48, avatars = {} }) {
  const [err, setErr] = useState(false);
  const url = getAvatarUrl(streamer, avatars);
  if (!url || err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.32, fontWeight: 800, color: '#fff',
        flexShrink: 0, letterSpacing: '-1px', userSelect: 'none',
      }}>
        {getInitials(streamer.display_name)}
      </div>
    );
  }
  return (
    <img
      src={url} alt={streamer.display_name}
      width={size} height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      onError={() => setErr(true)}
    />
  );
}

function StreamerCard({ streamer, avatars, sort }) {
  const [hovered, setHovered] = useState(false);
  const slug = streamer.display_name.toLowerCase().replace(/\s+/g, '-');

  const twitchUrl = streamer.twitch_url || (streamer.twitch ? `https://twitch.tv/${streamer.twitch}` : null);
  const kickUrl   = streamer.kick_url   || (streamer.kick   ? `https://kick.com/${streamer.kick}`     : null);
  const isPartner = streamer.broadcaster_type === 'partner';

  // Stat dinámico según sort
  const statConfig = STAT_BY_SORT[sort] || STAT_BY_SORT.followers_desc;
  const statValue = statConfig.key === 'created_at'
    ? fmtDate(streamer.created_at)
    : fmt(streamer[statConfig.key]);
  const statLabel = statConfig.label;

  return (
    <a
      href={`/${slug}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: hovered ? 'var(--bg-card)' : 'var(--bg-secondary)',
        border: `1px solid ${hovered ? 'var(--color-purple)' : 'var(--color-border)'}`,
        borderRadius: 12, padding: '12px 16px',
        textDecoration: 'none', color: 'inherit',
        transition: 'all 0.18s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 4px 20px rgba(124,58,237,0.15)' : 'none',
        animation: 'fadeIn 0.3s ease both',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank */}
      <div style={{
        minWidth: 30, textAlign: 'right', fontSize: 12, fontWeight: 700,
        color: streamer._rank <= 3 ? 'var(--color-purple-light)' : 'var(--color-text-secondary)',
        flexShrink: 0,
      }}>
        #{streamer._rank}
      </div>

      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <AvatarImg streamer={streamer} size={48} avatars={avatars} />
        {streamer.is_active && (
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: '50%',
            background: '#16A34A', border: '2px solid var(--bg-secondary)',
          }} title="Activo" />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 14, fontWeight: 700, color: '#fff',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180,
          }}>
            {streamer.display_name}
          </span>
          {isPartner && <span title="Partner de Twitch" style={{ fontSize: 11, color: '#9146FF' }}>✓</span>}
          <span style={{ fontSize: 12 }}>{flagOf(streamer.country)}</span>
        </div>

        {streamer.real_name && (
          <div style={{
            fontSize: 11, color: 'var(--color-text-secondary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 220, marginTop: 2,
          }}>
            {streamer.real_name}
          </div>
        )}

        <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          {streamer.top_category && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
              background: 'rgba(124,58,237,0.2)', color: 'var(--color-purple-light)',
              whiteSpace: 'nowrap',
            }}>
              {streamer.top_category}
            </span>
          )}
          {streamer.community && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
              background: 'rgba(83,252,24,0.12)', color: 'var(--color-green)',
              whiteSpace: 'nowrap',
            }}>
              {Array.isArray(streamer.community) ? streamer.community[0] : streamer.community}
            </span>
          )}
          {streamer.esports_team && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
              background: 'rgba(37,99,235,0.2)', color: '#60A5FA', whiteSpace: 'nowrap',
            }}>
              ⚔️ {streamer.esports_team}
            </span>
          )}
        </div>
      </div>

      {/* Stat dinámico + plataformas */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', textAlign: 'right' }}>
          {statValue}
          <span style={{ fontSize: 10, color: 'var(--color-text-secondary)', fontWeight: 400, marginLeft: 3 }}>
            {statLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {twitchUrl && (
            <a href={twitchUrl} target="_blank" rel="noopener noreferrer"
              className="badge-twitch" style={{ textDecoration: 'none' }}
              onClick={e => e.stopPropagation()}>Twitch</a>
          )}
          {kickUrl && (
            <a href={kickUrl} target="_blank" rel="noopener noreferrer"
              className="badge-kick" style={{ textDecoration: 'none' }}
              onClick={e => e.stopPropagation()}>Kick</a>
          )}
        </div>
      </div>
    </a>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function StreamersIndex({
  defaultCountry = 'ALL',
  pageTitle = 'Streamers Hispanohablantes',
  pageDesc = '',
  breadcrumbLabel = null,
  canonicalSlug = '',
}) {
  const [search,  setSearch]  = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [sort,    setSort]    = useState('followers_desc');
  const [page,    setPage]    = useState(1);
  const [avatars, setAvatars] = useState({});

  const paginatedLogins = useMemo(
    () => paginated.filter(s => s.twitch).map(s => s.twitch.toLowerCase()),
    [paginated]
  );

  useEffect(() => {
    if (!paginatedLogins.length) return;
    getAvatarsForLogins(paginatedLogins).then(data =>
      setAvatars(prev => ({ ...prev, ...data }))
    );
  }, [paginatedLogins]);

  useEffect(() => { setPage(1); }, [search, country, sort]);

  // Redirigir al cambiar el filtro de país (navega a la URL correcta)
  function handleCountryChange(code) {
    const found = ALL_COUNTRIES.find(c => c.code === code);
    if (!found) return;
    if (found.slug === '') {
      window.location.href = '/streamers';
    } else {
      window.location.href = `/streamers/${found.slug}`;
    }
  }

  const filtered = useMemo(() => {
    let list = [...STREAMERS];

    if (country === 'LATAM') {
      list = list.filter(s => LATAM_CODES.includes(s.country));
    } else if (country !== 'ALL') {
      list = list.filter(s => s.country === country);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(s =>
        s.display_name.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.real_name && s.real_name.toLowerCase().includes(q)) ||
        (Array.isArray(s.aliases)
          ? s.aliases.some(a => a.toLowerCase().includes(q))
          : (s.aliases || '').toLowerCase().includes(q))
      );
    }

    // Proteger random: en SSR usar followers_desc para evitar error de hidratación
    const effectiveSort = (sort === 'random' && typeof window === 'undefined')
      ? 'followers_desc'
      : sort;

    const sorted = sortStreamers(list, effectiveSort);

    // Rank local cuando hay filtro de país, global cuando es ALL
    let rankMap = RANK_MAP;
    if (country !== 'ALL') {
      const localSorted = [...list].sort((a,b) => toNum(b.total_followers)-toNum(a.total_followers));
      rankMap = {};
      localSorted.forEach((s,i) => { rankMap[s.id] = i+1; });
    }
    return sorted.map(s => ({ ...s, _rank: rankMap[s.id] }));
  }, [search, country, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  useEffect(() => {
    if (page > 1) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Breadcrumb
  const crumbs = [
    { label: 'Streamdle', href: '/' },
    { label: 'Streamers', href: '/streamers' },
  ];
  if (breadcrumbLabel && defaultCountry !== 'ALL') {
    crumbs.push({ label: breadcrumbLabel, href: null });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* HEADER */}
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', gap: 12, flexWrap: 'wrap',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎮</span>
          <span style={{
            fontSize: 18, fontWeight: 800,
            background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>STREAMDLE</span>
        </a>
        <div className="game-nav-links" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/classic',     label: '🎯 Classic' },
            { href: '/avatardle',   label: '👤 Avatardle' },
            { href: '/emojidle',    label: '😂 Emojidle' },
            { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle',     label: '💬 Chatdle' },
            { href: '/higherdle',   label: '📊 Higherdle' },
          ].map(g => (
            <a key={g.href} href={g.href} style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              color: 'white', borderRadius: 8, padding: '5px 12px',
              fontSize: 10, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '12px 16px 0',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--color-text-secondary)', flexWrap: 'wrap',
      }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span>›</span>}
            {c.href ? (
              <a href={c.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = 'var(--color-text-secondary)'}>
                {c.label}
              </a>
            ) : (
              <span style={{ color: 'var(--color-purple-light)', fontWeight: 600 }}>{c.label}</span>
            )}
          </span>
        ))}
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 64px' }}>

        {/* HERO */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, marginBottom: 6 }}>
            {pageTitle}
          </h1>
          {pageDesc && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, maxWidth: 640, lineHeight: 1.6 }}>
              {pageDesc}
            </p>
          )}
        </div>

        {/* CONTROLES */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 14,
          border: '1px solid var(--color-border)',
          padding: '16px 20px', marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {/* Búsqueda */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, pointerEvents: 'none', color: 'var(--color-text-secondary)',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, alias o nombre real..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base"
              style={{ paddingLeft: 36, fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-secondary)', fontSize: 16,
              }}>✕</button>
            )}
          </div>

          {/* País + Orden */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ALL_COUNTRIES.map(c => (
                <button
                  key={c.code}
                  className={`filter-pill${country === c.code ? ' active' : ''}`}
                  onClick={() => handleCountryChange(c.code)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: 'var(--bg-card)', border: '1.5px solid var(--color-border)',
                color: '#fff', borderRadius: 8, padding: '6px 12px',
                fontSize: 13, cursor: 'pointer', outline: 'none', minWidth: 170,
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* COUNT */}
        <div style={{
          fontSize: 13, color: 'var(--color-text-secondary)',
          marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>
            {filtered.length === STREAMERS.length
              ? `${STREAMERS.length} streamers`
              : `${filtered.length} streamer${filtered.length !== 1 ? 's' : ''}`}
          </span>
          {search && (
            <span style={{
              background: 'rgba(124,58,237,0.2)', color: 'var(--color-purple-light)',
              borderRadius: 4, padding: '1px 8px', fontSize: 11, fontWeight: 600,
            }}>"{search}"</span>
          )}
        </div>

        {/* LISTA */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No encontramos streamers</div>
            <div style={{ fontSize: 13 }}>Probá con otro nombre o cambiá el filtro de país</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
            gap: 8,
          }}>
            {paginated.map((s, i) => (
              <StreamerCard key={s.id} streamer={s} avatars={avatars} sort={sort} />
            ))}
          </div>
        )}

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 8, marginTop: 32, flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: page === 1 ? 'var(--bg-card)' : 'var(--color-purple)',
                border: 'none', color: page === 1 ? 'var(--color-text-secondary)' : '#fff',
                borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600,
                cursor: page === 1 ? 'default' : 'pointer',
              }}
            >← Anterior</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`d${i}`} style={{ color: 'var(--color-text-secondary)', padding: '0 4px' }}>…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)} style={{
                    background: page === p ? 'var(--color-purple)' : 'var(--bg-card)',
                    border: `1px solid ${page === p ? 'var(--color-purple)' : 'var(--color-border)'}`,
                    color: page === p ? '#fff' : 'var(--color-text-secondary)',
                    borderRadius: 8, padding: '7px 12px', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', minWidth: 36,
                  }}>{p}</button>
                )
              )
            }

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background: page === totalPages ? 'var(--bg-card)' : 'var(--color-purple)',
                border: 'none',
                color: page === totalPages ? 'var(--color-text-secondary)' : '#fff',
                borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600,
                cursor: page === totalPages ? 'default' : 'pointer',
              }}
            >Siguiente →</button>
          </div>
        )}

        {/* SEO TEXT */}
        <div style={{
          marginTop: 48, padding: 24, borderRadius: 14,
          border: '1px solid var(--color-border)', background: 'var(--bg-secondary)',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            {pageTitle} en Twitch y Kick
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 8 }}>
            {pageDesc || `Explorá el ranking completo de ${pageTitle.toLowerCase()} en Twitch y Kick.
            Filtrá por seguidores, peak viewers u horas de stream y descubrí nuevos creadores.`}
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            ¿Querés poner a prueba cuánto sabés de tus streamers favoritos? Jugá nuestros{' '}
            <a href="/" style={{ color: 'var(--color-purple-light)' }}>juegos diarios de streamers</a>:
            Classic, Avatardle, Emojidle, Categorydle, Chatdle e Higherdle.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--color-border)', background: 'var(--bg-secondary)',
        padding: '20px 24px', textAlign: 'center',
        fontSize: 12, color: 'var(--color-text-secondary)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          {[
            { href: '/como-jugar', label: 'Cómo jugar' },
            { href: '/contacto',   label: 'Contacto' },
            { href: '/privacidad', label: 'Privacidad' },
            { href: '/terminos',   label: 'Términos' },
            { href: 'https://ko-fi.com/streamdlenet', label: '☕ Apoyá Streamdle' },
          ].map(l => (
            <a key={l.href} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
        © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
        <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--color-green)', textDecoration: 'none' }}>Pato Wnuk</a>.
      </footer>
    </div>
  );
}