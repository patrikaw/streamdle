'use client';

import { useState, useEffect, useRef } from 'react';
import { STREAMERS, COUNTRIES, searchStreamers, getDailyStreamerNoRepeat } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

const MAX_ATTEMPTS = 6;
const PIXEL_LEVELS = ['pixel-1', 'pixel-2', 'pixel-3', 'pixel-4', 'pixel-5', 'pixel-0'];

function formatNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function getTodayKey(country) {
  const d = new Date();
  return `avatardle_${country}_${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
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
  const emoji = won ? (attempts <= 2 ? '🔥' : attempts <= 4 ? '✅' : '😅') : '💀';
  const blocks = Array.from({ length: MAX_ATTEMPTS }).map((_, i) =>
    i < attempts - 1 ? '🟥' : i === attempts - 1 && won ? '🟩' : i < attempts ? '🟥' : '⬛'
  ).join('');

  const shareText = !won
    ? `👤 Avatardle\nNo lo adiviné 💀\nEra ${target.display_name}\n${blocks}\nstreamdle.net/avatardle`
    : `👤 Avatardle ${attempts}/${MAX_ATTEMPTS}\n${blocks}\n¿Podés adivinar el streamer de hoy?\nstreamdle.net/avatardle`;

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
            {won ? `Lo lograste en ${attempts} intento${attempts > 1 ? 's' : ''}` : `Era ${target.display_name}`}
          </p>
          <div style={{ fontSize: '24px', letterSpacing: '4px', margin: '12px 0' }}>{blocks}</div>
        </div>

        <div style={{
          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '20px', border: '1px solid var(--color-purple)',
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
            <div style={{ fontWeight: '700', fontSize: '18px' }}>{target.display_name}</div>
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

export default function AvatardlePage() {
  const [country, setCountry] = useState('ALL');
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alreadyGuessed, setAlreadyGuessed] = useState([]);
  const [currentPixelLevel, setCurrentPixelLevel] = useState(0);
  const [avatars, setAvatars] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    getAvatars().then(data => setAvatars(data));
  }, []);

  useEffect(() => {
    const newTarget = getDailyStreamerNoRepeat(country, 'avatardle', 17);
    setTarget(newTarget);
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (saved) {
      const { guesses: g, won: w, gameOver: go, pixelLevel: pl } = JSON.parse(saved);
      const fullGuesses = g.map(id => STREAMERS.find(s => s.id === id)).filter(Boolean);
      setGuesses(fullGuesses);
      setAlreadyGuessed(g);
      setWon(w);
      setGameOver(go);
      setCurrentPixelLevel(pl || 0);
      if (go) setTimeout(() => setShowModal(true), 400);
    } else {
      setGuesses([]); setWon(false); setGameOver(false);
      setShowModal(false); setAlreadyGuessed([]);
      setCurrentPixelLevel(0); setQuery('');
    }
  }, [country]);

  useEffect(() => {
    if (!target || guesses.length === 0) return;
    const key = getTodayKey(country);
    localStorage.setItem(key, JSON.stringify({
      guesses: alreadyGuessed, won, gameOver, pixelLevel: currentPixelLevel,
    }));
  }, [guesses, won, gameOver, currentPixelLevel]);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const results = searchStreamers(query, country)
      .filter(s => !alreadyGuessed.includes(s.id)).slice(0, 6);
    setSuggestions(results);
  }, [query, country, alreadyGuessed]);

  const handleGuess = (streamer) => {
    if (!target || gameOver) return;
    setQuery(''); setSuggestions([]);
    setAlreadyGuessed(prev => [...prev, streamer.id]);
    const newGuesses = [...guesses, streamer];
    setGuesses(newGuesses);
    const newPixelLevel = Math.min(newGuesses.length, PIXEL_LEVELS.length - 1);
    setCurrentPixelLevel(newPixelLevel);
    if (streamer.id === target.id) {
      setWon(true); setGameOver(true);
      setTimeout(() => setShowModal(true), 900);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setCurrentPixelLevel(PIXEL_LEVELS.length - 1);
      setGameOver(true);
      setTimeout(() => setShowModal(true), 900);
    }
  };

  const avatarUrl = target ? getAvatarUrl(target, avatars) : null;

  if (!target) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--color-text-secondary)' }}>Cargando...</div>
    </div>
  );

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
        <span style={{ fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #9D5FF5, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AVATARDLE</span>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>👤 ¿Quién es este streamer?</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            La foto se va aclarando con cada intento fallido
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          {COUNTRIES.map(c => (
            <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`} onClick={() => setCountry(c.code)}>
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '220px', height: '220px', borderRadius: '16px',
            overflow: 'hidden', border: '3px solid var(--color-purple)',
            boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="¿Quién es?"
                className={PIXEL_LEVELS[currentPixelLevel]}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.6s ease' }}
                onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div style={{ fontSize: '80px', filter: currentPixelLevel < 4 ? 'blur(8px)' : 'none' }}>👤</div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} style={{
                width: '32px', height: '6px', borderRadius: '3px',
                background: i < guesses.length ? (won && i === guesses.length - 1 ? '#16A34A' : '#DC2626') : 'var(--color-border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {gameOver
              ? won ? '¡Correcto!' : 'Se acabaron los intentos'
              : `${MAX_ATTEMPTS - guesses.length} intento${MAX_ATTEMPTS - guesses.length !== 1 ? 's' : ''} restante${MAX_ATTEMPTS - guesses.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {!gameOver && (
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              ref={inputRef}
              className="input-base"
              placeholder="Escribí el nombre del streamer..."
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
                {suggestions.map(s => {
                  const sUrl = getAvatarUrl(s, avatars);
                  return (
                    <div key={s.id} className="suggestion-item" onClick={() => handleGuess(s)}>
                      {sUrl ? (
                        <img src={sUrl} alt={s.display_name}
                          style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                          onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                          {s.display_name[0]}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{s.display_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{s.country} · {formatNum(s.total_followers)} seguidores</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {guesses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Intentos
            </div>
            {guesses.map((guess, i) => {
              const isCorrect = guess.id === target.id;
              const gUrl = getAvatarUrl(guess, avatars);
              return (
                <div key={guess.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: isCorrect ? '#16A34A22' : '#DC262622',
                  border: `1px solid ${isCorrect ? '#16A34A44' : '#DC262644'}`,
                  borderRadius: '8px', padding: '8px 12px',
                  animation: 'fadeIn 0.3s ease',
                }}>
                  {gUrl ? (
                    <img src={gUrl} alt={guess.display_name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={e => e.target.style.display = 'none'} />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      {guess.display_name[0]}
                    </div>
                  )}
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{guess.display_name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '16px' }}>{isCorrect ? '✅' : '❌'}</span>
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