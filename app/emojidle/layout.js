const title = 'Emojidle — Adiviná el Streamer por sus Emojis';
const description = 'Adiviná qué streamer hispanohablante se esconde detrás de estos emojis. Un nuevo reto cada día.';

export const metadata = {
  title,
  description,
  keywords: 'adivinar streamer emojis, wordle emojis streamer, streamer emojis juego',
  openGraph: {
    title,
    description,
    url: 'https://streamdle.net/emojidle',
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
