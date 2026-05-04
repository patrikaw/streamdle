import { STREAMERS } from './streamers';

let avatarCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export async function getAvatars() {
  // Si el caché es reciente, lo devolvemos directo
  if (avatarCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return avatarCache;
  }

  // Si hay algo en localStorage, lo usamos mientras cargamos
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('streamdle_avatars');
    const savedTime = localStorage.getItem('streamdle_avatars_time');
    if (saved && savedTime && Date.now() - parseInt(savedTime) < CACHE_DURATION * 24) {
      avatarCache = JSON.parse(saved);
      cacheTimestamp = parseInt(savedTime);
      // Actualizamos en background
      fetchAndCacheAvatars();
      return avatarCache;
    }
  }

  return await fetchAndCacheAvatars();
}

async function fetchAndCacheAvatars() {
  try {
    // Tomamos todos los streamers con Twitch
    const twitchStreamers = STREAMERS.filter(s => s.twitch);
    const logins = twitchStreamers.map(s => s.twitch).join(',');

    const res = await fetch(`/api/twitch-avatars?logins=${logins}`);
    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    avatarCache = data;
    cacheTimestamp = Date.now();

    if (typeof window !== 'undefined') {
      localStorage.setItem('streamdle_avatars', JSON.stringify(data));
      localStorage.setItem('streamdle_avatars_time', cacheTimestamp.toString());
    }

    return data;
  } catch (error) {
    console.error('Error fetching avatars:', error);
    return avatarCache || {};
  }
}

export function getAvatarUrl(streamer, avatars = {}) {
  // Primero intentamos con la caché de Twitch API
  if (streamer.twitch && avatars[streamer.twitch.toLowerCase()]) {
    return avatars[streamer.twitch.toLowerCase()].avatar;
  }
  // Fallback a unavatar
  if (streamer.twitch) return `https://unavatar.io/twitch/${streamer.twitch}`;
  if (streamer.kick) return `https://unavatar.io/kick/${streamer.kick}`;
  return null;
}