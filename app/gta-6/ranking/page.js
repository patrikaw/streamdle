import Link from 'next/link';
import { Shell, jsonLd } from '../../components/AgrupacionUI';
import { STREAMERS } from '../../../data/streamers';
import { rankingsGta, ultimaMuestra } from '../../../lib/muestreo';
import { C } from '../../../lib/colores';

export const revalidate = 3600;
const SITE = 'https://streamdle.net';
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const MIN_INDEXAR = 4;

const conFicha = (lista) => lista.map((r) => ({ ...r, s: STREAMERS.find((x) => slugDe(x) === r.slug) })).filter((r) => r.s).slice(0, 10);
const fmt = (n) => Number(n).toLocaleString('es-AR');

export function generateMetadata() {
  const hay = rankingsGta().total >= MIN_INDEXAR;
  const title = 'Ranking de GTA 6: quién más lo jugó y más espectadores | Streamdle';
  const description = 'Los streamers hispanos que más jugaron GTA 6: más horas, mayor pico de espectadores, más espectadores acumulados y más seguidores ganados.';
  return { title, description, alternates: { canonical: `${SITE}/gta-6/ranking` }, ...(hay ? {} : { robots: { index: false, follow: true } }) };
}

function Tabla({ titulo, nota, lista, valor, unidad }) {
  if (!lista.length) return null;
  return (
    <section style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{titulo}</h2>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>{nota}</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {lista.map((r, i) => (
          <Link key={r.slug} href={`/${r.slug}`} className="agr-card" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '10px 16px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ minWidth: 28, fontSize: 13, fontWeight: 800, color: i < 3 ? 'var(--color-purple-light)' : 'var(--color-text-secondary)' }}>#{i + 1}</div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: '#fff' }}>{r.s.display_name}</div>
            <div style={{ fontSize: 14 }}><strong style={{ color: C.okLight }}>{valor(r)}</strong> <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{unidad}</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const r = rankingsGta();
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'GTA 6', href: '/gta-6' }, { label: 'Ranking' }];
  const url = `${SITE}/gta-6/ranking`;
  const horas = conFicha(r.masHoras);
  return (
    <Shell crumbs={crumbs} seccion="juegos">
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `${SITE}${c.href}` : url })) })}
      {horas.length > 0 && jsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Streamers hispanos que más jugaron GTA 6', url, itemListElement: horas.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.s.display_name, url: `${SITE}/${x.slug}` })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>🏆 Ranking de GTA 6 entre streamers hispanos</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Quién más lo jugó, quién llegó a más espectadores y quién ganó más seguidores mientras lo jugaba. Se calcula mirando, una vez por hora, qué juega cada streamer de Streamdle en Twitch y Kick, así que las horas son una estimación.
        {ultimaMuestra() ? ` Última medición: ${ultimaMuestra()}.` : ''}
      </p>

      {r.total === 0 ? (
        <p style={{ marginTop: 24, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 720 }}>
          Todavía nadie de Streamdle fue visto jugando GTA 6 en las mediciones. El juego salió el 19 de noviembre de 2026: el ranking se arma solo y se actualiza cada hora.
        </p>
      ) : (
        <>
          <Tabla titulo="⏱️ Más horas jugadas" nota="Horas estimadas en directo con GTA 6." lista={horas} valor={(x) => `${x.horas} h`} unidad="jugando" />
          <Tabla titulo="📈 Mayor pico de espectadores" nota="La mayor cantidad de espectadores simultáneos que tuvo cada streamer mientras jugaba GTA 6." lista={conFicha(r.masPico)} valor={(x) => fmt(x.pico)} unidad="espectadores" />
          <Tabla titulo="👁️ Más espectadores acumulados" nota="Horas vistas: suma de los espectadores que tuvo en cada medición, multiplicada por el tiempo. Premia a quien sostuvo una gran audiencia durante muchas horas." lista={conFicha(r.masHorasVistas)} valor={(x) => fmt(x.horasVistas)} unidad="horas vistas" />
          <Tabla titulo="➕ Más seguidores ganados mientras jugaba" nota="Seguidores que sumó entre su primera y su última medición jugando GTA 6. Es una referencia: el crecimiento no se debe solo al juego." lista={conFicha(r.masSeguidores)} valor={(x) => `+${fmt(x.seguidoresGanados)}`} unidad="seguidores" />
        </>
      )}
    </Shell>
  );
}
