'use client';

export default function ComoJugarPage() {
  const games = [
    {
      name: 'Streamdle Classic',
      emoji: '🎯',
      color: '#7C3AED',
      slug: '/classic',
      description: 'El juego principal. Adiviná el streamer del día usando pistas.',
      steps: [
        'Escribí el nombre de cualquier streamer en el buscador',
        'El sistema te muestra pistas: país, categoría, seguidores, horas en stream, si está activo, peak viewers y plataformas — todas visibles desde el primer intento',
        'Verde ✅ = correcto, Rojo ❌ = incorrecto, Azul con flecha = más alto ↑ o más bajo ↓',
        'Tenés 8 intentos para adivinar. ¡Un nuevo streamer cada día!',
      ],
    },
    {
      name: 'Avatardle',
      emoji: '👤',
      color: '#9D5FF5',
      slug: '/avatardle',
      description: 'Adiviná el streamer por su foto de perfil pixelada.',
      steps: [
        'Se muestra la foto de perfil del streamer muy pixelada',
        'Cada intento fallido la imagen se va aclarando progresivamente',
        'Escribí el nombre del streamer que creés que es',
        'Tenés 6 intentos. Cuanto antes lo adivines, mejor',
      ],
    },
    {
      name: 'Emojidle',
      emoji: '😂',
      color: '#F59E0B',
      slug: '/emojidle',
      description: 'Adiviná el streamer por sus emojis representativos.',
      steps: [
        'Se muestra un emoji que representa al streamer del día',
        'Cada intento fallido se revela un emoji más (hasta 4 en total)',
        'Escribí el nombre del streamer que creés que es',
        'Tenés 6 intentos para adivinarlo',
      ],
    },
    {
      name: 'Categorydle',
      emoji: '🎮',
      color: '#059669',
      slug: '/categorydle',
      description: 'Adiviná las dos categorías que más streameó el streamer del día.',
      steps: [
        'Se muestra el streamer del día con su foto y nombre visibles',
        'Tenés que adivinar su categoría principal y su segunda categoría',
        'Escribí el nombre de un juego o categoría en el buscador',
        'Si acertás una, se revela. Ganás cuando adivinás las dos',
        'Tenés 8 intentos en total',
      ],
    },
    {
      name: 'Chatdle',
      emoji: '💬',
      color: '#B45309',
      slug: '/chatdle',
      description: 'Adiviná el streamer por su frase más icónica.',
      steps: [
        'Se muestra la frase más reconocible del streamer del día',
        'Cada intento fallido se desbloquea una pista extra: categoría, país, plataforma e inicial',
        'Escribí el nombre del streamer que creés que dijo esa frase',
        'Tenés 6 intentos para adivinarlo',
      ],
    },
    {
      name: 'Higherdle',
      emoji: '📊',
      color: '#2563EB',
      slug: '/higherdle',
      description: 'Higher or Lower de streamers. ¿Quién tiene más seguidores, horas o peak?',
      steps: [
        'Se muestran dos streamers enfrentados',
        'El streamer de la izquierda muestra su número (seguidores, horas o peak viewers)',
        'Tenés que adivinar si el de la derecha tiene MÁS ↑ o MENOS ↓',
        'Si acertás, el de la derecha pasa a la izquierda y aparece uno nuevo',
        'El juego termina cuando fallás. ¡Intentá batir tu récord y subir de nivel!',
        'Podés cambiar entre modo Seguidores, Horas y Peak Viewers desde el header',
      ],
    },
  ];

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
        <div className="game-nav-links" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/classic',     label: '🎯 Classic' },
            { href: '/avatardle',   label: '👤 Avatardle' },
            { href: '/emojidle',    label: '😂 Emojidle' },
            { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle',     label: '💬 Chatdle' },
            { href: '/higherdle',   label: '📊 Higherdle' },
          ].map(g => (
            <a key={g.href} href={g.href} style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              color: 'white', borderRadius: '8px', padding: '5px 12px',
              fontSize: '10px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 16px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>¿Cómo jugar?</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            Streamdle tiene 6 modos de juego. Todos se renuevan cada día a las 00:00.
          </p>
        </div>

        {/* Filtros globales */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px 20px',
          marginBottom: '32px', border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>🌎 Filtros de región</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
            En todos los juegos podés filtrar streamers por región: <strong>Todos</strong>, <strong>🇦🇷 Argentina</strong>, <strong>🇲🇽 México</strong>, <strong>🇪🇸 España</strong> o <strong>🌎 LATAM</strong>. Al cambiar el filtro, el streamer del día cambia también para esa región.
          </p>
        </div>

        {/* Juegos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {games.map(game => (
            <div key={game.slug} style={{
              background: 'var(--bg-secondary)', borderRadius: '14px',
              border: '1px solid var(--color-border)', overflow: 'hidden',
            }}>
              <div style={{ height: '4px', background: `linear-gradient(90deg, ${game.color}, transparent)` }} />
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{game.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '18px' }}>{game.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{game.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                  {game.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        minWidth: '22px', height: '22px', borderRadius: '50%',
                        background: `${game.color}22`, border: `1px solid ${game.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '700', color: game.color, flexShrink: 0,
                      }}>{i + 1}</div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
                <a href={game.slug} style={{
                  display: 'inline-block', marginTop: '16px',
                  background: game.color, color: 'white',
                  padding: '8px 20px', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '700', textDecoration: 'none',
                }}>
                  Jugar ahora →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Sobre Streamdle */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px 24px',
          marginTop: '40px', border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>🎮 Sobre Streamdle</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
            Streamdle es un proyecto independiente creado por{' '}
            <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-green)', textDecoration: 'none', fontWeight: '700' }}>
              Pato Wnuk
            </a>{' '}
            para la comunidad de streamers hispanohablantes. Nació en 2025 como un Wordle de streamers
            y creció hasta convertirse en una plataforma con 6 juegos diarios, fichas de streamers,
            estadísticas y cultura streamer en español. No estamos afiliados con Twitch, Kick ni YouTube.
            Si querés sugerir un streamer, reportar un error o colaborar,{' '}
            <a href="/contacto" style={{ color: 'var(--color-purple-light)', textDecoration: 'none' }}>
              escribinos por acá
            </a>.
          </p>
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-border)', background: 'var(--bg-secondary)',
        padding: '20px 24px', textAlign: 'center',
        fontSize: '12px', color: 'var(--color-text-secondary)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {[
            { href: '/',           label: 'Juegos' },
            { href: '/streamers',  label: 'Streamers' },
            { href: '/contacto',   label: 'Contacto' },
            { href: '/privacidad', label: 'Privacidad' },
            { href: '/terminos',   label: 'Términos' },
            { href: 'https://ko-fi.com/streamdlenet', label: '☕ Apoyá Streamdle' },
          ].map(l => (
            <a key={l.href} href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
        © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
        <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--color-green)', textDecoration: 'none' }}>Pato Wnuk</a>.
      </footer>
    </div>
  );
}