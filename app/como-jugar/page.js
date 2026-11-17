'use client';

import { claro, textoSobre } from '../../lib/colores';

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
      name: 'Edadle',
      emoji: '🎂',
      color: '#DB2777',
      slug: '/edadle',
      description: 'Adiviná cuántos años tiene el streamer del día.',
      steps: [
        'Se muestra un streamer con su foto, su categoría y sus seguidores',
        'Escribí la edad que creés que tiene',
        'En el primer intento solo te decimos que no es esa edad. Desde el segundo te decimos si es mayor o menor, y desde el tercero qué tan cerca estás',
        'Si seguís fallando se desbloquean pistas: su generación y su signo',
        'Tenés 6 intentos. ¡Un nuevo streamer cada día!',
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
                        fontSize: '11px', fontWeight: '700', color: claro(game.color), flexShrink: 0,
                      }}>{i + 1}</div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
                <a href={game.slug} style={{
                  display: 'inline-block', marginTop: '16px',
                  background: game.color, color: textoSobre(game.color),
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
              style={{ color: 'var(--color-green)', textDecoration: 'underline', fontWeight: '700' }}>
              Pato Wnuk
            </a>{' '}
            para la comunidad de streamers hispanohablantes. Nació en 2025 como un Wordle de streamers
            y creció hasta convertirse en una plataforma con 7 juegos diarios, fichas de streamers,
            estadísticas y cultura streamer en español. No estamos afiliados con Twitch, Kick ni YouTube.
            Si querés sugerir un streamer, reportar un error o colaborar,{' '}
            <a href="/contacto" style={{ color: 'var(--color-purple-light)', textDecoration: 'underline' }}>
              escribinos por acá
            </a>.
          </p>
        </div>
      </main>

    </div>
  );
}