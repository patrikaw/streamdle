import Link from 'next/link';
import { Shell, jsonLd } from './AgrupacionUI';
import contenido from '../../data/contenido.json';
import { fmtNum } from '../../lib/formato';

export const SITE = 'https://streamdle.net';

export const PERIODOS = {
  hoy: { clave: 'dia', corto: 'hoy', largo: 'de hoy', ventana: 'las últimas 24 horas' },
  semana: { clave: 'semana', corto: 'de la semana', largo: 'de la semana', ventana: 'los últimos 7 días' },
  mes: { clave: 'mes', corto: 'del mes', largo: 'del mes', ventana: 'los últimos 30 días' },
};

export const TIPOS = {
  clips: {
    base: '/clips', datos: () => contenido.destacados, emoji: '🎬',
    h1: (p) => `Mejores clips de streamers hispanos ${PERIODOS[p].largo}`,
    titulo: (p) => `Mejores clips de streamers hispanos ${PERIODOS[p].largo} | Streamdle`,
    desc: (p, n) => `Los ${n} clips más vistos ${PERIODOS[p].largo} de streamers hispanos de Twitch: ${PERIODOS[p].ventana}, ordenados por vistas y actualizados todos los días.`,
    migas: [{ label: 'Inicio', href: '/' }, { label: 'Clips' }],
  },
  gta6: {
    base: '/gta-6/clips', datos: () => contenido.gta6, emoji: '🎮',
    h1: (p) => `Mejores clips de GTA 6 en español ${PERIODOS[p].largo}`,
    titulo: (p) => `Mejores clips de GTA 6 ${PERIODOS[p].largo} en español | Streamdle`,
    desc: (p, n) => `Los ${n} clips de GTA 6 más vistos ${PERIODOS[p].largo} entre los streamers hispanos de Twitch (${PERIODOS[p].ventana}), actualizados todos los días.`,
    migas: [{ label: 'Inicio', href: '/' }, { label: 'GTA 6', href: '/gta-6' }, { label: 'Clips' }],
  },
};

export const listaDe = (tipo, periodo) => (TIPOS[tipo].datos()[PERIODOS[periodo].clave] || []);
export const fechaActualizado = () => new Date(contenido.actualizado).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' });

export function metaClips(tipo, periodo) {
  const T = TIPOS[tipo];
  const n = listaDe(tipo, periodo).length;
  const url = `${SITE}${T.base}/${periodo}`;
  const title = T.titulo(periodo);
  const description = T.desc(periodo, Math.max(n, 1));
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-image.jpg`] },
    ...(n >= 3 ? {} : { robots: { index: false, follow: true } }),
  };
}

const fmtVistas = (n) => fmtNum(n);

export function ClipsPagina({ tipo, periodo }) {
  const T = TIPOS[tipo];
  const lista = listaDe(tipo, periodo);
  const url = `${SITE}${T.base}/${periodo}`;
  const crumbs = T.migas.map((c) => (c.href ? c : { label: c.label }));
  const faq = [
    [`¿De dónde salen estos clips?`, `De Twitch. Tomamos los clips más vistos ${PERIODOS[periodo].largo} (${PERIODOS[periodo].ventana}) ${tipo === 'gta6' ? 'de GTA 6 en español' : 'de los streamers hispanos que están en Streamdle'} y los ordenamos por vistas.`],
    ['¿Cada cuánto se actualiza?', 'Todos los días. La última actualización fue el ' + fechaActualizado() + '.'],
  ];
  return (
    <Shell crumbs={crumbs}>
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `${SITE}${c.href}` : url })) })}
      {jsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', name: T.h1(periodo), url, itemListElement: lista.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.titulo, url: c.url })) })}
      {jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>{T.emoji} {T.h1(periodo)}</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Los clips más vistos {PERIODOS[periodo].largo} {tipo === 'gta6' ? 'de GTA 6 entre los streamers hispanos' : 'de los streamers hispanos de Streamdle'}, tomados de Twitch en {PERIODOS[periodo].ventana}. Actualizado el {fechaActualizado()}.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {Object.keys(PERIODOS).map((p) => (
          <Link key={p} href={`${T.base}/${p}`} className="agr-chip" style={{ background: p === periodo ? 'var(--color-purple)' : 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Semana' : 'Mes'}</Link>
        ))}
        <Link href={tipo === 'clips' ? '/gta-6/clips/hoy' : '/clips/hoy'} className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{tipo === 'clips' ? '🎮 Clips de GTA 6' : '🎬 Todos los clips'}</Link>
      </div>

      {lista.length === 0 ? (
        <p style={{ marginTop: 24, color: 'var(--color-text-secondary)' }}>Todavía no hay clips en este período. Se actualiza todos los días.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginTop: 24 }}>
          {lista.map((c, i) => (
            <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, overflow: 'hidden' }}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                <img src={c.miniatura} alt={c.titulo} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(124,58,237,0.92)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 5 }}>#{i + 1}</span>
                <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>👁 {fmtVistas(c.vistas)}</span>
              </a>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.titulo}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: 'var(--color-text-secondary)' }}>
                  {c.ficha ? <Link href={`/${c.ficha.slug}`} style={{ color: 'var(--color-purple-light)', fontWeight: 700, textDecoration: 'none' }}>{c.ficha.nombre}</Link> : c.canal}
                  {c.duracion ? ` · ${Math.floor(c.duracion / 60)}:${String(c.duracion % 60).padStart(2, '0')}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section style={{ marginTop: 36, maxWidth: 780 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Preguntas frecuentes</h2>
        {faq.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{q}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}
