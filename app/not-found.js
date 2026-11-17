import Link from 'next/link';
export const metadata = { title: 'Página no encontrada', robots: { index: false } };

const ENLACES = [
  { href: '/classic', label: '🎯 Classic' },
  { href: '/edadle', label: '🎂 Edadle' },
  { href: '/ruleta', label: '🎲 Descubrí un streamer' },
  { href: '/streamers', label: '📚 Todos los streamers' },
];

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }} aria-hidden="true">📡</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Este canal no está al aire</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          La página que buscás no existe o cambió de lugar. Probá con alguno de estos:
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {ENLACES.map((l) => (
            <a key={l.href} href={l.href} style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        <Link href="/" style={{ display: 'inline-block', marginTop: 20, fontSize: 13, color: 'var(--color-text-secondary)' }}>← Volver al inicio</Link>
      </div>
    </main>
  );
}
