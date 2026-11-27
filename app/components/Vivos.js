'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fmtNum } from '../../lib/formato';

const REFRESCO = 120000;
let cache = null, cacheHora = 0, pedido = null;
const oyentes = new Set();

function cargar() {
  if (cache && Date.now() - cacheHora < REFRESCO) return Promise.resolve(cache);
  if (!pedido) {
    pedido = fetch('/api/vivos').then((r) => r.json()).then((d) => {
      cache = d.vivos || {}; cacheHora = Date.now();
      oyentes.forEach((f) => f(cache));
      return cache;
    }).catch(() => cache || {}).finally(() => { pedido = null; });
  }
  return pedido;
}

// Mapa slug -> { p, v, j, t, img, url } de quién está en vivo. Un solo pedido compartido por toda la página.
export function useVivos() {
  const [vivos, setVivos] = useState(cache);
  useEffect(() => {
    oyentes.add(setVivos);
    cargar().then(setVivos);
    const id = setInterval(() => { if (!document.hidden) cargar(); }, REFRESCO);
    return () => { oyentes.delete(setVivos); clearInterval(id); };
  }, []);
  return vivos;
}

export function VivoLinea({ slug, style }) {
  const v = useVivos()?.[slug];
  if (!v) return null;
  return (
    <div title={`En vivo en ${v.p}${v.j ? ` · ${v.j}` : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#ff5c5c', marginTop: 4, minWidth: 0, ...style }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff3b3b', flexShrink: 0, animation: 'pulsoVivo 1.6s ease-in-out infinite' }} />
      <span style={{ whiteSpace: 'nowrap' }}>EN VIVO · {fmtNum(v.v)}</span>
      {v.j && <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {v.j}</span>}
      <style>{`@keyframes pulsoVivo{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
    </div>
  );
}

// filtro (solo desde componentes cliente) recibe { n, c, p, v, j }; juego es un patrón de texto. Franja horizontal con los streamers en vivo, de más a menos espectadores.
export function EnVivoAhora({ filtro, plataforma, juego, limite = 20, titulo = '🔴 En vivo ahora' }) {
  const vivos = useVivos();
  if (!vivos) return null;
  const lista = Object.entries(vivos)
    .map(([slug, v]) => ({ slug, v }))
    .filter((x) => (!filtro || filtro(x.v)) && (!plataforma || x.v.p === plataforma) && (!juego || new RegExp(juego, 'i').test(x.v.j)))
    .sort((a, b) => b.v.v - a.v.v)
    .slice(0, limite);
  if (!lista.length) return null;
  return (
    <section style={{ margin: '0 0 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{titulo}</h2>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{lista.length} {lista.length === 1 ? 'streamer' : 'streamers'}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {lista.map(({ slug, v }) => (
          <Link key={slug} href={`/${slug}`} className="agr-card" style={{ flex: '0 0 200px', scrollSnapAlign: 'start', background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'linear-gradient(135deg,#1A1A2E,#2D1B69)' }}>
              {v.img && <img src={v.img} alt={`${v.n} en vivo`} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
              <span style={{ position: 'absolute', top: 6, left: 6, background: '#e91916', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>EN VIVO</span>
              <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>👁 {fmtNum(v.v)}</span>
              <span style={{ position: 'absolute', bottom: 6, right: 6, background: v.p === 'Kick' ? 'var(--color-kick)' : 'var(--color-twitch)', color: v.p === 'Kick' ? '#000' : '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>{v.p}</span>
            </div>
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.n}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{v.j || 'Sin categoría'}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
