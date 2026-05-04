'use client';

import { useState, useEffect, useRef } from 'react';
import { STREAMERS, COUNTRIES, getDailyStreamerNoRepeat } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

const MAX_ATTEMPTS = 8;

function getCategories(pool) {
  const cats = new Set();
  pool.forEach(s => {
    if (s.top_category) cats.add(s.top_category);
    if (s.second_category) cats.add(s.second_category);
  });
  return Array.from(cats).sort();
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function getTodayKey(country) {
  const d = new Date();
  return `categorydle_${country}_${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
}

function Countdown() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return <span className="countdown">{time}</span>;
}

function ShareModal({ won, attempts, target, avatars, onClose, onOtherGames }) {
  const [copied, setCopied] = useState(false);
  const emoji = won ? (attempts <= 3 ? '🔥' : attempts <= 6 ? '✅' : '😅') : '💀';
  const blocks = Array.from({ length: MAX_ATTEMPTS }).map((_, i) =>
    i < attempts - 1 ? '🟥' : i === attempts - 1 && won ? '🟩' : i < attempts ? '🟥' : '⬛'
  ).join('');

  const shareText = !won
    ? `🎮 Categorydle\nNo lo adiviné 💀\nEran: ${target.top_category} + ${target.second_category}\n${blocks}\nstreamdle.net/categorydle`
    : `🎮 Categorydle ${attempts}/${MAX_ATTEMPTS}\n${blocks}\n¿Conocés las 2 categorías de ${target.display_name}?\nstreamdle.net/categorydle`;

  const avatarUrl = getAvatarUrl(target, avatars);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{emoji}</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
            {won ? '¡Lo adivinaste!' : '¡Casi!'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {won ? `Lo lograste en ${attempts} intento${attempts > 1 ? 's' : ''}` : `Eran: ${target.top_category} + ${target.second_category}`}
          </p>
          <div style={{ fontSize: '24px', letterSpacing: '4px', margin: '12px 0' }}>{blocks}</div>
        </div>

        <div style={{
          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '16px', border: '1px solid var(--color-purple)',
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={target.display_name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {target.display_name[0]}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>{target.display_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              🥇 <span style={{ color: '#53FC18', fontWeight: '600' }}>{target.top_category}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              🥈 <span style={{ color: '#9D5FF5', fontWeight: '600' }}>{target.second_category}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
              {target.twitch && <a href={`https://twitch.tv/${target.twitch}`} target="_blank" rel="noopener noreferrer" className="badge-twitch">Twitch</a>}
              {target.kick && <a href={`https://kick.com/${target.kick}`} target="_blank" rel="noopener noreferrer" className="badge-kick">Kick</a>}
              {target.youtube && <a href={`https://youtube.com/${target.youtube}`} target="_blank" rel="noopener noreferrer" className="badge-youtube">YouTube</a>}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Próximo streamer en</div>
          <Countdown />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-green" style={{ flex: 1 }} onClick={() => {
            navigator.clipboard.writeText(shareText).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}>
            {copied ? '✓ ¡Copiado!' : '🔗 Compartir'}
          </button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={onOtherGames}>
            🎮 Otros juegos
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategorydlePage() {
  const [country, setCountry] = useState('ALL');
  const [target, setTarget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [topGuessed, setTopGuessed] = useState(false);
  const [secondGuessed, setSecondGuessed] = useState(false);
  const [avatars, setAvatars] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    getAvatars().then(data => setAvatars(data));
  }, []);

  useEffect(() => {
    const newPool = country === 'ALL' ? STREAMERS : STREAMERS.filter(s => s.country === country);
    setCategories(getCategories(newPool));
    const newTarget = getDailyStreamerNoRepeat(country, 'categorydle', 41, s => s.top_category && s.second_category && s.second_category !== '');
    setTarget(newTarget);

    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (saved) {
      const { guesses: g, won: w, gameOver: go, topGuessed: tg, secondGuessed: sg } = JSON.parse(saved);
      setGuesses(g);
      setWon(w);
      setGameOver(go);
      setTopGuessed(tg || false);
      setSecondGuessed(sg || false);
      if (go) setTimeout(() => setShowModal(true), 400);
    } else {
      setGuesses([]); setWon(false); setGameOver(false);
      setShowModal(false); setQuery('');
      setTopGuessed(false); setSecondGuessed(false);
    }
  }, [country]);

  useEffect(() => {
    if (!target || guesses.length === 0) return;
    const key = getTodayKey(country);
    localStorage.setItem(key, JSON.stringify({ guesses, won, gameOver, topGuessed, secondGuessed }));
  }, [guesses, won, gameOver, topGuessed, secondGuessed]);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const results = categories
      .filter(c => c.toLowerCase().includes(q) && !guesses.includes(c))
      .slice(0, 8);
    setSuggestions(results);
  }, [query, categories, guesses]);

  const handleGuess = (category) => {
    if (!target || gameOver) return;
    setQuery(''); setSuggestions([]);
    const isTop = category.toLowerCase() === (target.top_category || '').toLowerCase();
    const isSecond = category.toLowerCase() === (target.second_category || '').toLowerCase();
    const newTopGuessed = topGuessed || isTop;
    const newSecondGuessed = secondGuessed || isSecond;
    const newGuesses = [...guesses, category];
    setGuesses(newGuesses);
    setTopGuessed(newTopGuessed);
    setSecondGuessed(newSecondGuessed);
    if (newTopGuessed && newSecondGuessed) {
      setWon(true); setGameOver(true);
      setTimeout(() => setShowModal(true), 600);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setTimeout(() => setShowModal(true), 600);
    }
  };

  if (!target) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14' }}>
      <div style={{ color: '#A1A1B5' }}>Cargando...</div>
    </div>
  );

  const avatarUrl = getAvatarUrl(target, avatars);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎮</span>
          <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #7C3AED, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</span>
        </a>
        <span style={{ fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #059669, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CATEGORYDLE</span>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>🎮 Adiviná las 2 categorías</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Encontrá la categoría principal y la segunda más streameada
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          {COUNTRIES.map(c => (
            <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`} onClick={() => setCountry(c.code)}>
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              overflow: 'hidden', border: '3px solid var(--color-purple)',
              boxShadow: '0 0 24px rgba(124,58,237,0.4)',
              background: '#1A1A2E', margin: '0 auto 10px',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Streamer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => e.target.style.display = 'none'} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: '#7C3AED' }}>
                  {target.display_name[0]}
                </div>
              )}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>{target.display_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
              {target.country} · {formatNum(target.total_followers)} seguidores
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            background: topGuessed ? '#16A34A22' : 'var(--bg-card)',
            border: `1.5px solid ${topGuessed ? '#16A34A' : 'var(--color-border)'}`,
            borderRadius: '10px', padding: '12px', textAlign: 'center', transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
              🥇 Categoría Principal
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: topGuessed ? '#53FC18' : 'var(--color-text-secondary)' }}>
              {topGuessed ? target.top_category : '???'}
            </div>
          </div>
          <div style={{
            background: secondGuessed ? '#7C3AED22' : 'var(--bg-card)',
            border: `1.5px solid ${secondGuessed ? '#7C3AED' : 'var(--color-border)'}`,
            borderRadius: '10px', padding: '12px', textAlign: 'center', transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
              🥈 Segunda Categoría
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: secondGuessed ? '#9D5FF5' : 'var(--color-text-secondary)' }}>
              {secondGuessed ? target.second_category : '???'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
              const guess = guesses[i];
              const isTop = guess && guess.toLowerCase() === (target.top_category || '').toLowerCase();
              const isSecond = guess && guess.toLowerCase() === (target.second_category || '').toLowerCase();
              const isCorrect = isTop || isSecond;
              return (
                <div key={i} style={{
                  width: '28px', height: '6px', borderRadius: '3px',
                  background: i >= guesses.length ? 'var(--color-border)' : isCorrect ? '#16A34A' : '#DC2626',
                  transition: 'background 0.3s',
                }} />
              );
            })}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {gameOver
              ? won ? '¡Adivinaste las dos categorías!' : 'Se acabaron los intentos'
              : `${MAX_ATTEMPTS - guesses.length} intento${MAX_ATTEMPTS - guesses.length !== 1 ? 's' : ''} restante${MAX_ATTEMPTS - guesses.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {!gameOver && (
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              ref={inputRef}
              className="input-base"
              placeholder="Escribí una categoría (ej: Minecraft, GTA V...)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && suggestions.length > 0) handleGuess(suggestions[0]);
                if (e.key === 'Escape') setSuggestions([]);
              }}
              autoComplete="off"
              style={{ fontSize: '15px', padding: '12px 16px' }}
            />
            {suggestions.length > 0 && (
              <div className="suggestions-box">
                {suggestions.map(cat => (
                  <div key={cat} className="suggestion-item" onClick={() => handleGuess(cat)}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>🎮 {cat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {guesses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Intentos
            </div>
            {guesses.map((guess, i) => {
              const isTop = guess.toLowerCase() === (target.top_category || '').toLowerCase();
              const isSecond = guess.toLowerCase() === (target.second_category || '').toLowerCase();
              const isCorrect = isTop || isSecond;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: isCorrect ? '#16A34A22' : '#DC262622',
                  border: `1px solid ${isCorrect ? '#16A34A44' : '#DC262644'}`,
                  borderRadius: '8px', padding: '8px 14px',
                  animation: 'fadeIn 0.3s ease',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>🎮 {guess}</span>
                  <span style={{ fontSize: '12px', color: isCorrect ? '#53FC18' : 'var(--color-text-secondary)' }}>
                    {isTop ? '✅ Principal' : isSecond ? '✅ Segunda' : '❌'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {gameOver && !showModal && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button className="btn-primary" onClick={() => setShowModal(true)}>Ver resultado</button>
          </div>
        )}
      </main>

      {showModal && (
        <ShareModal won={won} attempts={guesses.length} target={target} avatars={avatars}
          onClose={() => setShowModal(false)}
          onOtherGames={() => window.location.href = '/'} />
      )}
    </div>
  );
}