import Link from 'next/link';
import { Shell, jsonLd } from '../../components/AgrupacionUI';
import { STREAMERS } from '../../../data/streamers';
import { rankingJuego, GTA, ultimaMuestra } from '../../../lib/muestreo';

export const revalidate = 3600;
const SITE = 'https://streamdle.net';
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const MIN_INDEXAR = 4;

function filas(n) {
  return rankingJuego(GTA, n).map((r) => ({ ...r, s: STREAMERS.find((x) => slugDe(x) === r.slug) })).filter((r) => r.s).slice(0, 25);
}

export function generateMetadata() {
  const hay = filas(0).length >= MIN_INDEXAR;
  const title = 'Streamers hispanos que más jugaron GTA 6 | Streamdle';
  const description = 'Ranking de los streamers hispanos que más horas jugaron GTA 6 en Twitch y Kick: horas, porcentaje de su tiempo en vivo y pico de espectadores.';
  return { title, description, alternates: { canonical: `${SITE}/gta-6/ranking` }, ...(hay ? {} : { robots: { index: false, follow: true } }) };
}

function Tabla({ lista }) {
  return (
    <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
      {lista.map((r, i) => (
        <Link key={r.slug} href={`/${r.slug}`} className="agr-card" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '12px 16px', textDecoration: 'none', color: 'inherit', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 28, fontSize: 13, fontWeight: 800, color: i < 3 ? 'var(--color-purple-light)' : 'var(--color-text-secondary)' }}>#{i + 1}</div>
          <div style={{ flex: 1, minWidth: 160, fontSize: 15, fontWeight: 800, color: '#fff' }}>{r.s.display_name}</div>
          <div style={{ fontSize: 13 }}><strong style={{ color: '#4ADE80' }}>{r.horas} h</strong> <span style={{ color: 'var(--color-text-secondary)' }}>jugando GTA 6</span></div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.pct}% de su tiempo en vivo{r.pico ? ` · pico ${r.pico.toLocaleString('es-AR')} espectadores` : ''}</div>
        </Link>
      ))}
    </div>
  );
}

export default function Page() {
  const semana = filas(7), todo = filas(0);
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'GTA 6', href: '/gta-6' }, { label: 'Ranking' }];
  const url = `${SITE}/gta-6/ranking`;
  return (
    <Shell crumbs={crumbs}>
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `${SITE}${c.href}` : url })) })}
      {todo.length > 0 && jsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Streamers hispanos que más jugaron GTA 6', url, itemListElement: todo.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.s.display_name, url: `${SITE}/${r.slug}` })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>🏆 Streamers hispanos que más jugaron GTA 6</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Estimamos las horas que cada streamer de Streamdle pasó en GTA 6 mirando, una vez por hora, qué estaba jugando en Twitch y Kick. Es una estimación: cuenta una hora por cada vez que lo vemos en vivo con ese juego.
        {ultimaMuestra() ? ` Última medición: ${ultimaMuestra()}.` : ''}
      </p>

      {todo.length === 0 ? (
        <p style={{ marginTop: 24, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 720 }}>
          Todavía nadie de Streamdle fue visto jugando GTA 6. El juego sale el 19 de noviembre de 2026: el ranking se arma solo desde ese día, y se actualiza cada hora.
        </p>
      ) : (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 28 }}>Últimos 7 días</h2>
          {semana.length ? <Tabla lista={semana} /> : <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Sin datos esta semana.</p>}
          <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 32 }}>Desde el lanzamiento</h2>
          <Tabla lista={todo} />
        </>
      )}
    </Shell>
  );
}
