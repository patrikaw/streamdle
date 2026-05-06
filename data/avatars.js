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

const KICK_AVATARS = {
  'adrianozendejas32': 'https://files.kick.com/images/user/53715418/profile_image/conversion/4ddecb8f-57f5-4c84-a293-50d98fd3c1cb-fullsize.webp',
  'benjaz': 'https://files.kick.com/images/user/11383714/profile_image/conversion/b4458890-6422-43b0-aed7-f2b657c6b357-fullsize.webp',
  'cristorata7': 'https://files.kick.com/images/user/37748685/profile_image/conversion/bb8c1847-06c9-452b-9800-673997f74107-fullsize.webp',
};

export function getAvatarUrl(streamer, avatars = {}) {
  if (streamer.twitch && avatars[streamer.twitch.toLowerCase()]) {
    return avatars[streamer.twitch.toLowerCase()].avatar;
  }
  const kickKey = (streamer.kick || '').toLowerCase();
  if (kickKey && KICK_AVATARS[kickKey]) return KICK_AVATARS[kickKey];
  if (streamer.twitch) return `https://unavatar.io/twitch/${streamer.twitch}`;
  if (streamer.kick) return `https://unavatar.io/kick/${streamer.kick}`;
  return null;
}