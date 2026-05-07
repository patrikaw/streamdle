import { STREAMERS } from './streamers';

// ── Cache en memoria (dura mientras la pestaña está abierta) ──────────────────
let memoryCache = null;
let memoryCacheTime = 0;
const MEMORY_TTL  = 1000 * 60 * 60;      // 1 hora en memoria
const STORAGE_TTL = 1000 * 60 * 60 * 24; // 24 horas en localStorage
const STORAGE_KEY      = 'streamdle_avatars_v2'; // v2 limpia caché viejo corrupto
const STORAGE_TIME_KEY = 'streamdle_avatars_v2_time';

export async function getAvatars() {
  // 1. Caché en memoria — más rápido, sin parsear JSON
  if (memoryCache && Date.now() - memoryCacheTime < MEMORY_TTL) {
    return memoryCache;
  }

  // 2. localStorage — válido por 24 horas
  if (typeof window !== 'undefined') {
    try {
      const savedTime = localStorage.getItem(STORAGE_TIME_KEY);
      const saved     = localStorage.getItem(STORAGE_KEY);

      if (saved && savedTime) {
        const age = Date.now() - parseInt(savedTime, 10);
        if (age < STORAGE_TTL) {
          const parsed = JSON.parse(saved);
          // Validar que tiene estructura esperada (más de 10 streamers)
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 10) {
            memoryCache     = parsed;
            memoryCacheTime = parseInt(savedTime, 10);
            return memoryCache;
          }
        }
      }

      // Limpiar claves viejas (v1)
      localStorage.removeItem('streamdle_avatars');
      localStorage.removeItem('streamdle_avatars_time');
    } catch {
      // localStorage puede fallar en modo privado — ignorar
    }
  }

  // 3. Fetch a la API
  return fetchAndCache();
}

async function fetchAndCache() {
  try {
    const twitchLogins = STREAMERS
      .filter(s => s.twitch && s.twitch.trim())
      .map(s => s.twitch.trim());

    if (twitchLogins.length === 0) return {};

    const res = await fetch(`/api/twitch-avatars?logins=${twitchLogins.join(',')}`);

    if (!res.ok) {
      console.error(`Avatar API error: ${res.status}`);
      return memoryCache || {};
    }

    const data = await res.json();

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      console.warn('Avatar API devolvió datos vacíos');
      return memoryCache || {};
    }

    memoryCache     = data;
    memoryCacheTime = Date.now();

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(STORAGE_TIME_KEY, memoryCacheTime.toString());
      } catch {
        // Falla si localStorage está lleno — no es crítico
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching avatars:', error);
    return memoryCache || {};
  }
}

const KICK_AVATARS = {
  'adrianozendejas32': 'https://files.kick.com/images/user/53715418/profile_image/conversion/4ddecb8f-57f5-4c84-a293-50d98fd3c1cb-fullsize.webp',
  'benjaz':            'https://files.kick.com/images/user/11383714/profile_image/conversion/b4458890-6422-43b0-aed7-f2b657c6b357-fullsize.webp',
  'cristorata7':       'https://files.kick.com/images/user/37748685/profile_image/conversion/bb8c1847-06c9-452b-9800-673997f74107-fullsize.webp',
};

export function getAvatarUrl(streamer, avatars = {}) {
  if (streamer.twitch) {
    const key = streamer.twitch.toLowerCase();
    if (avatars[key]?.avatar) return avatars[key].avatar;
  }
  const kickKey = (streamer.kick || '').toLowerCase();
  if (kickKey && KICK_AVATARS[kickKey]) return KICK_AVATARS[kickKey];
  if (streamer.twitch) return `https://unavatar.io/twitch/${streamer.twitch}`;
  if (streamer.kick)   return `https://unavatar.io/kick/${streamer.kick}`;
  return null;
}