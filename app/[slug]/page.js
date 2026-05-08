'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { STREAMERS } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';

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

const RANK_BY_FOLLOWERS = (() => {
  const s = [...STREAMERS].sort((a,b) => Number(b.total_followers)-Number(a.total_followers));
  const m = {}; s.forEach((x,i) => m[x.id]=i+1); return m;
})();
const RANK_BY_PEAK = (() => {
  const s = [...STREAMERS].sort((a,b) => Number(b.peak_viewers)-Number(a.peak_viewers));
  const m = {}; s.forEach((x,i) => m[x.id]=i+1); return m;
})();
const RANK_BY_HOURS = (() => {
  const s = [...STREAMERS].sort((a,b) => Number(b.total_hours)-Number(a.total_hours));
  const m = {}; s.forEach((x,i) => m[x.id]=i+1); return m;
})();

function countryName(code) {
  const map = { ES:'España',AR:'Argentina',MX:'México',PE:'Perú',CO:'Colombia',CL:'Chile',SV:'El Salvador',PR:'Puerto Rico',VE:'Venezuela',UY:'Uruguay',GT:'Guatemala',DO:'Rep. Dominicana',FR:'Francia',NO:'Noruega' };
  return map[code] || code;
}
function countrySlug(code) {
  const map = { ES:'espana',AR:'argentina',MX:'mexico',PE:'peru',CO:'colombia',CL:'chile' };
  return map[code] || null;
}
function flagOf(code) {
  const map = { ES:'🇪🇸',AR:'🇦🇷',MX:'🇲🇽',PE:'🇵🇪',CO:'🇨🇴',CL:'🇨🇱',SV:'🇸🇻',PR:'🇵🇷',VE:'🇻🇪',UY:'🇺🇾',GT:'🇬🇹',DO:'🇩🇴',FR:'🇫🇷',NO:'🇳🇴' };
  return map[code] || '🌍';
}
function debutYear(iso) {
  if (!iso?.trim()) return null;
  try { return new Date(iso).getFullYear(); } catch { return null; }
}
function yearsActive(iso) {
  const y = debutYear(iso); return y ? new Date().getFullYear()-y : null;
}
function calcAge(by, bm, bd) {
  if (!by) return null;
  const today = new Date();
  const age = today.getFullYear() - Number(by);
  if (bm && bd) {
    const hadBirthday = (today.getMonth()+1 > Number(bm)) || (today.getMonth()+1 === Number(bm) && today.getDate() >= Number(bd));
    return hadBirthday ? age : age - 1;
  }
  return age;
}
function fmt_hours(h) {
  const n = Number(h); if (!n) return null;
  if (n >= 8760) return `≈${(n/8760).toFixed(1)} años`;
  if (n >= 720) return `≈${Math.round(n/720)} meses`;
  return `${fmtFull(n)} hs`;
}

function getRelated(streamer) {
  return STREAMERS.filter(s => s.id !== streamer.id).map(s => {
    let score = 0;
    if (streamer.community && s.community) {
      const sc = Array.isArray(s.community)?s.community:[s.community];
      const tc = Array.isArray(streamer.community)?streamer.community:[streamer.community];
      if (sc.some(c=>tc.includes(c))) score+=10;
    }
    if (s.country === streamer.country) score+=4;
    if (s.top_category && s.top_category === streamer.top_category) score+=2;
    const r = streamer.total_followers>0?s.total_followers/streamer.total_followers:0;
    if (r>0.4&&r<2.5) score+=1;
    return {s,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,6).map(x=>x.s);
}

function generateTrivia(streamer) {
  const rnd = arr => [...arr].sort(()=>Math.random()-0.5);
  const qs = [];

  const othersPhrase = STREAMERS.filter(s=>s.id!==streamer.id&&s.catchphrase?.trim());
  if (streamer.catchphrase?.trim() && othersPhrase.length>=3) {
    const wrongs = rnd(othersPhrase).slice(0,3).map(s=>s.catchphrase);
    qs.push({ q:`¿Cuál de estas frases es de ${streamer.display_name}?`, options:rnd([streamer.catchphrase,...wrongs]), answer:streamer.catchphrase, exp:`"${streamer.catchphrase}" es una de las frases más reconocibles de ${streamer.display_name}.` });
  }

  const debut = debutYear(streamer.created_at);
  if (debut) {
    const wrongs = rnd([debut-3,debut+2,debut-1,debut+1]).slice(0,3);
    qs.push({ q:`¿En qué año creó ${streamer.display_name} su canal de Twitch?`, options:rnd([debut,...wrongs]).map(String), answer:String(debut), exp:`${streamer.display_name} abrió su canal en ${debut}, lleva ${yearsActive(streamer.created_at)} años en Twitch.` });
  }



  return rnd(qs).slice(0,4);
}

function TriviaSection({ streamer }) {
  const [questions, setQuestions] = useState([]);
  const [current,setCurrent] = useState(0);
  const [selected,setSelected] = useState(null);
  const [score,setScore] = useState(0);
  const [done,setDone] = useState(false);

  // Solo generar en el cliente para evitar mismatch de hidratación (Math.random)
  useEffect(() => {
    setQuestions(generateTrivia(streamer));
  }, [streamer.id]);

  if (!questions.length) return <p style={{color:'var(--color-text-secondary)',fontSize:13,padding:'8px 0'}}>Cargando trivia...</p>;

  const q = questions[current];

  if (done) {
    const pct = Math.round(score/questions.length*100);
    return (
      <div style={{textAlign:'center',padding:'20px 0'}}>
        <div style={{fontSize:44,marginBottom:8}}>{pct===100?'🏆':pct>=75?'🔥':pct>=50?'✅':'😅'}</div>
        <div style={{fontSize:20,fontWeight:800,marginBottom:6}}>{score}/{questions.length} correctas</div>
        <div style={{fontSize:13,color:'var(--color-text-secondary)',marginBottom:18}}>
          {pct===100?`¡Sos un experto en ${streamer.display_name}!`:pct>=75?'¡Muy bien!':pct>=50?'Nada mal, podés mejorar.':`Tenés que ver más streams de ${streamer.display_name} 😂`}
        </div>
        <button onClick={()=>{setCurrent(0);setSelected(null);setScore(0);setDone(false);}} className="btn-primary">Jugar de nuevo</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <span style={{fontSize:12,color:'var(--color-text-secondary)',fontWeight:600}}>{current+1}/{questions.length}</span>
        <div style={{display:'flex',gap:4}}>{questions.map((_,i)=><div key={i} style={{width:24,height:3,borderRadius:2,background:i<current?'var(--color-purple)':i===current?'var(--color-purple-light)':'var(--color-border)'}}/>)}</div>
      </div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10,lineHeight:1.4}}>{q.q}</div>
      <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:10}}>
        {q.options.map(opt=>{
          const isSel=selected===opt, isRight=opt===q.answer;
          let bg='var(--bg-primary)',border='var(--color-border)',color='#fff';
          if (selected) { if(isRight){bg='rgba(22,163,74,0.2)';border='#16A34A';color='#4ADE80';}else if(isSel){bg='rgba(220,38,38,0.2)';border='#DC2626';color='#F87171';} }
          return <button key={opt} onClick={()=>{if(!selected){setSelected(opt);if(opt===q.answer)setScore(s=>s+1);}}} style={{background:bg,border:`1.5px solid ${border}`,color,borderRadius:9,padding:'10px 13px',textAlign:'left',fontSize:13,fontWeight:600,cursor:selected?'default':'pointer',transition:'all 0.18s'}}>{opt}</button>;
        })}
      </div>
      {selected&&(
        <div>
          <div style={{fontSize:12,color:'var(--color-text-secondary)',background:'var(--bg-card)',borderRadius:8,padding:'9px 12px',marginBottom:9,lineHeight:1.5,borderLeft:`3px solid ${selected===q.answer?'#16A34A':'#DC2626'}`}}>
            {selected===q.answer?'✅ ':'❌ '}{q.exp}
          </div>
          <button onClick={()=>{if(current+1>=questions.length)setDone(true);else{setCurrent(c=>c+1);setSelected(null);}}} className="btn-primary" style={{width:'100%'}}>
            {current+1>=questions.length?'Ver resultado →':'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({label,value,tooltip,rank,color}) {
  const [hov,setHov]=useState(false);
  return (
    <div style={{background:'var(--bg-card)',border:'1px solid var(--color-border)',borderRadius:12,padding:'13px 15px',flex:1,minWidth:100,position:'relative'}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{fontSize:10,color:'var(--color-text-secondary)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:5}}>{label}</div>
      <div style={{fontSize:20,fontWeight:800,color:color||'#fff',lineHeight:1}}>{value}</div>
      {rank&&<div style={{fontSize:11,color:'var(--color-text-secondary)',marginTop:3,fontWeight:600}}>#{rank} en el sitio</div>}
      {tooltip&&hov&&(
        <div style={{position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:'#1A1A2E',border:'1px solid var(--color-border)',borderRadius:6,padding:'5px 10px',fontSize:12,fontWeight:600,color:'#fff',whiteSpace:'nowrap',zIndex:10,boxShadow:'0 4px 12px rgba(0,0,0,0.4)',pointerEvents:'none'}}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

const SOCIAL_DATA = {
  twitch:    {path:'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z', color:'#9146FF'},
  kick:      {path:'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm3 4v12h2.5v-4l4.5 4H17l-5-5 4.5-4.5h-2.8L9.5 12.5V6H7z', color:'#53FC18'},
  youtube:   {path:'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', color:'#FF0000'},
  twitter:   {path:'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z', color:'#1DA1F2'},
  instagram: {path:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color:'#E1306C'},
  tiktok:    {path:'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z', color:'#69C9D0'},
};

function SocialIcon({href,type}) {
  const [hov,setHov]=useState(false);
  if (!href?.trim()) return null;
  const d=SOCIAL_DATA[type]; if(!d) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:34,height:34,borderRadius:8,background:hov?d.color+'22':'var(--bg-card)',border:`1px solid ${hov?d.color:'var(--color-border)'}`,color:hov?d.color:'var(--color-text-secondary)',transition:'all 0.18s',textDecoration:'none',flexShrink:0}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={d.path}/></svg>
    </a>
  );
}

function RelatedCard({streamer,avatars}) {
  const [hov,setHov]=useState(false);
  const [err,setErr]=useState(false);
  const slug=streamer.display_name.toLowerCase().replace(/\s+/g,'-');
  const url=getAvatarUrl(streamer,avatars);
  return (
    <a href={`/${slug}`} style={{display:'flex',alignItems:'center',gap:10,background:hov?'var(--bg-card)':'transparent',border:`1px solid ${hov?'var(--color-purple)':'var(--color-border)'}`,borderRadius:10,padding:'8px 10px',textDecoration:'none',color:'inherit',transition:'all 0.18s'}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {url&&!err?<img src={url} alt={streamer.display_name} style={{width:30,height:30,borderRadius:'50%',objectFit:'cover',flexShrink:0}} onError={()=>setErr(true)}/>
        :<div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#7C3AED,#53FC18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff'}}>{streamer.display_name.slice(0,2).toUpperCase()}</div>}
      <div style={{minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{streamer.display_name}</div>
        <div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{flagOf(streamer.country)} · {fmt(streamer.total_followers)}</div>
      </div>
    </a>
  );
}

function NotFound() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',display:'flex',flexDirection:'column'}}>
      <header style={{borderBottom:'1px solid var(--color-border)',padding:'14px 24px',display:'flex',alignItems:'center',gap:8,background:'var(--bg-secondary)'}}>
        <a href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:20}}>🎮</span>
          <span style={{fontSize:18,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#53FC18)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>STREAMDLE</span>
        </a>
      </header>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',textAlign:'center'}}>
        <div style={{fontSize:72,marginBottom:16}}>👤</div>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>Streamer no encontrado</h1>
        <p style={{color:'var(--color-text-secondary)',fontSize:15,marginBottom:32,maxWidth:400}}>Este streamer no está en nuestra base de datos todavía.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center'}}>
          <a href="/streamers" className="btn-primary" style={{textDecoration:'none'}}>Ver todos los streamers</a>
          <a href="/contacto" style={{textDecoration:'none',color:'var(--color-text-secondary)',border:'1px solid var(--color-border)',borderRadius:8,padding:'10px 20px',fontSize:14,fontWeight:600}}>Sugerir streamer</a>
        </div>
      </div>
    </div>
  );
}

export default function StreamerPage() {
  const params=useParams();
  const slug=params?.slug||'';
  const streamer=findStreamer(slug);
  const [avatars,setAvatars]=useState({});
  const [imgErr,setImgErr]=useState(false);
  const [clipLoaded,setClipLoaded]=useState(false);
  useEffect(()=>{getAvatars().then(d=>setAvatars(d||{}));},[]);

  if (!streamer) return <NotFound/>;

  const avatarUrl=getAvatarUrl(streamer,avatars);
  const related=useMemo(()=>getRelated(streamer),[streamer.id]);
  const debut=debutYear(streamer.created_at);
  const age=calcAge(streamer.birth_year, streamer.birth_month, streamer.birth_day);
  const isPartner=streamer.broadcaster_type==='partner';
  const twitchUrl=streamer.twitch?`https://twitch.tv/${streamer.twitch}`:null;
  const kickUrl=streamer.kick?`https://kick.com/${streamer.kick}`:null;

  const platforms=[
    streamer.twitch_followers>0&&{name:'Twitch',followers:streamer.twitch_followers,hours:streamer.twitch_hours,color:'#9146FF',url:twitchUrl},
    streamer.kick_followers>0&&{name:'Kick',followers:streamer.kick_followers,hours:streamer.kick_hours,color:'#53FC18',url:kickUrl},
  ].filter(Boolean);

  const crumbs=[{label:'Streamdle',href:'/'},{label:'Streamers',href:'/streamers'}];
  const cSlug=countrySlug(streamer.country);
  if(cSlug) crumbs.push({label:`${flagOf(streamer.country)} ${countryName(streamer.country)}`,href:`/streamers/${cSlug}`});
  crumbs.push({label:streamer.display_name,href:null});

  const extraData=[
    streamer.real_name&&{label:'Nombre real',value:streamer.real_name},
    age&&{label:'Edad',value:`${age} años`},
    streamer.birth_date&&{label:'Fecha de nac.',value:streamer.birth_date},
    streamer.zodiac&&{label:'Signo',value:streamer.zodiac},
    streamer.generation&&{label:'Generación',value:streamer.generation},
    streamer.personality&&{label:'Personalidad',value:streamer.personality},
  ].filter(Boolean);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)'}}>
      <style>{`
        @media(max-width:768px){
          .streamer-grid{grid-template-columns:1fr!important;}
          .community-section-empty{display:none!important;}
          .panel-datos{display:none!important;}
          .panel-datos-mobile{display:block!important;}
          .panel-relacionados{order:99;}
        }
        .panel-datos-mobile{display:none;}
      `}</style>

      <header style={{borderBottom:'1px solid var(--color-border)',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg-secondary)',gap:12,flexWrap:'wrap'}}>
        <a href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:20}}>🎮</span>
          <span style={{fontSize:18,fontWeight:800,background:'linear-gradient(135deg,#7C3AED,#53FC18)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>STREAMDLE</span>
        </a>
        <div className="game-nav-links" style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center'}}>
          {[{href:'/classic',label:'🎯 Classic'},{href:'/avatardle',label:'👤 Avatardle'},{href:'/emojidle',label:'😂 Emojidle'},{href:'/categorydle',label:'🎮 Categorydle'},{href:'/chatdle',label:'💬 Chatdle'},{href:'/higherdle',label:'📊 Higherdle'}].map(g=>(
            <a key={g.href} href={g.href} style={{background:'var(--bg-card)',border:'1px solid var(--color-border)',color:'white',borderRadius:8,padding:'5px 12px',fontSize:10,fontWeight:600,textDecoration:'none',whiteSpace:'nowrap'}}>{g.label}</a>
          ))}
        </div>
      </header>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'10px 16px 0',display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--color-text-secondary)',flexWrap:'wrap'}}>
        {crumbs.map((c,i)=>(
          <span key={i} style={{display:'flex',alignItems:'center',gap:6}}>
            {i>0&&<span>›</span>}
            {c.href?<a href={c.href} style={{color:'var(--color-text-secondary)',textDecoration:'none'}} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='var(--color-text-secondary)'}>{c.label}</a>
              :<span style={{color:'#fff',fontWeight:600}}>{c.label}</span>}
          </span>
        ))}
      </div>

      <main style={{maxWidth:1100,margin:'0 auto',padding:'14px 16px 64px'}}>
        <div className="streamer-grid" style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 270px',gap:14,alignItems:'start'}}>

          {/* IZQUIERDA */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>

            {/* HERO */}
            <div style={{background:'var(--bg-secondary)',borderRadius:16,border:'1px solid var(--color-border)',overflow:'hidden',animation:'fadeIn 0.4s ease'}}>
              <div style={{height:90,position:'relative',overflow:'hidden',background:'linear-gradient(135deg,#1a0a2e,#0d1a0d)'}}>
                {avatarUrl&&!imgErr&&<img src={avatarUrl} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:'blur(20px) brightness(0.25) saturate(1.5)',transform:'scale(1.1)'}}/>}
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,var(--bg-secondary) 100%)'}}/>
              </div>
              <div style={{padding:'0 18px 18px',marginTop:-38,position:'relative'}}>
                <div style={{display:'flex',alignItems:'flex-end',gap:12,marginBottom:10,flexWrap:'wrap'}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    {avatarUrl&&!imgErr
                      ?<img src={avatarUrl} alt={streamer.display_name} style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',border:'3px solid var(--bg-secondary)',boxShadow:'0 0 0 2px var(--color-purple)'}} onError={()=>setImgErr(true)}/>
                      :<div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#7C3AED,#53FC18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'#fff',border:'3px solid var(--bg-secondary)',boxShadow:'0 0 0 2px var(--color-purple)'}}>{streamer.display_name.slice(0,2).toUpperCase()}</div>
                    }
                    {streamer.is_active&&<span style={{position:'absolute',bottom:2,right:2,width:12,height:12,borderRadius:'50%',background:'#16A34A',border:'2px solid var(--bg-secondary)'}} title="Activo"/>}
                  </div>
                  <div style={{flex:1,minWidth:0,paddingBottom:2}}>
                    <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
                      <h1 style={{fontSize:'clamp(17px,3vw,24px)',fontWeight:800,margin:0}}>{streamer.display_name}</h1>
                      {isPartner&&<span style={{background:'#9146FF',color:'#fff',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:4}}>PARTNER</span>}
                      {!streamer.is_active&&<span style={{background:'var(--bg-card)',color:'var(--color-text-secondary)',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:4}}>INACTIVO</span>}
                    </div>
                    <div style={{fontSize:12,color:'var(--color-text-secondary)',marginTop:3}}>{flagOf(streamer.country)} {countryName(streamer.country)}</div>
                  </div>
                  <div style={{display:'flex',gap:5,flexShrink:0,flexWrap:'wrap'}}>
                    {twitchUrl&&<SocialIcon href={twitchUrl} type="twitch"/>}
                    {kickUrl&&<SocialIcon href={kickUrl} type="kick"/>}
                    {streamer.youtube_url&&<SocialIcon href={streamer.youtube_url} type="youtube"/>}
                    {streamer.twitter_url&&<SocialIcon href={streamer.twitter_url} type="twitter"/>}
                    {streamer.instagram_url&&<SocialIcon href={streamer.instagram_url} type="instagram"/>}
                    {streamer.tiktok_url&&<SocialIcon href={streamer.tiktok_url} type="tiktok"/>}
                  </div>
                </div>
                {streamer.description?.trim()&&<p style={{fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.6,margin:'0 0 10px',fontStyle:'italic',borderLeft:'3px solid var(--color-purple)',paddingLeft:12}}>"{streamer.description}"</p>}
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {streamer.top_category&&<span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:'rgba(124,58,237,0.2)',color:'var(--color-purple-light)',border:'1px solid rgba(124,58,237,0.3)'}}>{streamer.top_category}</span>}
                  {streamer.second_category&&streamer.second_category!=='(No tiene)'&&<span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:'rgba(124,58,237,0.1)',color:'var(--color-text-secondary)',border:'1px solid var(--color-border)'}}>{streamer.second_category}</span>}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:7}}>En números</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <StatCard label="Seguidores" value={fmt(streamer.total_followers)} tooltip={fmtFull(streamer.total_followers)} rank={RANK_BY_FOLLOWERS[streamer.id]} color="var(--color-purple-light)"/>
                <StatCard label="Peak histórico" value={fmt(streamer.peak_viewers)} tooltip={fmtFull(streamer.peak_viewers)} rank={RANK_BY_PEAK[streamer.id]} color="#F59E0B"/>
                <StatCard label="Horas en stream" value={fmt(streamer.total_hours)} tooltip={fmtFull(streamer.total_hours)+' hs · '+fmt_hours(streamer.total_hours)} rank={RANK_BY_HOURS[streamer.id]} color="var(--color-green)"/>
              </div>
            </div>

            {/* PLATAFORMAS */}
            {platforms.length>1&&(
              <div style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Por plataforma</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {platforms.map(p=>(
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{flex:1,minWidth:110,textDecoration:'none',background:'var(--bg-card)',borderRadius:10,border:`1px solid ${p.color}44`,padding:'10px 12px',transition:'transform 0.15s'}}
                      onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                      <div style={{fontSize:11,fontWeight:700,color:p.color,marginBottom:3}}>{p.name}</div>
                      <div style={{fontSize:18,fontWeight:800,color:'#fff'}}>{fmt(p.followers)}</div>
                      <div style={{fontSize:11,color:'var(--color-text-secondary)',marginTop:2}}>{fmt(p.hours)} hs</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* COMUNIDAD / ESPORTS / EVENTOS */}
            {/* En mobile solo muestra si tiene datos en al menos una categoría */}
            {(streamer.community||streamer.esports_team||(streamer.events&&streamer.events.length>0)) ? (
              <div className="community-section" style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Comunidad & Esports</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {streamer.community&&(
                    <div>
                      <div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Comunidad</div>
                      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                        {(Array.isArray(streamer.community)?streamer.community:[streamer.community]).map(c=>(
                          <span key={c} style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,background:'rgba(83,252,24,0.12)',color:'var(--color-green)',border:'1px solid rgba(83,252,24,0.25)'}}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {streamer.esports_team&&(
                    <div>
                      <div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Equipo de Esports</div>
                      <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,background:'rgba(37,99,235,0.15)',color:'#60A5FA',border:'1px solid rgba(37,99,235,0.3)'}}>⚔️ {streamer.esports_team}</span>
                    </div>
                  )}
                  {streamer.events&&streamer.events.length>0&&(
                    <div>
                      <div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Eventos</div>
                      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                        {streamer.events.map(e=>(
                          <span key={e} style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,background:'rgba(124,58,237,0.15)',color:'var(--color-purple-light)',border:'1px solid rgba(124,58,237,0.3)'}}>🎪 {e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="community-section-empty" style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Comunidad & Esports</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div><div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Comunidad</div><span style={{fontSize:12,color:'var(--color-border)'}}>Sin comunidad conocida</span></div>
                  <div><div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Equipo de Esports</div><span style={{fontSize:12,color:'var(--color-border)'}}>Sin equipo registrado</span></div>
                  <div><div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Eventos</div><span style={{fontSize:12,color:'var(--color-border)'}}>Sin eventos registrados</span></div>
                </div>
              </div>
            )}

            {/* CLIP */}
            {streamer.top_clip_id&&(
              <div style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px'}}>🎬 Clip más visto</div>
                  {streamer.top_clip_url&&<a href={streamer.top_clip_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'var(--color-purple-light)',textDecoration:'none'}}>Ver en Twitch ↗</a>}
                </div>
                {streamer.top_clip_title&&(
                  <div style={{fontSize:13,fontWeight:600,color:'#fff',marginBottom:8,lineHeight:1.3}}>
                    "{streamer.top_clip_title}"
                    {streamer.top_clip_views>0&&<span style={{color:'var(--color-text-secondary)',fontWeight:400,marginLeft:6}}>· {fmtFull(streamer.top_clip_views)} vistas</span>}
                  </div>
                )}
                <div style={{position:'relative',paddingBottom:'56.25%',height:0,borderRadius:10,overflow:'hidden'}}>
                  {!clipLoaded?(
                    <div style={{position:'absolute',inset:0,background:'var(--bg-card)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,cursor:'pointer',borderRadius:10}}
                      onClick={()=>setClipLoaded(true)}>
                      <div style={{width:52,height:52,borderRadius:'50%',background:'var(--color-purple)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>▶</div>
                      <span style={{fontSize:12,color:'var(--color-text-secondary)'}}>Click para ver el clip</span>
                    </div>
                  ):(
                    <iframe
                      src={`https://clips.twitch.tv/embed?clip=${streamer.top_clip_id}&parent=streamdle.net&parent=www.streamdle.net&autoplay=true`}
                      style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none',borderRadius:10}}
                      allowFullScreen
                      title={`Clip de ${streamer.display_name}`}
                    />
                  )}
                </div>
              </div>
            )}

            {/* TRIVIA */}
            <div style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-purple)',padding:'12px 14px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:12}}>🧠 ¿Cuánto sabés de {streamer.display_name}?</div>
              <TriviaSection streamer={streamer}/>
            </div>

            {/* DATOS (solo mobile) */}
            {extraData.length>0&&(
              <div className="panel-datos-mobile" style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Datos</div>
                <div style={{display:'flex',flexDirection:'column',gap:9}}>
                  {extraData.map((d,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,paddingBottom:i<extraData.length-1?9:0,borderBottom:i<extraData.length-1?'1px solid var(--color-border)':undefined}}>
                      <span style={{fontSize:11,color:'var(--color-text-secondary)',flexShrink:0}}>{d.label}</span>
                      <span style={{fontSize:12,fontWeight:600,color:'#fff',textAlign:'right'}}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BANNER JUEGOS */}
            <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(83,252,24,0.08))',border:'1px solid rgba(124,58,237,0.3)',borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:800,marginBottom:2}}>¿Habrá salido {streamer.display_name} hoy?</div>
                <div style={{fontSize:11,color:'var(--color-text-secondary)'}}>Descubrilo en nuestros juegos diarios</div>
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'nowrap',overflowX:'auto'}}>
                {[{href:'/classic',label:'🎯 Classic'},{href:'/avatardle',label:'👤 Avatardle'},{href:'/emojidle',label:'😂 Emojidle'},{href:'/chatdle',label:'💬 Chatdle'}].map(g=>(
                  <a key={g.href} href={g.href} style={{background:'var(--color-purple)',color:'#fff',borderRadius:8,padding:'5px 9px',fontSize:10,fontWeight:600,textDecoration:'none',transition:'opacity 0.2s',whiteSpace:'nowrap',flexShrink:0}}
                    onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>{g.label}</a>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div style={{padding:'14px 16px',borderRadius:12,border:'1px solid var(--color-border)',background:'var(--bg-secondary)'}}>
              <h2 style={{fontSize:14,fontWeight:700,marginBottom:7}}>Sobre {streamer.display_name}</h2>
              <p style={{fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.7,margin:0}}>
                {streamer.display_name} es un streamer de {countryName(streamer.country)}{streamer.real_name?`, cuyo nombre real es ${streamer.real_name}`:''}
                {age?` (${age} años)`:''}.{debut?` Activo en Twitch desde ${debut},`:''} acumula {fmtFull(streamer.total_followers)} seguidores y {fmtFull(streamer.total_hours)} horas de transmisión.
                {streamer.top_category?` Su contenido principal es ${streamer.top_category}`:''}
                {streamer.second_category&&streamer.second_category!=='(No tiene)'?` y ${streamer.second_category}`:''}.
                {streamer.peak_viewers>0?` Su pico histórico fue de ${fmtFull(streamer.peak_viewers)} espectadores simultáneos.`:''}
                {streamer.is_active?' Actualmente sigue activo.':''}
              </p>
            </div>
          </div>

          {/* DERECHA */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {extraData.length>0&&(
              <div className="panel-datos" style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Datos</div>
                <div style={{display:'flex',flexDirection:'column',gap:9}}>
                  {extraData.map((d,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,paddingBottom:i<extraData.length-1?9:0,borderBottom:i<extraData.length-1?'1px solid var(--color-border)':undefined}}>
                      <span style={{fontSize:11,color:'var(--color-text-secondary)',flexShrink:0}}>{d.label}</span>
                      <span style={{fontSize:12,fontWeight:600,color:'#fff',textAlign:'right'}}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {related.length>0&&(
              <div className="panel-relacionados" style={{background:'var(--bg-secondary)',borderRadius:12,border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Relacionados</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {related.map(s=><RelatedCard key={s.id} streamer={s} avatars={avatars}/>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{borderTop:'1px solid var(--color-border)',background:'var(--bg-secondary)',padding:'20px 24px',textAlign:'center',fontSize:12,color:'var(--color-text-secondary)'}}>
        <div style={{display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap',marginBottom:8}}>
          {[{href:'/streamers',label:'Todos los streamers'},{href:'/contacto',label:'Contacto'},{href:'/privacidad',label:'Privacidad'},{href:'/terminos',label:'Términos'}].map(l=>(
            <a key={l.href} href={l.href} style={{color:'var(--color-text-secondary)',textDecoration:'none'}}>{l.label}</a>
          ))}
        </div>
        © 2026 Streamdle. No afiliado con Twitch, Kick ni YouTube. Hecho por{' '}
        <a href="https://x.com/PatooWnuk" target="_blank" rel="noopener noreferrer" style={{color:'var(--color-green)',textDecoration:'none'}}>Pato Wnuk</a>.
      </footer>
    </div>
  );
}