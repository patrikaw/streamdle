'use client';
import { useState } from 'react';
import { REDES as SOCIAL_DATA } from '../../../lib/redes';



function SocialIcon({ href, type }) {
  const [hov, setHov] = useState(false);
  const d = SOCIAL_DATA[type];
  if (!d || !href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 38, height: 38, borderRadius: 'var(--radius-sm)',
        background: hov ? d.color + '22' : 'var(--bg-card)',
        border: `1px solid ${hov ? d.color : 'var(--color-border)'}`,
        color: hov ? d.color : 'var(--color-text-secondary)',
        transition: 'all 0.18s', textDecoration: 'none', flexShrink: 0,
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d={d.path} />
      </svg>
    </a>
  );
}

export default function CommunitySocials({ socials }) {
  return (
    <div className="comm-socials" style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
      {socials.map(s => (
        <SocialIcon key={s.type} href={s.href} type={s.type} />
      ))}
    </div>
  );
}
