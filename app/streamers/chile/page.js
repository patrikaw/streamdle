import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Chilenos — Ranking Twitch & Kick',
  description: 'Germán Garmendia, DylanteroLIVE, LaChilenaBelu y la escena de Chile en Twitch. Stats, trivia y clips de los streamers chilenos.',
  keywords: ['streamers chilenos', 'streamers twitch chile', 'german garmendia', 'streamers chile', 'twitch chile', 'mejores streamers chile'],
  openGraph: {
    title: 'Streamers de Chile · Germán y la nueva escena',
    description: 'Chile tiene desde el OG Germán Garmendia hasta la nueva generación del stream. Explorá el ranking completo de streamers chilenos.',
    url: 'https://streamdle.net/streamers/chile',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de Chile · Germán y la nueva escena',
    description: 'Chile tiene desde el OG Germán Garmendia hasta la nueva generación del stream. Explorá el ranking completo de streamers chilenos.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/chile' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://streamdle.net/' },
    { '@type': 'ListItem', position: 2, name: 'Streamers', item: 'https://streamdle.net/streamers' },
    { '@type': 'ListItem', position: 3, name: 'Chile', item: 'https://streamdle.net/streamers/chile' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <StreamersIndex
        defaultCountry="CL"
        pageTitle="Streamers de Chile"
        pageDesc="Explorá los streamers chilenos en Twitch y Kick, ordenados por seguidores, peak viewers y horas de stream."
        breadcrumbLabel="Chile"
        canonicalSlug="chile"
      />
    </>
  );
}
