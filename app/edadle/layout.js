import JuegoSEO from '../components/JuegoSEO';
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
const SEO = {"nombre": "Edadle", "intro": "Edadle te muestra un streamer hispano y tenés que adivinar cuántos años tiene. Con cada intento recibís pistas hasta acertar la edad exacta.", "reglas": ["Escribí la edad que creés que tiene el streamer.", "Desde el segundo intento te decimos si es mayor o menor, y desde el tercero qué tan cerca estás.", "Tenés 6 intentos y el streamer cambia todos los días."], "preguntas": [["¿Qué es Edadle?", "Es un juego diario donde se adivina la edad de un streamer hispano de Twitch o Kick."], ["¿Cuántos intentos hay?", "Tenés 6 intentos por día."], ["¿Qué pistas hay?", "Si es mayor o menor, qué tan cerca estás, y la generación y el signo si seguís fallando."], ["¿Dónde veo la edad de un streamer?", "En la ficha de cada streamer de Streamdle figura su edad y fecha de nacimiento cuando es pública."]]};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <JuegoSEO href="/edadle" {...SEO} />
    </>
  );
}
