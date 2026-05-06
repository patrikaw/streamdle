'use client';

import { useState } from 'react';

export default function ContactoPage() {
  const [copied, setCopied] = useState(false);
  const email = 'contacto@streamdle.net';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', gap: '12px', flexWrap: 'wrap',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎮</span>
          <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #7C3AED, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</span>
        </a>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/classic', label: '🎯 Classic' },
            { href: '/avatardle', label: '👤 Avatardle' },
            { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle', label: '💬 Chatdle' },
            { href: '/higherdle', label: '📊 Higherdle' },
            { href: '/higherdle?mode=hours', label: '⏱️ Hourdle' },
          ].map(g => (
            <a key={g.href} href={g.href} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              color: 'white', borderRadius: '8px', padding: '5px 12px',
              fontSize: '10px', fontWeight: '600', textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 16px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✉️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>Contacto</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
            ¿Tenés sugerencias, encontraste un error, o querés hablar sobre sponsors? Escribinos.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { emoji: '🐛', title: 'Reportar un error', desc: 'Encontraste algo roto o un dato incorrecto de algún streamer' },
            { emoji: '💡', title: 'Sugerencias', desc: 'Ideas para nuevos juegos, streamers para agregar, mejoras al sitio' },
            { emoji: '🤝', title: 'Sponsors y colaboraciones', desc: 'Marcas o streamers interesados en aparecer en Streamdle' },
            { emoji: '➕', title: 'Agregar un streamer', desc: 'Si conocés un streamer que debería estar en el juego' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px 20px',
              border: '1px solid var(--color-border)', display: 'flex', gap: '14px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.emoji}</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px', background: 'var(--bg-secondary)', borderRadius: '14px',
          padding: '28px', textAlign: 'center', border: '1px solid var(--color-purple)',
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Escribinos a
          </div>
          <div style={{
            fontSize: '20px', fontWeight: '800',
            background: 'linear-gradient(135deg, #7C3AED, #53FC18)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '16px',
          }}>
            {email}
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              navigator.clipboard.writeText(email).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
          >
            {copied ? '✓ ¡Copiado!' : '📋 Copiar email'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '24px' }}>
  Streamdle es un proyecto independiente hecho por fans, para fans. No estamos afiliados con Twitch, Kick ni YouTube.
</p>
<div style={{ textAlign: 'center', marginTop: '16px' }}>
  <a href="https://ko-fi.com/streamdlenet" target="_blank" rel="noopener noreferrer" style={{
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#FF5E5B', color: 'white',
    padding: '10px 24px', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', textDecoration: 'none',
    transition: 'opacity 0.2s',
  }}>
    ☕ Apoyá Streamdle en Ko-fi
  </a>
</div>
      </main>
    </div>
  );
}