'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { STREAMERS } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

// ── helpers ───────────────────────────────────────────────────────────────────

function findStreamer(slug) {
  return STREAMERS.find(s =>
    s.display_name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

function fmt(n) {
  if (!n) return '—';
  const num = Number(n);
  if (isNaN(num) || num === 0) return '—';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1_000) return Math.round(num / 1_000) + 'K';
  return num.toLocaleString('es-AR');
}

function fmtFull(n) {
  if (!n) return '—';
  const num = Number(n);
  if (isNaN(num) || num === 0) return '—';
  return num.toLocaleString('es-AR');
}

function countryName(code) {
  const map = {
    ES: 'España', AR: 'Argentina', MX: 'México', PE: 'Perú',
    CO: 'Colombia', CL: 'Chile', SV: 'El Salvador', PR: 'Puerto Rico',
    VE: 'Venezuela', UY: 'Uruguay', GT: 'Guatemala', DO: 'Rep. Dominicana',
    FR: 'Francia', NO: 'Noruega',
  };
  return map[code] || code;
}

function countrySlug(code) {
  const map = {
    ES: 'espana', AR: 'argentina', MX: 'mexico', PE: 'peru',
    CO: 'colombia', CL: 'chile',
  };
  return map[code] || null;
}

function flagOf(code) {
  const map = {
    ES:'🇪🇸', AR:'🇦🇷', MX:'🇲🇽', PE:'🇵🇪', CO:'🇨🇴', CL:'🇨🇱',
    SV:'🇸🇻', PR:'🇵🇷', VE:'🇻🇪', UY:'🇺🇾', GT:'🇬🇹', DO:'🇩🇴',
    FR:'🇫🇷', NO:'🇳🇴',
  };
  return map[code] || '🌍';
}

function debutYear(iso) {
  if (!iso || iso.trim() === '') return null;
  try { return new Date(iso).getFullYear(); } catch { return null; }
}

function yearsActive(iso) {
  const y = debutYear(iso);
  if (!y) return null;
  return new Date().getFullYear() - y;
}

function calcAge(birthYear) {
  if (!birthYear) return null;
  return new Date().getFullYear() - Number(birthYear);
}

function hoursLabel(h) {
  const n = Number(h);
  if (!n) return null;
  if (n >= 8760) return `≈ ${(n / 8760).toFixed(1)} años transmitiendo`;
  if (n >= 720) return `≈ ${Math.round(n / 720)} meses transmitiendo`;
  return `${fmtFull(n)} horas en total`;
}

function getRelated(streamer) {
  return STREAMERS
    .filter(s => s.id !== streamer.id)
    .map(s => {
      let score = 0;
      if (streamer.community && s.community) {
        const sc = Array.isArray(s.community) ? s.community : [s.community];
        const tc = Array.isArray(streamer.community) ? streamer.community : [streamer.community];
        if (sc.some(c => tc.includes(c))) score += 10;
      }
      if (s.country === streamer.country) score += 4;
      if (s.top_category && s.top_category === streamer.top_category) score += 2;
      const ratio = (streamer.total_followers || 1) > 0
        ? s.total_followers / streamer.total_followers
        : 0;
      if (ratio > 0.4 && ratio < 2.5) score += 1;
      return { s, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.s);
}

// ── TRIVIA ────────────────────────────────────────────────────────────────────

function generateTrivia(streamer) {
  const questions = [];
  const rnd = arr => [...arr].sort(() => Math.random() - 0.5);

  // Q1: ¿De quién es esta frase? — solo si tiene catchphrase
  const othersWithPhrase = STREAMERS.filter(s =>
    s.id !== streamer.id && s.catchphrase && s.catchphrase.trim()
  );
  if (streamer.catchphrase && streamer.catchphrase.trim() && othersWithPhrase.length >= 3) {
    const wrongs = rnd(othersWithPhrase).slice(0, 3).map(s => s.catchphrase);
    questions.push({
      q: `¿Cuál de estas frases es de ${streamer.display_name}?`,
      options: rnd([streamer.catchphrase, ...wrongs]),
      answer: streamer.catchphrase,
      explanation: `"${streamer.catchphrase}" es una de las frases más reconocibles de ${streamer.display_name}.`,
    });
  }

  // Q2: Seguidores totales
  if (streamer.total_followers > 0) {
    const base = streamer.total_followers;
    const options = rnd([base, Math.round(base * 0.5), Math.round(base * 1.8), Math.round(base * 0.28)]).map(n => fmt(n));
    questions.push({
      q: `¿Cuántos seguidores totales tiene ${streamer.display_name}?`,
      options,
      answer: fmt(base),
      explanation: `${streamer.display_name} acumula ${fmtFull(base)} seguidores en total.`,
    });
  }

  // Q3: Categoría principal
  if (streamer.top_category) {
    const wrongCats = [...new Set(
      STREAMERS.filter(s => s.top_category && s.top_category !== streamer.top_category)
        .map(s => s.top_category)
    )];
    questions.push({
      q: `¿Con qué contenido se hizo conocido ${streamer.display_name}?`,
      options: rnd([streamer.top_category, ...rnd(wrongCats).slice(0, 3)]),
      answer: streamer.top_category,
      explanation: `${streamer.display_name} es conocido principalmente por streamear ${streamer.top_category}.`,
    });
  }

  // Q4: Peak histórico
  if (streamer.peak_viewers > 0) {
    const base = streamer.peak_viewers;
    const options = rnd([base, Math.round(base * 0.35), Math.round(base * 2.5), Math.round(base * 0.65)]).map(n => fmt(n));
    questions.push({
      q: `¿Cuál fue el pico máximo de espectadores de ${streamer.display_name}?`,
      options,
      answer: fmt(base),
      explanation: `El récord histórico de ${streamer.display_name} fue de ${fmtFull(base)} espectadores simultáneos.`,
    });
  }

  // Q5: Año de nacimiento
  if (streamer.birth_year) {
    const base = Number(streamer.birth_year);
    const age = calcAge(base);
    const options = rnd([base, base - 3, base + 2, base - 1]).map(String);
    questions.push({
      q: `¿En qué año nació ${streamer.display_name}?`,
      options,
      answer: String(base),
      explanation: `${streamer.display_name} nació en ${base}${age ? `, tiene ${age} años` : ''}.`,
    });
  }

  // Q6: País
  const correctCountry = countryName(streamer.country);
  const wrongCountries = rnd(
    ['España','Argentina','México','Colombia','Chile','Perú','Venezuela','Uruguay']
      .filter(c => c !== correctCountry)
  ).slice(0, 3);
  questions.push({
    q: `¿De qué país es ${streamer.display_name}?`,
    options: rnd([correctCountry, ...wrongCountries]),
    answer: correctCountry,
    explanation: `${streamer.display_name} es de ${correctCountry}${streamer.real_name ? `. Su nombre real es ${streamer.real_name}` : ''}.`,
  });

  // Q7: Año de debut en Twitch
  const debut = debutYear(streamer.created_at);
  if (debut) {
    const options = rnd([debut, debut - 3, debut + 2, debut - 1]).map(String);
    questions.push({
      q: `¿En qué año creó ${streamer.display_name} su canal de Twitch?`,
      options,
      answer: String(debut),
      explanation: `${streamer.display_name} abrió su canal en ${debut}, lleva ${yearsActive(streamer.created_at)} años en Twitch.`,
    });
  }

  // Priorizar catchphrase y peak, mezclar el resto, tomar 4
  const priority = questions.filter(q => q.q.includes('frase') || q.q.includes('pico'));
  const rest = rnd(questions.filter(q => !q.q.includes('frase') && !q.q.includes('pico')));
  return [...priority, ...rest].slice(0, 4);
}

// ── SUB-COMPONENTES ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--color-border)',
      borderRadius: 12, padding: '14px 18px', flex: 1, minWidth: 120,
    }}>
      <div style={{
        fontSize: 10, color: 'var(--color-text-secondary)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || '#fff', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SocialLink({ href, label, color, bg }) {
  const [hov, setHov] = useState(false);
  if (!href || !href.trim()) return null;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: hov ? color : bg,
        color: hov ? '#fff' : color,
        border: `1px solid ${color}44`,
        borderRadius: 8, padding: '6px 14px',
        fontSize: 12, fontWeight: 700, textDecoration: 'none',
        transition: 'all 0.18s',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {label} ↗
    </a>
  );
}

function TriviaSection({ streamer }) {
  const [questions] = useState(() => generateTrivia(streamer));
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore]       = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
        No hay suficientes datos para generar una trivia todavía.
      </p>
    );
  }

  const q = questions[current];

  function handleSelect(opt) {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) setFinished(true);
    else { setCurrent(c => c + 1); setSelected(null); }
  }

  function handleReset() {
    setCurrent(0); setSelected(null); setScore(0); setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>
          {pct === 100 ? '🏆' : pct >= 75 ? '🔥' : pct >= 50 ? '✅' : '😅'}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
          {score} / {questions.length} correctas
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          {pct === 100
            ? `¡Sos un experto en ${streamer.display_name}!`
            : pct >= 75 ? '¡Muy bien! Sabés bastante.'
            : pct >= 50 ? 'Nada mal, pero podés mejorar.'
            : `Tenés que ver más streams de ${streamer.display_name} 😂`}
        </div>
        <button onClick={handleReset} className="btn-primary">
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14,
      }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          {current + 1} / {questions.length}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 28, height: 4, borderRadius: 2,
              background: i < current
                ? 'var(--color-purple)'
                : i === current
                  ? 'var(--color-purple-light)'
                  : 'var(--color-border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Pregunta */}
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, lineHeight: 1.4 }}>
        {q.q}
      </div>

      {/* Opciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {q.options.map(opt => {
          const isSelected = selected === opt;
          const isRight = opt === q.answer;
          let bg = 'var(--bg-primary)', border = 'var(--color-border)', color = '#fff';
          if (selected) {
            if (isRight) { bg = 'rgba(22,163,74,0.2)'; border = '#16A34A'; color = '#4ADE80'; }
            else if (isSelected) { bg = 'rgba(220,38,38,0.2)'; border = '#DC2626'; color = '#F87171'; }
          }
          return (
            <button key={opt} onClick={() => handleSelect(opt)} style={{
              background: bg, border: `1.5px solid ${border}`, color,
              borderRadius: 10, padding: '11px 14px', textAlign: 'left',
              fontSize: 13, fontWeight: 600,
              cursor: selected ? 'default' : 'pointer',
              transition: 'all 0.18s',
            }}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explicación + siguiente */}
      {selected && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{
            fontSize: 13, color: 'var(--color-text-secondary)',
            background: 'var(--bg-card)', borderRadius: 8,
            padding: '10px 14px', marginBottom: 12, lineHeight: 1.5,
            borderLeft: `3px solid ${selected === q.answer ? '#16A34A' : '#DC2626'}`,
          }}>
            {selected === q.answer ? '✅ ' : '❌ '}{q.explanation}
          </div>
          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>
            {current + 1 >= questions.length ? 'Ver resultado →' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}

function RelatedCard({ streamer, avatars }) {
  const [hov, setHov] = useState(false);
  const [err, setErr] = useState(false);
  const slug = streamer.display_name.toLowerCase().replace(/\s+/g, '-');
  const url = getAvatarUrl(streamer, avatars);

  return (
    <a
      href={`/${slug}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: hov ? 'var(--bg-card)' : 'var(--bg-secondary)',
        border: `1px solid ${hov ? 'var(--color-purple)' : 'var(--color-border)'}`,
        borderRadius: 10, padding: '10px 12px',
        textDecoration: 'none', color: 'inherit',
        transition: 'all 0.18s',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {url && !err ? (
        <img src={url} alt={streamer.display_name} style={{
          width: 36, height: 36, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
        }} onError={() => setErr(true)} />
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#7C3AED,#53FC18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff',
        }}>
          {streamer.display_name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#fff',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {streamer.display_name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          {flagOf(streamer.country)} · {fmt(streamer.total_followers)} segs
        </div>
      </div>
    </a>
  );
}

// ── NOT FOUND ─────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg-secondary)',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎮</span>
          <span style={{
            fontSize: 18, fontWeight: 800,
            background: 'linear-gradient(135deg,#7C3AED,#53FC18)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>STREAMDLE</span>
        </a>
      </header>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>👤</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Streamer no encontrado
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 32, maxWidth: 400 }}>
          Este streamer no está en nuestra base de datos todavía.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/streamers" className="btn-primary" style={{ textDecoration: 'none' }}>
            Ver todos los streamers
          </a>
          <a href="/contacto" style={{
            textDecoration: 'none', color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)', borderRadius: 8,
            padding: '10px 20px', fontSize: 14, fontWeight: 600,
          }}>
            Sugerir streamer
          </a>
        </div>
        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
            Mientras tanto, probá nuestros juegos:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { href: '/classic',   label: '🎯 Classic' },
              { href: '/avatardle', label: '👤 Avatardle' },
              { href: '/emojidle',  label: '😂 Emojidle' },
              { href: '/higherdle', label: '📊 Higherdle' },
            ].map(g => (
              <a key={g.href} href={g.href} style={{
                background: 'var(--bg-card)', border: '1px solid var(--color-border)',
                color: '#fff', borderRadius: 8, padding: '8px 16px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>{g.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function StreamerPage() {
  const params   = useParams();
  const slug     = params?.slug || '';
  const streamer = findStreamer(slug);

  const [avatars,    setAvatars]    = useState({});
  const [imgErr,     setImgErr]     = useState(false);
  useEffect(() => {
    getAvatars().then(d => setAvatars(d || {}));
  }, []);

  if (!streamer) return <NotFound />;

  const avatarUrl = getAvatarUrl(streamer, avatars);
  const related   = getRelated(streamer);
  const debut     = debutYear(streamer.created_at);
  const age       = calcAge(streamer.birth_year);
  const isPartner = streamer.broadcaster_type === 'partner';

  const twitchUrl = streamer.twitch ? `https://twitch.tv/${streamer.twitch}` : null;
  const kickUrl   = streamer.kick   ? `https://kick.com/${streamer.kick}`   : null;

  const platforms = [
    streamer.twitch_followers > 0 && {
      name: 'Twitch', followers: streamer.twitch_followers,
      hours: streamer.twitch_hours, color: '#9146FF', url: twitchUrl,
    },
    streamer.kick_followers > 0 && {
      name: 'Kick', followers: streamer.kick_followers,
      hours: streamer.kick_hours, color: '#53FC18', url: kickUrl,
    },
  ].filter(Boolean);

  const socials = [
    { href: twitchUrl,                  label: 'Twitch',    color: '#9146FF', bg: 'rgba(145,70,255,0.1)'  },
    { href: kickUrl,                    label: 'Kick',      color: '#53FC18', bg: 'rgba(83,252,24,0.1)'   },
    { href: streamer.youtube_url,       label: 'YouTube',   color: '#FF0000', bg: 'rgba(255,0,0,0.1)'     },
    { href: streamer.twitter_url,       label: 'X/Twitter', color: '#1DA1F2', bg: 'rgba(29,161,242,0.1)'  },
    { href: streamer.instagram_url,     label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.1)'  },
    { href: streamer.tiktok_url,        label: 'TikTok',    color: '#69C9D0', bg: 'rgba(105,201,208,0.1)' },
  ].filter(s => s.href && s.href.trim());

  // Breadcrumb
  const crumbs = [
    { label: 'Streamdle', href: '/' },
    { label: 'Streamers', href: '/streamers' },
  ];
  const cSlug = countrySlug(streamer.country);
  if (cSlug) {
    crumbs.push({
      label: `${flagOf(streamer.country)} ${countryName(streamer.country)}`,
      href: `/streamers/${cSlug}`,
    });
  }
  crumbs.push({ label: streamer.display_name, href: null });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* HEADER */}
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', gap: 12, flexWrap: 'wrap',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎮</span>
          <span style={{
            fontSize: 18, fontWeight: 800,
            background: 'linear-gradient(135deg,#7C3AED,#53FC18)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>STREAMDLE</span>
        </a>
        <div className="game-nav-links" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/classic',     label: '🎯 Classic' },
            { href: '/avatardle',   label: '👤 Avatardle' },
            { href: '/emojidle',    label: '😂 Emojidle' },
            { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle',     label: '💬 Chatdle' },
            { href: '/higherdle',   label: '📊 Higherdle' },
          ].map(g => (
            <a key={g.href} href={g.href} style={{
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
              color: 'white', borderRadius: 8, padding: '5px 12px',
              fontSize: 10, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '12px 16px 0',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--color-text-secondary)', flexWrap: 'wrap',
      }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span>›</span>}
            {c.href ? (
              <a href={c.href}
                style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = 'var(--color-text-secondary)'}
              >{c.label}</a>
            ) : (
              <span style={{ color: '#fff', fontWeight: 600 }}>{c.label}</span>
            )}
          </span>
        ))}
      </div>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 64px' }}>

        {/* ── HERO ── */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16,
          border: '1px solid var(--color-border)',
          overflow: 'hidden', marginBottom: 16,
          animation: 'fadeIn 0.4s ease',
        }}>
          {/* Banner difuminado */}
          <div style={{
            height: 110, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a0a2e, #0d1a0d)',
          }}>
            {avatarUrl && !imgErr && (
              <img src={avatarUrl} alt="" style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                filter: 'blur(22px) brightness(0.25) saturate(1.5)',
                transform: 'scale(1.1)',
              }} />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, var(--bg-secondary) 100%)',
            }} />
          </div>

          <div style={{ padding: '0 20px 20px', marginTop: -44, position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end',
              gap: 14, marginBottom: 14, flexWrap: 'wrap',
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {avatarUrl && !imgErr ? (
                  <img src={avatarUrl} alt={streamer.display_name} style={{
                    width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                    border: '3px solid var(--bg-secondary)',
                    boxShadow: '0 0 0 2px var(--color-purple)',
                  }} onError={() => setImgErr(true)} />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#7C3AED,#53FC18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 800, color: '#fff',
                    border: '3px solid var(--bg-secondary)',
                    boxShadow: '0 0 0 2px var(--color-purple)',
                  }}>
                    {streamer.display_name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {streamer.is_active && (
                  <span style={{
                    position: 'absolute', bottom: 3, right: 3,
                    width: 13, height: 13, borderRadius: '50%',
                    background: '#16A34A', border: '2px solid var(--bg-secondary)',
                  }} title="Activo" />
                )}
              </div>

              {/* Nombre y meta */}
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, margin: 0 }}>
                    {streamer.display_name}
                  </h1>
                  {isPartner && (
                    <span style={{
                      background: '#9146FF', color: '#fff',
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    }}>PARTNER</span>
                  )}
                  {!streamer.is_active && (
                    <span style={{
                      background: 'var(--bg-card)', color: 'var(--color-text-secondary)',
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    }}>INACTIVO</span>
                  )}
                </div>
                {streamer.real_name && (
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {streamer.real_name}{age ? ` · ${age} años` : ''}
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  {flagOf(streamer.country)} {countryName(streamer.country)}
                  {debut ? ` · En Twitch desde ${debut}` : ''}
                </div>
              </div>
            </div>

            {/* Descripción del canal */}
            {streamer.description && streamer.description.trim() && (
              <p style={{
                fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6,
                margin: '0 0 14px', fontStyle: 'italic',
                borderLeft: '3px solid var(--color-purple)', paddingLeft: 12,
              }}>
                "{streamer.description}"
              </p>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {streamer.top_category && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(124,58,237,0.2)', color: 'var(--color-purple-light)',
                  border: '1px solid rgba(124,58,237,0.3)',
                }}>{streamer.top_category}</span>
              )}
              {streamer.second_category && streamer.second_category !== '(No tiene)' && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(124,58,237,0.1)', color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}>{streamer.second_category}</span>
              )}
              {streamer.community && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(83,252,24,0.12)', color: 'var(--color-green)',
                  border: '1px solid rgba(83,252,24,0.25)',
                }}>
                  {Array.isArray(streamer.community)
                    ? streamer.community.join(' · ')
                    : streamer.community}
                </span>
              )}
              {streamer.esports_team && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(37,99,235,0.15)', color: '#60A5FA',
                  border: '1px solid rgba(37,99,235,0.3)',
                }}>⚔️ {streamer.esports_team}</span>
              )}
            </div>

            {/* Redes sociales */}
            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {socials.map(s => <SocialLink key={s.label} {...s} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10,
          }}>
            En números
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatCard
              label="Seguidores totales"
              value={fmt(streamer.total_followers)}
              sub={fmtFull(streamer.total_followers)}
              color="var(--color-purple-light)"
            />
            <StatCard
              label="Peak histórico"
              value={fmt(streamer.peak_viewers)}
              sub="espectadores simultáneos"
              color="#F59E0B"
            />
            <StatCard
              label="Horas en stream"
              value={fmt(streamer.total_hours)}
              sub={hoursLabel(streamer.total_hours)}
              color="var(--color-green)"
            />
            {debut && (
              <StatCard
                label="Años activo"
                value={`${yearsActive(streamer.created_at)} años`}
                sub={`Desde ${debut}`}
                color="#60A5FA"
              />
            )}
          </div>
        </div>

        {/* ── POR PLATAFORMA ── */}
        {platforms.length > 1 && (
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 14,
            border: '1px solid var(--color-border)',
            padding: '14px 18px', marginBottom: 16,
          }}>
            <h2 style={{
              fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12,
            }}>Por plataforma</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {platforms.map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, minWidth: 130, textDecoration: 'none',
                    background: 'var(--bg-card)', borderRadius: 10,
                    border: `1px solid ${p.color}44`, padding: '12px 14px',
                    transition: 'transform 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: p.color, marginBottom: 4 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                    {fmt(p.followers)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    seguidores · {fmt(p.hours)} hs
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── CLIP MÁS VISTO ── */}
        {streamer.top_clip_url && (
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 14,
            border: '1px solid var(--color-border)',
            padding: '14px 18px', marginBottom: 16,
          }}>
            <h2 style={{
              fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10,
            }}>🎬 Clip más visto</h2>
            <a
              href={streamer.top_clip_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--bg-card)', borderRadius: 10,
                border: '1px solid var(--color-border)',
                padding: '14px 16px', textDecoration: 'none',
                transition: 'border-color 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-purple)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: 'var(--color-purple)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>▶</div>
              <div style={{ minWidth: 0 }}>
                {streamer.top_clip_title && (
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: '#fff',
                    marginBottom: 4, lineHeight: 1.3,
                  }}>
                    {streamer.top_clip_title}
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {streamer.top_clip_views > 0 && (
                    <span>{fmtFull(streamer.top_clip_views)} vistas · </span>
                  )}
                  <span style={{ color: 'var(--color-purple-light)' }}>Ver en Twitch ↗</span>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* ── TRIVIA ── */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 14,
          border: '1px solid var(--color-purple)',
          padding: '14px 18px', marginBottom: 16,
        }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 16,
          }}>
            🧠 ¿Cuánto sabés de {streamer.display_name}?
          </h2>
          <TriviaSection streamer={streamer} />
        </div>

        {/* ── BANNER JUEGOS ── */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(83,252,24,0.08))',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 14, padding: '18px 20px', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              ¿Podés adivinar a {streamer.display_name} en los juegos?
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Ponelo a prueba en nuestros 6 juegos diarios de streamers
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { href: '/classic',   label: '🎯 Classic' },
              { href: '/avatardle', label: '👤 Avatardle' },
              { href: '/chatdle',   label: '💬 Chatdle' },
            ].map(g => (
              <a key={g.href} href={g.href} style={{
                background: 'var(--color-purple)', color: '#fff',
                borderRadius: 8, padding: '7px 14px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >{g.label}</a>
            ))}
          </div>
        </div>

        {/* ── RELACIONADOS ── */}
        {related.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10,
            }}>
              Streamers relacionados
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
              gap: 8,
            }}>
              {related.map(s => (
                <RelatedCard key={s.id} streamer={s} avatars={avatars} />
              ))}
            </div>
          </div>
        )}

        {/* ── SEO TEXT ── */}
        <div style={{
          padding: '18px 20px', borderRadius: 12,
          border: '1px solid var(--color-border)',
          background: 'var(--bg-secondary)',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            Sobre {streamer.display_name}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
            {streamer.display_name} es un streamer de {countryName(streamer.country)}
            {streamer.real_name ? `, cuyo nombre real es ${streamer.real_name}` : ''}
            {age ? ` (${age} años)` : ''}.
            {debut ? ` Activo en Twitch desde ${debut},` : ''} acumula {fmtFull(streamer.total_followers)} seguidores
            y {fmtFull(streamer.total_hours)} horas de transmisión.
            {streamer.top_category ? ` Su contenido principal es ${streamer.top_category}` : ''}
            {streamer.second_category && streamer.second_category !== '(No tiene)'
              ? ` y ${streamer.second_category}` : ''}.
            {streamer.peak_viewers > 0
              ? ` Su pico histórico fue de ${fmtFull(streamer.peak_viewers)} espectadores simultáneos.`
              : ''}
            {streamer.is_active ? ' Actualmente sigue activo.' : ''}
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--color-border)', background: 'var(--bg-secondary)',
        padding: '20px 24px', textAlign: 'center',
        fontSize: 12, color: 'var(--color-text-secondary)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          {[
            { href: '/streamers', label: 'Todos los streamers' },
            { href: '/contacto',  label: 'Contacto' },
            { href: '/privacidad', label: 'Privacidad' },
            { href: '/terminos',  label: 'Términos' },
          ].map(l => (
            <a key={l.href} href={l.href}
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
        © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
        <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--color-green)', textDecoration: 'none' }}>Pato Wnuk</a>.
      </footer>
    </div>
  );
}