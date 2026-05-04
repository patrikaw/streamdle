'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { STREAMERS, COUNTRIES } from '../../data/streamers';

function formatNum(n) {
  if (!n || n === 0) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function formatNumFull(n) {
  if (!n) return '0';
  return n.toLocaleString('es-AR');
}

function getAvatarUrl(streamer) {
  if (streamer.twitch) return `https://unavatar.io/twitch/${streamer.twitch}`;
  if (streamer.kick) return `https://unavatar.io/kick/${streamer.kick}`;
  return null;
}

function getRandomPair(pool, recentIds = []) {
  const available = pool.filter(s => !recentIds.includes(s.id));
  if (available.length < 2) return null;
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function getHighScore(mode, country) {
  if (typeof window === 'undefined') return 0;
  try { return parseInt(localStorage.getItem(`higherdle_hs_${mode}_${country}`) || '0'); }
  catch { return 0; }
}

function saveHighScore(mode, country, score) {
  if (typeof window === 'undefined') return;
  try {
    const current = getHighScore(mode, country);
    if (score > current) localStorage.setItem(`higherdle_hs_${mode}_${country}`, score.toString());
  } catch {}
}

function StreamerCard({ streamer, value, label, showValue, isLeft, result, onClick, disabled }) {
  const avatarUrl = getAvatarUrl(streamer);
  const bgColor = result === 'correct' ? 'rgba(22,163,74,0.3)' : result === 'wrong' ? 'rgba(220,38,38,0.3)' : 'transparent';

  return (
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#13131F', transition: 'background 0.4s ease',
    }}>
      {avatarUrl && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.3)', transform: 'scale(1.1)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: bgColor, transition: 'background 0.4s ease', zIndex: 1,
      }} />
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          overflow: 'hidden', border: '3px solid rgba(124,58,237,0.6)',
          boxShadow: '0 0 30px rgba(124,58,237,0.4)', background: '#1A1A2E', flexShrink: 0,
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={streamer.display_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: '#7C3AED' }}>
              {streamer.display_name[0]}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {streamer.display_name}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
            {streamer.country}
          </div>
        </div>

        {showValue ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#53FC18', textShadow: '0 0 20px rgba(83,252,24,0.5)', lineHeight: 1 }}>
              {formatNum(value)}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              ({formatNumFull(value)})
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
              ¿Tiene más o menos {label.toLowerCase()}?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => !disabled && onClick('higher')} disabled={disabled}
                style={{
                  background: 'rgba(124,58,237,0.8)', border: '2px solid #7C3AED',
                  color: 'white', borderRadius: '10px', padding: '12px 32px',
                  fontSize: '16px', fontWeight: '700', cursor: disabled ? 'default' : 'pointer',
                  transition: 'all 0.2s', backdropFilter: 'blur(4px)',
                }}>
                ↑ Más
              </button>
              <button onClick={() => !disabled && onClick('lower')} disabled={disabled}
                style={{
                  background: 'rgba(124,58,237,0.8)', border: '2px solid #7C3AED',
                  color: 'white', borderRadius: '10px', padding: '12px 32px',
                  fontSize: '16px', fontWeight: '700', cursor: disabled ? 'default' : 'pointer',
                  transition: 'all 0.2s', backdropFilter: 'blur(4px)',
                }}>
                ↓ Menos
              </button>
            </div>
          </div>
        )}

        {result && (
          <div style={{ fontSize: '48px', animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
            {result === 'correct' ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  );
}

function HigherdleInner() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'hours' ? 'hours' : 'followers');
  const [country, setCountry] = useState('ALL');
  const [pool, setPool] = useState([]);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [usedIds, setUsedIds] = useState([]);
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const label = mode === 'followers' ? 'Seguidores' : 'Horas en Stream';

  const getValue = useCallback((streamer) => {
    return mode === 'followers' ? streamer.total_followers : streamer.total_hours;
  }, [mode]);

  const initGame = useCallback((p) => {
    const pair = getRandomPair(p, []);
    if (!pair) return;
    setLeft(pair[0]);
    setRight(pair[1]);
    setUsedIds([pair[0].id, pair[1].id]);
    setScore(0);
    setResult(null);
    setGameOver(false);
    setShowValue(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    const newPool = country === 'ALL' ? STREAMERS : STREAMERS.filter(s => s.country === country);
    setPool(newPool);
    setHighScore(getHighScore(mode, country));
    initGame(newPool);
  }, [country, mode]);

  const handleGuess = (guess) => {
    if (!left || !right || result || gameOver) return;
    const leftVal = getValue(left);
    const rightVal = getValue(right);
    const isCorrect = guess === 'higher' ? rightVal >= leftVal : rightVal <= leftVal;

    setShowValue(true);
    setResult(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        saveHighScore(mode, country, newScore);
        setHighScore(hs => Math.max(hs, newScore));
        const newUsed = [...usedIds];
        const nextPair = getRandomPair(pool, newUsed.slice(-10));
        if (!nextPair) { setGameOver(true); return; }
        setLeft(right);
        setRight(nextPair[1]);
        setUsedIds([...newUsed, nextPair[1].id]);
        setResult(null);
        setShowValue(false);
      } else {
        saveHighScore(mode, country, score);
        setGameOver(true);
      }
    }, 1500);
  };

  const handleShare = () => {
    const text = `📊 Higherdle ${mode === 'followers' ? 'Seguidores' : 'Horas'}\nRacha: ${score} | Récord: ${Math.max(score, highScore)}\n¿Podés superarme?\nstreamdle.net/higherdle`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!left || !right) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14' }}>
      <div style={{ color: 'var(--color-text-secondary)' }}>Cargando...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D14', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--color-border)', padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(13,13,20,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🎮</span>
          <span style={{ fontSize: '16px', fontWeight: '800', background: 'linear-gradient(135deg, #7C3AED, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</span>
        </a>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setMode('followers')} style={{ background: mode === 'followers' ? '#7C3AED' : 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            👥 Seguidores
          </button>
          <button onClick={() => setMode('hours')} style={{ background: mode === 'hours' ? '#7C3AED' : 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            ⏱️ Horas
          </button>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>RACHA</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#53FC18' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>RÉCORD</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#7C3AED' }}>{highScore}</div>
          </div>
        </div>
      </header>

      {/* Filtro país */}
      <div style={{
        position: 'fixed', top: '57px', left: 0, right: 0, zIndex: 49,
        display: 'flex', gap: '6px', justifyContent: 'center',
        padding: '8px 16px', background: 'rgba(13,13,20,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap',
      }}>
        {[
          { code: 'ALL', label: '🌎 Todos' },
          { code: 'AR', label: '🇦🇷 Argentina' },
          { code: 'MX', label: '🇲🇽 México' },
          { code: 'ES', label: '🇪🇸 España' },
          { code: 'CO', label: '🇨🇴 Colombia' },
        ].map(c => (
          <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`}
            onClick={() => setCountry(c.code)} style={{ fontSize: '11px', padding: '3px 10px' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Game area */}
      {!gameOver ? (
        <div style={{ display: 'flex', flex: 1, paddingTop: '100px', position: 'relative' }}>
          <StreamerCard streamer={left} value={getValue(left)} label={label} showValue={true} isLeft={true} result={null} disabled={true} />
          <div style={{
            position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 10, width: '56px', height: '56px', borderRadius: '50%',
            background: '#0D0D14', border: '2px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '800', color: 'white',
          }}>VS</div>
          <StreamerCard streamer={right} value={getValue(right)} label={label} showValue={showValue} isLeft={false} result={result} onClick={handleGuess} disabled={!!result} />
          <div style={{ position: 'fixed', left: '50%', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)', zIndex: 5 }} />
        </div>
      ) : (
        /* Game Over */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', position: 'relative' }}>

          {/* Fondo blurreado */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'flex' }}>
            <div style={{
              flex: 1,
              backgroundImage: getAvatarUrl(left) ? `url(${getAvatarUrl(left)})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.25)', transform: 'scale(1.1)',
            }} />
            <div style={{
              flex: 1,
              backgroundImage: getAvatarUrl(right) ? `url(${getAvatarUrl(right)})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.25)', transform: 'scale(1.1)',
            }} />
          </div>

          {/* Modal Game Over */}
          <div style={{
            position: 'relative', zIndex: 10,
            background: 'rgba(19,19,31,0.92)', border: '1px solid var(--color-border)',
            borderRadius: '20px', padding: '40px', textAlign: 'center',
            maxWidth: '400px', width: '90%',
            animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>
              {score >= 10 ? '🔥' : score >= 5 ? '✅' : '💀'}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
              {score >= 10 ? '¡Increíble!' : score >= 5 ? '¡Bien jugado!' : 'Game Over'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Modo: {mode === 'followers' ? 'Seguidores' : 'Horas en Stream'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>RACHA</div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#53FC18' }}>{score}</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>RÉCORD</div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#7C3AED' }}>{Math.max(score, highScore)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button className="btn-green" style={{ flex: 1 }} onClick={() => initGame(pool)}>
                🔄 Jugar de nuevo
              </button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => window.location.href = '/'}>
                🎮 Otros juegos
              </button>
            </div>

            <button style={{
              width: '100%', background: 'transparent',
              border: '1px solid var(--color-border)',
              color: copied ? '#53FC18' : 'var(--color-text-secondary)',
              borderRadius: '8px', padding: '8px', fontSize: '13px', cursor: 'pointer',
              transition: 'color 0.2s',
            }} onClick={handleShare}>
              {copied ? '✓ ¡Copiado!' : '🔗 Compartir resultado'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from 'react';

export default function HigherdleInner() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14' }}><div style={{ color: '#A1A1B5' }}>Cargando...</div></div>}>
      <HigherdleInner />
    </Suspense>
  );
}

export default function HigherdlePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14' }}><div style={{ color: '#A1A1B5' }}>Cargando...</div></div>}>
      <HigherdleInner />
    </Suspense>
  );
}