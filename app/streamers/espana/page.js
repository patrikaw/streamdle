import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Españoles — Ranking Twitch & Kick',
  description: 'Ibai, Auronplay, Rubius, TheGrefg y toda la escena española. El ranking completo de streamers de España en Twitch y Kick.',
  keywords: ['streamers españoles', 'streamers twitch españa', 'streamers españa', 'ibai auronplay rubius', 'streamers kick españa', 'mejores streamers españoles'],
  openGraph: {
    title: 'Streamers de España · Del Velada al ESLAND',
    description: 'Los streamers más grandes del español están en España. Ibai, Auronplay, Rubius, TheGrefg, IlloJuan y mucho más. ¿Cuánto sabés de la escena?',
    url: 'https://streamdle.net/streamers/espana',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de España · Del Velada al ESLAND',
    description: 'Los streamers más grandes del español están en España. Ibai, Auronplay, Rubius, TheGrefg, IlloJuan y mucho más. ¿Cuánto sabés de la escena?',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/espana' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://streamdle.net/' },
    { '@type': 'ListItem', position: 2, name: 'Streamers', item: 'https://streamdle.net/streamers' },
    { '@type': 'ListItem', position: 3, name: 'España', item: 'https://streamdle.net/streamers/espana' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <StreamersIndex
        defaultCountry="ES"
        pageTitle="Streamers de España"
        pageDesc="Explorá el ranking completo de streamers españoles en Twitch y Kick. Desde Ibai, Auronplay y Rubius hasta streamers emergentes. Más de 80 streamers de España."
        breadcrumbLabel="España"
        canonicalSlug="españa"
      />
    </>
  );
}
