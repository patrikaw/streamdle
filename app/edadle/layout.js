export const metadata = {
  title: 'Edadle — Adiviná la Edad del Streamer',
  description: 'Te mostramos un streamer hispano y tenés 6 intentos para adivinar cuántos años tiene. Con pistas de más o menos y un streamer nuevo cada día.',
  keywords: ['edadle', 'adivinar edad streamer', 'cuántos años tiene streamer', 'edad de streamers', 'wordle streamers edad', 'juego streamers hispanos'],
  openGraph: {
    title: 'Edadle · ¿Cuántos años tiene el streamer de hoy?',
    description: 'Un streamer nuevo cada día. Adiviná su edad en 6 intentos con pistas de más o menos.',
    url: 'https://streamdle.net/edadle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edadle · ¿Cuántos años tiene el streamer de hoy?',
    description: 'Un streamer nuevo cada día. Adiviná su edad en 6 intentos con pistas de más o menos.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/edadle' },
};
export default function Layout({ children }) { return children; }
