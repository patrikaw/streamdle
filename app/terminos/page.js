export default function TerminosPage() {
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

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 16px 64px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Términos de Uso</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '32px' }}>Última actualización: Mayo 2026</p>

        {[
          {
            title: '1. Aceptación de términos',
            content: 'Al acceder y usar Streamdle (streamdle.net), aceptás estos términos de uso. Si no estás de acuerdo, por favor no uses el sitio.',
          },
          {
            title: '2. Uso del sitio',
            content: 'Streamdle es un juego gratuito de entretenimiento. Podés usarlo libremente para jugar, compartir resultados y disfrutar del contenido. No está permitido intentar manipular el sistema de juego, hacer scraping masivo del sitio o usar el sitio de formas que perjudiquen a otros usuarios.',
          },
          {
            title: '3. Propiedad intelectual',
            content: 'El diseño, código y contenido original de Streamdle son propiedad de sus creadores. Los nombres, imágenes y datos de los streamers son propiedad de sus respectivos dueños. Las imágenes de perfil se obtienen mediante la API oficial de Twitch respetando sus términos de servicio.',
          },
          {
            title: '4. Afiliación',
            content: 'Streamdle no está afiliado, asociado, autorizado ni respaldado por Twitch, Kick, YouTube ni por ningún streamer mencionado en el sitio. Los nombres y marcas de estos servicios son propiedad de sus respectivos dueños.',
          },
          {
            title: '5. Exactitud de la información',
            content: 'Los datos estadísticos de los streamers (seguidores, horas, categorías) se actualizan periódicamente pero pueden no reflejar en tiempo real la situación actual. Streamdle no garantiza la exactitud absoluta de estos datos.',
          },
          {
            title: '6. Limitación de responsabilidad',
            content: 'Streamdle se provee "tal cual" sin garantías de ningún tipo. No somos responsables por interrupciones del servicio, pérdida de progreso de juego ni ningún otro inconveniente derivado del uso del sitio.',
          },
          {
            title: '7. Modificaciones',
            content: 'Nos reservamos el derecho de modificar el sitio, agregar o quitar juegos, streamers o funcionalidades en cualquier momento sin previo aviso.',
          },
          {
            title: '8. Contacto',
            content: 'Para consultas sobre estos términos, escribinos a contacto@streamdle.net.',
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#9D5FF5' }}>{section.title}</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{section.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}