import Link from 'next/link';
import { notFound } from 'next/navigation';
import AvatarImg from '../../components/AvatarImg';
import { VivoLinea } from '../../components/Vivos';
import { Shell, jsonLd, FLAGS } from '../../components/AgrupacionUI';
import { getAvatarUrl } from '../../../data/avatars';
import { fetchTwitchAvatars } from '../../../lib/twitch-server';
import { COMUNIDADES, SITE, comunidadPorSlug, miembrosDe, sinFichaDe, edadDe, esIndexable } from '../../../lib/comunidades';
import { fmtNum } from '../../../lib/formato';

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return COMUNIDADES.map((c) => ({ slug: c.slug }));
}

const fmt = (n) => fmtNum(n);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = comunidadPorSlug(slug);
  if (!c) return {};
  const m = miembrosDe(c);
  const sf = sinFichaDe(c);
  const nombres = [...m.map((x) => x.s.display_name), ...sf.map((x) => x.nombre)].slice(0, 4).join(', ');
  const title = `${c.nombre}: integrantes, edades y seguidores | Streamdle`;
  const description = `Quiénes integran ${c.nombre}: ${nombres}${m.length + sf.length > 4 ? ' y más' : ''}. Seguidores en Twitch y Kick, edad y ficha de cada streamer.`;
  const url = `${SITE}/comunidades/${c.slug}`;
  return {
    title, description,
    openGraph: { title, description, url, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-image.jpg`] },
    alternates: { canonical: url },
    ...(esIndexable(c) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const c = comunidadPorSlug(slug);
  if (!c) notFound();
  const m = miembrosDe(c);
  const sf = sinFichaDe(c);
  const url = `${SITE}/comunidades/${c.slug}`;
  const avatares = await fetchTwitchAvatars(m.map((x) => x.s.twitch).filter(Boolean));
  const total = m.reduce((a, x) => a + x.s.total_followers, 0);
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'Comunidades', href: '/comunidades' }, { label: c.nombre }];
  const faq = [
    [`¿Quiénes integran ${c.nombre}?`, `${c.nombre} incluye a ${[...m.map((x) => x.s.display_name + (x.nota ? ` (${x.nota.toLowerCase()})` : '')), ...sf.map((x) => x.nombre)].join(', ')}.`],
    [`¿Cuántos seguidores suman los integrantes de ${c.nombre}?`, `Entre todos suman unos ${fmt(total)} de seguidores en Twitch y Kick.`],
    [`¿Quién es el integrante con más seguidores de ${c.nombre}?`, `${m[0].s.display_name}, con ${fmt(m[0].s.total_followers)} de seguidores.`],
  ];
  return (
    <Shell crumbs={crumbs} seccion="comunidades">
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.label, item: x.href ? `${SITE}${x.href}` : url })) })}
      {jsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', name: `Integrantes de ${c.nombre}`, url, itemListElement: [...m.map((x) => ({ name: x.s.display_name, url: `${SITE}/${x.slug}` })), ...sf.map((x) => ({ name: x.nombre }))].map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })) })}
      {jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>{c.emoji} {c.nombre}: integrantes, edades y seguidores</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>{c.descripcion} Los {m.length === 1 ? 'streamers con ficha suman' : `${m.length} streamers con ficha suman`} unos {fmt(total)} de seguidores.</p>
      {c.enlaceExtra && <p style={{ marginTop: 10 }}><Link href={c.enlaceExtra.href} style={{ color: 'var(--acento-texto, var(--color-purple-light))', fontWeight: 700, textDecoration: 'none' }}>{c.enlaceExtra.label}</Link></p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10, marginTop: 24 }}>
        {m.map((x, i) => {
          const edad = edadDe(x.s);
          return (
            <Link key={x.s.id} href={`/${x.slug}`} className="agr-card" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: `1px solid ${c.color}55`, borderRadius: 'var(--radius-md)', padding: '12px 14px', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ minWidth: 24, fontSize: 12, fontWeight: 700, textAlign: 'right', color: 'var(--color-text-secondary)' }}>#{i + 1}</div>
              <AvatarImg url={getAvatarUrl(x.s, avatares)} name={x.s.display_name} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.s.display_name}</span>
                  <span style={{ fontSize: 12 }}>{FLAGS[x.s.country] ?? '🌍'}</span>
                  {x.nota && <span style={{ fontSize: 10, fontWeight: 700, color: c.color }}>{x.nota}</span>}
                </div>
                <div style={{ fontSize: 12, marginTop: 3, color: 'var(--color-text-secondary)' }}>{fmt(x.s.total_followers)} seguidores{edad ? ` · ${edad} años` : ''}{x.s.top_category ? ` · ${x.s.top_category}` : ''}</div>
                <VivoLinea slug={x.slug} />
              </div>
            </Link>
          );
        })}
      </div>

      {sf.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Otros integrantes y protagonistas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
            {sf.map((x) => (
              <div key={x.nombre} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${c.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flexShrink: 0 }}>{x.nombre[0]}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{x.nombre}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 3, lineHeight: 1.5 }}>{x.nota}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {c.hechos && (
        <section style={{ marginTop: 32, maxWidth: 780 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Lo que tenés que saber de {c.nombre}</h2>
          {c.hechos.map(([t, d]) => (
            <div key={t} style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </section>
      )}

      <section style={{ marginTop: 36, maxWidth: 780 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Preguntas frecuentes sobre {c.nombre}</h2>
        {faq.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{q}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Otras comunidades</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/comunidades/top-globales" className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>🌎 Top Globales</Link>
          {COMUNIDADES.filter((o) => o.slug !== c.slug).map((o) => (
            <Link key={o.slug} href={`/comunidades/${o.slug}`} className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{o.emoji} {o.nombre}</Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
