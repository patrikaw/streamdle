'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function GuestCards({ guests }) {
  const [kickAvatars, setKickAvatars] = useState({});

  useEffect(() => {
    const usernames = guests.map(g => g.kick).filter(Boolean).join(',');
    if (!usernames) return;
    fetch(`/api/kick-live?users=${usernames}`)
      .then(r => r.json())
      .then(data => {
        const avs = {};
        Object.entries(data).forEach(([k, v]) => { if (v?.avatar) avs[k] = v.avatar; });
        setKickAvatars(avs);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="guests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
      {guests.map(g => {
        const avatarUrl = kickAvatars[g.kick] || g.avatarUrl;
        return (
          <Link key={g.kick} href={g.slug} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="guest-card" style={{
            background: 'var(--bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 12, padding: '16px 14px', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            transition: 'border-color 0.2s', cursor: 'pointer',
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={g.displayName} width={56} height={56} style={{
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
          </Link>
        );
      })}
    </div>
  );
}
