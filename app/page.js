'use client';

import { useState } from 'react';
import { claro, C, C_JUEGO, C_SEC } from '../lib/colores';
import Ruleta from './components/Ruleta';

const GAMES = [
  {
    slug: 'classic',
    name: 'Streamdle',
    emoji: '🎯',
    description: 'Adiviná el streamer del día con pistas',
    color: C_JUEGO.classic,
    available: true,
    daily: true,
  },
  {
    slug: 'avatardle',
    name: 'Avatardle',
    emoji: '👤',
    description: 'Adiviná el streamer por su foto pixelada',
    color: C_JUEGO.avatardle,
    available: true,
    daily: true,
  },
  {
    slug: 'emojidle',
    name: 'Emojidle',
    emoji: '😂',
    description: 'Adiviná el streamer por sus emojis',
    color: C_JUEGO.emojidle,
    available: true,
    daily: true,
  },
  {
    slug: 'categorydle',
    name: 'Categorydle',
    emoji: '🎮',
    description: 'Adiviná las 2 categorías favoritas del streamer',
    color: C_JUEGO.categorydle,
    available: true,
    daily: true,
  },
  {
    slug: 'higherdle',
    name: 'Higherdle',
    emoji: '📊',
    description: '¿Quién tiene más?',
    color: C_JUEGO.higherdle,
    available: true,
    daily: false,
  },
  {
    slug: 'edadle',
    name: 'Edadle',
    emoji: '🎂',
    description: '¿Cuántos años tiene el streamer?',
    color: C_JUEGO.edadle,
    available: true,
    daily: true,
    nuevo: true,
  },
  {
    slug: 'chatdle',
    name: 'Chatdle',
    emoji: '💬',
    description: 'Adiviná el streamer por su frase más icónica',
    color: C_JUEGO.chatdle,
    available: true,
    daily: true,
  },
];

export default function Home() {
  const [hoveredGame, setHoveredGame] = useState(null);
  const ORDEN = ['classic', 'chatdle', 'avatardle', 'emojidle', 'edadle', 'higherdle', 'categorydle'];
  const rango = (g) => { const i = ORDEN.indexOf(g.slug); return i === -1 ? -1 : i; };
  const visibleGames = GAMES.filter(g => !g.until || Date.now() <= new Date(g.until).getTime()).sort((a, b) => rango(a) - rango(b));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        .ribbon-nuevo { position: absolute; top: 14px; right: -34px; width: 130px; text-align: center; transform: rotate(40deg);
          background: linear-gradient(90deg, var(--color-warn), var(--sec-clips), var(--color-purple)); background-size: 200% 100%; color: #fff; font-size: 11px; font-weight: 900;
          letter-spacing: 1px; padding: 4px 0; box-shadow: 0 2px 10px rgba(236,72,153,.6); animation: nuevoBrillo 2.4s linear infinite; z-index: 2; }
        @keyframes nuevoBrillo { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
        .novedades-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 700px) { .novedades-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 440px) { .novedades-grid { grid-template-columns: 1fr; } }
      `}</style>
      {/* Header */}
      
      {/* Cinta de novedades */}
      <a href="#novedades" className="cinta-volvimos" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '9px 16px', background: 'linear-gradient(90deg, var(--color-purple), #DB2777, var(--color-warn))' }}>
        🎉 ¡Volvimos con todo! Nuevo juego <u>Edadle</u>, streamers en tendencia y comunidades. Mirá las novedades ↓
      </a>

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
            background: 'linear-gradient(135deg, var(--color-purple), var(--color-kick))',
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
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '14px',
          lineHeight: 1.7,
          maxWidth: '620px',
          margin: '14px auto 0',
          opacity: 0.9,
        }}>
          Streamdle reúne a más de 200 streamers hispanos de Twitch y Kick: 7 juegos diarios, una ficha con datos reales de cada uno
          (edad, seguidores, horas, clip más visto y actividad reciente) y rankings que se actualizan cada 15 días.
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
          {visibleGames.map((game) => {
          const wrapperProps = game.external
            ? { href: game.href, target: '_blank', rel: 'sponsored noopener noreferrer' }
            : { href: `/${game.slug}` };
          return (
            <a
              key={game.slug}
              {...wrapperProps}
              style={{ textDecoration: 'none', height: '100%', display: 'block' }}
              onClick={game.external ? () => window.gtag?.('event', 'sponsor_click', { sponsor: game.slug }) : undefined}
              onMouseEnter={() => setHoveredGame(game.slug)}
              onMouseLeave={() => setHoveredGame(null)}
            >
              <div style={{
                background: 'var(--bg-card)',
                border: `1.5px solid ${hoveredGame === game.slug ? game.color : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
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
                {game.nuevo && <div className="ribbon-nuevo">¡NUEVO!</div>}
                {/* Glow top bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: game.color,
                  borderRadius: '14px 14px 0 0',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  {game.image
                    ? <img src={game.image} alt={game.name} width={40} height={40} style={{ borderRadius: 'var(--radius-sm)' }} />
                    : <span style={{ fontSize: '32px' }}>{game.emoji}</span>}
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    background: `${game.color}22`,
                    color: claro(game.color),
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${game.color}44`,
                  }}>{game.badge || (game.daily ? 'DIARIO' : 'INFINITO')}</span>
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
                      { label: '👥 Seg.', href: '/higherdle', color: C.purple },
                      { label: '⏱️ Horas', href: '/higherdle?mode=hours', color: C.info },
                      { label: '🏆 Peak', href: '/higherdle?mode=peak', color: C.warn },
                    ].map(btn => (
                      <button key={btn.href} onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = btn.href; }} style={{
                        color: claro(btn.color), fontSize: '13px', fontWeight: '700',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                      }}>{btn.label}</button>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: claro(game.color),
                    fontSize: '13px',
                    fontWeight: '600',
                  }}>
                    {game.cta || 'Jugar ahora →'}
                  </div>
                )}
              </div>
            </a>
          );
        })}
        </div>

        {/* Ruleta */}
        <section style={{ marginTop: '48px' }}>
          <Ruleta conTitulo />
        </section>

        {/* Novedades */}
        <section id="novedades" style={{ marginTop: '48px' }}>
          <div className="novedades-grid">
            {[
              { href: '/tendencias', emoji: '🔥', titulo: 'Streamers en tendencia', texto: 'Quiénes ganaron más seguidores, por país y para toda Latam.', color: C_SEC.tendencias },
              { href: '/comunidades', emoji: '👥', titulo: 'Comunidades', texto: 'Top Globales, W Crew, Coscu Army y los grupos que mueven el streaming.', color: C_SEC.comunidades },
              { href: '/streamers', emoji: '🏆', titulo: 'Ranking y fichas', texto: 'Más de 200 fichas con edad, actividad del mes y clip más visto.', color: C_SEC.ranking },
              { href: '/streamers/signo', emoji: '♈', titulo: 'Por signo, generación y personalidad', texto: 'Explorá a los streamers agrupados de otra manera.', color: C_SEC.ranking },
              { href: '/clips/hoy', emoji: '🎬', titulo: 'Mejores clips de hoy', texto: 'Los clips más vistos de los streamers hispanos, del día, la semana y el mes.', color: C_SEC.clips },
              { href: '/gta-6', emoji: '🎮', titulo: 'GTA 6 en español', texto: 'Quién lo juega en vivo entre los streamers hispanos y sus mejores clips.', color: C.info },
            ].map((n) => (
              <a key={n.href} href={n.href} style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)', padding: '16px 18px', background: `linear-gradient(135deg, ${n.color}26, var(--bg-card))`, border: `1px solid ${n.color}55` }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{n.emoji}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{n.titulo}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>{n.texto}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Pie */}
              </main>
    </div>
  );
}