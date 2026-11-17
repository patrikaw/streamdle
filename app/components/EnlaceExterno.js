'use client';

// Enlace a otro sitio para usar DENTRO de una tarjeta que ya es un enlace (un <a> dentro de otro <a> no es HTML válido).
export default function EnlaceExterno({ href, className, style, children }) {
  const abrir = (e) => { e.preventDefault(); e.stopPropagation(); window.open(href, '_blank', 'noopener,noreferrer'); };
  return (
    <span role="link" tabIndex={0} className={className} style={{ textDecoration: 'none', cursor: 'pointer', ...style }}
      onClick={abrir} onKeyDown={(e) => { if (e.key === 'Enter') abrir(e); }}>
      {children}
    </span>
  );
}
