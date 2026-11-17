// Aclara un color de acento hasta que se lea bien (contraste WCAG) sobre el fondo oscuro de las tarjetas.
const canales = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luz = (hex) => {
  const [r, g, b] = canales(hex).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => { const [x, y] = [luz(a), luz(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mezclar = (hex, t) => '#' + canales(hex).map((v) => Math.round(v + (255 - v) * t).toString(16).padStart(2, '0')).join('');

export function claro(hex, fondo = '#2A2A40', minimo = 4.8) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  for (let t = 0; t <= 1.001; t += 0.05) {
    const c = mezclar(hex, Math.min(t, 1));
    if (contraste(c, fondo) >= minimo) return c;
  }
  return '#FFFFFF';
}

// Texto claro u oscuro según el color de fondo del botón.
export const textoSobre = (hex) => (/^#[0-9a-f]{6}$/i.test(hex) && contraste('#FFFFFF', hex) < 4.5 ? '#0D0D14' : '#FFFFFF');
