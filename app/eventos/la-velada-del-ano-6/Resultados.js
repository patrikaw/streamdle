import Link from 'next/link';
import { C } from '../../../lib/colores';

// Resultados verificados en varias fuentes (DAZN, Depor, Movistar eSports). Orden de la cartelera del evento.
const COMBATES = [
  { n: 1, ganador: 'Edu Aguirre', perdedor: 'Gastón Edul', marcador: '4-1', tipo: 'decisión dividida' },
  { n: 2, ganador: 'La Parce', perdedor: 'Fabiana Sevillano', marcador: '3-2', tipo: 'decisión dividida' },
  { n: 3, ganador: 'Natalia MX', perdedor: 'Clersss', marcador: '5-0', tipo: 'decisión unánime', slug: 'nataliamx' },
  { n: 4, ganador: 'Lit Killah', perdedor: 'Kidd Keo', marcador: '5-0', tipo: 'decisión unánime', slug: 'litkillah' },
  { n: 5, ganador: 'Angie Velasco', perdedor: 'Alondrissa', marcador: '5-0', tipo: 'decisión unánime', slug: 'angievelasco08' },
  { n: 6, ganador: 'Gero Arias', perdedor: 'ViruZz', marcador: '5-0', tipo: 'decisión unánime' },
  { n: 7, ganador: 'RoRo', perdedor: 'Samy Rivers', marcador: '5-0', tipo: 'decisión unánime' },
  { n: 8, ganador: 'Marta Díaz', perdedor: 'Tatiana Käer', marcador: '4-1', tipo: 'decisión' },
  { n: 9, ganador: 'Plex', perdedor: 'Fernanfloo', marcador: '5-0', tipo: 'decisión unánime', nota: 'Combate coestelar' },
  { n: 10, ganador: 'TheGrefg', perdedor: 'IlloJuan', marcador: '4-1', tipo: 'decisión dividida', nota: 'Combate estelar', slug: 'thegrefg', slugPerdedor: 'illojuan' },
];

export default function Resultados() {
  return (
    <section style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 24px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🏆 Resultados de todos los combates</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18, lineHeight: 1.6, maxWidth: 760 }}>
        La Velada del Año VI se disputó el 25 de julio de 2026 en el Estadio de La Cartuja, Sevilla, con diez combates. En el estelar, TheGrefg venció a IlloJuan por decisión dividida (4-1), y en el coestelar Plex le ganó a Fernanfloo por 5-0.
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {COMBATES.map((c) => (
          <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 70, fontSize: 11, fontWeight: 700, color: C.blueLight }}>Combate {c.n}</div>
            <div style={{ flex: 1, minWidth: 220, fontSize: 15 }}>
              {c.slug
                ? <Link href={`/${c.slug}`} style={{ color: C.okLight, fontWeight: 800, textDecoration: 'none' }}>{c.ganador}</Link>
                : <strong style={{ color: C.okLight }}>{c.ganador}</strong>}
              <span style={{ color: 'var(--color-text-secondary)' }}> venció a </span>
              {c.slugPerdedor
                ? <Link href={`/${c.slugPerdedor}`} style={{ color: '#fff', textDecoration: 'none' }}>{c.perdedor}</Link>
                : <span style={{ color: '#fff' }}>{c.perdedor}</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{c.tipo} ({c.marcador}){c.nota ? ` · ${c.nota}` : ''}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
