import { STREAMERS } from '../data/streamers';
import { getCategoriesWithMinStreamers } from '../lib/categories';
import seoOverrides from '../data/seo-overrides.json';
import { TIPOS, gruposDe } from '../lib/agrupaciones';
import { REGIONES, tendenciasDe, periodosArchivo } from '../lib/tendencias';
import { COMUNIDADES, esIndexable } from '../lib/comunidades';
import contenido from '../data/contenido.json';
import { rankingsGta, estadisticasGta } from '../lib/muestreo';
import historial from '../data/historial.json';

export default function sitemap() {
  const baseUrl = 'https://streamdle.net';
  // Fecha real del último cambio de datos (última actualización de seguidores); las páginas estáticas, la fecha fija de su última edición.
  const ultima = historial.snapshots.at(-1)?.fecha;
  const today = ultima ? new Date(`${ultima}T12:00:00Z`).toISOString() : '2026-11-16T12:00:00.000Z';
  const estatica = '2026-11-16T12:00:00.000Z';

  // Páginas principales
  const static_pages = [
    { url: baseUrl,                          lastModified: estatica, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/classic`,             lastModified: estatica, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/avatardle`,           lastModified: estatica, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/emojidle`,            lastModified: estatica, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/categorydle`,         lastModified: estatica, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/gta-6`,               lastModified: today, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/ruleta`,              lastModified: estatica, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/edadle`,             lastModified: estatica, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/chatdle`,             lastModified: estatica, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/higherdle`,           lastModified: estatica, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/explorar`,             lastModified: estatica, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/como-jugar`,          lastModified: estatica, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacto`,            lastModified: estatica, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacidad`,          lastModified: estatica, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terminos`,            lastModified: estatica, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const streamers_index = [
    { url: `${baseUrl}/streamers`,             lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/streamers/espana`,      lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/streamers/argentina`,   lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/streamers/mexico`,      lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/streamers/latam`,       lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/streamers/colombia`,    lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/streamers/chile`,       lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/streamers/peru`,        lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const agrupaciones = Object.values(TIPOS).flatMap((t) => [
    { url: `${baseUrl}/streamers/${t.ruta}`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    ...gruposDe(t.ruta).filter((g) => g.indexable).map((g) => ({
      url: `${baseUrl}/streamers/${t.ruta}/${g.slug}`, lastModified: today, changeFrequency: 'monthly', priority: 0.6,
    })),
  ]);

  const tendencias = REGIONES.filter((r) => tendenciasDe(r.slug)?.indexable).map((r) => ({
    url: `${baseUrl}/tendencias${r.slug ? '/' + r.slug : ''}`, lastModified: today, changeFrequency: 'weekly', priority: r.slug ? 0.7 : 0.9,
  }));

  const archivo = periodosArchivo().flatMap((a) => REGIONES.filter((r) => tendenciasDe(r.slug, a)?.indexable).map((r) => ({
    url: `${baseUrl}/tendencias/archivo/${a.clave}${r.slug ? '/' + r.slug : ''}`, lastModified: new Date(`${a.fin.fecha}T12:00:00Z`).toISOString(), changeFrequency: 'yearly', priority: 0.5,
  })));
  const archivo_index = periodosArchivo().length ? [{ url: `${baseUrl}/tendencias/archivo`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 }] : [];

  // Fichas individuales — todas; las que tienen override en seo-overrides.json van con más prioridad
  const streamer_pages = STREAMERS.map(s => {
    const slug = s.display_name.toLowerCase().replace(/\s+/g, '-');
    return {
      url: `${baseUrl}/${slug}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: seoOverrides[slug] ? 0.8 : 0.6,
    };
  });

  const juegos_index = [
    { url: `${baseUrl}/juegos`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const juegos_pages = getCategoriesWithMinStreamers(7).map(c => ({
    url: `${baseUrl}/juegos/${c.slug}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const comunidades_pages = [
    { url: `${baseUrl}/comunidades/top-globales`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const comunidades_extra = [
    { url: `${baseUrl}/comunidades`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    ...COMUNIDADES.filter(esIndexable).map((c) => ({ url: `${baseUrl}/comunidades/${c.slug}`, lastModified: today, changeFrequency: 'weekly', priority: 0.7 })),
  ];

  const clips_pages = ['hoy', 'semana', 'mes'].flatMap((p) => {
    const k = p === 'hoy' ? 'dia' : p;
    const mod = new Date(contenido.actualizado).toISOString();
    return [
      ...(contenido.destacados[k]?.length >= 3 ? [{ url: `${baseUrl}/clips/${p}`, lastModified: mod, changeFrequency: 'daily', priority: 0.8 }] : []),
      ...(contenido.gta6[k]?.length >= 3 ? [{ url: `${baseUrl}/gta-6/clips/${p}`, lastModified: mod, changeFrequency: 'daily', priority: 0.8 }] : []),
    ];
  });

  const ranking_gta = rankingsGta().total >= 4 ? [{ url: `${baseUrl}/gta-6/ranking`, lastModified: today, changeFrequency: 'daily', priority: 0.7 }] : [];
  const estadisticas_gta = estadisticasGta().dias.length >= 3 ? [{ url: `${baseUrl}/gta-6/estadisticas`, lastModified: today, changeFrequency: 'daily', priority: 0.7 }] : [];

  const eventos_pages = [
    { url: `${baseUrl}/eventos/la-velada-del-ano-6`, lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
  ];

  return [
    ...static_pages,
    ...streamers_index,
    ...agrupaciones,
    ...tendencias,
    ...archivo_index,
    ...archivo,
    ...streamer_pages,
    ...juegos_index,
    ...juegos_pages,
    ...comunidades_pages,
    ...comunidades_extra,
    ...eventos_pages,
    ...clips_pages,
    ...ranking_gta,
    ...estadisticas_gta,
  ];
}