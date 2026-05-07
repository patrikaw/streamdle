export const metadata = {
  title: 'Streamers LATAM — Ranking Twitch y Kick Latinoamérica',
  description: 'Ranking completo de streamers latinoamericanos de Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana.',
  keywords: 'streamers latinoamerica, streamers latam twitch, streamers hispanos latam, mejores streamers latinoamerica, streamers habla hispana',
  openGraph: {
    title: 'Streamers LATAM — Ranking Twitch y Kick Latinoamérica',
    description: 'Ranking completo de streamers latinoamericanos de Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana.',
    url: 'https://streamdle.net/streamers/latam',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers LATAM — Ranking Twitch y Kick Latinoamérica',
    description: 'Ranking completo de streamers latinoamericanos de Twitch y Kick. Argentina, México, Colombia, Perú, Chile y más países de habla hispana.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/latam',
  },
};

export default function Layout({ children }) {
  return children;
}
