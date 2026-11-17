// Única fuente de verdad de navegación y colores de identidad del sitio.
// Los colores salen de variables CSS (globals.css); acá solo se nombran.

export const JUEGOS = [
  { slug: 'classic', href: '/classic', emoji: '🎯', nombre: 'Streamdle', color: 'var(--game-classic)' },
  { slug: 'chatdle', href: '/chatdle', emoji: '💬', nombre: 'Chatdle', color: 'var(--game-chatdle)' },
  { slug: 'avatardle', href: '/avatardle', emoji: '👤', nombre: 'Avatardle', color: 'var(--game-avatardle)' },
  { slug: 'emojidle', href: '/emojidle', emoji: '😂', nombre: 'Emojidle', color: 'var(--game-emojidle)' },
  { slug: 'edadle', href: '/edadle', emoji: '🎂', nombre: 'Edadle', color: 'var(--game-edadle)' },
  { slug: 'higherdle', href: '/higherdle', emoji: '📊', nombre: 'Higherdle', color: 'var(--game-higherdle)' },
  { slug: 'categorydle', href: '/categorydle', emoji: '🎮', nombre: 'Categorydle', color: 'var(--game-categorydle)' },
];

// Una sección = un color, en todo el sitio (menú, tarjetas, pie, títulos).
export const SECCIONES = {
  juegos: { href: '/', emoji: '🎮', nombre: 'Juegos', color: 'var(--sec-juegos)' },
  ranking: { href: '/streamers', emoji: '🏆', nombre: 'Ranking', color: 'var(--sec-ranking)' },
  tendencias: { href: '/tendencias', emoji: '🔥', nombre: 'Tendencias', color: 'var(--sec-tendencias)' },
  comunidades: { href: '/comunidades', emoji: '👥', nombre: 'Comunidades', color: 'var(--sec-comunidades)' },
  clips: { href: '/clips/hoy', emoji: '🎬', nombre: 'Clips', color: 'var(--sec-clips)' },
  ruleta: { href: '/ruleta', emoji: '🎲', nombre: 'Descubrí un streamer', color: 'var(--color-purple)' },
};

export const MENU = ['juegos', 'ranking', 'tendencias', 'comunidades', 'clips'];

export const EXPLORAR = [
  { href: '/explorar', label: '🔍 Explorar todo' },
  { href: '/streamers/signo', label: '♈ Por signo' },
  { href: '/streamers/generacion', label: '🧬 Por generación' },
  { href: '/streamers/nacimiento', label: '🎈 Por año de nacimiento' },
  { href: '/streamers/personalidad', label: '🎭 Por personalidad' },
  { href: '/juegos', label: '🕹️ Por juego o categoría' },
];

export const LEGALES = [
  { href: '/como-jugar', label: 'Cómo jugar' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/terminos', label: 'Términos' },
];
