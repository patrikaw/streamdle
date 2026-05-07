import { STREAMERS } from '../../data/streamers';

function findStreamer(slug) {
  return STREAMERS.find(s =>
    s.display_name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

function fmt(n) {
  if (!n) return '0';
  const num = Number(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0','') + 'M';
  if (num >= 1_000) return Math.round(num / 1_000) + 'K';
  return String(num);
}

function countryAdj(code) {
  const map = {
    ES: 'español', AR: 'argentino', MX: 'mexicano', PE: 'peruano',
    CO: 'colombiano', CL: 'chileno', VE: 'venezolano', UY: 'uruguayo',
    SV: 'salvadoreño', PR: 'puertorriqueño', GT: 'guatemalteco',
    DO: 'dominicano', FR: 'francés', NO: 'noruego',
  };
  return map[code] || 'hispanohablante';
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = findStreamer(slug);

  if (!s) {
    return {
      title: 'Streamer no encontrado — Streamdle',
      description: 'Este streamer no existe en Streamdle.',
    };
  }

  const adj = countryAdj(s.country);
  const title = `${s.display_name} — Streamer ${adj} | Streamdle`;
  const description = `${s.display_name}${s.real_name ? ` (${s.real_name})` : ''} es un streamer ${adj} con ${fmt(s.total_followers)} seguidores en Twitch${s.kick ? ' y Kick' : ''}. Peak histórico: ${fmt(s.peak_viewers)} espectadores. Trivia, estadísticas y clip más visto en Streamdle.`;

  const keywords = [
    s.display_name,
    s.real_name,
    `streamer ${adj}`,
    `${s.display_name} twitch`,
    `${s.display_name} seguidores`,
    `${s.display_name} edad`,
    `${s.display_name} nombre real`,
    `streamers ${adj}s`,
  ].filter(Boolean).join(', ');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://streamdle.net/${slug}`,
      siteName: 'Streamdle',
      images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
      locale: 'es_ES',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://streamdle.net/og-image.jpg'],
    },
    alternates: {
      canonical: `https://streamdle.net/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return STREAMERS.map(s => ({
    slug: s.display_name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function Layout({ children }) {
  return children;
}