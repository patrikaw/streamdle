const OTROS = [
  ['/classic', '🎯 Streamdle Classic'], ['/chatdle', '💬 Chatdle'], ['/avatardle', '👤 Avatardle'], ['/emojidle', '😂 Emojidle'],
  ['/edadle', '🎂 Edadle'], ['/higherdle', '📊 Higherdle'], ['/categorydle', '🎮 Categorydle'],
];

// Texto visible bajo cada juego: explica las reglas (útil para quien busca) y da contenido indexable a una página que es toda interactiva.
export default function JuegoSEO({ href, nombre, intro, reglas, preguntas }) {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  return (
    <section style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--color-border)', padding: '32px 16px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Cómo se juega a {nombre}</h2>
        <p style={{ marginBottom: 12 }}>{intro}</p>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          {reglas.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Preguntas frecuentes</h2>
        {preguntas.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>{q}</h3>
            <p style={{ margin: 0 }}>{a}</p>
          </div>
        ))}
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '20px 0 10px' }}>Más juegos de Streamdle</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {OTROS.filter(([h]) => h !== href).map(([h, l]) => (
            <a key={h} href={h} style={{ fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-border)', background: 'var(--bg-card)' }}>{l}</a>
          ))}
          <a href="/tendencias" style={{ fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-border)', background: 'var(--bg-card)' }}>🔥 Streamers en tendencia</a>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </section>
  );
}
