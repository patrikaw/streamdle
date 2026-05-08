const title = 'Avatardle — Adiviná el Streamer por su Foto';
const description = 'Adiviná el streamer hispanohablante por su foto de perfil pixelada. ¿Podés reconocerlo antes de que se aclare?';

export const metadata = {
  title,
  description,
  keywords: 'adivinar streamer foto, wordle foto streamer, streamer pixelado',
  openGraph: {
    title,
    description,
    url: 'https://streamdle.net/avatardle',
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
