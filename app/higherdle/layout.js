import JuegoSEO from '../components/JuegoSEO';
export const metadata = {
  title: 'Higherdle — Compará Streamers por Seguidores y Stats',
  description: '¿Quién tiene más seguidores, más horas en vivo o más peak viewers? Compará streamers hispanos y adiviná quién gana en cada stat.',
  keywords: ['higherdle', 'comparar streamers', 'mas seguidores twitch', 'higher lower streamers', 'higherdle hispano', 'streamers estadisticas twitch'],
  openGraph: {
    title: 'Higherdle · ¿Quién tiene más? Compará streamers hispanos',
    description: 'Higher or lower con streamers de Twitch y Kick: followers, peak viewers, horas. ¿Sabés quién gana?',
    url: 'https://streamdle.net/higherdle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Higherdle · ¿Quién tiene más? Compará streamers hispanos',
    description: 'Higher or lower con streamers de Twitch y Kick: followers, peak viewers, horas. ¿Sabés quién gana?',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/higherdle' },
};
const SEO = {"nombre": "Higherdle", "intro": "Higherdle es un juego de comparar: te mostramos dos streamers hispanos y tenés que decidir cuál tiene más seguidores, más horas en vivo o más peak de espectadores.", "reglas": ["Elegí el modo: seguidores, horas en stream o peak de espectadores.", "Tocá el streamer que creés que tiene el número más alto.", "Si acertás, seguís sumando racha; si fallás, termina la partida."], "preguntas": [["¿Qué es Higherdle?", "Es un juego infinito de mayor o menor entre streamers hispanos de Twitch y Kick."], ["¿Qué se puede comparar?", "Seguidores, horas transmitidas y peak de espectadores."], ["¿Hay límite de partidas?", "No, es infinito: podés jugar todas las veces que quieras."], ["¿Los datos son reales?", "Sí, se actualizan cada 15 días con las cifras públicas de Twitch y Kick."]]};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <JuegoSEO href="/higherdle" h1Oculto="Higherdle: ¿quién tiene más seguidores, horas o peak?" {...SEO} />
    </>
  );
}
