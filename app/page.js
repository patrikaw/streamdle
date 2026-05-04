'use client';

import { useState } from 'react';
import Link from 'next/link';

const GAMES = [
  {
    slug: 'classic',
    name: 'Streamdle',
    emoji: '🎯',
    description: 'Adiviná el streamer del día con pistas',
    color: '#7C3AED',
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
    slug: 'categorydle',
    name: 'Categorydle',
    emoji: '🎮',
    description: 'Adiviná la categoría favorita del streamer',
    color: '#059669',
    available: true,
    daily: true,
  },
  {
    slug: 'higherdle',
    name: 'Higherdle',
    emoji: '📊',
    description: '¿Quién tiene más seguidores? — Infinito',
    color: '#2563EB',
    available: true,
    daily: false,
  },
  {
    slug: 'higherdle?mode=hours',
    name: 'Hourdle',
    emoji: '⏱️',
    description: '¿Quién streameó más horas? — Infinito',
    color: '#0891B2',
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
          ¿Cuánto sabés de tus{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            streamers favoritos?
          </span>
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          Jugá los desafíos diarios y demostrá que sos el fan número 1
        </p>
      </div>

      {/* Games grid */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px 48px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              style={{ textDecoration: 'none' }}
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
                  {game.daily && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      background: `${game.color}22`,
                      color: game.color,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${game.color}44`,
                    }}>DIARIO</span>
                  )}
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
              </div>
            </Link>
          ))}
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
].map(link => (
  <a key={link.label} href={link.href} style={{
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    textDecoration: 'none',
    cursor: 'pointer',
  }}>{link.label}</a>
))}
        </div>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '12px',
          marginTop: '12px',
        }}>
          © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por fans, para fans.
        </p>
      </main>
    </div>
  );
}