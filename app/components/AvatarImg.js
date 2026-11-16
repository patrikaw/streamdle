'use client';

import { useState } from 'react';

export default function AvatarImg({ url, name, size = 48 }) {
  const [err, setErr] = useState(false);
  if (!url || err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.32, fontWeight: 800, color: '#fff', flexShrink: 0,
      }}>
        {(name || '?').slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={url} alt={name} width={size} height={size} loading="lazy"
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      onError={() => setErr(true)}
    />
  );
}
