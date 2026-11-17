'use client';
import Link from 'next/link';

export default function Error({ reset }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }} aria-hidden="true">🔌</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Se cortó la transmisión</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          Algo falló de nuestro lado. Probá de nuevo; si sigue pasando, volvé al inicio.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={() => reset()} style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reintentar</button>
          <Link href="/" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ir al inicio</Link>
        </div>
      </div>
    </main>
  );
}
