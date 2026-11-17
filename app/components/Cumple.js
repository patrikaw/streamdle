'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Días hasta el próximo cumpleaños (0 = hoy). Se calcula en el navegador porque las páginas son estáticas.
function diasHasta(dia, mes, hoy = new Date()) {
  const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let prox = new Date(h.getFullYear(), mes - 1, dia);
  if (prox < h) prox = new Date(h.getFullYear() + 1, mes - 1, dia);
  return Math.round((prox - h) / 86400000);
}

export function CumpleChip({ dia, mes, anio }) {
  const [txt, setTxt] = useState(null);
  useEffect(() => {
    const d = diasHasta(dia, mes);
    if (d > 7) return;
    const nueva = anio ? new Date().getFullYear() - anio : null;
    setTxt(d === 0 ? `🎂 ¡Hoy cumple${nueva ? ` ${nueva} años` : ' años'}!` : d === 1 ? '🎂 Cumple mañana' : `🎂 Cumple en ${d} días`);
  }, [dia, mes, anio]);
  if (!txt) return null;
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: 'color-mix(in srgb, var(--game-edadle) 22%, transparent)', color: '#fff', border: '1px solid color-mix(in srgb, var(--game-edadle) 55%, transparent)' }}>{txt}</span>;
}

// Franja de la portada: solo aparece si hoy cumple años algún streamer.
export function CumpleHoy() {
  const [hoy, setHoy] = useState([]);
  useEffect(() => {
    fetch('/api/cumples').then((r) => r.json()).then((d) => setHoy(d.hoy || [])).catch(() => {});
  }, []);
  if (!hoy.length) return null;
  const anio = new Date().getFullYear();
  return (
    <div role="status" style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px 0', textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)' }}>
      🎂 Hoy cumplen años:{' '}
      {hoy.map((x, i) => (
        <span key={x.slug}>{i > 0 && ', '}<Link href={`/${x.slug}`} style={{ color: '#fff', fontWeight: 700 }}>{x.nombre}</Link>{x.anio ? ` (${anio - x.anio})` : ''}</span>
      ))}
    </div>
  );
}
