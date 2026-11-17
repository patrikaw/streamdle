import JuegoSEO from '../components/JuegoSEO';
export const metadata = {
  title: 'Avatardle — Adiviná el Streamer por su Foto',
  description: 'La foto del streamer empieza pixelada y se va aclarando con cada intento. ¿Reconocés la cara del streamer hispano antes que nadie?',
  keywords: ['avatardle', 'adivinar streamer por foto', 'streamer foto pixelada', 'wordle foto streamer', 'avatardle hispano', 'streamer pixelado twitch'],
  openGraph: {
    title: 'Avatardle · ¿Reconocés al streamer por su foto pixelada?',
    description: 'La foto empieza pixelada. Cada intento la aclara un poco más. ¿Podés adivinar al streamer hispano antes de agotar los intentos?',
    url: 'https://streamdle.net/avatardle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avatardle · ¿Reconocés al streamer por su foto pixelada?',
    description: 'La foto empieza pixelada. Cada intento la aclara un poco más. ¿Podés adivinar al streamer hispano antes de agotar los intentos?',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/avatardle' },
};
const SEO = {"nombre": "Avatardle", "intro": "En Avatardle se muestra la foto de perfil de un streamer hispano que se va aclarando a medida que fallás. ¿Lo reconocés antes de quedarte sin intentos?", "reglas": ["Los primeros 4 intentos la foto se ve en blanco y negro y pixelada.", "Con cada intento fallido la imagen se vuelve más nítida.", "Tenés 6 intentos y el streamer cambia todos los días."], "preguntas": [["¿Qué es Avatardle?", "Es un juego diario donde se adivina un streamer hispano a partir de su foto de perfil, que empieza pixelada."], ["¿Cuántos intentos hay?", "Tenés 6 intentos por día."], ["¿La foto cambia?", "Sí, cada día hay un streamer nuevo y la imagen se va aclarando con cada error."], ["¿Incluye streamers de Kick?", "Sí, aparecen streamers de Twitch y de Kick."]]};
export default function Layout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://static-cdn.jtvnw.net" crossOrigin="anonymous" />
      {children}
      <JuegoSEO href="/avatardle" {...SEO} />
    </>
  );
}
