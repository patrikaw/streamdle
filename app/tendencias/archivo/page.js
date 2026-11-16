import Link from 'next/link';
import { Shell } from '../../components/AgrupacionUI';
import { periodosArchivo, SITE } from '../../../lib/tendencias';

export const revalidate = 86400;

export function generateMetadata() {
  const hay = periodosArchivo().length > 0;
  const title = 'Archivo de tendencias: streamers que más crecieron, mes a mes | Streamdle';
  const description = 'Historial permanente de los streamers hispanos que más crecieron cada mes y cada año en Twitch y Kick.';
  return { title, description, alternates: { canonical: `${SITE}/tendencias/archivo` }, ...(hay ? {} : { robots: { index: false, follow: true } }) };
}

export default function Page() {
  const lista = periodosArchivo();
  return (
    <Shell crumbs={[{ label: 'Inicio', href: '/' }, { label: 'Tendencias', href: '/tendencias' }, { label: 'Archivo' }]}>
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>Archivo de tendencias</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Cada mes y cada año cerrado queda guardado acá: quiénes fueron los streamers hispanos que más seguidores ganaron en ese período.
      </p>
      {lista.length === 0 ? (
        <p style={{ marginTop: 20, color: 'var(--color-text-secondary)' }}>Todavía no hay períodos cerrados. El primero aparece cuando termine el mes en curso. Mientras tanto, mirá <Link href="/tendencias" style={{ color: '#fff' }}>la tendencia actual</Link>.</p>
      ) : (
        <ul style={{ marginTop: 20, display: 'grid', gap: 10, listStyle: 'none', padding: 0 }}>
          {lista.map((a) => (
            <li key={a.clave}>
              <Link href={`/tendencias/archivo/${a.clave}`} className="agr-card" style={{ display: 'block', background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '14px 16px', textDecoration: 'none', color: 'inherit' }}>
                <strong style={{ fontSize: 16 }}>{a.tipo === 'año' ? `Año ${a.mes}` : a.mes}</strong>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 10 }}>{a.desde} → {a.hasta}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
