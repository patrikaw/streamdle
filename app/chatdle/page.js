'use client';

import { useState, useEffect, useRef } from 'react';
import { STREAMERS, COUNTRIES, searchStreamers, getDailyStreamerNoRepeat, getYesterdayStreamer } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

const MAX_ATTEMPTS = 6;

function getTodayKey(country) {
  const d = new Date();
  return `chatdle_${country}_${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function getPlatforms(streamer) {
  const p = [];
  if (streamer.twitch) p.push({ label: 'Twitch', color: '#9146FF' });
  if (streamer.kick) p.push({ label: 'Kick', color: '#53FC18', textColor: '#0D0D14' });
  if (streamer.youtube) p.push({ label: 'YouTube', color: '#FF0000' });
  return p;
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

function HintBadge({ label, value, color = '#7C3AED' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: '8px', padding: '6px 12px',
      animation: 'fadeIn 0.4s ease',
    }}>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}:</span>
      <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{value}</span>
    </div>
  );
}

function ShareModal({ won, attempts, target, avatars, onClose, onOtherGames }) {
  const [copied, setCopied] = useState(false);
  const emoji = won ? (attempts <= 2 ? '🔥' : attempts <= 4 ? '✅' : '😅') : '💀';
  const blocks = Array.from({ length: MAX_ATTEMPTS }).map((_, i) =>
    i < attempts - 1 ? '🟥' : i === attempts - 1 && won ? '🟩' : i < attempts ? '🟥' : '⬛'
  ).join('');

  const shareText = !won
    ? `💬 Chatdle\nNo adiviné de quién era la frase 💀\n"${target.catchphrase}"\n${blocks}\nstreamdle.net/chatdle`
    : `💬 Chatdle ${attempts}/${MAX_ATTEMPTS}\n${blocks}\n¿Sabés de quién es esta frase?\n"${target.catchphrase}"\nstreamdle.net/chatdle`;

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
          <div style={{ fontSize: '22px', letterSpacing: '4px', margin: '10px 0' }}>{blocks}</div>
        </div>

        {/* Frase + streamer */}
        <div style={{
          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',
          marginBottom: '16px', border: '1px solid var(--color-purple)',
        }}>
          <p style={{
            fontSize: '15px', fontStyle: 'italic', color: 'white',
            textAlign: 'center', marginBottom: '14px', lineHeight: 1.5,
          }}>
            "{target.catchphrase}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={target.display_name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {target.display_name[0]}
              </div>
            )}
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>{target.display_name}</div>
              <div style={{ display: 'flex', gap: '5px', marginTop: '4px', flexWrap: 'wrap' }}>
                {target.twitch && <a href={`https://twitch.tv/${target.twitch}`} target="_blank" rel="noopener noreferrer" className="badge-twitch">Twitch</a>}
                {target.kick && <a href={`https://kick.com/${target.kick}`} target="_blank" rel="noopener noreferrer" className="badge-kick">Kick</a>}
                {target.youtube && <a href={`https://youtube.com/${target.youtube}`} target="_blank" rel="noopener noreferrer" className="badge-youtube">YouTube</a>}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px', padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Próxima frase en</div>
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

export default function ChatdlePage() {
  const [country, setCountry] = useState('ALL');
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alreadyGuessed, setAlreadyGuessed] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [yesterday, setYesterday] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getAvatars().then(data => setAvatars(data));
  }, []);
  useEffect(() => {
    const yday = getYesterdayStreamer(country, 'chatdle', 67, s => s.catchphrase && s.catchphrase.trim() !== '');
    setYesterday(yday);
  }, [country]);

  useEffect(() => {
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (saved) {
      const { guesses: g, won: w, gameOver: go, targetId } = JSON.parse(saved);
      const savedTarget = STREAMERS.find(s => s.id === targetId);
      if (savedTarget) setTarget(savedTarget);
      else setTarget(getDailyStreamerNoRepeat(country, 'chatdle', 67, s => s.catchphrase && s.catchphrase.trim() !== ''));
      const fullGuesses = g.map(id => STREAMERS.find(s => s.id === id)).filter(Boolean);
      setGuesses(fullGuesses);
      setAlreadyGuessed(g);
      setWon(w);
      setGameOver(go);
    } else {
      const newTarget = getDailyStreamerNoRepeat(country, 'chatdle', 67, s => s.catchphrase && s.catchphrase.trim() !== '');
      setTarget(newTarget);
      setGuesses([]); setWon(false); setGameOver(false);
      setShowModal(false); setAlreadyGuessed([]); setQuery('');
    }
  }, [country]);

  useEffect(() => {
    if (!target || guesses.length === 0) return;
    const key = getTodayKey(country);
    localStorage.setItem(key, JSON.stringify({
      guesses: alreadyGuessed, won, gameOver,
      targetId: target.id
    }));
  }, [guesses, won, gameOver]);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const results = searchStreamers(query, country)
      .filter(s => !alreadyGuessed.includes(s.id)).slice(0, 6);
    setSuggestions(results);
  }, [query, country, alreadyGuessed]);

  useEffect(() => {
    if (!target) return;
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify({
        guesses: [], won: false, gameOver: false,
        targetId: target.id
      }));
    }
  }, [target]);

  const handleGuess = (streamer) => {
    if (!target || gameOver) return;
    setQuery(''); setSuggestions([]);
    setAlreadyGuessed(prev => [...prev, streamer.id]);
    const newGuesses = [...guesses, streamer];
    setGuesses(newGuesses);
    if (streamer.id === target.id) {
      setWon(true); setGameOver(true);
      setTimeout(() => setShowModal(true), 600);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setTimeout(() => setShowModal(true), 600);
    }
  };

  // Pistas según intentos fallidos
  const attemptCount = guesses.length;
  const showCategory = attemptCount >= 1;
  const showCountry = attemptCount >= 2;
  const showPlatform = attemptCount >= 3;
  const showInitial = attemptCount >= 4;

  const countryFlags = {
    AR: '🇦🇷', ES: '🇪🇸', MX: '🇲🇽', CO: '🇨🇴', PE: '🇵🇪',
    CL: '🇨🇱', VE: '🇻🇪', UY: '🇺🇾', US: '🇺🇸', DO: '🇩🇴',
    GT: '🇬🇹', SV: '🇸🇻', CR: '🇨🇷', PA: '🇵🇦', BO: '🇧🇴',
    PY: '🇵🇾', EC: '🇪🇨', PR: '🇵🇷', FR: '🇫🇷', NO: '🇳🇴',
  };

  if (!target) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14' }}>
      <div style={{ color: '#A1A1B5' }}>Cargando...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', gap: '12px', flexWrap: 'wrap',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="hide-mobile" style={{ fontSize: '20px' }}>🎮</span>
          <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #7C3AED, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</span>
        </a>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/classic', label: '🎯 Classic' },
            { href: '/avatardle', label: '👤 Avatardle' },
            { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle', label: '💬 Chatdle' },
            { href: '/higherdle', label: '📊 Higherdle' },
            { href: '/higherdle?mode=hours', label: '⏱️ Hourdle' },
          ].map(g => (
            <a key={g.href} href={g.href} style={{
              background: g.href === '/chatdle' ? '#7C3AED' : 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              color: 'white', borderRadius: '8px', padding: '5px 12px',
              fontSize: '10px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      <main className="game-main-content" style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>💬 ¿De quién es esta frase?</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Adiviná el streamer por su frase más icónica
          </p>
        </div>
          {yesterday && <div style={{textAlign:'center',marginBottom:'12px',fontSize:'13px',color:'var(--color-text-secondary)'}}>La frase de ayer era de <a href={yesterday.kick ? `https://kick.com/${yesterday.kick}` : `https://twitch.tv/${yesterday.twitch}`} target="_blank" rel="noopener noreferrer" style={{fontWeight:'700',color:yesterday.kick?'#53FC18':'#9146FF',textDecoration:'none'}}>{yesterday.display_name}</a></div>}

        {/* Filtro país */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          {COUNTRIES.map(c => (
            <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`} onClick={() => setCountry(c.code)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* LA FRASE */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '16px',
          padding: '28px 24px', marginBottom: '24px',
          border: '1px solid var(--color-border)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #7C3AED, #53FC18)',
          }} />
          <div style={{ fontSize: '32px', color: '#7C3AED', marginBottom: '8px', lineHeight: 1 }}>"</div>
          <p style={{
            fontSize: '20px', fontWeight: '700', color: 'white',
            lineHeight: 1.4, fontStyle: 'italic', textAlign: 'center',
          }}>
            {target.catchphrase}
          </p>
          <div style={{ fontSize: '32px', color: '#7C3AED', textAlign: 'right', lineHeight: 1, marginTop: '8px' }}>"</div>
        </div>

        {/* Pistas desbloqueadas */}
        {attemptCount > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
            {showCategory && target.top_category && (
              <HintBadge label="Categoría" value={target.top_category} color="#059669" />
            )}
            {showCountry && target.country && country === 'ALL' && (
  <HintBadge label="País" value={`${countryFlags[target.country] || ''} ${target.country}`} color="#2563EB" />
)}
            {showPlatform && (
              <HintBadge label="Plataformas" value={getPlatforms(target).map(p => p.label).join(' · ')} color="#B45309" />
            )}
            {showInitial && target.display_name && (
              <HintBadge label="Inicial" value={target.display_name[0].toUpperCase()} color="#DC2626" />
            )}
          </div>
        )}

        {/* Pistas bloqueadas */}
        {!gameOver && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
            {[
              { label: 'Categoría', unlockAt: 1 },
              ...(country === 'ALL' ? [{ label: 'País', unlockAt: 2 }] : []),
              { label: 'Plataformas', unlockAt: 3 },
              { label: 'Inicial', unlockAt: 4 },
            ].filter(h => attemptCount < h.unlockAt).map(h => (
              <div key={h.label} style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '8px',
                background: 'var(--bg-card)', color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)', fontWeight: '500',
              }}>
                🔒 {h.label} — intento {h.unlockAt + 1}
              </div>
            ))}
          </div>
        )}

        {/* Barra intentos */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} style={{
                width: '32px', height: '6px', borderRadius: '3px',
                background: i < guesses.length
                  ? (won && i === guesses.length - 1 ? '#16A34A' : '#DC2626')
                  : 'var(--color-border)',
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

        {/* Input */}
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

        {/* Intentos anteriores */}
        {guesses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
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