export const metadata = {
  title: 'Streamers Chilenos — Ranking Twitch y Kick',
  description: 'Ranking de streamers chilenos de Twitch y Kick. Los mejores streamers de Chile ordenados por seguidores y peak viewers.',
  keywords: 'streamers chilenos, streamers chile twitch, mejores streamers chile, streamers hispanohablantes chile',
  openGraph: {
    title: 'Streamers Chilenos — Ranking Twitch y Kick',
    description: 'Ranking de streamers chilenos de Twitch y Kick. Los mejores streamers de Chile ordenados por seguidores y peak viewers.',
    url: 'https://streamdle.net/streamers/chile',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers Chilenos — Ranking Twitch y Kick',
    description: 'Ranking de streamers chilenos de Twitch y Kick. Los mejores streamers de Chile ordenados por seguidores y peak viewers.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/chile',
  },
};

export default function Layout({ children }) {
  return children;
}
