/**
 * Eventos por categoría — agregar manualmente.
 *
 * Cada evento:
 *   id          — slug único, ej: 'fncs-2024-global'
 *   title       — nombre del evento
 *   subtitle    — formato o subtítulo, ej: 'Squads', 'Solo', 'Charity'
 *   date        — fecha ISO 'YYYY-MM-DD' o rango 'YYYY-MM-DD/YYYY-MM-DD'
 *   description — texto breve del evento
 *   url         — link externo (opcional)
 *   type        — 'tournament' | 'collab' | 'charity' | 'event' | 'series'
 *   streamers   — array de twitch logins que participaron (opcional)
 */
export const EVENTS_BY_CATEGORY = {
  // 'Fortnite': [
  //   {
  //     id: 'fncs-2024-global',
  //     title: 'FNCS Global Championship 2024',
  //     subtitle: 'Trios',
  //     date: '2024-12-14/2024-12-15',
  //     description: 'TheGrefg y k1ng representaron a la comunidad hispana en la final global del FNCS.',
  //     url: 'https://www.fortnite.com/competitive',
  //     type: 'tournament',
  //     streamers: ['thegrefg', 'k1ng'],
  //   },
  // ],
  // 'Minecraft': [],
  // 'Just Chatting': [],
};

export function getEventsForCategory(categoryName) {
  return EVENTS_BY_CATEGORY[categoryName] ?? [];
}
