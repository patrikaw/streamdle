import { STREAMERS } from '../../data/streamers';

function findStreamer(slug) {
  return STREAMERS.find(s =>
    s.display_name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

function fmt(n) {
  if (!n) return '0';
  const num = Number(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
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

function countryFull(code) {
  const map = {
    ES: 'Spain', AR: 'Argentina', MX: 'Mexico', PE: 'Peru',
    CO: 'Colombia', CL: 'Chile', VE: 'Venezuela', UY: 'Uruguay',
    SV: 'El Salvador', PR: 'Puerto Rico', GT: 'Guatemala',
    DO: 'Dominican Republic', FR: 'France', NO: 'Norway',
  };
  return map[code] || code;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = findStreamer(slug);

  if (!s) {
    return {
      title: 'Streamer no encontrado — Streamdle',
      description: 'Este streamer no existe en Streamdle.',
      robots: { index: false, follow: false },
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
    robots: {
      index: false,
      follow: false,
    },
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

// Layout inyecta el Schema.org JSON-LD como script tag
// Cuando quites el noindex, Google va a leer estos datos estructurados
export default async function Layout({ children, params }) {
  const { slug } = await params;
  const s = findStreamer(slug);

  // Sin streamer → sin schema
  if (!s) return children;

  const adj = countryAdj(s.country);
  const description = `${s.display_name}${s.real_name ? ` (${s.real_name})` : ''} es un streamer ${adj} con ${fmt(s.total_followers)} seguidores.`;

  // Construir sameAs con todas las redes disponibles
  const sameAs = [
    s.twitch        && `https://twitch.tv/${s.twitch}`,
    s.kick          && `https://kick.com/${s.kick}`,
    s.twitter_url,
    s.instagram_url,
    s.tiktok_url,
    s.youtube_url,
  ].filter(Boolean);

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: s.real_name || s.display_name,
    alternateName: s.display_name,
    description,
    nationality: { '@type': 'Country', name: countryFull(s.country) },
    url: `https://streamdle.net/${slug}`,
    ...(sameAs.length > 0 && { sameAs }),
    jobTitle: 'Streamer',
    ...(s.birth_year && s.birth_month && s.birth_day && {
      birthDate: `${s.birth_year}-${String(s.birth_month).padStart(2,'0')}-${String(s.birth_day).padStart(2,'0')}`,
    }),
    ...(s.top_category && {
      knowsAbout: [s.top_category, s.second_category].filter(Boolean),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      {children}
    </>
  );
}