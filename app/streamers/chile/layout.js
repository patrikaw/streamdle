import { STREAMERS } from '../../../data/streamers';

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
  const streamers = STREAMERS
    .filter(s => s.country === 'CL')
    .sort((a, b) => Number(b.total_followers) - Number(a.total_followers));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Streamers Chilenos',
    url: 'https://streamdle.net/streamers/chile',
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
