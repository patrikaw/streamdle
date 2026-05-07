export const metadata = {
  title: 'Streamers Peruanos — Ranking Twitch y Kick',
  description: 'Ranking de streamers peruanos de Twitch y Kick. ElZeein, SandraSkins y más streamers de Perú.',
  keywords: 'streamers peruanos, streamers peru twitch, mejores streamers peru, elzeein, sandraskins',
  openGraph: {
    title: 'Streamers Peruanos — Ranking Twitch y Kick',
    description: 'Ranking de streamers peruanos de Twitch y Kick. ElZeein, SandraSkins y más streamers de Perú.',
    url: 'https://streamdle.net/streamers/peru',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers Peruanos — Ranking Twitch y Kick',
    description: 'Ranking de streamers peruanos de Twitch y Kick. ElZeein, SandraSkins y más streamers de Perú.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/peru',
  },
};

export default function Layout({ children }) {
  return children;
}
