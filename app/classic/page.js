'use client';

import { useState, useEffect, useRef } from 'react';
import { STREAMERS, COUNTRIES, searchStreamers, getDailyStreamerNoRepeat, getYesterdayStreamer } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

const MAX_ATTEMPTS = 8;

function getSlug(s) { return s.display_name.toLowerCase().replace(/\s+/g, '-'); }

function normalizeStr(str) { return (str || '').toLowerCase().trim(); }

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

// Textos por país/región al ganar/perder
function getResultTexts(country, won, attempts, streamer) {
  const slug = getSlug(streamer);
  const learnLink = `<a href="/${slug}" style="color:var(--color-purple-light);fontWeight:700">Conocé más de ${streamer.display_name} →</a>`;
  
  const texts = {
    ES: {
      won: [
        `¡Eso es, tío! Lo tenías clarinete 🔥`,
        `¿Ves como eres un crack? Bien hecho 😎`,
        `¡Ole! A la primera no, pero llegaste 😂`,
      ],
      lost: [
        `Anda ya, ¡esto es una vergüenza! 😂`,
        `¿En serio no sabías quién era? Vaya crack... 💀`,
        `A ver si te pones al día con los streamers, ¿no? 😅`,
      ],
    },
    AR: {
      won: [
        `¡La rompisteee! Sos un capo 🔥`,
        `¡Qué crack! Sabés más de streamers que de fútbol 😂`,
        `¡La pegaste! Sos un fenómeno che`,
      ],
      lost: [
        `¡Uy uy uy! Andá a ver más streams che 💀`,
        `Mirá que mal... ¡andá a estudiar! 😂`,
        `¿No lo conocías? Qué papelón 😅`,
      ],
    },
    MX: {
      won: [
        `¡Órale! Le caíste al tiro 🔥`,
        `¡A toda máquina! Ya la armaste 😂`,
        `¡Chingón! Lo sabías de una`,
      ],
      lost: [
        `Ay wey... ¿ni ese conocías? 💀`,
        `¡Aguas! A ponerle más ganas al stream 😂`,
        `No manches, qué mal estuvo 😅`,
      ],
    },
    default: {
      won: [
        `¡Lo adivinaste! Sos un crack 🔥`,
        `¡Bien jugado! Conocés tu cultura streamer 😎`,
        `¡Ahí está! Lo lograste en ${attempts} intentos`,
      ],
      lost: [
        `¡Casi! La próxima seguro 💀`,
        `¡Andá a ver más streams! 😂`,
        `No te preocupes, mañana hay otro 😅`,
      ],
    },
  };

  const region = texts[country] || texts.default;
  const pool = won ? region.won : region.lost;
  return pool[attempts % pool.length];
}

function CountryFlag({ code }) {
  const flags = { AR:'🇦🇷',ES:'🇪🇸',MX:'🇲🇽',CO:'🇨🇴',PE:'🇵🇪',CL:'🇨🇱',VE:'🇻🇪',UY:'🇺🇾',BO:'🇧🇴',PY:'🇵🇾',EC:'🇪🇨',US:'🇺🇸',DO:'🇩🇴',GT:'🇬🇹',HN:'🇭🇳',SV:'🇸🇻',CR:'🇨🇷',PA:'🇵🇦',CU:'🇨🇺',NI:'🇳🇮',PR:'🇵🇷' };
  return <span>{flags[code] || '🏳️'}</span>;
}

function LockedCell({ label }) {
  return (
    <div style={{ background:'#1A1A2E',border:'1px dashed #2A2A40',borderRadius:'8px',padding:'8px 6px',textAlign:'center',flex:'1 1 0',minWidth:'72px',overflow:'hidden',opacity:0.5 }}>
      <div style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',marginBottom:'4px',fontWeight:'500',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{label}</div>
      <div style={{ fontSize:'16px' }}>🔒</div>
    </div>
  );
}

function HintCell({ label, value, hint, arrow }) {
  const colors = { correct:'#16A34A',wrong:'#DC262299',higher:'#2563EB',lower:'#2563EB' };
  const fallbackIcons = { correct:'✓', wrong:'✗' };
  const icon = arrow || fallbackIcons[hint] || null;
  const bg = colors[hint] || '#1A1A2E';
  return (
    <div style={{ background:bg,border:`1px solid ${bg}`,borderRadius:'8px',padding:'8px 6px',textAlign:'center',flex:'1 1 0',minWidth:'72px',overflow:'hidden',animation:'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <div style={{ fontSize:'10px',color:'rgba(255,255,255,0.7)',marginBottom:'4px',fontWeight:'500',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{label}</div>
      <div style={{ fontSize:'13px',fontWeight:'700',color:'white',lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>
        {value}{icon && <span style={{ marginLeft:'4px' }}>{icon}</span>}
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
      background: isCorrect ? '#16A34A' : '#DC262299',
      border: `1px solid ${isCorrect ? '#16A34A' : '#DC262299'}`,
      borderRadius: '8px', padding: '8px 6px', textAlign: 'center',
      flex:'1 1 0', minWidth:'72px', overflow:'hidden',
      animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{ fontSize:'10px',color:'rgba(255,255,255,0.7)',marginBottom:'4px',fontWeight:'500',whiteSpace:'nowrap' }}>Plataformas</div>
      <div style={{ display:'flex',flexDirection:'row',gap:'3px',alignItems:'center',justifyContent:'center',flexWrap:'wrap' }}>
        {guessPlatforms.map(p => (
          <span key={p.label} style={{ fontSize:'9px',fontWeight:'700',background:p.color,color:p.textColor||'white',padding:'1px 5px',borderRadius:'3px',whiteSpace:'nowrap' }}>
            {p.label}
          </span>
        ))}
        <span style={{ fontSize:'11px',fontWeight:'700' }}>{isCorrect ? '✓' : '✗'}</span>
      </div>
    </div>
  );
}

function GuessRow({ guess, target, avatars, country }) {
  const arrowMap = { higher:'↑',lower:'↓',correct:'✓' };
  const avatarUrl = getAvatarUrl(guess, avatars);
  const slug = getSlug(guess);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', animation: 'fadeIn 0.3s ease', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Nombre/avatar clickeable */}
      <a href={`/${slug}`} style={{
        display:'flex',alignItems:'center',gap:'8px',
        minWidth:'130px',maxWidth:'130px',
        background:'#1A1A2E',borderRadius:'8px',padding:'8px',
        border:'1px solid var(--color-border)',flexShrink:0,
        textDecoration:'none',color:'inherit',
        transition:'border-color 0.15s',
      }}
        onMouseOver={e => e.currentTarget.style.borderColor='var(--color-purple)'}
        onMouseOut={e => e.currentTarget.style.borderColor='var(--color-border)'}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={guess.display_name} style={{ width:'32px',height:'32px',borderRadius:'50%',objectFit:'cover',flexShrink:0 }} onError={e => e.target.style.display='none'} />
        ) : (
          <div style={{ width:'32px',height:'32px',borderRadius:'50%',background:'#7C3AED',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0 }}>
            {guess.display_name[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontSize:'11px',fontWeight:'600',color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
          {guess.display_name}
        </span>
      </a>

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
      <HintCell label="Peak Viewers" value={formatNum(guess.peak_viewers)}
        hint={getNumericHint(guess.peak_viewers, target.peak_viewers)}
        arrow={arrowMap[getNumericHint(guess.peak_viewers, target.peak_viewers)]} />
      <PlatformsCell guess={guess} target={target} />
    </div>
  );
}

function Countdown() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date(), tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0);
      const diff = tomorrow - now;
      const h = Math.floor(diff/3600000).toString().padStart(2,'0');
      const m = Math.floor((diff%3600000)/60000).toString().padStart(2,'0');
      const s = Math.floor((diff%60000)/1000).toString().padStart(2,'0');
      setTime(`${h}:${m}:${s}`);
    };
    update(); const interval = setInterval(update,1000); return () => clearInterval(interval);
  }, []);
  return <span className="countdown">{time}</span>;
}

function ShareModal({ won, attempts, target, avatars, country, onClose, onOtherGames }) {
  const [copied, setCopied] = useState(false);
  const emoji = won ? (attempts <= 2 ? '🔥' : attempts <= 4 ? '✅' : '😅') : '💀';
  const shareText = !won
    ? `🟣 Streamdle Classic\nNo lo adiviné 💀\nEra ${target.display_name}. ¿Lo conocés?\nstreamdle.net`
    : attempts <= 3
    ? `🟣 Streamdle Classic\n¡Lo adiviné en ${attempts} intento${attempts > 1 ? 's' : ''}! 🔥\n¿Podés con el streamer de hoy?\nstreamdle.net`
    : `🟣 Streamdle Classic\nPor poco... ${attempts} intentos 😅\nEl streamer me costó. ¿Lo conocés?\nstreamdle.net`;

  const avatarUrl = getAvatarUrl(target, avatars);
  const slug = getSlug(target);
  const resultText = getResultTexts(country, won, attempts, target);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign:'center',marginBottom:'16px' }}>
          <div style={{ fontSize:'48px',marginBottom:'8px' }}>{emoji}</div>
          <h2 style={{ fontSize:'20px',fontWeight:'800',marginBottom:'6px' }}>
            {won ? '¡Lo adivinaste!' : '¡Casi!'}
          </h2>
          <p style={{ color:'var(--color-text-secondary)',fontSize:'14px',marginBottom:'8px' }}>
            {won ? `Lo lograste en ${attempts} intento${attempts > 1 ? 's' : ''}` : `Era ${target.display_name}`}
          </p>
          {/* Texto por país */}
          <p style={{ fontSize:'13px',fontWeight:'600',color:'white',marginBottom:'4px' }}>{resultText}</p>
        </div>

        {/* Streamer clickeable */}
        <a href={`/${slug}`} style={{
          background:'var(--bg-primary)',borderRadius:'12px',padding:'16px',
          display:'flex',alignItems:'center',gap:'12px',
          marginBottom:'16px',border:'1px solid var(--color-purple)',
          textDecoration:'none',color:'inherit',transition:'border-color 0.18s',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--color-purple-light)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--color-purple)'}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={target.display_name} style={{ width:'56px',height:'56px',borderRadius:'50%',objectFit:'cover' }} />
          ) : (
            <div style={{ width:'56px',height:'56px',borderRadius:'50%',background:'#7C3AED',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px' }}>
              {target.display_name[0]}
            </div>
          )}
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontWeight:'700',fontSize:'16px' }}>{target.display_name}</div>
            <div style={{ display:'flex',gap:'6px',marginTop:'4px',flexWrap:'wrap' }}>
              {target.twitch && <span className="badge-twitch">Twitch</span>}
              {target.kick && <span className="badge-kick">Kick</span>}
              {target.youtube && <span className="badge-youtube">YouTube</span>}
            </div>
            {!won && (
              <div style={{ fontSize:'11px',color:'var(--color-purple-light)',marginTop:'4px',fontWeight:'600' }}>
                Ver perfil completo →
              </div>
            )}
          </div>
        </a>

        <div style={{ textAlign:'center',marginBottom:'16px',padding:'12px',background:'var(--bg-primary)',borderRadius:'8px' }}>
          <div style={{ fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'4px' }}>Próximo streamer en</div>
          <Countdown />
        </div>

        <div style={{ display:'flex',gap:'10px' }}>
          <button className="btn-green" style={{ flex:1 }} aria-label="Copiar resultado al portapapeles" onClick={() => {
            navigator.clipboard.writeText(shareText).then(() => { setCopied(true); setTimeout(() => setCopied(false),2000); });
          }}>
            {copied ? '✓ ¡Copiado!' : '🔗 Compartir'}
          </button>
          <button className="btn-primary" style={{ flex:1 }} aria-label="Ver otros juegos de Streamdle" onClick={onOtherGames}>🎮 Otros juegos</button>
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
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { getAvatars().then(data => setAvatars(data)); }, []);
  useEffect(() => { const yday = getYesterdayStreamer(country,'classic',0); setYesterday(yday); }, [country]);

  const getTodayKey = (c) => { const d = new Date(); return `classic_${c}_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

  useEffect(() => {
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (saved) {
      const { guesses:g,won:w,gameOver:go,targetId } = JSON.parse(saved);
      const savedTarget = STREAMERS.find(s => s.id === targetId);
      if (savedTarget) setTarget(savedTarget); else setTarget(getDailyStreamerNoRepeat(country,'classic',0));
      setGuesses(g.map(id => STREAMERS.find(s => s.id === id)).filter(Boolean));
      setAlreadyGuessed(g); setWon(w); setGameOver(go);
    } else {
      setTarget(getDailyStreamerNoRepeat(country,'classic',0));
      setGuesses([]); setWon(false); setGameOver(false); setShowModal(false); setAlreadyGuessed([]); setQuery('');
    }
  }, [country]);

  useEffect(() => {
    if (!target || guesses.length === 0) return;
    localStorage.setItem(getTodayKey(country), JSON.stringify({ guesses:alreadyGuessed,won,gameOver,targetId:target.id }));
  }, [guesses, won, gameOver, country]);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const t = setTimeout(() => {
      setSuggestions(searchStreamers(query, country).filter(s => !alreadyGuessed.includes(s.id)).slice(0,12));
    }, 120);
    return () => clearTimeout(t);
  }, [query, country, alreadyGuessed]);

  useEffect(() => {
    if (guesses.length !== 1) return;
    setShowSwipeHint(true);
    const t = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(t);
  }, [guesses.length]);

  useEffect(() => {
    if (!target) return;
    const key = getTodayKey(country);
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ guesses:[],won:false,gameOver:false,targetId:target.id }));
  }, [target]);

  const handleGuess = (streamer) => {
    if (!target || gameOver) return;
    setQuery(''); setSuggestions([]);
    setAlreadyGuessed(prev => [...prev, streamer.id]);
    const newGuesses = [streamer, ...guesses];
    setGuesses(newGuesses);
    if (streamer.id === target.id) { setWon(true); setGameOver(true); setTimeout(() => setShowModal(true), 800); }
    else if (newGuesses.length >= MAX_ATTEMPTS) { setGameOver(true); setTimeout(() => setShowModal(true), 800); }
  };

  if (!target) return <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}><div style={{ color:'var(--color-text-secondary)' }}>Cargando...</div></div>;

  return (
    <div style={{ minHeight:'100vh',background:'var(--bg-primary)' }}>
      <style>{`
        @keyframes swipeHintFade {
          0%   { opacity:0; transform:translateY(-3px); }
          15%  { opacity:1; transform:translateY(0); }
          75%  { opacity:1; }
          100% { opacity:0; }
        }
        @media (max-width: 768px) {
          .swipe-hint-mobile { display:flex !important; }
        }
      `}</style>
      <header style={{ borderBottom:'1px solid var(--color-border)',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg-secondary)',gap:'12px',flexWrap:'wrap' }}>
        <a href="/" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:'8px' }}>
          <span className="hide-mobile" style={{ fontSize:'20px' }}>🎮</span>
          <span style={{ fontSize:'18px',fontWeight:'800',background:'linear-gradient(135deg,#7C3AED,#53FC18)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>STREAMDLE</span>
        </a>
        <div style={{ display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'center' }}>
          {[{href:'/classic',label:'🎯 Classic'},{href:'/avatardle',label:'👤 Avatardle'},{href:'/emojidle',label:'😂 Emojidle'},{href:'/categorydle',label:'🎮 Categorydle'},{href:'/chatdle',label:'💬 Chatdle'},{href:'/higherdle',label:'📊 Higherdle'}].map(g => (
            <a key={g.href} href={g.href} style={{ background:g.href==='/classic'?'#7C3AED':'var(--bg-card)',border:'1px solid var(--color-border)',color:'white',borderRadius:'8px',padding:'5px 12px',fontSize:'10px',fontWeight:'600',textDecoration:'none',whiteSpace:'nowrap' }}>{g.label}</a>
          ))}
        </div>
      </header>

      <main className="game-main-content" style={{ maxWidth:'980px',margin:'0 auto',padding:'24px 16px 48px' }}>
        <div style={{ textAlign:'center',marginBottom:'24px' }}>
          <h1 style={{ fontSize:'22px',fontWeight:'800',marginBottom:'6px' }}>🎯 Adiviná el streamer del día</h1>
          <p style={{ color:'var(--color-text-secondary)',fontSize:'14px' }}>Tenés {MAX_ATTEMPTS} intentos — las pistas se desbloquean a medida que fallás</p>
        </div>

        {yesterday && (
          <div style={{ textAlign:'center',marginBottom:'12px',fontSize:'13px',color:'var(--color-text-secondary)' }}>
            El streamer de ayer fue{' '}
            <a href={`/${getSlug(yesterday)}`} style={{ fontWeight:'700',color:yesterday.kick?'#53FC18':'#9146FF',textDecoration:'none' }}>{yesterday.display_name}</a>
          </div>
        )}

        <div style={{ display:'flex',gap:'8px',justifyContent:'center',flexWrap:'wrap',marginBottom:'24px' }}>
          {COUNTRIES.map(c => <button key={c.code} className={`filter-pill ${country===c.code?'active':''}`} onClick={() => setCountry(c.code)}>{c.label}</button>)}
        </div>

        <div style={{ textAlign:'center',marginBottom:'16px' }}>
          <div style={{ display:'flex',justifyContent:'center',gap:'6px',marginBottom:'6px' }}>
            {Array.from({length:MAX_ATTEMPTS}).map((_,i) => (
              <div key={i} style={{ width:'28px',height:'6px',borderRadius:'3px',background:i<guesses.length?(won&&i===guesses.length-1?'#16A34A':'#DC262299'):'var(--color-border)',transition:'background 0.3s' }} />
            ))}
          </div>
          <p style={{ fontSize:'12px',color:'var(--color-text-secondary)' }}>
            {gameOver ? (won?'¡Correcto!':'Se acabaron los intentos') : `${MAX_ATTEMPTS-guesses.length} intento${MAX_ATTEMPTS-guesses.length!==1?'s':''} restante${MAX_ATTEMPTS-guesses.length!==1?'s':''}`}
          </p>
        </div>

        {guesses.length > 0 && (
          <div style={{ display:'flex',gap:'6px',marginBottom:'8px',paddingLeft:'138px',overflowX:'auto' }}>
            {(country==='ALL'?['País','Categ.','Seguid.','Hrs Stream','Activo','Peak','Plataformas']:['Categ.','Seguid.','Hrs Stream','Activo','Peak','Plataformas']).map(col => (
              <div key={col} style={{ flex:'1 1 0',minWidth:'72px',textAlign:'center',fontSize:'9px',fontWeight:'600',color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.5px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{col}</div>
            ))}
          </div>
        )}

        {!gameOver && (
          <div style={{ position:'relative',marginBottom:'20px' }}>
            <label htmlFor="classic-search" className="sr-only">Buscar streamer</label>
            <input id="classic-search" ref={inputRef} className="input-base" placeholder="Escribí el nombre del streamer..."
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter'&&suggestions.length>0)handleGuess(suggestions[0]); if(e.key==='Escape')setSuggestions([]); }}
              autoComplete="off" style={{ fontSize:'15px',padding:'12px 16px' }} />
            {suggestions.length > 0 && (
              <div className="suggestions-box">
                {suggestions.map(s => {
                  const sUrl = getAvatarUrl(s, avatars);
                  return (
                    <div key={s.id} className="suggestion-item" onClick={() => handleGuess(s)}>
                      {sUrl ? <img src={sUrl} alt={s.display_name} style={{ width:'28px',height:'28px',borderRadius:'50%' }} onError={e => e.target.style.display='none'} />
                        : <div style={{ width:'28px',height:'28px',borderRadius:'50%',background:'#7C3AED',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px' }}>{s.display_name[0]}</div>}
                      <div>
                        <div style={{ fontSize:'14px',fontWeight:'600' }}>{s.display_name}</div>
                        <div style={{ fontSize:'11px',color:'var(--color-text-secondary)' }}>{s.country} · {formatNum(s.total_followers)} seguidores</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
          {guesses.map((guess, i) => <GuessRow key={guess.id} guess={guess} target={target} avatars={avatars} country={country} />)}
        </div>
        {showSwipeHint && (
          <div className="swipe-hint-mobile" style={{ display:'none',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'11px',color:'var(--color-text-secondary)',padding:'6px 0 2px',animation:'swipeHintFade 3s ease forwards',pointerEvents:'none' }}>
            <span>←</span><span>deslizá para ver más</span><span>→</span>
          </div>
        )}

        {gameOver && !showModal && (
          <div style={{ textAlign:'center',marginTop:'24px' }}>
            <button className="btn-primary" aria-label="Ver resultado de la partida" onClick={() => setShowModal(true)}>Ver resultado</button>
          </div>
        )}
      </main>

      {showModal && (
        <ShareModal won={won} attempts={guesses.length} target={target} avatars={avatars} country={country}
          onClose={() => setShowModal(false)} onOtherGames={() => window.location.href='/'} />
      )}
    </div>
  );
}