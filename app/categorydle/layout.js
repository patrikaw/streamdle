const title = 'Categorydle — Adiviná las Categorías del Streamer';
const description = 'Adiviná las 2 categorías que más streameó el streamer del día. ¿Conocés sus juegos favoritos?';

export const metadata = {
  title,
  description,
  keywords: 'categorias streamer twitch, adivinar juego streamer, wordle categorias twitch',
  openGraph: {
    title,
    description,
    url: 'https://streamdle.net/categorydle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://streamdle.net/og-image.jpg'],
  },
};
export default function Layout({ children }) { return children; }
