import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Argentinos — Ranking Twitch & Kick',
  description: 'ElSpreen, Robleis, el Kun Agüero y la hermandad argentina. El ranking completo de streamers de Argentina en Twitch y Kick.',
  keywords: ['streamers argentinos', 'streamers twitch argentina', 'elspreen', 'coscu', 'kun agüero streamer', 'mejores streamers argentina'],
  openGraph: {
    title: 'Streamers de Argentina · La hermandad del stream',
    description: 'La escena argentina tiene identidad propia: ElSpreen, Robleis, Coscu, el Kun Agüero. Explorá el ranking completo de Argentina.',
    url: 'https://streamdle.net/streamers/argentina',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de Argentina · La hermandad del stream',
    description: 'La escena argentina tiene identidad propia: ElSpreen, Robleis, Coscu, el Kun Agüero. Explorá el ranking completo de Argentina.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/argentina' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://streamdle.net/' },
    { '@type': 'ListItem', position: 2, name: 'Streamers', item: 'https://streamdle.net/streamers' },
    { '@type': 'ListItem', position: 3, name: 'Argentina', item: 'https://streamdle.net/streamers/argentina' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <StreamersIndex
        defaultCountry="AR"
        pageTitle="Streamers de Argentina"
        pageDesc="Explorá el ranking completo de streamers argentinos en Twitch y Kick. Desde Spreen, Coscu y Robleis hasta streamers emergentes. Filtrá por seguidores, peak viewers u horas de stream."
        breadcrumbLabel="Argentina"
        canonicalSlug="argentina"
      />
    </>
  );
}
