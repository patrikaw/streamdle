import Link from 'next/link';
import { Shell, jsonLd } from '../../components/AgrupacionUI';
import { STREAMERS } from '../../../data/streamers';
import { estadisticasGta, ultimaMuestra } from '../../../lib/muestreo';
import { C } from '../../../lib/colores';

export const revalidate = 3600;
const SITE = 'https://streamdle.net';
const URL = `${SITE}/gta-6/estadisticas`;
const MIN_DIAS = 3;
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const nombre = (slug) => STREAMERS.find((s) => slugDe(s) === slug)?.display_name || null;
const fmt = (n) => Number(n).toLocaleString('es-AR');
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fecha = (d) => `${Number(d.slice(8, 10))} ${MESES[Number(d.slice(5, 7)) - 1]}`;

export function generateMetadata() {
  const hay = estadisticasGta().dias.length >= MIN_DIAS;
  const title = 'GTA 6 en Twitch y Kick: estadísticas día a día de streamers hispanos | Streamdle';
  const description = 'Cuántos streamers hispanos juegan GTA 6 cada día, cuántas horas, qué parte de sus directos ocupa y cómo se compara con otros juegos desde el lanzamiento.';
  return {
    title, description, alternates: { canonical: URL },
    openGraph: { title, description, url: URL, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }] },
    ...(hay ? {} : { robots: { index: false, follow: true } }),
  };
}

function Barras({ datos, valor, etiqueta, color, titulo }) {
  const max = Math.max(...datos.map(valor), 1);
  return (
    <figure style={{ margin: 0, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 14px 10px' }}>
      <figcaption style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{titulo}</figcaption>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
        {datos.map((d) => (
          <div key={d.dia} title={`${fecha(d.dia)}: ${etiqueta(d)}`} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 3, whiteSpace: 'nowrap' }}>{valor(d) > 0 ? etiqueta(d) : ''}</div>
            <div style={{ width: '100%', maxWidth: 34, height: `${Math.max(2, (valor(d) / max) * 90)}%`, background: color, borderRadius: '4px 4px 0 0' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
        {datos.map((d) => <div key={d.dia} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 9, color: 'var(--color-text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap' }}>{fecha(d.dia)}</div>)}
      </div>
    </figure>
  );
}

export default function Page() {
  const { dias, juegos, streamersDistintos } = estadisticasGta();
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'GTA 6', href: '/gta-6' }, { label: 'Estadísticas' }];
  const ult = dias.slice(-14);
  const mejorDia = [...dias].sort((a, b) => b.jugadores - a.jugadores)[0];
  const mayorPico = [...dias].sort((a, b) => b.pico - a.pico)[0];
  const horasTot = dias.reduce((a, d) => a + d.horas, 0);
  const gta = juegos.find((j) => j.juego === 'Grand Theft Auto VI');
  const puesto = gta ? juegos.indexOf(gta) + 1 : null;
  const resumen = dias.length > 0
    ? `Desde que lo medimos, ${streamersDistintos} streamers de Streamdle jugaron GTA 6 en directo, con unas ${fmt(horasTot)} horas en total.${gta ? ` Desde el lanzamiento es el juego n.º ${puesto} en tiempo de directo, con el ${gta.pct}% de las horas medidas.` : ''}`
    : '';
  const faq = dias.length > 0 ? [
    ['¿Cuántos streamers hispanos jugaron GTA 6?', `${streamersDistintos} streamers con ficha en Streamdle fueron vistos jugando GTA 6 en Twitch o Kick en nuestras mediciones.`],
    ...(mejorDia ? [[`¿Qué día lo jugaron más streamers?`, `El ${fecha(mejorDia.dia)}, con ${mejorDia.jugadores} streamers distintos jugando GTA 6.`]] : []),
    ...(mayorPico?.pico > 0 && nombre(mayorPico.picoSlug) ? [['¿Cuál fue el mayor pico de espectadores jugando GTA 6?', `${fmt(mayorPico.pico)} espectadores simultáneos, de ${nombre(mayorPico.picoSlug)} el ${fecha(mayorPico.dia)}.`]] : []),
  ] : [];

  return (
    <Shell crumbs={crumbs} seccion="juegos">
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `${SITE}${c.href}` : URL })) })}
      {faq.length > 0 && jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>📊 GTA 6 día a día entre streamers hispanos</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Cuántos streamers de Streamdle jugaron GTA 6 cada día en Twitch y Kick, cuántas horas le dedicaron y qué parte de sus directos ocupó. {resumen}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {[['/gta-6', '🔴 Quién juega ahora'], ['/gta-6/ranking', '🏆 Ranking'], ['/gta-6/clips/semana', '🎬 Clips de la semana']].map(([h, l]) => (
          <Link key={h} href={h} className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{l}</Link>
        ))}
      </div>

      {dias.length === 0 ? (
        <p style={{ marginTop: 24, color: 'var(--color-text-secondary)' }}>Todavía no hay mediciones de GTA 6.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginTop: 22 }}>
            {[
              [streamersDistintos, 'streamers lo jugaron'],
              [`${fmt(horasTot)} h`, 'en directo (estimado)'],
              mejorDia && [mejorDia.jugadores, `streamers el ${fecha(mejorDia.dia)}, el día récord`],
              mayorPico?.pico > 0 && [fmt(mayorPico.pico), `pico de ${nombre(mayorPico.picoSlug) || 'un streamer'}`],
            ].filter(Boolean).map(([v, l]) => (
              <div key={l} style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          <section style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 12 }}>
            <h2 className="sr-only">Evolución diaria</h2>
            <Barras titulo="Streamers que jugaron GTA 6 cada día" datos={ult} valor={(d) => d.jugadores} etiqueta={(d) => d.jugadores} color="var(--color-purple)" />
            <Barras titulo="% del tiempo en vivo dedicado a GTA 6" datos={ult} valor={(d) => d.pct} etiqueta={(d) => `${d.pct}%`} color={C.warn} />
          </section>

          <section style={{ marginTop: 30 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Día por día</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>El pico es la mayor audiencia simultánea medida ese día jugando GTA 6.</p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 460 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card)', textAlign: 'left' }}>
                    {['Día', 'Streamers', 'Horas', '% del vivo', 'Mayor pico'].map((t) => <th key={t} style={{ padding: '9px 12px', fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...dias].reverse().map((d) => {
                    const n = nombre(d.picoSlug);
                    return (
                      <tr key={d.dia} style={{ borderTop: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '9px 12px', fontWeight: 700, whiteSpace: 'nowrap' }}>{fecha(d.dia)}</td>
                        <td style={{ padding: '9px 12px' }}>{d.jugadores}</td>
                        <td style={{ padding: '9px 12px' }}>{fmt(d.horas)} h</td>
                        <td style={{ padding: '9px 12px' }}>{d.pct}%</td>
                        <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>{d.pico > 0 ? <>{fmt(d.pico)}{n && <> · <Link href={`/${d.picoSlug}`} style={{ color: 'var(--color-purple-light)' }}>{n}</Link></>}</> : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {juegos.length > 0 && (
            <section style={{ marginTop: 30, maxWidth: 780 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>GTA 6 contra los demás juegos</h2>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>Qué parte del tiempo en vivo de los streamers de Streamdle se llevó cada categoría desde el 19 de noviembre.</p>
              {juegos.map((j) => (
                <div key={j.juego} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: '0 0 42%', fontSize: 13, lineHeight: 1.25, fontWeight: j.juego === 'Grand Theft Auto VI' ? 800 : 500, color: j.juego === 'Grand Theft Auto VI' ? '#fff' : 'var(--color-text-secondary)', overflowWrap: 'anywhere' }}>{j.juego}</div>
                  <div style={{ flex: 1, height: 10, background: 'var(--bg-card)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                    <div style={{ width: `${(j.pct / juegos[0].pct) * 100}%`, height: '100%', background: j.juego === 'Grand Theft Auto VI' ? C.warn : 'var(--color-purple)' }} />
                  </div>
                  <div style={{ flex: '0 0 44px', textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{j.pct}%</div>
                </div>
              ))}
            </section>
          )}

          {faq.length > 0 && (
            <section style={{ marginTop: 32, maxWidth: 780 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Preguntas frecuentes</h2>
              {faq.map(([q, a]) => (
                <div key={q} style={{ marginBottom: 14 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{q}</h3>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{a}</p>
                </div>
              ))}
            </section>
          )}

          <p style={{ marginTop: 28, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 780 }}>
            Cómo se mide: varias veces al día revisamos qué está transmitiendo cada streamer de Streamdle en Twitch y Kick. Las horas son una estimación a partir de esas mediciones, no el tiempo exacto.{ultimaMuestra() ? ` Última medición: ${ultimaMuestra()}.` : ''}
          </p>
        </>
      )}
    </Shell>
  );
}
