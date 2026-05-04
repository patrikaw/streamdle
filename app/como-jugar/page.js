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
        'El sistema te muestra pistas: país, categoría, seguidores, horas en stream y si está activo',
        'Verde ✅ = correcto, Rojo ❌ = incorrecto, Azul con flecha = más alto o más bajo',
        'En el intento 4 se desbloquea el Peak Viewers como pista extra',
        'En el intento 6 se desbloquean las plataformas donde tiene cuenta',
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
        'Tenés 6 intentos. Cuanto antes lo adivines, mejor puntaje',
      ],
    },
    {
      name: 'Higherdle',
      emoji: '📊',
      color: '#2563EB',
      slug: '/higherdle',
      description: 'Higher or Lower de streamers. ¿Quién tiene más seguidores o horas?',
      steps: [
        'Se muestran dos streamers enfrentados',
        'El streamer de la izquierda muestra su cantidad (seguidores u horas)',
        'Tenés que adivinar si el de la derecha tiene MÁS ↑ o MENOS ↓',
        'Si acertás, el de la derecha pasa a la izquierda y aparece uno nuevo',
        'El juego termina cuando fallás. ¡Intentá batir tu récord!',
        'Podés cambiar entre modo Seguidores y modo Horas desde el header',
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
        'Tenés que adivinar tanto su categoría principal como su segunda categoría',
        'Escribí el nombre de un juego o categoría en el buscador',
        'Si acertás una de las dos, se revela esa categoría',
        'Ganás cuando adivinás las dos categorías',
        'Tenés 8 intentos en total',
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎮</span>
          <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #7C3AED, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</span>
        </a>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 16px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>¿Cómo jugar?</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            Streamdle tiene varios modos de juego. Todos se renuevan cada día a las 00:00.
          </p>
        </div>

        {/* Filtros globales */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px 20px',
          marginBottom: '32px', border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>🌎 Filtros de región</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
            En todos los juegos podés filtrar streamers por región: <strong>Todos</strong>, <strong>🇦🇷 Argentina</strong>, <strong>🇲🇽 México</strong>, <strong>🇪🇸 España</strong> o <strong>🇨🇴 Colombia</strong>. Al cambiar el filtro, el streamer del día cambia también para esa región.
          </p>
        </div>

        {/* Juegos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {games.map(game => (
            <div key={game.slug} style={{
              background: 'var(--bg-secondary)', borderRadius: '14px',
              border: `1px solid var(--color-border)`,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '4px',
                background: `linear-gradient(90deg, ${game.color}, transparent)`,
              }} />
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
      </main>
    </div>
  );
}