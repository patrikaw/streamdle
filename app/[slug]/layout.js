import { notFound } from 'next/navigation';
import { STREAMERS } from '../../data/streamers';
import seoOverrides from '../../data/seo-overrides.json';
import { fmtNum } from '../../lib/formato';

function findStreamer(slug) {
  return STREAMERS.find(s =>
    s.display_name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

const fmt = (n) => fmtNum(n, '0');

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

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function edadDe(s) {
  const { birth_year: y, birth_month: m, birth_day: d } = s;
  if (!y || !m || !d) return null;
  const hoy = new Date();
  let edad = hoy.getUTCFullYear() - y;
  if (hoy.getUTCMonth() + 1 < m || (hoy.getUTCMonth() + 1 === m && hoy.getUTCDate() < d)) edad--;
  return { edad, fecha: `${d} de ${MESES[m - 1]} de ${y}` };
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

  const seo = seoOverrides[slug];
  // Los textos de seo-overrides traen cifras escritas a mano: se renuevan con los datos actuales.
  const actual = (t) => (typeof t !== 'string' ? t : t
    .replace(/\d+(?:[.,]\d+)?\s?[MK]\b(?=\s+(?:seguidores|fans))/g, fmt(s.total_followers))
    .replace(/\d+(?:[.,]\d+)?\s?[MK]\b(?=\s+(?:espectadores|de pico))/g, (m) => (s.peak_viewers ? fmt(s.peak_viewers) : m)));
  const adj = countryAdj(s.country);

  const ed = edadDe(s);
  const titleBase = actual(seo?.title) ?? `${s.display_name} — Streamer ${adj} | Streamdle`;
  const title = ed ? `${s.display_name}: edad, fecha de nacimiento y datos | Streamdle` : titleBase;
  const description = ed
    ? `${s.display_name} tiene ${ed.edad} años (nació el ${ed.fecha}). Streamer ${adj} con ${fmt(s.total_followers)} seguidores. Stats, trivia y clip más visto.`
    : (actual(seo?.description) ?? `${s.display_name} es un streamer ${adj} con ${fmt(s.total_followers)} seguidores${s.peak_viewers ? ` y un peak de ${fmt(s.peak_viewers)} espectadores` : ''}. Trivia, stats y clip más visto.`);
  const ogTitle = actual(seo?.openGraphTitle) ?? title;
  const ogDescription = actual(seo?.openGraphDescription) ?? description;

  const keywords = seo?.keywords
    ? seo.keywords.join(', ')
    : [
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
    robots: { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `https://streamdle.net/${slug}`,
      siteName: 'Streamdle',
      images: [{ url: 'https://streamdle.net/og-image.jpg', width: 1200, height: 630 }],
      locale: 'es_ES',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
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

  // Sin streamer → 404 real (antes devolvía 200 con un mensaje)
  if (!s) notFound();

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

  const ed = edadDe(s);
  const faq = ed ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `¿Cuántos años tiene ${s.display_name}?`, acceptedAnswer: { '@type': 'Answer', text: `${s.display_name} tiene ${ed.edad} años. Nació el ${ed.fecha}.` } },
      { '@type': 'Question', name: `¿Cuándo nació ${s.display_name}?`, acceptedAnswer: { '@type': 'Answer', text: `${s.display_name} nació el ${ed.fecha}.` } },
      ...(s.real_name ? [{ '@type': 'Question', name: `¿Cuál es el nombre real de ${s.display_name}?`, acceptedAnswer: { '@type': 'Answer', text: `El nombre real de ${s.display_name} es ${s.real_name}.` } }] : []),
    ],
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      {faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      )}
      {children}
    </>
  );
}