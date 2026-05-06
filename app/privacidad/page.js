export default function PrivacidadPage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Política de Privacidad</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '32px' }}>Última actualización: Mayo 2026</p>

        {[
          {
            title: '1. Información que recopilamos',
            content: 'Streamdle no recopila datos personales identificables. No requerimos registro ni inicio de sesión. Toda la información del progreso del juego (intentos, rachas, récords) se almacena únicamente en tu navegador mediante localStorage y nunca se envía a nuestros servidores.',
          },
          {
            title: '2. Datos de uso',
            content: 'Podemos utilizar herramientas de analítica anónima (como Google Analytics) para entender cómo se usa el sitio. Estos datos son agregados y no permiten identificar usuarios individuales. Incluyen páginas visitadas, tiempo en el sitio y país de origen.',
          },
          {
            title: '3. Cookies',
            content: 'Streamdle utiliza localStorage del navegador para guardar tu progreso de juego local. No utilizamos cookies de rastreo de terceros con fines publicitarios.',
          },
          {
            title: '4. APIs de terceros',
            content: 'Utilizamos la API oficial de Twitch para obtener imágenes de perfil de streamers. Esta información es pública y no incluye datos personales de los usuarios del sitio. Los datos de streamers (seguidores, horas, categorías) son información pública obtenida de fuentes como Twitchtracker y Streamscharts.',
          },
          {
            title: '5. Información de streamers',
            content: 'Toda la información mostrada sobre streamers (nombre, estadísticas, categorías) es información pública disponible en sus perfiles de Twitch, Kick o YouTube. Si sos un streamer y querés que tu información sea modificada o eliminada, contactanos en contacto@streamdle.net.',
          },
          {
            title: '6. Menores de edad',
            content: 'Streamdle está dirigido a usuarios mayores de 13 años. No recopilamos intencionalmente información de menores de 13 años.',
          },
          {
            title: '7. Cambios a esta política',
            content: 'Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos publicando la nueva versión en esta página con la fecha de actualización.',
          },
          {
            title: '8. Contacto',
            content: 'Si tenés preguntas sobre esta política de privacidad, escribinos a contacto@streamdle.net.',
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