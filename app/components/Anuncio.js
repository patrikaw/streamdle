'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const CLIENTE = 'ca-pub-9797476509112947';

// IDs de bloque (data-ad-slot) creados en AdSense → Anuncios → Por bloque de anuncios.
// Mientras estén vacíos, el anuncio no se muestra.
export const SLOTS = {
  juegos: '5662754044',
  ficha: '7666100856',
  listado: '2425061662',
};

// Bloque manual adaptable. Reserva altura para que la página no salte al cargar
// y se oculta solo si Google no tiene anuncio para mostrar.
export default function Anuncio({ slot, style }) {
  const ruta = usePathname();
  const ref = useRef(null);
  useEffect(() => {
    if (!slot || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* bloqueador o script sin cargar */ }
  }, [slot, ruta]);
  if (!slot) return null;
  return (
    <div className="anuncio" style={{ margin: '20px auto', maxWidth: 728, textAlign: 'center', ...style }}>
      <style>{`.anuncio:has(ins[data-ad-status="unfilled"]){display:none}`}</style>
      <div style={{ fontSize: 10, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Publicidad</div>
      <ins key={ruta} ref={ref} className="adsbygoogle" style={{ display: 'block', minHeight: 100 }}
        data-ad-client={CLIENTE} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  );
}
