const title = 'Chatdle — Adiviná el Streamer por su Frase';
const description = 'Adiviná qué streamer hispanohablante dijo esta frase icónica. Un nuevo streamer cada día.';

export const metadata = {
  title,
  description,
  keywords: 'frases streamers twitch, adivinar streamer frase, catchphrase streamer español',
  openGraph: {
    title,
    description,
    url: 'https://streamdle.net/chatdle',
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
