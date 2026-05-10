'use client';
import { useState, useEffect } from 'react';

function fmt(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toLocaleString('es');
}

function SocialLink({ href, label, bg, color, border }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      fontSize: 11, fontWeight: 700,
      background: bg, color, border: border ? `1px solid ${border}` : 'none',
      borderRadius: 4, padding: '2px 7px', textDecoration: 'none',
    }}>
      {label}
    </a>
  );
}

export default function MemberCards({ members }) {
  const [liveStatus, setLiveStatus] = useState({});

  useEffect(() => {
    const usernames = members.map(m => m.kick).filter(Boolean).join(',');
    if (!usernames) return;
    fetch(`/api/kick-live?users=${usernames}`)
      .then(r => r.json())
      .then(data => setLiveStatus(data))
      .catch(() => {});
  }, []);

  return (
    <div className="member-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
      gap: 12,
    }}>
      {members.map(m => {
        const status = liveStatus[m.kick];
        const isLive = status?.live;

        return (
          <div key={m.kick} className="member-card" style={{
            background: 'var(--bg-card)',
            border: `1px solid ${isLive ? 'rgba(34,197,94,0.5)' : 'var(--color-border)'}`,
            borderRadius: 14, padding: '18px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 10, transition: 'border-color 0.2s, transform 0.15s',
          }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.displayName} width={72} height={72} style={{
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

            {/* Social links */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {m.kick && (
                <SocialLink href={`https://kick.com/${m.kick}`} label="Kick"
                  bg="#53FC18" color="#0D0D14" />
              )}
              {m.twitch && (
                <SocialLink href={`https://twitch.tv/${m.twitch}`} label="Twitch"
                  bg="#9146FF" color="#fff" />
              )}
              {m.twitter && (
                <SocialLink href={m.twitter} label="X"
                  bg="rgba(29,161,242,0.15)" color="#fff" border="rgba(29,161,242,0.3)" />
              )}
              {m.instagram && (
                <SocialLink href={m.instagram} label="IG"
                  bg="rgba(225,48,108,0.15)" color="#fff" border="rgba(225,48,108,0.3)" />
              )}
              {m.tiktok && (
                <SocialLink href={m.tiktok} label="TT"
                  bg="rgba(255,255,255,0.08)" color="#fff" border="rgba(255,255,255,0.15)" />
              )}
              {m.youtube && (
                <SocialLink href={m.youtube} label="YT"
                  bg="rgba(255,0,0,0.15)" color="#fff" border="rgba(255,0,0,0.3)" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
