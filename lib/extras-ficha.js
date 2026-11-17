import historial from '../data/historial.json';
import { fmtNum } from './formato';

const HITOS = [100_000, 250_000, 500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000, 20_000_000];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Hito de seguidores de Twitch cruzado entre la foto más vieja y la más nueva guardadas (máx. ~7 meses).
export function hitoDe(s) {
  const fotos = [...historial.snapshots].sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (fotos.length < 2) return null;
  const fin = fotos[fotos.length - 1];
  const limite = new Date(fin.fecha).getTime() - 215 * 86400000;
  const ini = fotos.find((f) => new Date(f.fecha).getTime() >= limite) || fotos[0];
  const id = String(s.id);
  const a = ini.tw?.[id], b = fin.tw?.[id];
  if (!a || !b || ini === fin) return null;
  const t = [...HITOS].reverse().find((h) => a < h && b >= h);
  if (!t) return null;
  const d = new Date(ini.fecha + 'T12:00:00Z');
  return { texto: `🏅 Superó ${fmtNum(t)} en Twitch`, title: `Pasó de ${fmtNum(a)} a ${fmtNum(b)} seguidores en Twitch desde ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}` };
}
