import { STREAMERS } from '../../../data/streamers';

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
  const streamers = STREAMERS
    .filter(s => s.country === 'PE')
    .sort((a, b) => Number(b.total_followers) - Number(a.total_followers));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Streamers Peruanos',
    url: 'https://streamdle.net/streamers/peru',
    numberOfItems: streamers.length,
    itemListElement: streamers.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.display_name,
      url: `https://streamdle.net/${s.display_name.toLowerCase().replace(/\s+/g, '-')}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
