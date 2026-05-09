import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Mexicanos — Ranking Twitch & Kick',
  description: 'JuanSGuarnizo, ElMariana, AriGameplays y la explosión creativa de México. Ranking de streamers mexicanos en Twitch y Kick.',
  keywords: ['streamers mexicanos', 'streamers twitch mexico', 'juansguarnizo', 'elmariana', 'arigameplays', 'mejores streamers mexico'],
  openGraph: {
    title: 'Streamers de México · Carisma, QSMP y mucho más',
    description: 'México tiene el mejor humor y los eventos más locos del stream. JuanS, ElMariana, Ari y toda la escena en un solo lugar.',
    url: 'https://streamdle.net/streamers/mexico',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de México · Carisma, QSMP y mucho más',
    description: 'México tiene el mejor humor y los eventos más locos del stream. JuanS, ElMariana, Ari y toda la escena en un solo lugar.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/mexico' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://streamdle.net/' },
    { '@type': 'ListItem', position: 2, name: 'Streamers', item: 'https://streamdle.net/streamers' },
    { '@type': 'ListItem', position: 3, name: 'México', item: 'https://streamdle.net/streamers/mexico' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <StreamersIndex
        defaultCountry="MX"
        pageTitle="Streamers de México"
        pageDesc="Explorá el ranking completo de streamers mexicanos en Twitch y Kick. Desde JuanSGuarnizo, ElMariana y AriGameplays hasta streamers emergentes. Más de 30 streamers de México."
        breadcrumbLabel="México"
        canonicalSlug="mexico"
      />
    </>
  );
}
