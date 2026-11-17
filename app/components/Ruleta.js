'use client';

// La ruleta de Streamdle: tirás y te sale un streamer al azar para conocerlo.
// Mismo planteo que la de Pispeo: bolsa mezclada (no se repite hasta ver a todos), contador de descubiertos en
// localStorage y animación de rodillo. Si el navegador no deja guardar nada, la ruleta gira igual.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fmtNum } from '../../lib/formato';
import { C } from '../../lib/colores';

const CLAVE = 'streamdle-ruleta-vistas';
const ALTO = 76;
const FILAS = 18;
const DURACION = 2100;
const FILAS_SUAVE = 6;
const DURACION_SUAVE = 900;

const mezclar = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const leerVistas = () => { try { return new Set(JSON.parse(localStorage.getItem(CLAVE) || '[]')); } catch { return new Set(); } };
const guardarVistas = (v) => { try { localStorage.setItem(CLAVE, JSON.stringify([...v])); } catch { /* sin storage solo se pierde el contador */ } };
const fmt = (n) => fmtNum(n);

function Foto({ it, size }) {
  const [err, setErr] = useState(false);
  if (it.avatar && !err) return <img src={it.avatar} alt="" width={size} height={size} onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: 'var(--bg-card)' }} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,var(--color-purple),#9D5FF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size / 2.4, flexShrink: 0 }}>{it.nombre[0].toUpperCase()}</div>;
}

function Fila({ it }) {
  return (
    <div style={{ height: ALTO, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 16px', fontSize: 20, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
      <Foto it={it} size={40} /><span>{it.nombre}</span>
    </div>
  );
}

export default function Ruleta({ conTitulo = false }) {
  const [items, setItems] = useState(null);
  const [vistas, setVistas] = useState(new Set());
  const [res, setRes] = useState(null);
  const [girando, setGirando] = useState(false);
  const [filas, setFilas] = useState(null); // null = pantalla de espera
  const strip = useRef(null);
  const bolsa = useRef([]);
  const ultimo = useRef(null);
  const sinMov = useRef(false);

  const raiz = useRef(null);
  const pedido = useRef(false);
  const cargar = useCallback(() => {
    if (pedido.current) return;
    pedido.current = true;
    fetch('/api/ruleta').then((r) => r.json()).then((d) => setItems(d.items || [])).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    sinMov.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setVistas(leerVistas());
    // El listado pesa poco, pero no hace falta pedirlo hasta que la ruleta esté cerca de la pantalla.
    if (!('IntersectionObserver' in window)) { cargar(); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cargar(); obs.disconnect(); } }, { rootMargin: '300px' });
    if (raiz.current) obs.observe(raiz.current);
    return () => obs.disconnect();
  }, [cargar]);

  const sacar = () => {
    if (bolsa.current.length === 0) {
      bolsa.current = mezclar(items);
      const fin = bolsa.current.length - 1;
      if (fin > 0 && bolsa.current[fin].id === ultimo.current) [bolsa.current[0], bolsa.current[fin]] = [bolsa.current[fin], bolsa.current[0]];
    }
    const it = bolsa.current.pop();
    ultimo.current = it.id;
    return it;
  };

  const tirar = () => {
    if (girando || !items || items.length === 0) return;
    setGirando(true);
    const ganador = sacar();
    const n = sinMov.current ? FILAS_SUAVE : FILAS;
    const dur = sinMov.current ? DURACION_SUAVE : DURACION;
    const relleno = Array.from({ length: n }, () => items[Math.floor(Math.random() * items.length)]);
    const inicio = res || items[Math.floor(Math.random() * items.length)];
    setFilas([inicio, ...relleno, ganador]);
    // dos frames para que el navegador pinte la tira antes de moverla
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = strip.current;
      if (!el) return;
      el.style.transition = 'none';
      el.style.transform = 'translateY(0)';
      void el.offsetHeight;
      el.style.transition = `transform ${dur}ms cubic-bezier(.12,.7,.2,1)`;
      el.style.transform = `translateY(-${(n + 1) * ALTO}px)`;
    }));
    setTimeout(() => {
      const v = new Set(vistas); v.add(ganador.id);
      setVistas(v); guardarVistas(v);
      setRes(ganador);
      setFilas([ganador]);
      const el = strip.current;
      if (el) { el.style.transition = 'none'; el.style.transform = 'translateY(0)'; }
      setGirando(false);
    }, dur + 150);
  };

  const total = items ? items.length : 0;
  const n = vistas.size;
  const completas = total > 0 && n >= total;

  return (
    <section ref={raiz} data-ruleta style={{ background: 'var(--bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '28px 20px', maxWidth: 560, margin: '0 auto' }}>
      {conTitulo && (
        <header style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🎲 ¡Descubrí un <span style={{ background: 'linear-gradient(135deg,var(--color-purple),var(--color-kick))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>streamer</span>!</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '6px 0 0' }}>Tirá la ruleta y conocé a uno al azar. No se repite ninguno hasta que los veas a todos.</p>
        </header>
      )}

      <div style={{ position: 'relative', height: ALTO, overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: `1px solid ${girando ? C.purple : 'var(--color-border)'}`, boxShadow: girando ? '0 0 24px rgba(124,58,237,0.45)' : 'none', transition: 'box-shadow .3s, border-color .3s' }}>
        <div ref={strip} style={{ willChange: 'transform' }}>
          {filas
            ? filas.map((it, i) => <Fila key={i} it={it} />)
            : <div style={{ height: ALTO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--color-text-secondary)' }}>¿A quién te toca hoy?</div>}
        </div>
        <div style={{ pointerEvents: 'none', position: 'absolute', left: 0, right: 0, top: 0, height: 18, background: 'linear-gradient(to bottom, var(--bg-card), transparent)' }} />
        <div style={{ pointerEvents: 'none', position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: 'linear-gradient(to top, var(--bg-card), transparent)' }} />
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button type="button" onClick={tirar} onMouseEnter={cargar} onFocus={cargar} disabled={girando || !items || total === 0} className="btn-primary" style={{ padding: '14px 32px', fontSize: 16, fontWeight: 800, borderRadius: 'var(--radius-md)', opacity: girando ? 0.7 : 1, cursor: girando ? 'wait' : 'pointer' }}>
          <span style={{ display: 'inline-block', marginRight: 8, animation: girando ? 'dadoGira .6s linear infinite' : 'none' }}>🎲</span>
          {items === null ? 'Cargando…' : total === 0 ? 'Todavía no hay streamers' : res ? 'Descubrir otro' : 'Descubrir un streamer'}
        </button>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', minHeight: 16 }} aria-live="polite">
          {n > 0 && total > 0 ? (completas ? `Los descubriste a todos: ${total} de ${total} 🏆` : `Descubriste ${Math.min(n, total)} de ${total}`) : ''}
        </div>
        {n > 0 && total > 0 && (
          <div style={{ width: '100%', maxWidth: 260, height: 4, borderRadius: 'var(--radius-xs)', background: 'var(--bg-card)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.round((n / total) * 100))}%`, height: '100%', background: 'var(--color-purple)', transition: 'width .5s' }} />
          </div>
        )}
      </div>

      {res && !girando && (
        <div style={{ marginTop: 22, background: 'var(--bg-card)', border: '1px solid var(--color-purple)', borderRadius: 'var(--radius-lg)', padding: '18px 18px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <Foto it={res} size={64} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{res.nombre}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>{res.flag} {res.pais}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {fmt(res.seguidores)} seguidores{res.edad ? ` · ${res.edad} años` : ''}{res.categoria ? ` · ${res.categoria}` : ''}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>{res.bajada}</p>
              <div style={{ marginTop: 14 }}>
                <Link href={`/${res.slug}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 18px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 700 }}>Conocer a {res.nombre} →</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes dadoGira { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
