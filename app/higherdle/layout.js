export const metadata = {
  title: 'Higherdle — Compará Streamers por Seguidores y Stats',
  description: '¿Quién tiene más seguidores, más horas en vivo o más peak viewers? Compará streamers hispanos y adiviná quién gana en cada stat.',
  keywords: ['higherdle', 'comparar streamers', 'mas seguidores twitch', 'higher lower streamers', 'higherdle hispano', 'streamers estadisticas twitch'],
  openGraph: {
    title: 'Higherdle · ¿Quién tiene más? Compará streamers hispanos',
    description: 'Higher or lower con streamers de Twitch y Kick: followers, peak viewers, horas. ¿Sabés quién gana?',
    url: 'https://streamdle.net/higherdle',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Higherdle · ¿Quién tiene más? Compará streamers hispanos',
    description: 'Higher or lower con streamers de Twitch y Kick: followers, peak viewers, horas. ¿Sabés quién gana?',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: { canonical: 'https://streamdle.net/higherdle' },
};
export default function Layout({ children }) { return children; }
