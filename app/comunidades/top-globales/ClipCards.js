'use client';
import { useState } from 'react';

const ACCENT = {
  Coker:      '#7C3AED',
  Goncho:     '#22C55E',
  Zeko:       '#EF4444',
  DuendePablo:'#3B82F6',
  Coscu:      '#F59E0B',
};

function ClipCard({ clip }) {
  const [thumbOk, setThumbOk] = useState(true);
  const color = ACCENT[clip.streamer] ?? '#7C3AED';
  const thumbUrl = `https://clips.kick.com/clips/${clip.id}/thumbnail.webp`;
  const kickUrl = `https://kick.com/clip/${clip.id}`;

  return (
    <a
      href={kickUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block', textDecoration: 'none', color: 'inherit',
        background: 'var(--bg-card)', border: '1px solid var(--color-border)',
        borderRadius: 12, overflow: 'hidden',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
      className="clip-card"
    >
      {/* Thumbnail / placeholder 16:9 */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', overflow: 'hidden' }}>
        {thumbOk ? (
          <img
            src={thumbUrl}
            alt={clip.title}
            onError={() => setThumbOk(false)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${color}33, ${color}11)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill={color} opacity={0.6}>
              <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm3 4v12h2.5v-4l4.5 4H17l-5-5 4.5-4.5h-2.8L9.5 12.5V6H7z" />
            </svg>
          </div>
        )}

        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)', border: `2px solid ${color}99`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: 3,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Kick badge */}
        <span style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.75)', color: '#53FC18',
          fontSize: 9, fontWeight: 800, borderRadius: 3, padding: '2px 6px',
          letterSpacing: '0.3px',
        }}>
          VER EN KICK ↗
        </span>
      </div>

      <div style={{ padding: '10px 14px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 3 }}>{clip.streamer}</div>
        <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>{clip.title}</div>
      </div>
    </a>
  );
}

export default function ClipCards({ clips }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 12,
    }}>
      {clips.map(clip => <ClipCard key={clip.id} clip={clip} />)}
    </div>
  );
}
