'use client';

import { useState } from 'react';
import { claro } from '../lib/colores';
import Ruleta from './components/Ruleta';

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
    slug: 'higherdle',
    name: 'Higherdle',
    emoji: '📊',
    description: '¿Quién tiene más?',
    color: '#2563EB',
    available: true,
    daily: false,
  },
  {
    slug: 'edadle',
    name: 'Edadle',
    emoji: '🎂',
    description: '¿Cuántos años tiene el streamer?',
    color: '#DB2777',
    available: true,
    daily: true,
    nuevo: true,
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
          background: linear-gradient(90deg, #F59E0B, #EC4899, #8B5CF6); background-size: 200% 100%; color: #fff; font-size: 11px; font-weight: 900;
          letter-spacing: 1px; padding: 4px 0; box-shadow: 0 2px 10px rgba(236,72,153,.6); animation: nuevoBrillo 2.4s linear infinite; z-index: 2; }
        @keyframes nuevoBrillo { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
        .novedades-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 700px) { .novedades-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 440px) { .novedades-grid { grid-template-columns: 1fr; } }
      `}</style>
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
          <a href="/ruleta" style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '6px 14px', borderRadius: '8px', background: '#7C3AED', whiteSpace: 'nowrap' }}>🎲 Descubrí un streamer</a>
          <a href="/explorar" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-card)', whiteSpace: 'nowrap' }}>🔍 Explorar</a>
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

      {/* Cinta de novedades */}
      <a href="#novedades" className="cinta-volvimos" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '9px 16px', background: 'linear-gradient(90deg, #7C3AED, #DB2777, #F59E0B)' }}>
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
                    ? <img src={game.image} alt={game.name} width={40} height={40} style={{ borderRadius: '10px' }} />
                    : <span style={{ fontSize: '32px' }}>{game.emoji}</span>}
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    background: `${game.color}22`,
                    color: claro(game.color),
                    padding: '3px 8px',
                    borderRadius: '8px',
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
                      { label: '👥 Seg.', href: '/higherdle', color: '#2563EB' },
                      { label: '⏱️ Horas', href: '/higherdle?mode=hours', color: '#0891B2' },
                      { label: '🏆 Peak', href: '/higherdle?mode=peak', color: '#7C3AED' },
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
              { href: '/tendencias', emoji: '🔥', titulo: 'Streamers en tendencia', texto: 'Quiénes ganaron más seguidores, por país y para toda Latam.', color: '#F97316' },
              { href: '/comunidades', emoji: '👥', titulo: 'Comunidades', texto: 'Top Globales, W Crew, Coscu Army y los grupos que mueven el streaming.', color: '#16A34A' },
              { href: '/streamers', emoji: '🏆', titulo: 'Ranking y fichas', texto: 'Más de 200 fichas con edad, actividad del mes y clip más visto.', color: '#7C3AED' },
              { href: '/streamers/signo', emoji: '♈', titulo: 'Por signo, generación y personalidad', texto: 'Explorá a los streamers agrupados de otra manera.', color: '#2563EB' },
              { href: '/clips/hoy', emoji: '🎬', titulo: 'Mejores clips de hoy', texto: 'Los clips más vistos de los streamers hispanos, del día, la semana y el mes.', color: '#0EA5E9' },
              { href: '/gta-6', emoji: '🎮', titulo: 'GTA 6 en español', texto: 'Quién lo juega en vivo entre los streamers hispanos y sus mejores clips.', color: '#0EA5E9' },
            ].map((n) => (
              <a key={n.href} href={n.href} style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderRadius: '14px', padding: '16px 18px', background: `linear-gradient(135deg, ${n.color}26, var(--bg-card))`, border: `1px solid ${n.color}55` }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{n.emoji}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{n.titulo}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>{n.texto}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Pie */}
        <footer style={{ marginTop: '48px', padding: '28px 24px 8px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
        <nav aria-label="Rankings y explorador de streamers" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {[
            ['/tendencias', '🔥 Streamers en tendencia'], ['/streamers', '🏆 Ranking de streamers'], ['/streamers/signo', '♈ Por signo'],
            ['/streamers/generacion', '🧬 Por generación'], ['/streamers/personalidad', '🎭 Por personalidad'],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--color-border)', background: 'var(--bg-card)' }}>{label}</a>
          ))}
        </nav>
        <div style={{
          textAlign: 'center',
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
  { label: 'Pispeo · reseñas de herramientas', href: 'https://pispeo.com.ar' },
].map(link => (
  <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 'normal',
  }}>{link.label}</a>
))}
 
        </div>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '12px',
          margin: 0,
        }}>
          © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
          <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer" style={{ color: '#53FC18', fontWeight: '700', textDecoration: 'underline' }}>Pato Wnuk</a>.
        </p>
        </footer>
      </main>
    </div>
  );
}