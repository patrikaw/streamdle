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

    // Fetch avatars for kick-only streamers (no Twitch account)
    const kickOnly = STREAMERS.filter(s => !s.twitch?.trim() && s.kick?.trim());
    if (kickOnly.length > 0) {
      try {
        const kickLogins = kickOnly.map(s => s.kick.trim()).join(',');
        const kickRes = await fetch(`/api/kick-live?users=${kickLogins}`);
        if (kickRes.ok) {
          const kickData = await kickRes.json();
          kickOnly.forEach(s => {
            const key = s.kick.trim().toLowerCase();
            const av = kickData[s.kick.trim()]?.avatar || kickData[key]?.avatar;
            if (av) data[`__kick__${key}`] = { avatar: av };
          });
        }
      } catch {}
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

export async function getAvatarsForLogins(logins) {
  if (!logins.length) return memoryCache || {};

  // Si memoryCache está vacío, intentar cargar desde localStorage primero
  // (evita un fetch de red cuando el usuario viene de una sesión anterior)
  if (!memoryCache && typeof window !== 'undefined') {
    try {
      const savedTime = localStorage.getItem(STORAGE_TIME_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && savedTime && Date.now() - parseInt(savedTime, 10) < STORAGE_TTL) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 10) {
          memoryCache = parsed;
          memoryCacheTime = parseInt(savedTime, 10);
        }
      }
    } catch {}
  }

  const cached = memoryCache || {};
  const missing = logins.filter(l => !(l in cached));

  if (missing.length === 0) return cached;

  try {
    const res = await fetch(`/api/twitch-avatars?logins=${missing.join(',')}`);
    if (!res.ok) return cached;
    const data = await res.json();
    if (!data || typeof data !== 'object') return cached;

    memoryCache = { ...cached, ...data };
    memoryCacheTime = Date.now();
    return memoryCache;
  } catch {
    return cached;
  }
}

export function getAvatarUrl(streamer, avatars = {}) {
  if (streamer.twitch) {
    const key = streamer.twitch.toLowerCase();
    if (avatars[key]?.avatar) return avatars[key].avatar;
    return `https://unavatar.io/twitch/${streamer.twitch}`;
  }
  const kickKey = (streamer.kick || '').toLowerCase();
  if (kickKey) {
    if (avatars[`__kick__${kickKey}`]?.avatar) return avatars[`__kick__${kickKey}`].avatar;
    if (KICK_AVATARS[kickKey]) return KICK_AVATARS[kickKey];
    return `https://unavatar.io/kick/${kickKey}`;
  }
  return null;
}