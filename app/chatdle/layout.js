export const metadata = {
  title: 'Chatdle — Adiviná el Streamer por su Frase Icónica',
  description: 'Una frase del streamer hispano del día. ¿La reconocés? Adiviná al hispanohablante solo con su catchphrase antes de quedarte sin intentos.',
  keywords: ['chatdle', 'adivinar streamer por frase', 'catchphrase streamers twitch', 'frases streamers español', 'chatdle hispano', 'frases icónicas streamers'],
  openGraph: {
    title: 'Chatdle · ¿Reconocés la frase del streamer del día?',
    description: 'Una frase icónica, un streamer hispano. Adiviná quién la dijo antes de agotar los intentos.',
    url: 'https://streamdle.net/chatdle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatdle · ¿Reconocés la frase del streamer del día?',
    description: 'Una frase icónica, un streamer hispano. Adiviná quién la dijo antes de agotar los intentos.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/chatdle' },
};
export default function Layout({ children }) { return children; }
