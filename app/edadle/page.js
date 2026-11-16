'use client';

import { useState, useEffect } from 'react';
import { STREAMERS, COUNTRIES, getDailyStreamerNoRepeat, getYesterdayStreamer } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

const MAX_ATTEMPTS = 6;
const tieneEdad = (s) => !!(s.birth_year && s.birth_month && s.birth_day);
const slugDe = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');
const GAMES = [{ href: '/', label: '🎮 Nuestros juegos' }, { href: '/ruleta', label: '🎲 Descubrí un streamer' }];

function edadDe(s) {
  const h = new Date();
  let e = h.getFullYear() - s.birth_year;
  if (h.getMonth() + 1 < s.birth_month || (h.getMonth() + 1 === s.birth_month && h.getDate() < s.birth_day)) e--;
  return e;
}

function claveDelDia(country) {
  const d = new Date();
  return `edadle_${country}_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function pista(diff, n) {
  const d = Math.abs(diff);
  if (d === 0) return { txt: '¡Exacto!', color: '#16A34A' };
  if (n < 2) return { txt: 'No es esa edad', color: '#A78BFA' };
  const dir = diff > 0 ? 'es mayor ↑' : 'es menor ↓';
  if (n < 3) return { txt: dir, color: '#A78BFA' };
  const calor = d <= 1 ? 'Muy cerca' : d <= 3 ? 'Cerca' : d <= 6 ? 'Lejos' : 'Muy lejos';
  return { txt: `${calor} · ${dir}`, color: d <= 3 ? '#F59E0B' : '#DC2626' };
}

function Cuenta() {
  const [t, setT] = useState('');
  useEffect(() => {
    const u = () => {
      const n = new Date(), m = new Date(n); m.setDate(m.getDate() + 1); m.setHours(0, 0, 0, 0);
      const d = m - n; const p = (x) => String(x).padStart(2, '0');
      setT(`${p(Math.floor(d / 3600000))}:${p(Math.floor((d % 3600000) / 60000))}:${p(Math.floor((d % 60000) / 1000))}`);
    };
    u(); const i = setInterval(u, 1000); return () => clearInterval(i);
  }, []);
  return <span className="countdown">{t}</span>;
}

function Resultado({ won, intentos, target, edad, onClose }) {
  const [copiado, setCopiado] = useState(false);
  const bloques = Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (i < intentos - 1 ? '🟥' : i === intentos - 1 && won ? '🟩' : i < intentos ? '🟥' : '⬛')).join('');
  const texto = won ? `🎂 Edadle ${intentos}/${MAX_ATTEMPTS}\n${bloques}\nstreamdle.net/edadle` : `🎂 Edadle\nNo adiviné la edad 💀\n${bloques}\nstreamdle.net/edadle`;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{won ? (intentos <= 2 ? '🔥' : '✅') : '💀'}</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{won ? '¡Adivinaste la edad!' : '¡Casi!'}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>{target.display_name} tiene <strong style={{ color: '#fff' }}>{edad} años</strong> y nació el {target.birth_date}.</p>
          <div style={{ fontSize: 24, letterSpacing: 4, margin: '10px 0' }}>{bloques}</div>
        </div>
        <a href={`/${slugDe(target)}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: 12 }}>Ver la ficha de {target.display_name} →</a>
        <div style={{ textAlign: 'center', marginBottom: 16, padding: 12, background: 'var(--bg-primary)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Próximo streamer en</div>
          <Cuenta />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-green" style={{ flex: 1 }} onClick={() => navigator.clipboard.writeText(texto).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 2000); })}>{copiado ? '✓ ¡Copiado!' : '🔗 Compartir'}</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => { window.location.href = '/'; }}>🎮 Otros juegos</button>
        </div>
      </div>
    </div>
  );
}

export default function EdadlePage() {
  const [country, setCountry] = useState('ALL');
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [valor, setValor] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [avatars, setAvatars] = useState({});
  const [imgErr, setImgErr] = useState(false);
  const [ayer, setAyer] = useState(null);

  useEffect(() => { getAvatars().then(setAvatars); }, []);
  useEffect(() => { setAyer(getYesterdayStreamer(country, 'edadle', 97, tieneEdad)); }, [country]);
  useEffect(() => { setImgErr(false); }, [target?.id, avatars]);

  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(claveDelDia(country)); } catch {}
    const nuevo = () => getDailyStreamerNoRepeat(country, 'edadle', 97, tieneEdad);
    if (saved) {
      const { guesses: g, won: w, gameOver: go, targetId } = JSON.parse(saved);
      setTarget(STREAMERS.find((s) => s.id === targetId) || nuevo());
      setGuesses(g); setWon(w); setGameOver(go);
    } else {
      setTarget(nuevo()); setGuesses([]); setWon(false); setGameOver(false); setShowModal(false); setValor('');
    }
  }, [country]);

  useEffect(() => {
    if (!target) return;
    try { localStorage.setItem(claveDelDia(country), JSON.stringify({ guesses, won, gameOver, targetId: target.id })); } catch {}
  }, [guesses, won, gameOver, target]);

  if (!target) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ textAlign: 'center', color: '#A1A1B5' }}><h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>🎂 ¿Cuántos años tiene este streamer?</h1>Cargando...</div></div>;

  const edad = edadDe(target);
  const avatarUrl = getAvatarUrl(target, avatars);
  const pistas = [
    guesses.length >= 2 && `Generación: ${target.generation}`,
    guesses.length >= 4 && `Signo: ${target.zodiac}`,
  ].filter(Boolean);

  const adivinar = (e) => {
    e.preventDefault();
    const n = parseInt(valor, 10);
    if (gameOver || !Number.isFinite(n) || n < 10 || n > 80) return;
    const ng = [...guesses, n];
    setGuesses(ng); setValor('');
    if (n === edad) { setWon(true); setGameOver(true); setTimeout(() => setShowModal(true), 700); }
    else if (ng.length >= MAX_ATTEMPTS) { setGameOver(true); setTimeout(() => setShowModal(true), 700); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{ borderBottom: '1px solid var(--color-border)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', gap: 12, flexWrap: 'wrap' }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#7C3AED,#53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</a>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {GAMES.map((g) => (
            <a key={g.href} href={g.href} style={{ background: '#7C3AED', border: '1px solid var(--color-border)', color: 'white', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>{g.label}</a>
          ))}
        </div>
      </header>
      <main className="game-main-content" style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🎂 ¿Cuántos años tiene este streamer?</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Tenés {MAX_ATTEMPTS} intentos. Desde el 2.º intento te decimos si es mayor o menor, y desde el 3.º también qué tan cerca estás.</p>
        </div>
        {ayer && <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 13, color: 'var(--color-text-secondary)' }}>El de ayer fue <a href={`/${slugDe(ayer)}`} style={{ fontWeight: 700, color: '#9146FF', textDecoration: 'none' }}>{ayer.display_name}</a> ({edadDe(ayer)} años)</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {COUNTRIES.map((c) => <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`} onClick={() => setCountry(c.code)}>{c.label}</button>)}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', border: '3px solid var(--color-purple)', boxShadow: '0 0 30px rgba(124,58,237,0.4)', background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatarUrl && !imgErr
              ? <img key={target.id} src={avatarUrl} alt={target.display_name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
              : <span style={{ fontSize: 56 }}>{target.display_name[0]}</span>}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{target.display_name}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{target.top_category ? `Juega ${target.top_category} · ` : ''}{Math.round(target.total_followers / 1000).toLocaleString('es-AR')} K seguidores</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => <div key={i} style={{ width: 32, height: 6, borderRadius: 3, background: i < guesses.length ? (won && i === guesses.length - 1 ? '#16A34A' : '#DC2626') : 'var(--color-border)' }} />)}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 14 }}>{gameOver ? (won ? '¡Correcto!' : 'Se acabaron los intentos') : `${MAX_ATTEMPTS - guesses.length} intento${MAX_ATTEMPTS - guesses.length !== 1 ? 's' : ''} restante${MAX_ATTEMPTS - guesses.length !== 1 ? 's' : ''}`}</p>
        {pistas.length > 0 && <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>{pistas.map((p) => <span key={p} style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>💡 {p}</span>)}</div>}
        {!gameOver && (
          <form onSubmit={adivinar} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <label htmlFor="edadle-edad" className="sr-only">Edad del streamer</label>
            <input id="edadle-edad" className="input-base" type="number" inputMode="numeric" min="10" max="80" placeholder="Escribí la edad..." value={valor} onChange={(e) => setValor(e.target.value)} style={{ fontSize: 16, padding: '12px 16px', flex: 1 }} />
            <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>Probar</button>
          </form>
        )}
        {guesses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {guesses.map((n, i) => {
              const p = pista(edad - n, guesses.length);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${p.color}22`, border: `1px solid ${p.color}55`, borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{n} años</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.txt}</span>
                </div>
              );
            })}
          </div>
        )}
        {gameOver && !showModal && <div style={{ textAlign: 'center', marginTop: 24 }}><button className="btn-primary" onClick={() => setShowModal(true)}>Ver resultado</button></div>}
      </main>
      {showModal && <Resultado won={won} intentos={guesses.length} target={target} edad={edad} onClose={() => setShowModal(false)} />}
    </div>
  );
}
