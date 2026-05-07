export const metadata = {
  title: 'Streamers Españoles — Ranking Twitch y Kick',
  description: 'Ranking completo de streamers españoles de Twitch y Kick. Ibai, Auronplay, Rubius, TheGrefg, IlloJuan y más de 80 streamers de España ordenados por seguidores, peak viewers y horas.',
  keywords: 'streamers españoles, streamers españa twitch, mejores streamers españa, ibai, auronplay, rubius, thegrefg, illojuan, streamers hispanohablantes españa',
  openGraph: {
    title: 'Streamers Españoles — Ranking Twitch y Kick',
    description: 'Ranking completo de streamers españoles de Twitch y Kick. Ibai, Auronplay, Rubius, TheGrefg, IlloJuan y más de 80 streamers de España ordenados por seguidores, peak viewers y horas.',
    url: 'https://streamdle.net/streamers/espana',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers Españoles — Ranking Twitch y Kick',
    description: 'Ranking completo de streamers españoles de Twitch y Kick. Ibai, Auronplay, Rubius, TheGrefg, IlloJuan y más de 80 streamers de España ordenados por seguidores, peak viewers y horas.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/espana',
  },
};

export default function Layout({ children }) {
  return children;
}
