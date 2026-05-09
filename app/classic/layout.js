export const metadata = {
  title: 'Streamdle Classic — Adiviná el Streamer del Día',
  description: 'Adiviná el streamer hispanohablante del día con pistas de país, categoría, seguidores, peak y plataformas. 8 intentos, nuevo reto cada día.',
  keywords: ['adivinar streamer', 'wordle streamers', 'streamer del dia', 'twitch wordle español', 'streamdle classic', 'juego streamers hispanos'],
  openGraph: {
    title: 'Streamdle Classic · ¿Podés adivinar al streamer del día?',
    description: 'Pistas de país, followers, categoría y más. El juego diario de streamers hispanos. ¿Cuántos intentos necesitás?',
    url: 'https://streamdle.net/classic',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamdle Classic · ¿Podés adivinar al streamer del día?',
    description: 'Pistas de país, followers, categoría y más. El juego diario de streamers hispanos. ¿Cuántos intentos necesitás?',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/classic' },
};
export default function Layout({ children }) { return children; }
