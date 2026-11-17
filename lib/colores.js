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

// Paleta del sitio como valores hex (para lógica JS: claro(), sufijos de transparencia, etc.).
// Deben coincidir con las variables de globals.css.
export const C = {
  purple: '#7C3AED', purpleLight: '#B794FF',
  twitch: '#9146FF', kick: '#53FC18',
  ok: '#16A34A', okLight: '#4ADE80',
  error: '#DC2626', errorLight: '#F87171', live: '#EF4444',
  warn: '#F59E0B', warnLight: '#FBBF24',
  youtube: '#FF0000', instagram: '#E1306C', x: '#1DA1F2', tiktok: '#69C9D0',
  info: '#0EA5E9', blue: '#2563EB', blueLight: '#60A5FA',
};

export const C_JUEGO = {
  classic: '#DC2626', chatdle: '#B45309', avatardle: '#9D5FF5', emojidle: '#F59E0B', edadle: '#DB2777', higherdle: '#2563EB', categorydle: '#059669',
};
export const C_SEC = { juegos: '#7C3AED', ranking: '#2563EB', tendencias: '#F97316', comunidades: '#14B8A6', clips: '#EC4899' };

// Un color por categoría de juego, el mismo en todo el sitio.
export const COLOR_CATEGORIA = {
  'Just Chatting': '#7C3AED', 'Minecraft': '#53FC18', 'Grand Theft Auto V': '#F97316', 'Fortnite': '#38BDF8',
  'League of Legends': '#EAB308', 'Counter-Strike': '#EF4444', 'Valorant': '#FF4655', 'World of Warcraft': '#AAE0FA',
  'Kings League': '#F59E0B', 'EA Sports FC 26': '#16A34A', 'Sports': '#22C55E', 'Variety': '#8B5CF6',
  'Rust': '#D97706', 'Clash Royale': '#6366F1',
};

export const colorCategoria = (nombre) => COLOR_CATEGORIA[nombre] ?? '#7C3AED';
