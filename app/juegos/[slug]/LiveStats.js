'use client';

import { useState, useEffect } from 'react';

function fmt(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return n.toLocaleString('es');
}

function Skeleton({ w, h, radius = 6 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-secondary) 50%, var(--bg-card) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

export default function LiveStats({ slug, color }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/game-meta/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const accentColor = color ?? '#7C3AED';

  if (loading) {
    return (
      <div style={{ marginTop: 40 }}>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Skeleton w={140} h={60} radius={10} />
          <Skeleton w={140} h={60} radius={10} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} w="100%" h={90} radius={10} />)}
        </div>
      </div>
    );
  }

  if (!data || (data.liveCount === 0 && data.topClips?.length === 0)) return null;

  return (
    <div style={{ marginTop: 40 }}>
      {/* Live summary pills */}
      {(data.liveCount > 0 || data.totalViewers > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {data.liveCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', border: `1px solid ${accentColor}44`,
              borderRadius: 12, padding: '10px 18px',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: '#EF4444',
                boxShadow: '0 0 6px #EF4444', flexShrink: 0,
                animation: 'pulse 2s infinite',
              }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{fmt(data.liveCount)}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>streams en vivo</div>
              </div>
            </div>
          )}
          {data.totalViewers > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '10px 18px',
            }}>
              <span style={{ fontSize: 18 }}>👥</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{fmt(data.totalViewers)}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>viewers ahora</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top live streams */}
      {data.topStreams?.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            En vivo ahora
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {data.topStreams.map(s => (
              <a
                key={s.user_login}
                href={`https://twitch.tv/${s.user_login}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textDecoration: 'none', color: 'inherit',
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 10, overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = accentColor}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                {s.thumbnail_url && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={s.thumbnail_url}
                      alt={s.title}
                      style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                    />
                    <span style={{
                      position: 'absolute', top: 6, left: 6,
                      background: '#EF4444', color: '#fff',
                      fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                    }}>
                      EN VIVO
                    </span>
                    <span style={{
                      position: 'absolute', bottom: 6, right: 6,
                      background: 'rgba(0,0,0,0.75)', color: '#fff',
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                    }}>
                      {fmt(s.viewer_count)} viewers
                    </span>
                  </div>
                )}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                    {s.user_name}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--color-text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top clips */}
      {data.topClips?.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Clips de la comunidad hispana
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {data.topClips.map(clip => (
              <a
                key={clip.id}
                href={clip.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textDecoration: 'none', color: 'inherit',
                  background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 10, overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = accentColor}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                {clip.thumbnail_url && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={clip.thumbnail_url}
                      alt={clip.title}
                      style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                    />
                    <span style={{
                      position: 'absolute', bottom: 6, right: 6,
                      background: 'rgba(0,0,0,0.75)', color: '#fff',
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                    }}>
                      {fmt(clip.view_count)} views
                    </span>
                  </div>
                )}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                    {clip.broadcaster_name}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--color-text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {clip.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
