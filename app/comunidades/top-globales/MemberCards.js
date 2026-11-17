'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fmtNum } from '../../../lib/formato';
import { C } from '../../../lib/colores';
import { REDES as SOCIAL_DATA } from '../../../lib/redes';
import EnVivo from '../../components/EnVivo';

const fmt = (n) => fmtNum(n, '—');



function SocialIcon({ href, type }) {
  const [hov, setHov] = useState(false);
  if (!href?.trim()) return null;
  const d = SOCIAL_DATA[type];
  if (!d) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 'var(--radius-xs)',
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
            border: `1px solid ${isLive ? 'rgba(239,68,68,0.5)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)', padding: '18px 14px', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 10, transition: 'border-color 0.2s, transform 0.15s', cursor: 'pointer',
          }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={m.displayName} width={72} height={72} style={{
                  borderRadius: '50%', objectFit: 'cover', display: 'block',
                  border: `2px solid ${isLive ? C.live : 'var(--color-border)'}`,
                }} />
              ) : (
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-purple), #9D5FF5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: '#fff',
                  border: `2px solid ${isLive ? C.live : 'var(--color-border)'}`,
                  flexShrink: 0,
                }}>
                  {m.displayName[0].toUpperCase()}
                </div>
              )}
              {isLive && (
                <span style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: C.live, border: '2.5px solid var(--bg-card)',
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
            {isLive && <EnVivo viewers={status.viewers} />}

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
        borderRadius: 'var(--radius-sm)', textAlign: 'center',
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
