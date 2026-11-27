'use client';
import { useEffect } from 'react';

export default function PanelInferior({ abierto, onCerrar, titulo, children }) {
  useEffect(() => {
    if (!abierto) return;
    const esc = (e) => { if (e.key === 'Escape') onCerrar(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', esc); };
  }, [abierto, onCerrar]);

  if (!abierto) return null;
  return (
    <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn 0.15s ease' }}>
      <div role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderTop: '1px solid var(--color-border)', borderRadius: '16px 16px 0 0', animation: 'panelSube 0.22s ease', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <style>{`@keyframes panelSube{from{transform:translateY(100%)}to{transform:none}}`}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 8px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{titulo}</div>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', width: 34, height: 34, borderRadius: '50%', fontSize: 16, cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '14px 16px 20px', overscrollBehavior: 'contain' }}>{children}</div>
      </div>
    </div>
  );
}
