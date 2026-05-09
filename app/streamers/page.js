import StreamersIndex from './StreamersIndex';

export const metadata = {
  title: 'Ranking de Streamers Hispanohablantes — Twitch & Kick',
  description: 'Más de 190 streamers en español ordenados por seguidores, peak viewers y horas. Filtrá por España, Argentina, México, Colombia y más.',
  keywords: ['ranking streamers español', 'streamers hispanohablantes', 'streamers twitch ranking', 'mejores streamers español', 'streamers kick ranking', 'streamers hispanos lista'],
  openGraph: {
    title: 'Streamers Hispanos · El ranking completo de Twitch & Kick',
    description: '190+ streamers en español con stats reales. Seguidores, peak viewers, horas en vivo y más — todo filtrable por país.',
    url: 'https://streamdle.net/streamers',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers Hispanos · El ranking completo de Twitch & Kick',
    description: '190+ streamers en español con stats reales. Seguidores, peak viewers, horas en vivo y más — todo filtrable por país.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers' },
};

export default function Page() {
  return (
    <StreamersIndex
      defaultCountry="ALL"
      pageTitle="Streamers Hispanohablantes"
      pageDesc="Explorá los más de 190 streamers en español de Twitch y Kick. Filtrá por país, ordená por seguidores, peak viewers, horas y más."
      breadcrumbLabel={null}
      canonicalSlug=""
    />
  );
}
