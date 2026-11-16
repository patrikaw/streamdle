import Link from 'next/link';
import { Shell, jsonLd } from '../components/AgrupacionUI';
import Ruleta from '../components/Ruleta';

const SITE = 'https://streamdle.net';

export const metadata = {
  title: 'Ruleta de streamers: descubrí uno al azar | Streamdle',
  description: 'Tirá la ruleta y conocé a un streamer hispano de Twitch o Kick al azar: edad, seguidores, categoría y su ficha completa. No se repite ninguno hasta que los veas a todos.',
  alternates: { canonical: `${SITE}/ruleta` },
  openGraph: {
    title: 'Ruleta de streamers: descubrí uno al azar', description: 'Tirá la ruleta y conocé a un streamer hispano al azar.',
    url: `${SITE}/ruleta`, siteName: 'Streamdle', locale: 'es_ES', type: 'website', images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const FAQ = [
  ['¿Cómo funciona la ruleta de streamers?', 'Apretás el botón y la ruleta elige al azar a un streamer hispano de Twitch o Kick con ficha en Streamdle. Te mostramos su país, seguidores, categoría y un resumen, y podés ir a su ficha completa.'],
  ['¿Se repiten los streamers?', 'No. La ruleta no repite a ninguno hasta que los descubriste a todos. Tu progreso se guarda en tu navegador.'],
  ['¿Qué streamers entran en la ruleta?', 'Los que tienen la ficha más completa: con biografía y varios datos verificados. A medida que completamos más fichas, entran más streamers.'],
];

export default function Page() {
  const crumbs = [{ label: 'Inicio', href: '/' }, { label: 'Ruleta' }];
  return (
    <Shell crumbs={crumbs}>
      {jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `${SITE}${c.href}` : `${SITE}/ruleta` })) })}
      {jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, margin: '20px 0 10px', textAlign: 'center' }}>🎲 Ruleta de streamers</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 640, margin: '0 auto 24px', textAlign: 'center' }}>
        ¿No sabés a quién mirar? Tirá la ruleta y descubrí a un streamer hispano de Twitch o Kick al azar.
      </p>
      <Ruleta />
      <section style={{ marginTop: 40, maxWidth: 780, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Preguntas frecuentes</h2>
        {FAQ.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{q}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          {[['/streamers', '🏆 Ranking de streamers'], ['/tendencias', '🔥 En tendencia'], ['/edadle', '🎂 Jugá Edadle'], ['/', '🎮 Todos los juegos']].map(([h, l]) => (
            <Link key={h} href={h} className="agr-chip" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
