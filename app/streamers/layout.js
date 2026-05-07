export const metadata = {
  title: 'Streamers en Español — Ranking Twitch y Kick | Streamdle',
  description: 'Ranking completo de streamers hispanohablantes de Twitch y Kick. Más de 190 streamers de España, Argentina, México, Perú, Colombia y Chile. Filtrá por país, ordená por seguidores, peak viewers u horas de stream.',
  keywords: 'streamers en español, streamers twitch españa, streamers argentinos, streamers mexicanos, ranking streamers hispanohablantes, mejores streamers twitch, streamers kick español, streamers hispanos, lista streamers español',
  openGraph: {
    title: 'Streamers en Español — Ranking completo Twitch y Kick',
    description: 'Explorá el ranking de más de 190 streamers hispanohablantes. Filtrá por país, ordená por seguidores o peak viewers.',
    url: 'https://streamdle.net/streamers',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers en Español — Ranking Twitch y Kick',
    description: 'Más de 190 streamers hispanohablantes. Filtrá por país y ordená como quieras.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers',
  },
};

export default function Layout({ children }) {
  return children;
}
