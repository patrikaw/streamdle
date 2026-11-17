// Racha de días seguidos ganando al menos un juego, leída de lo que los juegos ya guardan en el navegador
// (claves "<juego>_<país>_<AAAA-MM-DD>"). No toca la lógica de ningún juego.
const CLAVE = /^(classic|avatardle|emojidle|categorydle|chatdle|edadle)_[A-Za-z]+_(\d{4}-\d{2}-\d{2})$/;

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function rachaActual() {
  const dias = new Set();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const m = CLAVE.exec(k || '');
      if (!m) continue;
      try { const v = JSON.parse(localStorage.getItem(k)); if (v?.won && v?.gameOver) dias.add(m[2]); } catch {}
    }
  } catch { return 0; }
  const d = new Date();
  if (!dias.has(iso(d))) d.setDate(d.getDate() - 1); // si hoy todavía no ganó, la racha de ayer sigue viva
  let n = 0;
  while (dias.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
