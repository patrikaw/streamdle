import Link from 'next/link';
import AvatarImg from './AvatarImg';
import { Shell, jsonLd, FLAGS } from './AgrupacionUI';
import { getAvatarUrl } from '../../data/avatars';
import { fetchTwitchAvatars } from '../../lib/twitch-server';
import { REGIONES, SITE, tendenciasDe, fmtNum, periodosArchivo } from '../../lib/tendencias';

const rutaDe = (slug, clave) => (clave ? `/tendencias/archivo/${clave}${slug ? '/' + slug : ''}` : slug ? `/tendencias/${slug}` : '/tendencias');
const periodoDe = (clave) => (clave ? periodosArchivo().find((x) => x.clave === clave) : undefined);

function Lista({ titulo, nota, filas, avatares, modo }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{titulo}</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 14, maxWidth: 720 }}>{nota}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
        {filas.map((f, i) => (
          <Link key={f.s.id} href={`/${f.slug}`} className="agr-card" style={{
            display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)',
            border: '1px solid var(--color-border)', borderRadius: 12, padding: '12px 14px',
            textDecoration: 'none', color: 'inherit',
          }}>
            <div style={{ minWidth: 26, fontSize: 12, fontWeight: 700, textAlign: 'right', color: i < 3 ? 'var(--color-purple-light)' : 'var(--color-text-secondary)' }}>#{i + 1}</div>
            <AvatarImg url={getAvatarUrl(f.s, avatares)} name={f.s.display_name} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>{f.s.display_name}</span>
                <span style={{ fontSize: 12 }}>{FLAGS[f.s.country] ?? '🌍'}</span>
              </div>
              <div style={{ fontSize: 12, marginTop: 3, color: '#4ADE80', fontWeight: 700 }}>
                {modo === 'pct' ? `+${f.pct.toFixed(f.pct >= 10 ? 0 : 1).replace('.', ',')}%` : `+${fmtNum(f.ganancia)}`}
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}> · {fmtNum(f.base)} → {fmtNum(f.ahora)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function Tendencias({ regionSlug, periodoClave }) {
  const t = tendenciasDe(regionSlug, periodoDe(periodoClave));
  const { region, p } = t;
  const url = `${SITE}${rutaDe(regionSlug, periodoClave)}`;
  const archivo = periodosArchivo();
  const avatares = await fetchTwitchAvatars([...new Set([...t.porGanancia, ...t.porPct].map((f) => f.s.twitch).filter(Boolean))]);
  const crumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Streamers', href: '/streamers' },
    ...(periodoClave
      ? [{ label: 'Tendencias', href: '/tendencias' }, { label: 'Archivo', href: '/tendencias/archivo' }, regionSlug ? { label: p.mes, href: rutaDe('', periodoClave) } : { label: p.mes }, ...(regionSlug ? [{ label: region.label }] : [])]
      : regionSlug ? [{ label: 'Tendencias', href: '/tendencias' }, { label: region.label }] : [{ label: 'Tendencias' }]),
  ];
  const plataforma = t.soloTwitch ? 'seguidores en Twitch' : 'seguidores en Twitch y Kick';
  const primero = t.porGanancia[0];
  return (
    <Shell crumbs={crumbs}>
      {jsonLd({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `${SITE}${c.href}` : url })),
      })}
      {jsonLd({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `Streamers ${region.nombre} en tendencia`, url,
        itemListElement: t.porGanancia.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: f.s.display_name, url: `${SITE}/${f.slug}` })),
      })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>
        Streamers {region.nombre} en tendencia · {p.mes}
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Los streamers {region.nombre} que más crecieron en {plataforma} entre el {p.desde} y el {p.hasta} ({p.dias} días).
        {primero ? ` El que más seguidores sumó fue ${primero.s.display_name}, con +${fmtNum(primero.ganancia)}.` : ''}
        {' '}Se mide de dos formas: por seguidores ganados y por porcentaje de crecimiento (solo canales de más de 20 K, para que un canal chico no distorsione la lista).
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {REGIONES.map((r) => (
          <Link key={r.slug} href={rutaDe(r.slug, periodoClave)} className="agr-chip" style={{
            background: r.slug === regionSlug ? 'var(--color-purple)' : 'var(--bg-card)', border: '1px solid var(--color-border)',
            color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>{r.label}</Link>
        ))}
      </div>

      <Lista titulo="Los que más seguidores ganaron" nota={`Mayor aumento en cantidad de ${plataforma}.`} filas={t.porGanancia} avatares={avatares} modo="abs" />
      <Lista titulo="Mayor crecimiento porcentual" nota="Quién creció más en relación a su tamaño. Solo canales con más de 20 K seguidores al inicio." filas={t.porPct} avatares={avatares} modo="pct" />

      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 32, maxWidth: 780, lineHeight: 1.6 }}>
        Cómo se calcula: comparamos los seguidores de cada streamer en dos fechas ({p.desde} y {p.hasta}).
        {periodoClave ? 'Esta página es un registro permanente de ese período y no cambia.' : 'Los datos se actualizan cada 15 días y esta página se renueva con ellos.'} Solo aparecen los {t.total} streamers {region.nombre} que están en Streamdle.
      </p>
      {archivo.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Archivo de tendencias</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {archivo.map((a) => (
              <Link key={a.clave} href={rutaDe(regionSlug, a.clave)} className="agr-chip" style={{ background: a.clave === periodoClave ? 'var(--color-purple)' : 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{a.tipo === 'año' ? `Año ${a.mes}` : a.mes}</Link>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}

export function metaTendencias(regionSlug, periodoClave) {
  const t = tendenciasDe(regionSlug, periodoDe(periodoClave));
  const { region, p } = t;
  const url = `${SITE}${rutaDe(regionSlug, periodoClave)}`;
  const top = t.porGanancia.slice(0, 3).map((f) => f.s.display_name).join(', ');
  const title = periodoClave ? `Streamers ${region.nombre} que más crecieron en ${p.mes} | Streamdle` : `Streamers ${region.nombre} en tendencia | Streamdle`;
  const description = `Los streamers ${region.nombre} que más crecieron en Twitch (${p.mes}${periodoClave ? ', archivo' : ''}): ${top}. Ranking por seguidores ganados y por % de crecimiento.`;
  return {
    title,
    description,
    openGraph: { title, description, url, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-image.jpg`] },
    alternates: { canonical: url },
    ...(t.indexable ? {} : { robots: { index: false, follow: true } }),
  };
}
