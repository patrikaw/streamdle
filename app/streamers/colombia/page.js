import StreamersIndex from '../StreamersIndex';

export const metadata = {
  title: 'Streamers Colombianos — Ranking Twitch & Kick',
  description: 'WestCOL, mrstiventc y la escena colombiana de Twitch y Kick. Explorá el ranking con stats, trivia y clips de los streamers de Colombia.',
  keywords: ['streamers colombianos', 'streamers twitch colombia', 'westcol', 'streamers colombia', 'free fire colombia', 'mejores streamers colombia'],
  openGraph: {
    title: 'Streamers de Colombia · WestCOL y la escena local',
    description: 'Colombia tiene Free Fire, Warzone y puro carisma. WestCOL, mrstiventc y todos los creadores colombianos en un solo ranking.',
    url: 'https://streamdle.net/streamers/colombia',
  },
  twitter: {
    card: 'summary',
    title: 'Streamers de Colombia · WestCOL y la escena local',
    description: 'Colombia tiene Free Fire, Warzone y puro carisma. WestCOL, mrstiventc y todos los creadores colombianos en un solo ranking.',
  },
  alternates: { canonical: 'https://streamdle.net/streamers/colombia' },
};

export default function Page() {
  return (
    <StreamersIndex
      defaultCountry="CO"
      pageTitle="Streamers de Colombia"
      pageDesc="Explorá los streamers colombianos en Twitch y Kick. La Liendra, JhDeLaCruz, Pelicanger y más."
      breadcrumbLabel="Colombia"
      canonicalSlug="colombia"
    />
  );
}
