'use client';
import { useEffect, useState } from 'react';
import EnVivo from './EnVivo';

// Insignia "EN VIVO" en la ficha: consulta Twitch/Kick al abrir la página (las fichas son estáticas).
export default function VivoAhora({ twitch, kick }) {
  const [vivo, setVivo] = useState(null);
  useEffect(() => {
    const q = new URLSearchParams({ ...(twitch ? { twitch } : {}), ...(kick ? { kick } : {}) });
    if (![...q.keys()].length) return;
    fetch(`/api/en-vivo?${q}`).then((r) => r.json()).then((d) => setVivo(d.vivo)).catch(() => {});
  }, [twitch, kick]);
  if (!vivo) return null;
  return (
    <a href={vivo.url} target="_blank" rel="noopener noreferrer" title={`En vivo en ${vivo.plataforma}${vivo.juego ? ` · ${vivo.juego}` : ''}`} style={{ textDecoration: 'none' }}>
      <EnVivo viewers={vivo.viewers} />
    </a>
  );
}
