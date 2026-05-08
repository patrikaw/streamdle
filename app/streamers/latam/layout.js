import { STREAMERS } from '../../../data/streamers';

export const metadata = {
  title: 'Streamers LATAM — Ranking Twitch y Kick Latinoamérica',
  description: 'Ranking completo de streamers latinoamericanos de Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana.',
  keywords: 'streamers latinoamerica, streamers latam twitch, streamers hispanos latam, mejores streamers latinoamerica, streamers habla hispana',
  openGraph: {
    title: 'Streamers LATAM — Ranking Twitch y Kick Latinoamérica',
    description: 'Ranking completo de streamers latinoamericanos de Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana.',
    url: 'https://streamdle.net/streamers/latam',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers LATAM — Ranking Twitch y Kick Latinoamérica',
    description: 'Ranking completo de streamers latinoamericanos de Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/latam',
  },
};

const LATAM_CODES = ['AR','MX','PE','CO','CL','SV','PR','VE','UY','GT','DO','FR','NO'];

export default function Layout({ children }) {
  const streamers = STREAMERS
    .filter(s => LATAM_CODES.includes(s.country))
    .sort((a, b) => Number(b.total_followers) - Number(a.total_followers));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Streamers LATAM',
    url: 'https://streamdle.net/streamers/latam',
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
