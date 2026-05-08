import { STREAMERS } from '../data/streamers';
import { getCategoriesWithMinStreamers } from '../lib/categories';

export default function sitemap() {
  const baseUrl = 'https://streamdle.net';
  const today = new Date().toISOString();

  // Páginas principales
  const static_pages = [
    { url: baseUrl,                          lastModified: today, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/classic`,             lastModified: today, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/avatardle`,           lastModified: today, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/emojidle`,            lastModified: today, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/categorydle`,         lastModified: today, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/chatdle`,             lastModified: today, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/higherdle`,           lastModified: today, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/como-jugar`,          lastModified: today, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacto`,            lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacidad`,          lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terminos`,            lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Índice de streamers — noindex temporalmente, no incluir en sitemap hasta quitar noindex
  // const streamers_index = [
  //   { url: `${baseUrl}/streamers`,             lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
  //   { url: `${baseUrl}/streamers/espana`,      lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
  //   { url: `${baseUrl}/streamers/argentina`,   lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
  //   { url: `${baseUrl}/streamers/mexico`,      lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
  //   { url: `${baseUrl}/streamers/colombia`,    lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  //   { url: `${baseUrl}/streamers/chile`,       lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  //   { url: `${baseUrl}/streamers/peru`,        lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  //   { url: `${baseUrl}/streamers/latam`,       lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  // ];

  // Fichas individuales — noindex temporalmente, descomentar cuando estén listas
  // const streamer_pages = STREAMERS.map(s => ({
  //   url: `${baseUrl}/${s.display_name.toLowerCase().replace(/\s+/g, '-')}`,
  //   lastModified: today,
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }));

  const juegos_index = [
    { url: `${baseUrl}/juegos`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const juegos_pages = getCategoriesWithMinStreamers(7).map(c => ({
    url: `${baseUrl}/juegos/${c.slug}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...static_pages,
    ...juegos_index,
    ...juegos_pages,
    // ...streamers_index,  // descomentar cuando quites noindex
    // ...streamer_pages,   // descomentar cuando quites noindex
  ];
}