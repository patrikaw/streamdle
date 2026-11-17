# Streamdle

Juegos diarios, fichas, rankings y tendencias de streamers hispanos de Twitch y Kick. Sitio en [streamdle.net](https://streamdle.net).

Hecho con Next.js 16 (App Router), React 19 y Tailwind 4. No usa base de datos: los datos viven en archivos de `data/` y se actualizan con scripts y GitHub Actions.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción + verificación automática
```

Las claves de Twitch (`TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`) van en `.env.local` y como secretos del repositorio.

## Cómo se mantienen los datos

`data/streamers.js` es la fuente de verdad. Cinco flujos de GitHub Actions la completan y publican directo en `main`:

| Flujo | Cuándo | Qué hace |
|---|---|---|
| Actualizar datos de streamers | días 1 y 16 | seguidores de Twitch y Kick, y foto para tendencias |
| TwitchTracker | día 3 de cada mes | horas transmitidas y pico de espectadores |
| Actividad del mes | día 1 | resumen del mes anterior de cada streamer |
| Contenido diario | todos los días | mejores clips del día, la semana y el mes |
| Muestreo de juegos | cada 6 horas | qué juega cada streamer (ranking de GTA 6 y panel de las fichas) |

Más detalle en `CLAUDE.md`.
