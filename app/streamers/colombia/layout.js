import { STREAMERS } from '../../../data/streamers';

export const metadata = {
  title: 'Streamers Colombianos — Ranking Twitch y Kick',
  description: 'Ranking de streamers colombianos de Twitch y Kick. La Liendra, JhDeLaCruz, Pelicanger, LaSapaaaaa y más streamers de Colombia.',
  keywords: 'streamers colombianos, streamers colombia twitch, mejores streamers colombia, la liendra, jhdelacruz, pelicanger',
  openGraph: {
    title: 'Streamers Colombianos — Ranking Twitch y Kick',
    description: 'Ranking de streamers colombianos de Twitch y Kick. La Liendra, JhDeLaCruz, Pelicanger, LaSapaaaaa y más streamers de Colombia.',
    url: 'https://streamdle.net/streamers/colombia',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers Colombianos — Ranking Twitch y Kick',
    description: 'Ranking de streamers colombianos de Twitch y Kick. La Liendra, JhDeLaCruz, Pelicanger, LaSapaaaaa y más streamers de Colombia.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/colombia',
  },
};

export default function Layout({ children }) {
  const streamers = STREAMERS
    .filter(s => s.country === 'CO')
    .sort((a, b) => Number(b.total_followers) - Number(a.total_followers));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Streamers Colombianos',
    url: 'https://streamdle.net/streamers/colombia',
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
