import JuegoSEO from '../components/JuegoSEO';
export const metadata = {
  title: 'Categorydle — Adiviná las Categorías del Streamer',
  description: '¿Sabés qué juegos transmite cada streamer hispano? Adiviná al streamer del día usando sus dos categorías favoritas en Twitch y Kick.',
  keywords: ['categorydle', 'adivinar streamer por categoría', 'categorias streamers twitch', 'wordle categorias', 'categorydle hispano', 'juegos streamers twitch'],
  openGraph: {
    title: 'Categorydle · ¿Sabés qué juega cada streamer hispano?',
    description: 'Dos categorías, un streamer. Adiviná al hispano del día solo con sus juegos favoritos de Twitch y Kick.',
    url: 'https://streamdle.net/categorydle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categorydle · ¿Sabés qué juega cada streamer hispano?',
    description: 'Dos categorías, un streamer. Adiviná al hispano del día solo con sus juegos favoritos de Twitch y Kick.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/categorydle' },
};
const SEO = {"nombre": "Categorydle", "intro": "En Categorydle te mostramos a un streamer hispano y tenés que adivinar sus dos categorías o juegos más transmitidos en Twitch y Kick.", "reglas": ["Escribí una categoría o juego y mirá si es la principal, la secundaria o ninguna de las dos.", "Tenés 8 intentos para encontrar las dos categorías del streamer.", "El streamer cambia todos los días."], "preguntas": [["¿Qué es Categorydle?", "Es un juego diario donde se adivinan las dos categorías más jugadas de un streamer hispano."], ["¿Cuántos intentos hay?", "Tenés 8 intentos por día."], ["¿De dónde salen las categorías?", "De los juegos y secciones que más transmite el streamer en Twitch y Kick."], ["¿Es gratis?", "Sí, todos los juegos de Streamdle son gratuitos."]]};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <JuegoSEO href="/categorydle" {...SEO} />
    </>
  );
}
