'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { rachaActual } from '../../lib/racha';
import SearchBar from './SearchBar';
import { JUEGOS, SECCIONES, MENU } from '../../lib/sitio';

const activo = (pathname, href) => (href === '/' ? false : pathname === href || pathname.startsWith(href + '/'));

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  const [racha, setRacha] = useState(0);
  useEffect(() => { setRacha(rachaActual()); }, [pathname]);
  const enJuego = JUEGOS.some((j) => activo(pathname, j.href));

  return (
    <header className="sd-header">
      <div className="sd-header-inner">
        <Link href="/" className="sd-logo" aria-label="Streamdle, inicio">
          <span aria-hidden="true" style={{ fontSize: 20 }}>🎮</span>
          <span className="sd-logo-text">STREAMDLE</span>
        </Link>
        <SearchBar />
        {racha >= 2 && (
          <span className="sd-racha" title={`Llevás ${racha} días seguidos ganando`}>🔥 {racha}</span>
        )}
        <nav className="sd-nav" aria-label="Principal">
          {MENU.map((clave) => {
            const s = SECCIONES[clave];
            if (clave === 'juegos') {
              return (
                <details key={pathname} className="sd-menu" style={{ '--sd-color': s.color }}>
                  <summary className="sd-link" aria-current={pathname === '/' || enJuego ? 'page' : undefined}>
                    <span aria-hidden="true">{s.emoji}</span> {s.nombre} <span aria-hidden="true" style={{ fontSize: 9 }}>▾</span>
                  </summary>
                  <div className="sd-pop">
                    <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>🏠 Todos los juegos</Link>
                    {JUEGOS.map((j) => (
                      <Link key={j.slug} href={j.href} aria-current={activo(pathname, j.href) ? 'page' : undefined} style={{ '--sd-color': j.color }}>
                        <span className="sd-dot" aria-hidden="true" /> {j.emoji} {j.nombre}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            }
            const aqui = activo(pathname, s.href.replace(/\/hoy$/, ''));
            return (
              <Link key={clave} href={s.href} className="sd-link" style={{ '--sd-color': s.color }} aria-current={aqui ? 'page' : undefined}>
                <span aria-hidden="true">{s.emoji}</span> {s.nombre}
              </Link>
            );
          })}
          <Link href={SECCIONES.ruleta.href} className="sd-cta">🎲 Descubrí un streamer</Link>
        </nav>
      </div>
    </header>
  );
}
