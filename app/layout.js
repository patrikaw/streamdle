import './globals.css';
import Script from 'next/script';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Streamdle — El Wordle de Streamers en Español',
  description: '6 juegos diarios de streamers hispanos: adiviná por pistas, foto pixelada, emojis, categorías, frases y más. ¡Nuevo reto cada día!',
  keywords: 'wordle streamers, wordle de streamers, juego streamers, adivinar streamer, wordle español, streamers hispanos, twitch wordle, kick wordle',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/icon.png',
  },
  openGraph: {
    title: 'Streamdle — ¿Cuánto sabés de tus streamers favoritos?',
    description: 'Adiviná streamers hispanohablantes en varios juegos diarios.',
    url: 'https://streamdle.net',
    siteName: 'Streamdle',
    images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamdle',
    description: '¿Cuánto sabés de tus streamers favoritos?',
    images: ['https://streamdle.net/og-image.jpg'],
  },
  verification: {
    google: 'xHolM5K2MY7kQJyWcckrSVRZgRsAohrAqh8qHjDOHOg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
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