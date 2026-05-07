import StreamersIndex from '../StreamersIndex';

export default function Page() {
  return (
    <StreamersIndex
      defaultCountry="LATAM"
      pageTitle="Streamers de LATAM"
      pageDesc="Explorá el ranking de streamers latinoamericanos en Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana."
      breadcrumbLabel="🌎 LATAM"
      canonicalSlug="latam"
    />
  );
}
