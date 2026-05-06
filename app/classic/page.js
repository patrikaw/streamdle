'use client';

import { useState, useEffect, useRef } from 'react';
import { STREAMERS, COUNTRIES, searchStreamers, getDailyStreamerNoRepeat, getYesterdayStreamer } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

const MAX_ATTEMPTS = 8;

function normalizeStr(str) {
  return (str || '').toLowerCase().trim();
}

function getNumericHint(guessVal, targetVal) {
  if (guessVal === targetVal) return 'correct';
  if (guessVal < targetVal) return 'higher';
  return 'lower';
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function getPlatforms(streamer) {
  const platforms = [];
  if (streamer.twitch) platforms.push({ label: 'Twitch', color: '#9146FF' });
  if (streamer.kick) platforms.push({ label: 'Kick', color: '#53FC18', textColor: '#0D0D14' });
  if (streamer.youtube) platforms.push({ label: 'YouTube', color: '#FF0000' });
  return platforms;
}

function CountryFlag({ code }) {
  const flags = {
    AR: '🇦🇷', ES: '🇪🇸', MX: '🇲🇽', CO: '🇨🇴',
    PE: '🇵🇪', CL: '🇨🇱', VE: '🇻🇪', UY: '🇺🇾',
    BO: '🇧🇴', PY: '🇵🇾', EC: '🇪🇨', US: '🇺🇸',
    DO: '🇩🇴', GT: '🇬🇹', HN: '🇭🇳', SV: '🇸🇻',
    CR: '🇨🇷', PA: '🇵🇦', CU: '🇨🇺', NI: '🇳🇮',
    PR: '🇵🇷',
  };
  return <span>{flags[code] || '🏳️'}</span>;
}

function LockedCell({ label }) {
  return (
    <div style={{
      background: '#1A1A2E', border: '1px dashed #2A2A40',
      borderRadius: '8px', padding: '8px 6px', textAlign: 'center',
      minWidth: '80px', flex: 1, opacity: 0.5,
    }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', fontWeight: '500' }}>{label}</div>
      <div style={{ fontSize: '16px' }}>🔒</div>
    </div>
  );
}

function HintCell({ label, value, hint, arrow }) {
  const colors = { correct: '#16A34A', wrong: '#DC2626', higher: '#2563EB', lower: '#2563EB' };
  const bg = colors[hint] || '#1A1A2E';
  return (
    <div style={{
      background: bg, border: `1px solid ${bg}`, borderRadius: '8px',
      padding: '8px 6px', textAlign: 'center', minWidth: '80px', flex: 1,
      animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', fontWeight: '500' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', lineHeight: 1.2 }}>
        {value}{arrow && <span style={{ marginLeft: '4px' }}>{arrow}</span>}
      </div>
    </div>
  );
}

function PlatformsCell({ guess, target }) {
  const guessPlatforms = getPlatforms(guess);
  const targetPlatforms = getPlatforms(target);
  const isCorrect = guessPlatforms.map(p => p.label).sort().join(',') === targetPlatforms.map(p => p.label).sort().join(',');
  return (
    <div style={{
      background: isCorrect ? '#16A34A' : '#DC2626',
      border: `1px solid ${isCorrect ? '#16A34A' : '#DC2626'}`,
      borderRadius: '8px', padding: '8px 6px', textAlign: 'center',
      minWidth: '80px', flex: 1, animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', fontWeight: '500' }}>Plataformas</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
        {guessPlatforms.map(p => (
          <span key={p.label} style={{ fontSize: '9px', fontWeight: '700', background: p.color, color: p.textColor || 'white', padding: '1px 5px', borderRadius: '3px' }}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}

function GuessRow({ guess, target, attemptNumber, avatars, country }) {
  const showPeakViewers = true;
  const showPlatforms = true;
  const arrowMap = { higher: '↑', lower: '↓', correct: '✓' };
  const avatarUrl = getAvatarUrl(guess, avatars);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', animation: 'fadeIn 0.3s ease', overflowX: 'auto', paddingBottom: '2px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        minWidth: '130px', maxWidth: '130px',
        background: '#1A1A2E', borderRadius: '8px', padding: '8px',
        border: '1px solid var(--color-border)', flexShrink: 0,
      }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={guess.display_name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        ) : (
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
            {guess.display_name[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontSize: '11px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {guess.display_name}
        </span>
      </div>

      {country === 'ALL' && (
  <HintCell label="País" value={<CountryFlag code={guess.country} />}
    hint={normalizeStr(guess.country) === normalizeStr(target.country) ? 'correct' : 'wrong'} />
)}
      <HintCell label="Categoría" value={guess.top_category || '?'}
        hint={normalizeStr(guess.top_category) === normalizeStr(target.top_category) ? 'correct' : 'wrong'} />
      <HintCell label="Seguidores" value={formatNum(guess.total_followers)}
        hint={getNumericHint(guess.total_followers, target.total_followers)}
        arrow={arrowMap[getNumericHint(guess.total_followers, target.total_followers)]} />
      <HintCell label="Horas en Stream" value={formatNum(guess.total_hours)}
        hint={getNumericHint(guess.total_hours, target.total_hours)}
        arrow={arrowMap[getNumericHint(guess.total_hours, target.total_hours)]} />
      <HintCell label="Activo" value={guess.is_active ? 'Sí' : 'No'}
        hint={guess.is_active === target.is_active ? 'correct' : 'wrong'} />
      {showPeakViewers
        ? <HintCell label="Peak Viewers" value={formatNum(guess.peak_viewers)}
            hint={getNumericHint(guess.peak_viewers, target.peak_viewers)}
            arrow={arrowMap[getNumericHint(guess.peak_viewers, target.peak_viewers)]} />
        : <LockedCell label="Peak Viewers" />}
      {showPlatforms
        ? <PlatformsCell guess={guess} target={target} />
        : <LockedCell label="Plataformas" />}
    </div>
  );
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
  const shareText = !won
    ? `🟣 Streamdle Classic\nNo lo adiviné 💀\nEra ${target.display_name}. ¿Lo conocés?\nstreamdle.net`
    : attempts <= 3
    ? `🟣 Streamdle Classic\n¡Lo adiviné en ${attempts} intento${attempts > 1 ? 's' : ''}! 🔥\n¿Podés con el streamer de hoy?\nstreamdle.net`
    : `🟣 Streamdle Classic\nPor poco... ${attempts} intentos 😅\nEl streamer me costó. ¿Lo conocés?\nstreamdle.net`;

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

export default function ClassicPage() {
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

  // Cargar avatares de Twitch API
  useEffect(() => {
    getAvatars().then(data => setAvatars(data));
  }, []);

  useEffect(() => {
    const yday = getYesterdayStreamer(country, 'classic', 0);
    setYesterday(yday);
  }, [country]);

  const getTodayKey = (c) => {
    const d = new Date();
    return `classic_${c}_${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
  };

  useEffect(() => {
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    
    if (saved) {
      const { guesses: g, won: w, gameOver: go, targetId } = JSON.parse(saved);
      const savedTarget = STREAMERS.find(s => s.id === targetId);
      if (savedTarget) setTarget(savedTarget);
      else setTarget(getDailyStreamerNoRepeat(country, 'classic', 0));
      const fullGuesses = g.map(id => STREAMERS.find(s => s.id === id)).filter(Boolean);
      setGuesses(fullGuesses);
      setAlreadyGuessed(g);
      setWon(w);
      setGameOver(go);
    } else {
      const newTarget = getDailyStreamerNoRepeat(country, 'classic', 0);
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
      .filter(s => !alreadyGuessed.includes(s.id)).slice(0, 12);
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
    const newGuesses = [streamer, ...guesses];
    setGuesses(newGuesses);
    if (streamer.id === target.id) {
      setWon(true); setGameOver(true);
      setTimeout(() => setShowModal(true), 800);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setTimeout(() => setShowModal(true), 800);
    }
  };

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
            { href: '/emojidle', label: '😂 Emojidle' },
            { href: '/categorydle', label: '🎮 Categorydle' },
            { href: '/chatdle', label: '💬 Chatdle' },
            { href: '/higherdle', label: '📊 Higherdle' },
          ].map(g => (
            <a key={g.href} href={g.href} style={{
              background: g.href === '/classic' ? '#7C3AED' : 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              color: 'white', borderRadius: '8px', padding: '5px 12px',
              fontSize: '10px', fontWeight: '600', textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      <main className="game-main-content" style={{ maxWidth: '980px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>🎯 Adiviná el streamer del día</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Tenés {MAX_ATTEMPTS} intentos — las pistas se desbloquean a medida que fallás
          </p>
        </div>

        {yesterday && <div style={{textAlign:'center',marginBottom:'12px',fontSize:'13px',color:'var(--color-text-secondary)'}}>El streamer de ayer fue <a href={yesterday.kick ? `https://kick.com/${yesterday.kick}` : `https://twitch.tv/${yesterday.twitch}`} target="_blank" rel="noopener noreferrer" style={{fontWeight:'700',color:yesterday.kick?'#53FC18':'#9146FF',textDecoration:'none'}}>{yesterday.display_name}</a></div>}
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          {COUNTRIES.map(c => (
            <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`} onClick={() => setCountry(c.code)}>
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} style={{
                width: '28px', height: '6px', borderRadius: '3px',
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

        {guesses.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', paddingLeft: '138px', overflowX: 'auto' }}>
            {(country === 'ALL' ? ['País', 'Categoría', 'Seguidores', 'Horas en Stream', 'Activo', 'Peak Viewers', 'Plataformas'] : ['Categoría', 'Seguidores', 'Horas en Stream', 'Activo', 'Peak Viewers', 'Plataformas']).map(col => (
              <div key={col} style={{ flex: 1, minWidth: '80px', textAlign: 'center', fontSize: '9px', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {col}
              </div>
            ))}
          </div>
        )}

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
                  const sAvatarUrl = getAvatarUrl(s, avatars);
                  return (
                    <div key={s.id} className="suggestion-item" onClick={() => handleGuess(s)}>
                      {sAvatarUrl ? (
                        <img src={sAvatarUrl} alt={s.display_name}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {guesses.map((guess, i) => (
            <GuessRow key={guess.id} guess={guess} target={target} attemptNumber={guesses.length - i} avatars={avatars} country={country} />
          ))}
        </div>

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