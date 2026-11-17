// Formato único de números abreviados para todo el sitio (es-AR): 391 K, 1,2 K, 5,6 M.
const es = (n, d) => n.toLocaleString('es-AR', { maximumFractionDigits: d });

export function fmtNum(valor, vacio = '0') {
  const n = typeof valor === 'string' ? parseInt(valor.replace(/[.,]/g, ''), 10) : Number(valor);
  if (!n || isNaN(n)) return vacio;
  if (n >= 999_500) return `${es(n / 1_000_000, 1)} M`;
  if (n >= 10_000) return `${es(Math.round(n / 1000), 0)} K`;
  if (n >= 1000) return `${es(n / 1000, 1)} K`;
  return es(n, 0);
}
