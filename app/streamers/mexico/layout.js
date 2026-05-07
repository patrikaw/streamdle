export const metadata = {
  title: 'Streamers Mexicanos — Ranking Twitch y Kick',
  description: 'Ranking completo de streamers mexicanos de Twitch y Kick. JuanSGuarnizo, ElMariana, AriGameplays, Rivers GG, Roier y más de 30 streamers de México ordenados por seguidores y peak viewers.',
  keywords: 'streamers mexicanos, streamers mexico twitch, mejores streamers mexico, juansguarnizo, elmariana, arigameplays, rivers gg, streamers hispanohablantes mexico',
  openGraph: {
    title: 'Streamers Mexicanos — Ranking Twitch y Kick',
    description: 'Ranking completo de streamers mexicanos de Twitch y Kick. JuanSGuarnizo, ElMariana, AriGameplays, Rivers GG, Roier y más de 30 streamers de México ordenados por seguidores y peak viewers.',
    url: 'https://streamdle.net/streamers/mexico',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamers Mexicanos — Ranking Twitch y Kick',
    description: 'Ranking completo de streamers mexicanos de Twitch y Kick. JuanSGuarnizo, ElMariana, AriGameplays, Rivers GG, Roier y más de 30 streamers de México ordenados por seguidores y peak viewers.',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://streamdle.net/streamers/mexico',
  },
};

export default function Layout({ children }) {
  return children;
}
