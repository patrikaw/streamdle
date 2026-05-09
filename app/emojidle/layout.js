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
export default function Layout({ children }) { return children; }
