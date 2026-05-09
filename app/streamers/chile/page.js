import StreamersIndex from '../StreamersIndex';

export default function Page() {
  return (
    <StreamersIndex
      defaultCountry="CL"
      pageTitle="Streamers de Chile"
      pageDesc="Explorá los streamers chilenos en Twitch y Kick, ordenados por seguidores, peak viewers y horas de stream."
      breadcrumbLabel="Chile"
      canonicalSlug="chile"
    />
  );
}
