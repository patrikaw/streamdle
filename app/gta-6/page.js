import Link from 'next/link';
import { Shell, jsonLd } from '../components/AgrupacionUI';
import { STREAMERS } from '../../data/streamers';
import { getTwitchToken } from '../../lib/twitch-server';
import { C } from '../../lib/colores';
import EnVivo from '../components/EnVivo';
import { rankingsGta } from '../../lib/muestreo';
import { EnVivoAhora } from '../components/Vivos';

export const revalidate = 600;

const SITE = 'https://streamdle.net';
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');

export const metadata = {
  title: 'GTA 6 en español: streamers en vivo y clips | Streamdle',
  description: 'Qué streamers hispanos juegan GTA 6 ahora en Twitch y sus clips más vistos. Ya disponible desde el 19 de noviembre de 2026: directos, clips y ranking de quién más lo jugó, actualizado cada pocos minutos.',
  alternates: { canonical: `${SITE}/gta-6` },
  openGraph: {
    title: 'GTA 6 en español: streamers en vivo y clips | Streamdle',
    description: 'Quién juega GTA 6 ahora entre los streamers hispanos y los clips más vistos.',
    url: `${SITE}/gta-6`, siteName: 'Streamdle', locale: 'es_ES', type: 'website',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

async function helix(ruta, token) {
  const r = await fetch(`https://api.twitch.tv/helix/${ruta}`, {
    headers: { 'Client-Id': process.env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token}` },
    next: { revalidate: 600 },
  });
  if (!r.ok) return null;
  return r.json();
}

async function datosTwitch() {
  try {
    const token = await getTwitchToken();
    const cat = await helix('search/categories?query=' + encodeURIComponent('Grand Theft Auto VI') + '&first=10', token);
    const juego = (cat?.data || []).find((c) => c.name === 'Grand Theft Auto VI');
    if (!juego) return null;

    const propios = new Map(STREAMERS.filter((s) => s.twitch).map((s) => [s.twitch.toLowerCase(), s]));

    // Directos en español (hasta 500) y cuáles son de streamers con ficha
    let cursor = '', vivos = [];
    for (let i = 0; i < 5; i++) {
      const d = await helix(`streams?game_id=${juego.id}&first=100${cursor ? `&after=${cursor}` : ''}`, token);
      if (!d) break;
      vivos = vivos.concat(d.data || []);
      cursor = d.pagination?.cursor;
      if (!cursor) break;
    }
    const enEspanol = vivos.filter((v) => v.language === 'es');
    const nuestros = enEspanol.filter((v) => propios.has(v.user_login.toLowerCase()))
      .map((v) => ({ ...v, ficha: propios.get(v.user_login.toLowerCase()) }))
      .sort((a, b) => b.viewer_count - a.viewer_count);

    // Clips de la última semana de streamers con ficha
    const desde = new Date(Date.now() - 7 * 86400000).toISOString();
    const c = await helix(`clips?game_id=${juego.id}&started_at=${desde}&first=100`, token);
    const clips = (c?.data || []).filter((x) => propios.has(x.broadcaster_name.toLowerCase()) || propios.has((x.broadcaster_login || '').toLowerCase()))
      .map((x) => ({ ...x, ficha: propios.get((x.broadcaster_login || x.broadcaster_name).toLowerCase()) }))
      .sort((a, b) => b.view_count - a.view_count).slice(0, 6);

    return { juego, totalEs: enEspanol.length, totalVivos: vivos.length, nuestros, clips };
  } catch {
    return null;
  }
}

export default async function Page() {
  const d = await datosTwitch();
  const url = `${SITE}/gta-6`;
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'GTA 6' }];
  const rk = rankingsGta();
  const top = rk.masHoras.map((x) => ({ ...x, s: STREAMERS.find((y) => slugDe(y) === x.slug) })).filter((x) => x.s).slice(0, 3);
  const faq = [
    ['¿Cuándo salió GTA 6?', 'GTA 6 salió el 19 de noviembre de 2026, según Rockstar Games.'],
    ['¿En qué plataformas está GTA 6?', 'En PlayStation 5 y Xbox Series X|S. Rockstar no ha anunciado fecha para la versión de PC. Conviene confirmarlo en los canales oficiales de Rockstar.'],
    ...(top.length ? [['¿Qué streamer hispano jugó más GTA 6?', `Según nuestras mediciones, ${top.map((x) => `${x.s.display_name} (${x.horas} h)`).join(', ')}. El ranking completo está en la página de ranking.`]] : []),
    ['¿Qué streamers hispanos juegan GTA 6?', 'En esta página mostramos en vivo cuáles de los streamers de Streamdle están transmitiendo GTA 6 en Twitch y sus clips más vistos de la última semana.'],
    ['¿Cada cuánto se actualiza esta página?', 'Cada 10 minutos aproximadamente.'],
  ];
  const caja = { background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' };
  return (
    <Shell crumbs={crumbs} seccion="juegos">
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.label, item: x.href ? `${SITE}${x.href}` : url })) })}
      {jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px' }}>🎮 GTA 6 en español: streamers en vivo y clips</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
        Quiénes juegan GTA 6 ahora entre los streamers hispanos de Streamdle y cuáles son sus clips más vistos. El juego salió el <strong style={{ color: '#fff' }}>19 de noviembre de 2026</strong> en PlayStation 5 y Xbox Series X|S, según Rockstar.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {[['/gta-6/clips/hoy', '🎬 Mejores clips de hoy'], ['/gta-6/clips/semana', 'Clips de la semana'], ['/gta-6/clips/mes', 'Clips del mes'], ['/gta-6/ranking', '🏆 Quién más lo jugó'], ['/gta-6/estadisticas', '📊 Día a día']].map(([h, l]) => (
          <Link key={h} href={h} className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{l}</Link>
        ))}
      </div>

      {d && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          {[[d.totalEs, 'directos en español ahora'], [d.nuestros.length, 'de streamers con ficha'], [d.totalVivos, 'directos en total (mundo)']].map(([v, l]) => (
            <div key={l} style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '8px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🔴 En vivo ahora</h2>
        {d && d.nuestros.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {d.nuestros.map((v) => (
              <Link key={v.id} href={`/${slugDe(v.ficha)}`} style={caja} className="agr-card">
                <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                  <img src={v.thumbnail_url.replace('{width}', '440').replace('{height}', '248')} alt={`${v.user_name} jugando GTA 6`} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <EnVivo style={{ position: 'absolute', top: 8, left: 8 }} />
                  <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-xs)' }}>👁 {v.viewer_count.toLocaleString('es-AR')}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{v.ficha.display_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 720 }}>
            Ahora mismo ningún streamer de Streamdle está transmitiendo GTA 6 en Twitch. Cuando alguno entre en directo con GTA 6 aparecerá aquí; la lista se actualiza cada pocos minutos.
          </p>
        )}
      </section>

      <div style={{ marginTop: 22 }}>
        <EnVivoAhora titulo="🟢 Jugando GTA 6 en Kick ahora" plataforma="Kick" juego="grand theft auto vi|gta ?(6|vi)" />
      </div>

      {d && d.clips.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🎬 Clips más vistos de la semana</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {d.clips.map((c) => (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" style={caja} className="agr-card">
                <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                  <img src={c.thumbnail_url} alt={c.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-xs)' }}>👁 {c.view_count.toLocaleString('es-AR')}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{c.ficha?.display_name || c.broadcaster_name}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {top.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🏆 Quién más lo jugó</h2>
          <div style={{ display: 'grid', gap: 8, maxWidth: 780 }}>
            {top.map((x, i) => (
              <Link key={x.slug} href={`/${x.slug}`} className="agr-card" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '10px 16px', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ minWidth: 28, fontSize: 13, fontWeight: 800, color: 'var(--color-purple-light)' }}>#{i + 1}</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: '#fff' }}>{x.s.display_name}</div>
                <div style={{ fontSize: 14 }}><strong style={{ color: C.okLight }}>{x.horas} h</strong> <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>jugando</span></div>
              </Link>
            ))}
          </div>
          <Link href="/gta-6/ranking" style={{ display: 'inline-block', marginTop: 10, fontSize: 13, fontWeight: 700, color: 'var(--color-purple-light)' }}>Ver el ranking completo →</Link>
        </section>
      )}

      <section style={{ marginTop: 36, maxWidth: 780 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Preguntas frecuentes sobre GTA 6</h2>
        {faq.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{q}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}
