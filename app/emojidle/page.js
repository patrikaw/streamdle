'use client';

import { useState, useEffect, useRef } from 'react';
import { STREAMERS, COUNTRIES, searchStreamers, getDailyStreamerNoRepeat, getYesterdayStreamer } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

function getSlug(s) { return s.display_name.toLowerCase().replace(/\s+/g,'-'); }

function getResultText(country, won, attempts, streamer) {
  const texts = {
    ES: { won:["¡Eso es, tío! Lo tenías clarinete 🔥","¿Ves como eres un crack? 😎","¡Ole! Llegaste 😂"], lost:["Anda ya, ¡vergüenza! 😂","¿En serio no lo sabías? 💀","Ponete al día con los streamers 😅"] },
    AR: { won:["¡La rompisteee! Sos un capo 🔥","¡Qué crack! 😂","¡La pegaste! Sos un fenómeno"], lost:["Andá a ver más streams che 💀","Mirá que mal... 😂","¿No lo conocías? Qué papelón 😅"] },
    MX: { won:["¡Órale! Le caíste al tiro 🔥","¡A toda máquina! 😂","¡Chingón! Lo sabías de una"], lost:["Ay wey... ¿ni ese conocías? 💀","¡Aguas! A ponerle más ganas 😂","No manches, qué mal 😅"] },
    default: { won:["¡Lo adivinaste! Sos un crack 🔥","¡Bien jugado! 😎","¡Ahí está!"], lost:["¡Casi! La próxima seguro 💀","¡Andá a ver más streams! 😂","No te preocupes, mañana hay otro 😅"] },
  };
  const r = texts[country] || texts.default;
  const pool = won ? r.won : r.lost;
  return pool[attempts % pool.length];
}

const MAX_ATTEMPTS = 6;
const MAX_EMOJIS = 4;

// Emojis por streamer — de menos obvio a más obvio
const STREAMER_EMOJIS = {
  'ibai': ['🥘','🏟️','🎤','🔔'],
  'auronplay': ['🤖','🤡','🍎','👟'],
  'rubius': ['🗿','🐱','🏹','🍋'],
  'thegrefg': ['🕒','⚡','🟡','💇‍♂️'],
  'juansguarnizo': ['👓','🏗️','🎨','⛪'],
  'elmariana': ['🎭','🤠','🥛','🦴'],
  'arigameplays': ['🎀','🐰','💃','🥊'],
  'rivers_gg': ['🍵','🐥','🥊','🐐'],
  'quackitytoo': ['⚖️','🦆','🏛️','🚬'],
  'bytarifaaa': ['📦','🏎️','🎥','💻'],
  'slakuntv': ['🎮','⚽','👶','🔵'],
  'illojuan': ['🐴','💃','🎙️','👴'],
  'elxokas': ['🍴','🤬','🏔️','🔋'],
  'zilverk': ['🎥','🐀','🔴','🗣️'],
  'kingsleague': ['🃏','⚽','🏆','👑'],
  'alexby11': ['🚀','🔫','🌌','🛰️'],
  'vegetta777': ['🦄','🟣','🏰','🧱'],
  'cristinini': ['🎙️','🏎️','🎬','🏰'],
  'luzu': ['💡','🐗','🐢','🎈'],
  'barcagamer': ['🕶️','⚽','👕','🥛'],
  'reborn': ['🎙️','👔','🧠','🍷'],
  'bystaxxx': ['🎯','🔫','🐉','🧨'],
  'k1ng': ['🎮','👑','⚔️','📈'],
  'djmariio': ['👕','⚽','🎤','🖐️'],
  'shadoune666': ['🌑','🏹','🗡️','🎮'],
  'perxitaa': ['🏗️','🍐','🧒','😂'],
  'aroyitt': ['🎀','🏹','🎮','💗'],
  'beniju03': ['📱','👑','😂','📢'],
  'knekro': ['💀','🃏','🥉','📺'],
  'aldo_geo': ['📍','🌍','🎥','🧭'],
  'axozer': ['🎭','👁️','🎮','🧠'],
  'roier': ['☕','🕷️','🛹','🧶'],
  'c0ker': ['🥤','🐕','😂','📺'],
  'carola': ['🛡️','⚔️','🫰','😂'],
  'xxxthefocusxxx': ['🎭','👁️','🎮','🧩'],
  'papomc': ['🎤','🦅','🏗️','🧱'],
  'folagorlives': ['🐢','⚡','🍒','🧣'],
  'mayichi': ['🌸','🐭','⚔️','🏰'],
  'komanche': ['🏹','🐎','🏜️','🏟️'],
  'elzeein': ['🎙️','🦓','🎪','🏢'],
  'laliendra': ['📱','🕷️','🎥','😂'],
  'lasapaaaaa': ['🐸','👑','💅','👄'],
  'lonche': ['🥪','🍞','🧀','🧂'],
  'deusamir': ['🎙️','✝️','🎮','🧠'],
  'alk4pon3': ['🕴️','🔫','🧔','🐺'],
  'vicens': ['🏎️','✌️','🏗️','🏆'],
  'alondrissa': ['💃','🐦','💅','📸'],
  'elabrahaham': ['🎮','🎩','📜','😂'],
  'llobeti4': ['🏹','🐺','🎮','4️⃣'],
  'elrichmc': ['⚙️','🧱','💰','🧠'],
  'mangel': ['😂','🎭','📼','🌀'],
  'polispol1': ['👮‍♂️','🚨','📣','🧾'],
  'alexelcapo': ['🧠','🎙️','💻','🧩'],
  'elchiringuitotv': ['🗞️','⚽','📡','🗣️'],
  'elfedelobo': ['🌙','🐺','📢','🌲'],
  'orslok': ['🧪','🤪','🎆','🧃'],
  'elspreen': ['🌩️','⚡','🎉','🌀'],
  'robleis': ['🎶','🎤','📷','✨'],
  'missasinfonia': ['🎭','🎬','🎨','📣'],
  'coscu': ['🧢','🎤','🚀','💥'],
  'fernanfloo': ['🤪','🎮','📼','🧠'],
  'biyin_': ['🎀','💅','📷','🌸'],
  'lolitofdez': ['🏹','⚔️','🎯','🛡️'],
  'litkillah': ['🎧','🎤','💿','✨'],
  'nimuvt': ['🤖','🎀','🧠','🌐'],
  'ampeterby7': ['🥅','⚽','📣','🎽'],
  'germangarmendia': ['🎬','😂','📀','🎙️'],
  'markitonavaja': ['💼','🔪','💸','🕶️'],
  'davooxeneize': ['🔵','⚽','📢','🏟️'],
  'farfadoxvevo': ['🕹️','🎮','📀','🧱'],
  'gemita': ['🌸','🎀','📷','💖'],
  'westcol': ['💸','🧨','📣','👑'],
  'eldemente': ['🤯','🧠','🎇','🗯️'],
  'lachilenabelu': ['💃','📷','🌟','🎶'],
  'dylanterolive': ['🧠','😂','📼','📊'],
  'goncho': ['🎯','😂','📼','🧃'],
  'wismichu': ['🤡','💥','🎬','📢'],
  'capitangatoo': ['🎩','🐱','🪄','📜'],
  'momoladinastia': ['👑','🧬','📣','🎆'],
  'unicornio': ['🌈','🦄','✨','💫'],
  'aquino': ['🎯','🏆','📣','🔥'],
  'soypan': ['🥖','🍞','😂','🧂'],
  'emikukis': ['💖','🎀','📷','🫧'],
  'nilojeda': ['🧠','💼','📊','💰'],
  'pelicanger': ['🎬','🍿','🧠','📺'],
  'papigavitv': ['👑','⚽','🕺','📣'],
  'y0l0aventuras': ['🌍','🎒','✈️','📸'],
  'd3stri': ['🎯','⚔️','🕹️','💥'],
  'frankkaster': ['🎤','🎧','📣','🎆'],
  'dalasreview': ['📢','🧠','⚖️','🔥'],
  'alliege': ['🎀','🌸','📷','✨'],
  'ch14': ['⚽','🎯','🏆','🇲🇽'],
  'lacobraaa': ['🐍','🥊','🎙️','🔥'],
  'duendepablo': ['🧙‍♂️','🍀','🎭','📣'],
  'coolifegame': ['🕹️','🎮','🌈','🧩'],
  'bobicraftmc': ['🧱','⛏️','🐷','🌳'],
  'espe': ['🔮','✨','🎀','📷'],
  'nuvia_ouo': ['🌸','💮','🎀','🫧'],
  'llocochon': ['🤪','🎉','📣','🌀'],
  'mrhugo': ['🎩','📖','🧠','📣'],
  'didiwinxx': ['🎀','💅','📷','🌸'],
  'zainita': ['💖','🎀','✨','🫧'],
  'olliegamerz': ['🎮','🧢','🕹️','⚡'],
  'thealvaro845': ['📱','⚔️','🛡️','🔥'],
  'alphasniper97': ['🎯','🔫','🪖','⚡'],
  'zormanworld': ['🎭','🌍','🧠','📺'],
  'enriqueramosgamer': ['🎮','🧩','🕹️','📣'],
  'boffegp': ['🏎️','🏁','🔧','⚡'],
  'violetag': ['💜','🎤','✨','📷'],
  'luquitarodriguez': ['🎤','⚽','📣','🔥'],
  'nikitoniponogotv': ['😂','🎭','📺','🎉'],
  'vector': ['📐','🧠','📊','⚙️'],
  'tecnonauta': ['🚀','📱','🧠','🌐'],
  'jashlem': ['🎀','💖','📷','🌸'],
  'grafo': ['✍️','📖','🧠','🗞️'],
  'tuli_acosta': ['💃','📷','✨','🎶'],
  'bananirou': ['🍌','🎭','✨','🎉'],
  'dtoke': ['🎤','🧢','🔥','🏆'],
  'withzack': ['🧠','🎮','⚡','💻'],
  'mishifu': ['🐱','🎀','🫧','🌸'],
  'rainelissss': ['🌧️','💧','📷','✨'],
  'angievelasco08': ['💃','📷','✨','🎀'],
  'crisgreen': ['🌿','🎮','🍀','🧩'],
  'neburixtv': ['🌌','🎮','🚀','🧠'],
  'sandraskins': ['👗','🎨','✨','📷'],
  'byviruzz': ['🦠','🎮','⚡','💥'],
  'nissaxter': ['🌸','🎀','✨','🫧'],
  'iaaras2': ['💖','🎀','📷','🌸'],
  'werlyb': ['⚔️','🏹','🛡️','🔥'],
  'bichouu_': ['🐞','🎀','✨','🌸'],
  'elded': ['🧠','🎭','📺','📣'],
  'crystalmolly': ['💎','✨','🎀','📷'],
  'mixwell': ['🎯','🔫','🏆','🧠'],
  'alanalarana': ['💃','🎀','📷','✨'],
  'amablitz': ['⚡','👯‍♂️','💥','🚀'],
  'spursito': ['⚽','🎙️','😂','📣'],
  'jaggerprincesa': ['👑','💅','✨','📷'],
  'nataliamx': ['💃','📷','✨','🌸'],
  'carlosbelcastt': ['💪','🏋️','🔥','📸'],
  'adrianozendejas32': ['⚽','🎯','🏆','🔥'],
  'nexxuz': ['🧠','🎮','⚡','💻'],
  'cristorata7': ['🐀','✝️','😂','📺'],
  'rickyedit': ['✂️','🎬','📱','✨'],
  'vickypalami': ['🎀','💖','📷','🌸'],
  'jelty': ['🎯','🎮','⚔️','🔥'],
};

function getStreamEmojis(streamer) {
  const keys = [
    streamer.name?.toLowerCase(),
    streamer.display_name?.toLowerCase(),
    streamer.twitch?.toLowerCase(),
  ];
  for (const key of keys) {
    if (key && STREAMER_EMOJIS[key]) return STREAMER_EMOJIS[key];
  }
  return null;
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function getTodayKey(country) {
  const d = new Date();
  return `emojidle_${country}_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
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

function ShareModal({ won, attempts, target, avatars, country, onClose, onOtherGames }) {
  const [copied, setCopied] = useState(false);
  const slug = getSlug(target);
  const emoji = won ? (attempts <= 2 ? '🔥' : attempts <= 4 ? '✅' : '😅') : '💀';
  const resultText = getResultText(country, won, attempts, target);
  const emojis = getStreamEmojis(target) || [];
  const blocks = Array.from({ length: MAX_ATTEMPTS }).map((_, i) =>
    i < attempts - 1 ? '🟥' : i === attempts - 1 && won ? '🟩' : i < attempts ? '🟥' : '⬛'
  ).join('');

  const shareText = !won
    ? `😂 Emojidle\nNo adiviné de quién eran los emojis 💀\n${emojis.join('')}\n${blocks}\nstreamdle.net/emojidle`
    : `😂 Emojidle ${attempts}/${MAX_ATTEMPTS}\n${blocks}\n¿Sabés de quién son estos emojis?\n${emojis.join('')}\nstreamdle.net/emojidle`;

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
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginTop: '6px' }}>{resultText}</p>
          <div style={{ fontSize: '22px', letterSpacing: '4px', margin: '10px 0' }}>{blocks}</div>
        </div>

        <a href={`/${slug}`} style={{
          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '16px', border: '1px solid var(--color-purple)',
          textDecoration: 'none', color: 'inherit', transition: 'border-color 0.18s',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-purple-light)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-purple)'}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={target.display_name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} onError={e=>{e.target.style.display='none';}} />
          ) : (
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {target.display_name[0]}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>{target.display_name}</div>
            <div style={{ fontSize: '20px', marginTop: '4px' }}>{emojis.join(' ')}</div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
              {target.twitch && <span className="badge-twitch">Twitch</span>}
              {target.kick && <span className="badge-kick">Kick</span>}
              {target.youtube && <span className="badge-youtube">YouTube</span>}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-purple-light)', marginTop: '4px', fontWeight: '600' }}>Ver perfil completo →</div>
          </div>
        </a>

        <div style={{ textAlign: 'center', marginBottom: '16px', padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Próximos emojis en</div>
          <Countdown />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-green" style={{ flex: 1 }} aria-label="Copiar resultado al portapapeles" onClick={() => {
            navigator.clipboard.writeText(shareText).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}>
            {copied ? '✓ ¡Copiado!' : '🔗 Compartir'}
          </button>
          <button className="btn-primary" style={{ flex: 1 }} aria-label="Ver otros juegos de Streamdle" onClick={onOtherGames}>
            🎮 Otros juegos
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmojidlePage() {
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
    const yday = getYesterdayStreamer(country, 'emojidle', 83, s => !!getStreamEmojis(s));
    setYesterday(yday);
  }, [country]);

  useEffect(() => {
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (saved) {
      const { guesses: g, won: w, gameOver: go, targetId } = JSON.parse(saved);
      const savedTarget = STREAMERS.find(s => s.id === targetId);
      if (savedTarget) setTarget(savedTarget);
      else setTarget(getDailyStreamerNoRepeat(country, 'emojidle', 83, s => !!getStreamEmojis(s)));
      const fullGuesses = g.map(id => STREAMERS.find(s => s.id === id)).filter(Boolean);
      setGuesses(fullGuesses);
      setAlreadyGuessed(g);
      setWon(w);
      setGameOver(go);
    } else {
      const newTarget = getDailyStreamerNoRepeat(country, 'emojidle', 83, s => !!getStreamEmojis(s));
      setTarget(newTarget);
      setGuesses([]); setWon(false); setGameOver(false);
      setShowModal(false); setAlreadyGuessed([]); setQuery('');
    }
  }, [country]);

  useEffect(() => {
    if (!target || guesses.length === 0) return;
    const key = getTodayKey(country);
    localStorage.setItem(key, JSON.stringify({ guesses: alreadyGuessed, won, gameOver, targetId: target.id }));
  }, [guesses, won, gameOver]);

  useEffect(() => {
    if (!target) return;
    const key = getTodayKey(country);
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify({ guesses: [], won: false, gameOver: false, targetId: target.id }));
    }
  }, [target]);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const t = setTimeout(() => {
      setSuggestions(searchStreamers(query, country).filter(s => !alreadyGuessed.includes(s.id)).slice(0, 12));
    }, 120);
    return () => clearTimeout(t);
  }, [query, country, alreadyGuessed]);

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

  const targetEmojis = target ? getStreamEmojis(target) : null;
  // Mostrar emojis progresivamente según intentos fallidos
  const visibleEmojis = targetEmojis ? targetEmojis.slice(0, Math.min(guesses.length + 1, MAX_EMOJIS)) : [];

  if (!target) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D14' }}>
      <div style={{ color: '#A1A1B5' }}>Cargando...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{
        borderBottom: '1px solid var(--color-border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', gap: '12px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="hide-mobile" style={{ fontSize: '20px' }}>🎮</span>
            <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #7C3AED, #53FC18)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STREAMDLE</span>
          </a>
          <a href="/explorar" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-card)', whiteSpace: 'nowrap' }}>🔍 Explorar</a>
        </div>
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
              background: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              color: 'white', borderRadius: '8px', padding: '5px 12px',
              fontSize: '10px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{g.label}</a>
          ))}
        </div>
      </header>

      <main className="game-main-content" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>😂 ¿De quién son estos emojis?</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Se van revelando más emojis con cada intento fallido
          </p>
        </div>

        {yesterday && <div style={{textAlign:'center',marginBottom:'12px',fontSize:'13px',color:'var(--color-text-secondary)'}}>El streamer de ayer fue <a href={`/${getSlug(yesterday)}`} target="_blank" rel="noopener noreferrer" style={{fontWeight:'700',color:yesterday.kick?'#53FC18':'#9146FF',textDecoration:'none'}}>{yesterday.display_name}</a></div>}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          {COUNTRIES.map(c => (
            <button key={c.code} className={`filter-pill ${country === c.code ? 'active' : ''}`} onClick={() => setCountry(c.code)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Emojis del streamer */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '16px',
          padding: '32px 24px', marginBottom: '24px',
          border: '1px solid var(--color-border)',
          position: 'relative', overflow: 'hidden',
          textAlign: 'center',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {Array.from({ length: MAX_EMOJIS }).map((_, i) => (
              <div key={i} style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: i < visibleEmojis.length ? 'var(--bg-card)' : '#1A1A2E',
                border: `2px solid ${i < visibleEmojis.length ? '#F59E0B44' : '#2A2A40'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i < visibleEmojis.length ? '36px' : '20px',
                transition: 'all 0.4s ease',
                animation: i === visibleEmojis.length - 1 && i > 0 ? 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
              }}>
                {i < visibleEmojis.length ? visibleEmojis[i] : '❓'}
              </div>
            ))}
          </div>
          {guesses.length < MAX_EMOJIS - 1 && !gameOver && (
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '12px' }}>
              {MAX_EMOJIS - visibleEmojis.length} emoji{MAX_EMOJIS - visibleEmojis.length !== 1 ? 's' : ''} oculto{MAX_EMOJIS - visibleEmojis.length !== 1 ? 's' : ''} — fallá para revelar más
            </p>
          )}
        </div>

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
            <label htmlFor="emojidle-search" className="sr-only">Buscar streamer</label>
            <input
              id="emojidle-search"
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
                <a key={guess.id} href={`/${getSlug(guess)}`} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: isCorrect ? '#16A34A22' : '#DC262622',
                  border: `1px solid ${isCorrect ? '#16A34A44' : '#DC262644'}`,
                  borderRadius: '8px', padding: '8px 12px',
                  animation: 'fadeIn 0.3s ease',
                  textDecoration: 'none', color: 'inherit',
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
                </a>
              );
            })}
          </div>
        )}

        {gameOver && !showModal && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button className="btn-primary" aria-label="Ver resultado de la partida" onClick={() => setShowModal(true)}>Ver resultado</button>
          </div>
        )}
      </main>

      {showModal && (
        <ShareModal won={won} attempts={guesses.length} target={target} avatars={avatars} country={country}
          onClose={() => setShowModal(false)}
          onOtherGames={() => window.location.href = '/'} />
      )}
    </div>
  );
}