import Link from 'next/link';
import { Shell, jsonLd } from '../components/AgrupacionUI';
import { COMUNIDADES, SITE, miembrosDe, sinFichaDe } from '../../lib/comunidades';

export const revalidate = 86400;

export const metadata = {
  title: 'Comunidades de streamers hispanos: Top Globales y más | Streamdle',
  description: 'Los grupos de streamers hispanos más conocidos: Top Globales, Coscu Army, W Crew de WestCOL, La Comarca, Esos 4 y el Escuadrón Salchichón. Integrantes, edades y seguidores.',
  alternates: { canonical: `${SITE}/comunidades` },
};

export default function ComunidadesPage() {
  const items = [
    { href: '/comunidades/top-globales', emoji: '🌎', nombre: 'Top Globales', resumen: 'Coscu, Goncho, DuendePablo, Zeko, Coker y más: el boom del gaming en Kick Argentina.', n: null },
    ...COMUNIDADES.map((c) => ({ href: `/comunidades/${c.slug}`, emoji: c.emoji, nombre: c.nombre, resumen: c.resumen, n: miembrosDe(c).length + sinFichaDe(c).length })),
  ];
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'Comunidades' }];
  return (
    <Shell crumbs={crumbs} seccion="comunidades">
      {jsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Comunidades de streamers hispanos', itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.nombre, url: `${SITE}${x.href}` })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>Comunidades y grupos de streamers hispanos</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>Los grupos que mueven el streaming en español: quiénes los integran, cuántos seguidores suman y cuántos años tiene cada uno.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginTop: 24 }}>
        {items.map((x) => (
          <Link key={x.href} href={x.href} className="agr-card" style={{ display: 'block', background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '18px 20px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: 28 }}>{x.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 6 }}>{x.nombre}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{x.resumen}</div>
            {x.n != null && <div style={{ fontSize: 12, color: 'var(--acento-texto, var(--color-purple-light))', marginTop: 8, fontWeight: 700 }}>{x.n} streamers →</div>}
          </Link>
        ))}
      </div>
    </Shell>
  );
}
