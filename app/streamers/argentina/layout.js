import { STREAMERS } from '../../../data/streamers';

export const metadata = {
  title: 'Streamers Argentinos — Ranking Twitch y Kick',
  description: 'Ranking completo de streamers argentinos de Twitch y Kick. Explorá a Spreen, Coscu, Momo, Robleis, Carreraaa y más de 40 streamers de Argentina ordenados por seguidores, peak viewers y horas.',
  keywords: 'streamers argentinos, streamers argentina twitch, streamers argentina kick, mejores streamers argentina, spreen, coscu, robleis, carreraaa, streamers hispanohablantes argentina',
  openGraph: {
    title: 'Streamers Argentinos — Ranking Twitch y Kick',
    description: 'Ranking completo de streamers argentinos de Twitch y Kick. Explorá a Spreen, Coscu, Momo, Robleis, Carreraaa y más de 40 streamers de Argentina ordenados por seguidores, peak viewers y horas.',
    url: 'https://streamdle.net/streamers/argentina',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers Argentinos — Ranking Twitch y Kick',
    description: 'Ranking completo de streamers argentinos de Twitch y Kick. Explorá a Spreen, Coscu, Momo, Robleis, Carreraaa y más de 40 streamers de Argentina ordenados por seguidores, peak viewers y horas.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/argentina',
  },
};

export default function Layout({ children }) {
  const streamers = STREAMERS
    .filter(s => s.country === 'AR')
    .sort((a, b) => Number(b.total_followers) - Number(a.total_followers));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Streamers Argentinos',
    url: 'https://streamdle.net/streamers/argentina',
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
