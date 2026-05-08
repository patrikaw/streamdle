const title = 'Higherdle — Higher or Lower de Streamers';
const description = '¿Quién tiene más seguidores, horas en stream o peak viewers? El Higher or Lower de streamers de Twitch y Kick en español.';

export const metadata = {
  title,
  description,
  keywords: 'higher lower streamers, quien tiene mas seguidores twitch, higher or lower twitch kick español',
  openGraph: {
    title,
    description,
    url: 'https://streamdle.net/higherdle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://streamdle.net/og-image.jpg'],
  },
};
export default function Layout({ children }) { return children; }
