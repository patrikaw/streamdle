import Link from 'next/link';
import { JUEGOS, SECCIONES, EXPLORAR, LEGALES } from '../../lib/sitio';

const SECCIONES_PIE = ['ranking', 'tendencias', 'comunidades', 'clips', 'ruleta'];

export default function SiteFooter() {
  return (
    <footer className="sd-footer">
      <div className="sd-footer-inner">
        <div className="sd-footer-grid">
          <nav aria-label="Juegos">
            <h2>Juegos</h2>
            <ul>
              {JUEGOS.map((j) => <li key={j.slug}><Link href={j.href}>{j.emoji} {j.nombre}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Secciones">
            <h2>Streamers</h2>
            <ul>
              {SECCIONES_PIE.map((k) => <li key={k}><Link href={SECCIONES[k].href}>{SECCIONES[k].emoji} {SECCIONES[k].nombre}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Explorar">
            <h2>Explorar</h2>
            <ul>
              {EXPLORAR.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Sitio">
            <h2>Sitio</h2>
            <ul>
              {LEGALES.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              <li><a href="https://pispeo.com.ar" target="_blank" rel="noopener noreferrer">Pispeo · reseñas de herramientas</a></li>
            </ul>
          </nav>
        </div>
        <p className="sd-footer-base">
          © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
          <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-kick)', fontWeight: 700, textDecoration: 'underline' }}>Pato Wnuk</a>.
        </p>
      </div>
    </footer>
  );
}
