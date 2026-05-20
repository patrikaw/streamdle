'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function fmt(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toLocaleString('es');
}

const SOCIAL_DATA = {
  kick:      { path: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm3 4v12h2.5v-4l4.5 4H17l-5-5 4.5-4.5h-2.8L9.5 12.5V6H7z', color: '#53FC18' },
  youtube:   { path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', color: '#FF0000' },
  twitter:   { path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z', color: '#1DA1F2' },
  instagram: { path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: '#E1306C' },
  tiktok:    { path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z', color: '#69C9D0' },
};

function SocialIcon({ href, type }) {
  const [hov, setHov] = useState(false);
  if (!href?.trim()) return null;
  const d = SOCIAL_DATA[type];
  if (!d) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 7,
        background: hov ? d.color + '22' : 'var(--bg-card)',
        border: `1px solid ${hov ? d.color : 'var(--color-border)'}`,
        color: hov ? d.color : 'var(--color-text-secondary)',
        transition: 'all 0.18s', textDecoration: 'none', flexShrink: 0,
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d={d.path} />
      </svg>
    </a>
  );
}

export default function MemberCards({ members }) {
  const [liveStatus, setLiveStatus] = useState({});
  const [kickAvatars, setKickAvatars] = useState({});
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    const usernames = members.map(m => m.kick).filter(Boolean).join(',');
    if (!usernames) return;
    fetch(`/api/kick-live?users=${usernames}`)
      .then(r => r.json())
      .then(data => {
        setLiveStatus(data);
        const avs = {};
        Object.entries(data).forEach(([k, v]) => { if (v?.avatar) avs[k] = v.avatar; });
        setKickAvatars(avs);
        setStatusLoaded(true);
      })
      .catch(() => setStatusLoaded(true));
  }, []);

  const anyLive = statusLoaded && Object.values(liveStatus).some(s => s?.live);

  return (
    <div>
    <div className="member-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
      gap: 12,
    }}>
      {members.map(m => {
        const status = liveStatus[m.kick];
        const isLive = status?.live;

        const avatarUrl = kickAvatars[m.kick] || m.avatarUrl;

        return (
          <Link key={m.kick} href={m.slug} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="member-card" style={{
            background: 'var(--bg-card)',
            border: `1px solid ${isLive ? 'rgba(34,197,94,0.5)' : 'var(--color-border)'}`,
            borderRadius: 14, padding: '18px 14px', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 10, transition: 'border-color 0.2s, transform 0.15s', cursor: 'pointer',
          }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={m.displayName} width={72} height={72} style={{
                  borderRadius: '50%', objectFit: 'cover', display: 'block',
                  border: `2px solid ${isLive ? '#22C55E' : 'var(--color-border)'}`,
                }} />
              ) : (
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7C3AED, #9D5FF5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: '#fff',
                  border: `2px solid ${isLive ? '#22C55E' : 'var(--color-border)'}`,
                  flexShrink: 0,
                }}>
                  {m.displayName[0].toUpperCase()}
                </div>
              )}
              {isLive && (
                <span style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#22C55E', border: '2.5px solid var(--bg-card)',
                  display: 'block',
                }} />
              )}
            </div>

            {/* Name + role */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{m.displayName}</div>
              <div style={{ fontSize: 11, color: 'var(--color-purple-light)', fontWeight: 600, marginTop: 2 }}>
                {m.role}
              </div>
            </div>

            {/* Live badge */}
            {isLive && (
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#22C55E',
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 4, padding: '2px 8px',
              }}>
                EN VIVO{status.viewers > 0 ? ` · ${fmt(status.viewers)}` : ''}
              </div>
            )}

            {/* Followers */}
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {fmt(m.followers)} seguidores
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', justifyContent: 'center' }}>
              <SocialIcon href={`https://kick.com/${m.kick}`} type="kick" />
              <SocialIcon href={m.youtube} type="youtube" />
              <SocialIcon href={m.twitter} type="twitter" />
              <SocialIcon href={m.instagram} type="instagram" />
              <SocialIcon href={m.tiktok} type="tiktok" />
            </div>
          </div>
          </Link>
        );
      })}
    </div>

    {/* Offline banner */}
    {statusLoaded && !anyLive && (
      <div style={{
        marginTop: 14, padding: '11px 16px',
        background: 'rgba(161,161,181,0.06)', border: '1px solid var(--color-border)',
        borderRadius: 10, textAlign: 'center',
        fontSize: 13, color: 'var(--color-text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>💤</span>
        Ningún integrante está en vivo ahora mismo — volvé más tarde
      </div>
    )}
    </div>
  );
}
