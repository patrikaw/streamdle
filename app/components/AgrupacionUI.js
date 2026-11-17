import Link from 'next/link';
import AvatarImg from './AvatarImg';
import { getAvatarUrl } from '../../data/avatars';
import { fetchTwitchAvatars } from '../../lib/twitch-server';
import { SITE, TIPOS, TIPOS_LISTA, gruposDe, resumenDe } from '../../lib/agrupaciones';
import { fmtNum } from '../../lib/formato';

export const FLAGS = { ES:'🇪🇸', AR:'🇦🇷', MX:'🇲🇽', PE:'🇵🇪', CO:'🇨🇴', CL:'🇨🇱', SV:'🇸🇻', PR:'🇵🇷', VE:'🇻🇪', UY:'🇺🇾', GT:'🇬🇹', DO:'🇩🇴', CU:'🇨🇺', FR:'🇫🇷', NO:'🇳🇴' };

const fmt = (n) => fmtNum(n, '—');

export function Shell({ crumbs, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        @media (max-width: 640px) { .header-icon { display: none !important; } }
        .agr-card { transition: border-color .15s, transform .15s; }
        .agr-card:hover { border-color: var(--color-purple) !important; transform: translateY(-2px); }
        .agr-chip:hover { border-color: var(--color-purple) !important; }
        .agr-crumb:hover { color: #fff !important; }
      `}</style>

      <nav aria-label="breadcrumb" style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span>›</span>}
            {c.href ? <Link href={c.href} className="agr-crumb" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>{c.label}</Link>
              : <span style={{ color: '#fff', fontWeight: 600 }}>{c.label}</span>}
          </span>
        ))}
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 16px 48px' }}>{children}</main>

    </div>
  );
}

function TipoNav({ actual }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 4px' }}>
      {TIPOS_LISTA.map((t) => (
        <Link key={t.tipo} href={`/streamers/${TIPOS[t.tipo].ruta}`} className="agr-chip" style={{
          background: t.tipo === actual ? 'var(--color-purple)' : 'var(--bg-card)',
          border: '1px solid var(--color-border)', color: '#fff', borderRadius: 20,
          padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none',
        }}>{t.label}</Link>
      ))}
    </div>
  );
}

export function jsonLd(obj) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />;
}

export function Hub({ tipo }) {
  const t = TIPOS[tipo];
  const grupos = gruposDe(tipo);
  const url = `${SITE}/streamers/${t.ruta}`;
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'Streamers', href: '/streamers' }, { label: t.hubTitulo }];
  return (
    <Shell crumbs={crumbs}>
      {jsonLd({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Streamers', item: `${SITE}/streamers` },
          { '@type': 'ListItem', position: 3, name: t.hubTitulo, item: url },
        ],
      })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>{t.hubTitulo}</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 720 }}>{t.hubDesc}</p>
      <TipoNav actual={tipo} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginTop: 20 }}>
        {grupos.map((g) => (
          <Link key={g.slug} href={`/streamers/${t.ruta}/${g.slug}`} className="agr-card" style={{
            display: 'block', background: 'var(--bg-card)', border: '1px solid var(--color-border)',
            borderRadius: 12, padding: '16px 18px', textDecoration: 'none', color: 'inherit',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{g.etiqueta}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {g.miembros.length} streamers · {g.miembros.slice(0, 3).map((s) => s.display_name).join(', ')}
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

export async function Detalle({ tipo, slug }) {
  const t = TIPOS[tipo];
  const grupos = gruposDe(tipo);
  const g = grupos.find((x) => x.slug === slug);
  const url = `${SITE}/streamers/${t.ruta}/${g.slug}`;
  const avatares = await fetchTwitchAvatars(g.miembros.map((s) => s.twitch).filter(Boolean));
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'Streamers', href: '/streamers' }, { label: t.hubTitulo, href: `/streamers/${t.ruta}` }, { label: g.label }];
  return (
    <Shell crumbs={crumbs}>
      {jsonLd({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem', position: i + 1, name: c.label,
          item: c.href ? `${SITE}${c.href}` : url,
        })),
      })}
      {jsonLd({
        '@context': 'https://schema.org', '@type': 'ItemList', name: g.titulo, url,
        itemListElement: g.miembros.map((s, i) => ({
          '@type': 'ListItem', position: i + 1, name: s.display_name, url: `${SITE}/${s._slug}`,
        })),
      })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>{g.titulo}</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
        {t.intro(g)} {resumenDe(g)}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10, marginTop: 24 }}>
        {g.miembros.map((s, i) => (
          <Link key={s.id} href={`/${s._slug}`} className="agr-card" style={{
            display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)',
            border: '1px solid var(--color-border)', borderRadius: 12, padding: '12px 14px',
            textDecoration: 'none', color: 'inherit',
          }}>
            <div style={{ minWidth: 26, fontSize: 12, fontWeight: 700, textAlign: 'right', color: i < 3 ? 'var(--color-purple-light)' : 'var(--color-text-secondary)' }}>#{i + 1}</div>
            <AvatarImg url={getAvatarUrl(s, avatares)} name={s.display_name} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>{s.display_name}</span>
                <span style={{ fontSize: 12 }}>{FLAGS[s.country] ?? '🌍'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 3 }}>
                {fmt(s.total_followers)} segs{s.detalle ? ` · ${s.detalle}` : ''}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '36px 0 4px' }}>Más listas de {t.singular}</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
        {grupos.filter((x) => x.slug !== g.slug).map((x) => (
          <Link key={x.slug} href={`/streamers/${t.ruta}/${x.slug}`} className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 20, padding: '5px 12px', fontSize: 12, textDecoration: 'none' }}>{x.etiqueta}</Link>
        ))}
      </div>
      <TipoNav actual={tipo} />
    </Shell>
  );
}

export function metaHub(tipo) {
  const t = TIPOS[tipo];
  const url = `${SITE}/streamers/${t.ruta}`;
  return {
    title: `${t.hubTitulo} | Streamdle`,
    description: t.hubDesc,
    openGraph: { title: t.hubTitulo, description: t.hubDesc, url, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: t.hubTitulo, description: t.hubDesc, images: [`${SITE}/og-image.jpg`] },
    alternates: { canonical: url },
  };
}

export function metaDetalle(tipo, slug) {
  const t = TIPOS[tipo];
  const g = gruposDe(tipo).find((x) => x.slug === slug);
  const url = `${SITE}/streamers/${t.ruta}/${slug}`;
  const top = g.miembros.slice(0, 3).map((s) => s.display_name).join(', ');
  const description = `${g.titulo}: ${g.miembros.length} streamers hispanos de Twitch y Kick, entre ellos ${top}. Seguidores, país y ficha de cada uno.`;
  return {
    title: `${g.titulo} — Twitch y Kick | Streamdle`,
    description,
    openGraph: { title: g.titulo, description, url, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: g.titulo, description, images: [`${SITE}/og-image.jpg`] },
    alternates: { canonical: url },
    ...(g.indexable ? {} : { robots: { index: false, follow: true } }),
  };
}
