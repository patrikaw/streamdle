'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fmtNum } from '../../../lib/formato';
import { C } from '../../../lib/colores';
import { REDES as SOCIAL_SVG } from '../../../lib/redes';



function GuestSocialIcon({ href, type }) {
  if (!href) return null;
  const d = SOCIAL_SVG[type];
  if (!d) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
      background: d.bg, border: `1px solid ${d.border}`,
      color: d.color, textDecoration: 'none', flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d={d.path} />
      </svg>
    </a>
  );
}

const fmt = (n) => fmtNum(n, '—');

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
            borderRadius: 'var(--radius-md)', padding: '16px 14px', height: '100%',
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
