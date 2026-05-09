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
export default function Layout({ children }) { return children; }
