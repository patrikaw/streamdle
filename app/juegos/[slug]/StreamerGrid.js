'use client';

import { useState } from 'react';

const PAGE_SIZE = 12;

function flagOf(code) {
  const m = { ES:'🇪🇸', AR:'🇦🇷', MX:'🇲🇽', PE:'🇵🇪', CO:'🇨🇴', CL:'🇨🇱', UY:'🇺🇾', FR:'🇫🇷', NO:'🇳🇴' };
  return m[code] ?? '🌍';
}

function fmt(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toLocaleString('es');
}

function getInitials(n) { return (n || '?').slice(0, 2).toUpperCase(); }

function StreamerCard({ streamer, rank, isPrimary }) {
  const profileUrl = streamer.twitch
    ? `https://twitch.tv/${streamer.twitch}`
    : streamer.kick ? `https://kick.com/${streamer.kick}` : '#';

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="streamer-card"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--bg-card)', border: '1px solid var(--color-border)',
        borderRadius: 12, padding: '12px 14px',
        textDecoration: 'none', color: 'inherit',
        transition: 'border-color 0.15s, transform 0.15s',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div style={{
        minWidth: 28, fontSize: 12, fontWeight: 700, textAlign: 'right', flexShrink: 0,
        color: rank <= 3 ? 'var(--game-color)' : 'var(--color-text-secondary)',
      }}>
        #{rank}
      </div>

      {streamer.avatarUrl ? (
        <img src={streamer.avatarUrl} alt={streamer.display_name} width={48} height={48}
          style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>
          {getInitials(streamer.display_name)}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
            {streamer.display_name}
          </span>
          {streamer.broadcaster_type === 'partner' && (
            <span title="Partner" style={{ fontSize: 11, color: '#9146FF', flexShrink: 0 }}>✓</span>
          )}
          <span style={{ fontSize: 12, flexShrink: 0 }}>{flagOf(streamer.country)}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {fmt(streamer.total_followers)} segs
          </span>
          {streamer.personality && (
            <span style={{ fontSize: 10, color: 'var(--color-text-secondary)', background: 'var(--bg-secondary)', borderRadius: 4, padding: '1px 6px' }}>
              {streamer.personality}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function StreamerGrid({ streamers, isPrimary }) {
  const [shown, setShown] = useState(PAGE_SIZE);
  const visible = streamers.slice(0, shown);
  const remaining = streamers.length - shown;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {visible.map((s, i) => (
          <StreamerCard key={s.id} streamer={s} rank={i + 1} isPrimary={isPrimary} />
        ))}
      </div>

      {remaining > 0 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => setShown(prev => Math.min(prev + PAGE_SIZE, streamers.length))}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 10, padding: '10px 24px',
              color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--game-color)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Ver {Math.min(remaining, PAGE_SIZE)} más
            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>({remaining} restantes)</span>
          </button>
        </div>
      )}
    </div>
  );
}
