import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Streamdle — ¿Cuánto sabés de tus streamers favoritos?',
  description: 'Adiviná streamers hispanohablantes en varios juegos diarios. Avatardle, Higherdle, Categorydle y más.',
  keywords: 'streamdle, streamer, twitch, kick, juego, adivinar, wordle, hispano, argentina, mexico, españa',
  openGraph: {
    title: 'Streamdle',
    description: '¿Cuánto sabés de tus streamers favoritos?',
    url: 'https://streamdle.net',
    siteName: 'Streamdle',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamdle',
    description: '¿Cuánto sabés de tus streamers favoritos?',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MDVFG17P7S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MDVFG17P7S');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}