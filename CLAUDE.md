# Streamdle

Minijuegos de Wordle para la comunidad de streamers hispanos. Next.js 16 + React 19 + Tailwind 4.

## Stack
- **Framework:** Next.js 16 (App Router)
- **Estilos:** Tailwind CSS v4
- **Datos:** archivos JS/JSON estáticos, sin base de datos

## Estructura clave
- `app/` — rutas y páginas (cada juego tiene su propia carpeta)
- `app/components/` — componentes compartidos
- `app/juegos/[slug]/` — ficha dinámica por juego
- `app/comunidades/top-globales/` — página de comunidades con clips, trivia y redes
- `data/streamers.js` — fuente de verdad de todos los streamers
- `data/trivia-overrides.json` — trivia personalizada por streamer
- `data/seo-overrides.json` — metadatos SEO por streamer/juego
- `lib/twitch-server.js` — llamadas a la API de Twitch (solo server-side)

## Juegos disponibles
`classic`, `higherdle`, `avatardle`, `categorydle`, `chatdle`, `emojidle`

## Comandos
```bash
npm run dev    # servidor local (puerto 3000)
npm run build  # build de producción
```

## Reglas para Claude
- Preguntar antes de editar archivos de lógica de juego o datos.
- Devolver solo el fragmento modificado, sin explicaciones largas.
- No generar resúmenes al final de cada respuesta.
- No añadir comentarios al código salvo que el WHY sea no obvio.
