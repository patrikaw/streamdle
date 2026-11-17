// "1 streamer" / "5 streamers": evita "1 streamers".
export const plural = (n, uno, varios) => `${Number(n).toLocaleString('es-AR')} ${Number(n) === 1 ? uno : (varios || uno + 's')}`;
