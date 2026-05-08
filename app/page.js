'use client';

import { useState } from 'react';

const GAMES = [
  {
    slug: 'classic',
    name: 'Streamdle',
    emoji: '🎯',
    description: 'Adiviná el streamer del día con pistas',
    color: '#DC2626',
    available: true,
    daily: true,
  },
  {
    slug: 'avatardle',
    name: 'Avatardle',
    emoji: '👤',
    description: 'Adiviná el streamer por su foto pixelada',
    color: '#9D5FF5',
    available: true,
    daily: true,
  },
  {
    slug: 'emojidle',
    name: 'Emojidle',
    emoji: '😂',
    description: 'Adiviná el streamer por sus emojis',
    color: '#F59E0B',
    available: true,
    daily: true,
  },
  {
    slug: 'categorydle',
    name: 'Categorydle',
    emoji: '🎮',
    description: 'Adiviná las 2 categorías favoritas del streamer',
    color: '#059669',
    available: true,
    daily: true,
  },
  {
    slug: 'chatdle',
    name: 'Chatdle',
    emoji: '💬',
    description: 'Adiviná el streamer por su frase más icónica',
    color: '#B45309',
    available: true,
    daily: true,
  },
  {
    slug: 'higherdle',
    name: 'Higherdle',
    emoji: '📊',
    description: '¿Quién tiene más?',
    color: '#2563EB',
    available: true,
    daily: false,
  },
];

export default function Home() {
  const [hoveredGame, setHoveredGame] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎮</span>
          <span style={{
            fontSize: '22px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>STREAMDLE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            background: 'var(--bg-card)',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
          }}>🌎 ES</span>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 42px)',
          fontWeight: '800',
          lineHeight: 1.2,
          marginBottom: '12px',
        }}>
          El Wordle de{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
             Streamers en Español
          </span>
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          Adiviná el streamer del día — el Wordle de streamers hispanohablantes
        </p>
      </div>

      {/* Games grid */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px 48px',
      }}>
        <div className="games-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {GAMES.map((game) => {
          const isHigherdle = game.slug === 'higherdle';
          const Wrapper = isHigherdle ? 'div' : 'a';
          const wrapperProps = isHigherdle ? {} : { href: `/${game.slug}` };
          return (
            <Wrapper
              key={game.slug}
              {...wrapperProps}
              style={{ textDecoration: 'none', height: '100%', display: 'block' }}
              onMouseEnter={() => setHoveredGame(game.slug)}
              onMouseLeave={() => setHoveredGame(null)}
            >
              <div style={{
                background: 'var(--bg-card)',
                border: `1.5px solid ${hoveredGame === game.slug ? game.color : 'var(--color-border)'}`,
                borderRadius: '14px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: hoveredGame === game.slug ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredGame === game.slug ? `0 8px 24px ${game.color}30` : 'none',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Glow top bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: game.color,
                  borderRadius: '14px 14px 0 0',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{game.emoji}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    background: `${game.color}22`,
                    color: game.color,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    border: `1px solid ${game.color}44`,
                  }}>{game.daily ? 'DIARIO' : 'INFINITO'}</span>
                </div>

                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '6px',
                  color: 'var(--color-text)',
                }}>{game.name}</h2>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                }}>{game.description}</p>

                {game.slug === 'higherdle' ? (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'row', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { label: '👥 Seg.', href: '/higherdle', color: '#2563EB' },
                      { label: '⏱️ Horas', href: '/higherdle?mode=hours', color: '#0891B2' },
                      { label: '🏆 Peak', href: '/higherdle?mode=peak', color: '#7C3AED' },
                    ].map(btn => (
                      <a key={btn.href} href={btn.href} style={{
                        color: btn.color, fontSize: '13px', fontWeight: '700',
                        textDecoration: 'none', padding: '4px 0',
                      }}>{btn.label}  </a>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: game.color,
                    fontSize: '13px',
                    fontWeight: '600',
                  }}>
                    Jugar ahora →
                  </div>
                )}
              </div>
            </Wrapper>
          );
        })}
        </div>

        {/* Footer links */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          {[
  { label: 'Cómo jugar', href: '/como-jugar' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Términos', href: '/terminos' },
  { label: '☕ Apoyá Streamdle', href: 'https://ko-fi.com/streamdlenet' },
].map(link => (
  <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{
    color: link.href.startsWith('https://ko-fi') ? '#FF5E5B' : 'var(--color-text-secondary)',
    fontSize: '13px',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: link.href.startsWith('https://ko-fi') ? '600' : 'normal',
  }}>{link.label}</a>
))}
 
        </div>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '12px',
          marginTop: '12px',
        }}>
          © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
          <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer" style={{ color: '#53FC18', fontWeight: '700', textDecoration: 'none' }}>Pato Wnuk</a>.
        </p>
      </main>
    </div>
  );
}