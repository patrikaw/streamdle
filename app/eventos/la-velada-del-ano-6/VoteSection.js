'use client';
import { useState, useEffect } from 'react';
import { getAvatarsForLogins } from '../../../data/avatars';

const FIGHTS = [
  { id: 'c1', n: 1, f1: { name: 'Gastón Edul',    country: 'Argentina',     flag: '🇦🇷' },              f2: { name: 'Edu Aguirre',       country: 'España',        flag: '🇪🇸' } },
  { id: 'c2', n: 2, f1: { name: 'La Parce',        country: 'Colombia',      flag: '🇨🇴' },              f2: { name: 'Fabiana Sevillano', country: 'España',        flag: '🇪🇸' } },
  { id: 'c3', n: 3, f1: { name: 'Natalia MX',      country: 'México',        flag: '🇲🇽', twitch: 'nataliamx' },    f2: { name: 'Clersss',           country: 'España/México', flag: '🇪🇸' } },
  { id: 'c4', n: 4, f1: { name: 'Lit Killah',      country: 'Argentina',     flag: '🇦🇷', twitch: 'litkillah' },    f2: { name: 'Kidd Keo',          country: 'España',        flag: '🇪🇸' } },
  { id: 'c5', n: 5, f1: { name: 'Alondrissa',      country: 'Puerto Rico',   flag: '🇵🇷', twitch: 'alondrissa' },   f2: { name: 'Angie Velasco',     country: 'Argentina',     flag: '🇦🇷', twitch: 'angievelasco08' } },
  { id: 'c6', n: 6, f1: { name: 'Gero Arias',      country: 'Argentina',     flag: '🇦🇷' },              f2: { name: 'Viruzz',            country: 'España',        flag: '🇪🇸', twitch: 'byviruzz' } },
  { id: 'c7', n: 7, f1: { name: 'Samy Rivers',     country: 'México',        flag: '🇲🇽', twitch: 'rivers_gg' },   f2: { name: 'Roro',              country: 'España',        flag: '🇪🇸' } },
  { id: 'c8', n: 8, f1: { name: 'Tatiana Kaer',    country: 'España',        flag: '🇪🇸' },              f2: { name: 'Marta Díaz',        country: 'España',        flag: '🇪🇸' } },
  { id: 'c9', n: 9, f1: { name: 'Fernanfloo',      country: 'El Salvador',   flag: '🇸🇻', twitch: 'fernanfloo' },  f2: { name: 'Yo Soy Plex',       country: 'España',        flag: '🇪🇸' } },
];

const LS_KEY = 'velada6_picks';

const TWITCH_LOGINS = [...new Set(
  FIGHTS.flatMap(f => [f.f1.twitch, f.f2.twitch].filter(Boolean))
)];

function Avatar({ url, flag, size = 52, align = 'left' }) {
  const [err, setErr] = useState(false);
  if (url && !err) {
    return (
      <img
        src={url}
        onError={() => setErr(true)}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.35)',
          objectFit: 'cover',
          marginBottom: 8,
          display: 'block',
          ...(align === 'right' ? { marginLeft: 'auto' } : {}),
        }}
      />
    );
  }
  return <div style={{ fontSize: 28, marginBottom: 6 }}>{flag}</div>;
}

export default function VoteSection() {
  const [picks, setPicks] = useState({});
  const [mounted, setMounted] = useState(false);
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      setPicks(saved);
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!TWITCH_LOGINS.length) return;
    getAvatarsForLogins(TWITCH_LOGINS).then(data => {
      const map = {};
      TWITCH_LOGINS.forEach(login => {
        const key = login.toLowerCase();
        const url = data[key]?.avatar || `https://unavatar.io/twitch/${login}`;
        map[login] = url;
      });
      setAvatars(map);
    }).catch(() => {});
  }, []);

  function vote(fightId, side) {
    if (picks[fightId]) return;
    const next = { ...picks, [fightId]: side };
    setPicks(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  }

  const totalPicked = Object.keys(picks).length;

  return (
    <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 60px' }}>
      <style>{`
        .fight-half { transition: opacity 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .fight-half:hover { opacity: 0.92 !important; }
        @media (max-width: 600px) {
          .fight-row { flex-direction: column !important; }
          .fight-vs  { width: 100% !important; height: 40px !important; flex-direction: row !important; }
          .fight-half { width: 100% !important; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, marginBottom: 8 }}>
          🥊 Cronograma de Combates
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Hacé clic en el lado del peleador que creés que va a ganar
        </p>
        {mounted && totalPicked > 0 && (
          <div style={{ marginTop: 10, display: 'inline-block', background: 'rgba(83,252,24,0.1)', border: '1px solid rgba(83,252,24,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#53FC18', fontWeight: 700 }}>
            {totalPicked}/{FIGHTS.length} predicciones hechas
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20, fontSize: 12, fontWeight: 700 }}>
        <span style={{ color: '#60A5FA' }}>🌎 Internacional</span>
        <span style={{ color: '#FCA5A5' }}>🇪🇸 España</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FIGHTS.map(fight => {
          const picked = side => mounted ? picks[fight.id] === side : false;
          const hasPick = mounted && !!picks[fight.id];

          const f1Avatar = fight.f1.twitch ? avatars[fight.f1.twitch] : null;
          const f2Avatar = fight.f2.twitch ? avatars[fight.f2.twitch] : null;

          return (
            <div key={fight.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-card)' }}>

              {/* Fight number header */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', padding: '7px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: '#64748b' }}>COMBATE {fight.n}</span>
                {hasPick && <span style={{ fontSize: 10, fontWeight: 700, color: '#53FC18' }}>✓ predicción guardada</span>}
              </div>

              <div className="fight-row" style={{ display: 'flex', minHeight: 110 }}>

                {/* Fighter 1 */}
                <div
                  className="fight-half"
                  onClick={() => vote(fight.id, 'f1')}
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    padding: '16px 18px',
                    opacity: hasPick && !picked('f1') ? 0.3 : 1,
                    boxShadow: picked('f1') ? 'inset 0 0 0 3px #93C5FD, 0 0 24px #2563EB44' : 'inset 0 0 0 2px rgba(37,99,235,0.45)',
                    cursor: hasPick ? 'default' : 'pointer',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {f1Avatar
                    ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${f1Avatar})`, backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'blur(18px) brightness(0.18)', transform: 'scale(1.15)' }} />
                    : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f2352 0%, #1a3a7a 100%)' }} />
                  }
                  {picked('f1') && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, zIndex: 2 }}>✅</div>}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Avatar url={f1Avatar} flag={fight.f1.flag} align="left" />
                    <div style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{fight.f1.name}</div>
                    <div style={{ fontSize: 11, color: '#93C5FD', marginTop: 4, fontWeight: 600 }}>
                      {fight.f1.flag} {fight.f1.country}
                    </div>
                  </div>
                </div>

                {/* VS center */}
                <div className="fight-vs" style={{
                  width: 44, flexShrink: 0, background: '#06060c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>VS</div>
                </div>

                {/* Fighter 2 */}
                <div
                  className="fight-half"
                  onClick={() => vote(fight.id, 'f2')}
                  style={{
                    flex: 1,
                    background: '#0a0a14',
                    padding: '16px 18px',
                    textAlign: 'right',
                    opacity: hasPick && !picked('f2') ? 0.3 : 1,
                    boxShadow: picked('f2') ? 'inset 0 0 0 3px #FCA5A5, 0 0 24px #DC262644' : 'inset 0 0 0 2px rgba(220,38,38,0.45)',
                    cursor: hasPick ? 'default' : 'pointer',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {f2Avatar
                    ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${f2Avatar})`, backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'blur(18px) brightness(0.18)', transform: 'scale(1.15)' }} />
                    : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #4a0a0a 0%, #7a1a1a 100%)' }} />
                  }
                  {picked('f2') && <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 16, zIndex: 2 }}>✅</div>}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Avatar url={f2Avatar} flag={fight.f2.flag} align="right" />
                    <div style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{fight.f2.name}</div>
                    <div style={{ fontSize: 11, color: '#FCA5A5', marginTop: 4, fontWeight: 600 }}>
                      {fight.f2.flag} {fight.f2.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {mounted && totalPicked === FIGHTS.length && (
        <div style={{ marginTop: 24, textAlign: 'center', background: 'rgba(83,252,24,0.08)', border: '1px solid rgba(83,252,24,0.25)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#53FC18' }}>¡Predicciones completas!</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 6 }}>25 de julio de 2026 — Estadio de La Cartuja, Sevilla</div>
        </div>
      )}
    </section>
  );
}
