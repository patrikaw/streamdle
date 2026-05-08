import { STREAMERS } from '../data/streamers';

export function categoryToSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildCategoryMap() {
  const map = new Map();
  for (const s of STREAMERS) {
    if (s.top_category) {
      if (!map.has(s.top_category)) map.set(s.top_category, { primary: [], secondary: [] });
      map.get(s.top_category).primary.push(s);
    }
    if (s.second_category && s.second_category !== s.top_category) {
      if (!map.has(s.second_category)) map.set(s.second_category, { primary: [], secondary: [] });
      map.get(s.second_category).secondary.push(s);
    }
  }
  return map;
}

let _map = null;
function getMap() {
  if (!_map) _map = buildCategoryMap();
  return _map;
}

export function getCategoryFromSlug(slug) {
  for (const name of getMap().keys()) {
    if (categoryToSlug(name) === slug) return name;
  }
  return null;
}

export function getCategoriesWithMinStreamers(min = 10) {
  const map = getMap();
  return Array.from(map.entries())
    .map(([name, { primary, secondary }]) => {
      const all = [...primary, ...secondary].sort((a, b) => b.total_followers - a.total_followers);
      return {
        name,
        slug: categoryToSlug(name),
        primaryCount: primary.length,
        secondaryCount: secondary.length,
        totalCount: primary.length + secondary.length,
        topStreamers: all.slice(0, 3),
      };
    })
    .filter(c => c.totalCount >= min)
    .sort((a, b) => b.totalCount - a.totalCount);
}

export function getStreamersByCategory(categoryName) {
  const map = getMap();
  const data = map.get(categoryName);
  if (!data) return { primary: [], secondary: [] };
  return {
    primary: [...data.primary].sort((a, b) => b.total_followers - a.total_followers),
    secondary: [...data.secondary].sort((a, b) => b.total_followers - a.total_followers),
  };
}
