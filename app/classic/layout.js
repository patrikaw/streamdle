import JuegoSEO from '../components/JuegoSEO';
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
const SEO = {"nombre": "Streamdle Classic", "intro": "Streamdle Classic es el Wordle de streamers hispanos: cada día hay un streamer secreto de Twitch o Kick y tenés que adivinarlo con pistas que se comparan en cada intento.", "reglas": ["Escribí el nombre de un streamer y mirá qué columnas coinciden con el secreto: país, categoría, seguidores, horas en stream, estado activo y peak de espectadores.", "Las flechas te dicen si el valor del streamer secreto es mayor o menor.", "Tenés 8 intentos y el streamer cambia todos los días a la medianoche."], "preguntas": [["¿Qué es Streamdle Classic?", "Es un juego diario gratuito donde se adivina un streamer hispano de Twitch o Kick a partir de pistas como país, categoría, seguidores y peak de espectadores."], ["¿Cuántos intentos hay?", "Tenés 8 intentos por día."], ["¿Cuándo cambia el streamer?", "Todos los días a la medianoche, hora local."], ["¿Incluye streamers de Kick?", "Sí, el juego incluye streamers de Twitch y de Kick."]]};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <JuegoSEO href="/classic" {...SEO} />
    </>
  );
}
