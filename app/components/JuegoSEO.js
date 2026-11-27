import Link from 'next/link';
import { STREAMERS } from '../../data/streamers';
import Anuncio, { SLOTS } from './Anuncio';

const OTROS = [
  ['/classic', '🎯 Streamdle Classic'], ['/chatdle', '💬 Chatdle'], ['/avatardle', '👤 Avatardle'], ['/emojidle', '😂 Emojidle'],
  ['/edadle', '🎂 Edadle'], ['/higherdle', '📊 Higherdle'], ['/categorydle', '🎮 Categorydle'],
];

const PAISES = {
  ES: 'España', AR: 'Argentina', MX: 'México', CO: 'Colombia', PE: 'Perú', CL: 'Chile', VE: 'Venezuela', UY: 'Uruguay',
  SV: 'El Salvador', GT: 'Guatemala', PR: 'Puerto Rico', DO: 'República Dominicana', CU: 'Cuba', EC: 'Ecuador', BO: 'Bolivia',
};

// Qué streamers pueden salir en cada juego (los mismos criterios que usa el juego).
const POOL = {
  '/classic': () => true,
  '/avatardle': () => true,
  '/chatdle': (s) => !!(s.catchphrase && s.catchphrase.trim()),
  '/emojidle': (s) => !!(s.emojis && String(s.emojis).trim()),
  '/categorydle': (s) => !!(s.top_category && s.second_category && s.second_category !== ''),
  '/edadle': (s) => !!(s.birth_year && s.birth_month && s.birth_day),
  '/higherdle': () => true,
};

const CONSEJOS = {
  '/classic': ['Empezá con un streamer muy conocido: te da de entrada país, categoría y plataforma, y descarta a muchos.', 'Mirá las flechas de seguidores, horas y peak: el streamer secreto casi nunca está en los extremos.', 'Si la categoría coincide, buscá streamers que jueguen lo mismo pero con distinto tamaño de audiencia.'],
  '/chatdle': ['Fijate en el tono de la frase: el humor, las muletillas y el país de origen suelen delatar al streamer.', 'Con cada intento fallido se desbloquea una pista; usalas antes de arriesgar un nombre.', 'Si dudás entre dos, elegí al que más se asocie con esa expresión en su comunidad.'],
  '/avatardle': ['Aunque la imagen esté pixelada, los colores y el encuadre dicen mucho: fijate si es un logo, una cara o un personaje.', 'Los primeros 4 intentos son en blanco y negro: no descartes a alguien solo por el color.', 'Muchos streamers usan el mismo avatar durante años, así que repasar sus redes ayuda.'],
  '/emojidle': ['Los emojis resumen su contenido: un juego, una comida, un animal o una muletilla.', 'Cada intento fallido revela más emojis, así que el orden también puede ser una pista.', 'Pensá en el juego o la categoría que más se asocia al streamer antes que en su cara.'],
  '/edadle': ['Empezá por el medio (unos 25 años) para recortar el rango rápido: desde el segundo intento sabés si es mayor o menor.', 'La generación y el signo, que aparecen si fallás, acotan el año de nacimiento.', 'Pensá en cuándo empezó a ser conocido: muchos streamers de Twitch nacieron entre 1990 y 2003.'],
  '/higherdle': ['Los seguidores suelen crecer más rápido que las horas transmitidas: no siempre el más grande es el que más transmitió.', 'En el modo de peak, los picos dependen de eventos puntuales como La Velada o Stream Fighters.', 'Si dos streamers parecen parecidos, pensá en cuál tiene más años transmitiendo.'],
  '/categorydle': ['Empezá por categorías muy generales como Just Chatting: casi todos los streamers pasan por ahí.', 'El juego te dice si una categoría es la principal, la secundaria o ninguna: usalo para descartar.', 'Pensá en los hábitos del streamer: si hace directos largos suele variar, y si es competitivo suele repetir un juego.'],
};

// Texto visible bajo cada juego: reglas, consejos, cuántos streamers participan y preguntas frecuentes.
export default function JuegoSEO({ href, nombre, intro, reglas, preguntas, h1Oculto }) {
  const filtro = POOL[href] || (() => true);
  const pool = STREAMERS.filter(filtro);
  const porPais = Object.entries(pool.reduce((a, s) => ({ ...a, [s.country]: (a[s.country] || 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, n]) => `${PAISES[c] || c} (${n})`);
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const consejos = CONSEJOS[href] || [];
  const h2 = { fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 };
  return (
    <section style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--color-border)', padding: '32px 16px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
        {h1Oculto && <h1 className="sr-only">{h1Oculto}</h1>}
        <Anuncio slot={SLOTS.juegos} style={{ marginTop: 0, marginBottom: 28 }} />
        <h2 style={h2}>Cómo se juega a {nombre}</h2>
        <p style={{ marginBottom: 12 }}>{intro}</p>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          {reglas.map((r) => <li key={r}>{r}</li>)}
        </ul>
        {consejos.length > 0 && (
          <>
            <h2 style={h2}>Consejos para ganar</h2>
            <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
              {consejos.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </>
        )}
        <h2 style={h2}>A quiénes vas a adivinar</h2>
        <p style={{ marginBottom: 20 }}>
          {nombre} incluye {pool.length} streamers hispanos de Twitch y Kick{porPais.length ? `, sobre todo de ${porPais.join(', ')}` : ''}. La base se actualiza cada 15 días y se suman streamers nuevos de forma regular.
        </p>
        <h2 style={h2}>Preguntas frecuentes</h2>
        {preguntas.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>{q}</h3>
            <p style={{ margin: 0 }}>{a}</p>
          </div>
        ))}
        <h2 style={{ ...h2, margin: '20px 0 10px' }}>Más juegos de Streamdle</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {OTROS.filter(([h]) => h !== href).map(([h, l]) => (
            <a key={h} href={h} style={{ fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', background: 'var(--bg-card)' }}>{l}</a>
          ))}
          <Link href="/tendencias" style={{ fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', background: 'var(--bg-card)' }}>🔥 Streamers en tendencia</Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </section>
  );
}
