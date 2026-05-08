const title = 'Streamdle Classic — Adiviná el Streamer del Día';
const description = 'Adiviná el streamer del día hispanohablante con pistas de país, categoría, seguidores y más. El Wordle de streamers en español.';

export const metadata = {
  title,
  description,
  keywords: 'adivinar streamer, wordle streamers, streamer del dia, twitch wordle español',
  openGraph: {
    title,
    description,
    url: 'https://streamdle.net/classic',
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
