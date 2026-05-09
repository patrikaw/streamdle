import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Latinoamericanos — Twitch & Kick',
  description: 'JuanSGuarnizo, ElSpreen, ElMariana y lo mejor del streaming latino. Descubrí el ranking de streamers de LATAM en Twitch y Kick.',
  keywords: ['streamers latinoamericanos', 'streamers latam', 'streamers twitch latam', 'streaming latino', 'streamers hispanos', 'mejores streamers latam'],
  openGraph: {
    title: 'Streamers de LATAM · Lo mejor del stream latino',
    description: 'Desde Argentina hasta México, LATAM tiene los streamers más creativos del mundo hispano. JuanS, ElSpreen, ElMariana y muchos más.',
    url: 'https://streamdle.net/streamers/latam',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de LATAM · Lo mejor del stream latino',
    description: 'Desde Argentina hasta México, LATAM tiene los streamers más creativos del mundo hispano. JuanS, ElSpreen, ElMariana y muchos más.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/latam' },
};

export default function Page() {
  return (
    <StreamersIndex
      defaultCountry="LATAM"
      pageTitle="Streamers de LATAM"
      pageDesc="Explorá el ranking de streamers latinoamericanos en Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana."
      breadcrumbLabel="LATAM"
      canonicalSlug="latam"
    />
  );
}
