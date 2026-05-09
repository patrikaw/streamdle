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
export default function Layout({ children }) { return children; }
