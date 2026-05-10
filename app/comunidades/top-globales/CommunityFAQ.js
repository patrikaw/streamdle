'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: '¿Quiénes forman parte de Top Globales?',
    a: 'El grupo principal está formado por Coscu, Goncho, DuendePablo, Zeko y Coker. Rober Galati también es considerado parte oficial de la comunidad según su propio sitio web.',
  },
  {
    q: '¿Qué es Top Globales?',
    a: 'Top Globales es una comunidad de streamers argentinos que explotó en Kick gracias a sus streams diarios, el gaming constante y el caos total que manejan juntos. Son conocidos por volver a hacer gaming de la forma en que se hacía antes.',
  },
  {
    q: '¿Por qué Top Globales se hizo viral?',
    a: 'Por su enfoque en gaming cuando gran parte del streaming hispano apostaba a slots y reacciones. Sus streams grupales, el lore entre integrantes y el sentido de "si no entrás hoy, te perdés algo" generaron una comunidad muy fiel.',
  },
  {
    q: '¿Qué juegos juegan?',
    a: 'El grupo es conocido por hacer variedad: FIFA, CS, Valorant, GTA V y muchas sesiones grupales de Discord y just chatting donde ocurren los momentos más virales.',
  },
  {
    q: '¿Quiénes aparecen seguido con el grupo?',
    a: 'Entre los invitados más frecuentes están K1ng, Rober Galati, Unicornio, Carreraaa, Momo e incluso Duki, que en distintos momentos protagonizaron algunos de los clips más virales del multiverso Top Globales.',
  },
  {
    q: '¿Qué es la casa de Miami?',
    a: 'Es uno de los proyectos más comentados de la comunidad: la idea de que los integrantes convivan en una misma casa en Miami para hacer streams diarios, eventos y contenido grupal prácticamente 24/7.',
  },
  {
    q: '¿Top Globales transmite en Twitch o Kick?',
    a: 'Su foco principal está en Kick, donde hacen sus streams grupales. Algunos integrantes también mantienen actividad en Twitch. La comunidad oficial en redes está en X (Twitter), Instagram, YouTube y TikTok.',
  },
];

export default function CommunityFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', padding: '13px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 14, fontWeight: 600,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: 12,
            }}
          >
            <span>{faq.q}</span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 18, flexShrink: 0 }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div style={{
              padding: '0 16px 14px',
              fontSize: 13, color: 'var(--color-text-secondary)',
              lineHeight: 1.65, borderTop: '1px solid var(--color-border)',
              paddingTop: 12,
            }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
