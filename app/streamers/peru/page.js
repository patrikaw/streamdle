import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Peruanos — Ranking Twitch & Kick',
  description: 'ElZeein, AQUINO, CapitanGatoo y la escena de Perú en Twitch y Kick. Stats, trivia y clips de los streamers peruanos.',
  keywords: ['streamers peruanos', 'streamers twitch peru', 'elzeein', 'streamers peru', 'twitch peru', 'mejores streamers peru'],
  openGraph: {
    title: 'Streamers de Perú · Dota, GTA y cultura gamer',
    description: 'Perú tiene una escena gamer única: Dota 2, Minecraft y puro carisma. ElZeein, AQUINO y toda la comunidad peruana en un lugar.',
    url: 'https://streamdle.net/streamers/peru',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de Perú · Dota, GTA y cultura gamer',
    description: 'Perú tiene una escena gamer única: Dota 2, Minecraft y puro carisma. ElZeein, AQUINO y toda la comunidad peruana en un lugar.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/peru' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://streamdle.net/' },
    { '@type': 'ListItem', position: 2, name: 'Streamers', item: 'https://streamdle.net/streamers' },
    { '@type': 'ListItem', position: 3, name: 'Perú', item: 'https://streamdle.net/streamers/peru' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <StreamersIndex
        defaultCountry="PE"
        pageTitle="Streamers de Perú"
        pageDesc="Explorá los streamers peruanos en Twitch y Kick. ElZeein, SandraSkins y más."
        breadcrumbLabel="Perú"
        canonicalSlug="peru"
      />
    </>
  );
}
