import JuegoSEO from '../components/JuegoSEO';
export const metadata = {
  title: 'Emojidle — Adiviná el Streamer por sus Emojis',
  description: 'Cada streamer tiene emojis únicos que lo representan. ¿Podés adivinar al hispanohablante del día antes de que se revelen todos?',
  keywords: ['emojidle', 'adivinar streamer emojis', 'streamers emojis juego', 'wordle emojis twitch', 'emojidle hispano', 'emojis streamers español'],
  openGraph: {
    title: 'Emojidle · ¿Qué streamer se esconde detrás de estos emojis?',
    description: 'Emojis únicos para cada streamer hispano. Se van revelando de a uno. ¿Cuántos necesitás para adivinar?',
    url: 'https://streamdle.net/emojidle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emojidle · ¿Qué streamer se esconde detrás de estos emojis?',
    description: 'Emojis únicos para cada streamer hispano. Se van revelando de a uno. ¿Cuántos necesitás para adivinar?',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/emojidle' },
};
const SEO = {"nombre": "Emojidle", "intro": "Emojidle representa a cada streamer hispano con una serie de emojis. Tenés que descubrir de quién se trata antes de que se revelen todos.", "reglas": ["Mirá los emojis del día y escribí el nombre del streamer que creés que representan.", "Cada intento fallido muestra más emojis.", "El streamer cambia todos los días."], "preguntas": [["¿Qué es Emojidle?", "Es un juego diario donde se adivina un streamer hispano a partir de emojis que lo representan."], ["¿Cuántos emojis se ven al principio?", "Empezás con pocos y se revelan más con cada intento fallido."], ["¿Cuándo cambia el streamer?", "Todos los días a la medianoche."], ["¿Se puede jugar por país?", "Sí, podés elegir un país para adivinar solo streamers de esa región."]]};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <JuegoSEO href="/emojidle" {...SEO} />
    </>
  );
}
