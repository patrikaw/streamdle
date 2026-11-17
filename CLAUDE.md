# Streamdle

Minijuegos de Wordle y fichas de streamers hispanos de Twitch y Kick. Next.js 16 + React 19 + Tailwind 4.

## Stack
- **Framework:** Next.js 16 (App Router)
- **Estilos:** Tailwind CSS v4
- **Datos:** archivos JS/JSON estáticos, sin base de datos

## Estructura clave
- `app/` — rutas y páginas (cada juego tiene su propia carpeta)
- `app/components/` — componentes compartidos (Shell, ruleta, clips, SEO de juegos)
- `app/[slug]/` — ficha de cada streamer
- `app/comunidades/` — grupos de streamers (Top Globales tiene página propia)
- `app/tendencias/`, `app/clips/`, `app/gta-6/` — páginas que se renuevan con los datos automáticos
- `data/streamers.js` — **fuente de verdad** de todos los streamers (se edita a mano y la tocan los scripts)
- `data/historial.json` — fotos de seguidores cada 15 días (tendencias y archivo)
- `data/actividad.json`, `data/muestreo.json`, `data/contenido.json` — actividad mensual, juegos por streamer y clips (los generan scripts)
- `data/seo-overrides.json` — metadatos SEO por streamer/juego
- `lib/twitch-server.js` — llamadas a la API de Twitch (solo server-side)

## Juegos disponibles
`classic`, `higherdle`, `avatardle`, `categorydle`, `chatdle`, `emojidle`, `edadle`

## Datos automáticos (GitHub Actions, publican directo en main)
- `scripts/actualizar-datos.mjs` — seguidores Twitch/Kick, días 1 y 16
- `scripts/twitchtracker.py` — horas y peak (TwitchTracker), día 3 de cada mes
- `scripts/actividad-mensual.mjs` — resumen del mes anterior, día 1
- `scripts/contenido-diario.mjs` — mejores clips, todos los días
- `scripts/muestreo.mjs` — qué juega cada streamer, 4 veces al día
- `scripts/verificar-build.mjs` — corre solo tras `npm run build`; si falta algo esencial, el build falla

## Comandos
```bash
npm run dev      # servidor local (puerto 3000)
npm run build    # build de producción (incluye la verificación)
npm run actualizar          # simula la actualización de seguidores
npm run actualizar:aplicar  # la aplica
```

## Reglas para Claude
- Preguntar antes de editar archivos de lógica de juego o datos.
- Devolver solo el fragmento modificado, sin explicaciones largas.
- No generar resúmenes al final de cada respuesta.
- No añadir comentarios al código salvo que el WHY sea no obvio.

## Reglas de datos
- Solo información verificada; lo que no se pueda confirmar queda vacío.
- Nuevos streamers: España desde 500.000 seguidores (Twitch + Kick), resto desde 200.000.
- Kick: no cargar canales con menos de 5.000 seguidores (excepción: dtoke). Otras redes: mínimo 10.000.
- Los datos se editan en `data/streamers.js`: ya no hay generador desde planilla.
