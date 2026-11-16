import JuegoSEO from '../components/JuegoSEO';
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
const SEO = {"nombre": "Chatdle", "intro": "Chatdle te muestra una frase icónica de un streamer hispano y tenés que adivinar de quién es. Es el juego de frases de Streamdle, con un reto nuevo cada día.", "reglas": ["Leé la frase del día y escribí el nombre del streamer que creés que la dice.", "Si fallás, se desbloquean pistas para ayudarte.", "Tenés 6 intentos y la frase cambia todos los días."], "preguntas": [["¿Qué es Chatdle?", "Es un juego diario donde se adivina a qué streamer hispano pertenece una frase típica o catchphrase."], ["¿Cuántos intentos tengo en Chatdle?", "Tenés 6 intentos por día."], ["¿Hay frases de streamers de Kick?", "Sí, entran streamers de Twitch y de Kick con frase registrada."], ["¿Se puede jugar por país?", "Sí, podés filtrar para adivinar solo streamers de España, Argentina, México y otros países."]]};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <JuegoSEO href="/chatdle" {...SEO} />
    </>
  );
}
