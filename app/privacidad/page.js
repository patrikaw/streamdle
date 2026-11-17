import { C } from '../../lib/colores';
export const metadata = {
  title: 'Política de Privacidad — Streamdle',
  description: 'Leé la política de privacidad de Streamdle. Cómo manejamos tus datos, cookies y todo lo que necesitás saber sobre tu información.',
  alternates: { canonical: 'https://streamdle.net/privacidad' },
};

export default function PrivacidadPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 16px 64px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Política de Privacidad</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '32px' }}>Última actualización: Mayo 2026</p>

        {[
          {
            title: '1. Información que recopilamos',
            content: 'Streamdle no recopila datos personales identificables. No requerimos registro ni inicio de sesión. Toda la información del progreso del juego (intentos, rachas, récords) se almacena únicamente en tu navegador mediante localStorage y nunca se envía a nuestros servidores.',
          },
          {
            title: '2. Datos de uso',
            content: 'Podemos utilizar herramientas de analítica anónima (como Google Analytics) para entender cómo se usa el sitio. Estos datos son agregados y no permiten identificar usuarios individuales. Incluyen páginas visitadas, tiempo en el sitio y país de origen.',
          },
          {
            title: '3. Cookies',
            content: 'Streamdle utiliza localStorage del navegador para guardar tu progreso de juego local. Terceros proveedores, entre ellos Google, utilizan cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. El uso de cookies publicitarias permite a Google y a sus socios mostrar anuncios según tu navegación. Podés desactivar la publicidad personalizada en https://www.google.com/settings/ads y consultar cómo Google usa los datos en https://policies.google.com/technologies/partner-sites.',
          },
          {
            title: '4. APIs de terceros',
            content: 'Utilizamos la API oficial de Twitch para obtener imágenes de perfil de streamers. Esta información es pública y no incluye datos personales de los usuarios del sitio. Los datos de streamers (seguidores, horas, categorías) son información pública obtenida de fuentes como Twitchtracker y Streamscharts.',
          },
          {
            title: '5. Información de streamers',
            content: 'Toda la información mostrada sobre streamers (nombre, estadísticas, categorías) es información pública disponible en sus perfiles de Twitch, Kick o YouTube. Si sos un streamer y querés que tu información sea modificada o eliminada, contactanos en contacto@streamdle.net.',
          },
          {
            title: '6. Menores de edad',
            content: 'Streamdle está dirigido a usuarios mayores de 13 años. No recopilamos intencionalmente información de menores de 13 años.',
          },
          {
            title: '7. Cambios a esta política',
            content: 'Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos publicando la nueva versión en esta página con la fecha de actualización.',
          },
          {
            title: '8. Contacto',
            content: 'Si tenés preguntas sobre esta política de privacidad, escribinos a contacto@streamdle.net.',
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: C.purpleLight }}>{section.title}</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{section.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}