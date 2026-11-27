'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { STREAMERS } from '../../data/streamers';
import { getAvatars, getAvatarUrl } from '../../data/avatars';
import { enlacesDeFicha } from '../../lib/agrupaciones';
import { badgesDe } from '../../lib/tendencias';
import { hitoDe } from '../../lib/extras-ficha';
import { CumpleChip } from '../components/Cumple';
import VivoAhora from '../components/VivoAhora';
import PanelInferior from '../components/PanelInferior';
import { categoryToSlug, getCategoriesWithMinStreamers } from '../../lib/categories';
import { fmtNum } from '../../lib/formato';
import { C } from '../../lib/colores';
import { REDES as SOCIAL_DATA } from '../../lib/redes';
import { plural } from '../../lib/plural';

const VALID_GAME_SLUGS = new Set(getCategoriesWithMinStreamers(7).map(c => c.slug));

const EVENT_URLS = {
  'La Velada del Año VI': '/eventos/la-velada-del-ano-6',
};

function findStreamer(slug) {
  return STREAMERS.find(s =>
    s.display_name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

const fmt = (n) => fmtNum(n, '—');

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
  const map = { ES:'España',AR:'Argentina',MX:'México',PE:'Perú',CO:'Colombia',CL:'Chile',SV:'El Salvador',PR:'Puerto Rico',VE:'Venezuela',UY:'Uruguay',GT:'Guatemala',DO:'Rep. Dominicana',CU:'Cuba',FR:'Francia',NO:'Noruega' };
  return map[code] || code;
}
function countrySlug(code) {
  const map = { ES:'espana',AR:'argentina',MX:'mexico',PE:'peru',CO:'colombia',CL:'chile' };
  return map[code] || null;
}
function flagOf(code) {
  const map = { ES:'🇪🇸',AR:'🇦🇷',MX:'🇲🇽',PE:'🇵🇪',CO:'🇨🇴',CL:'🇨🇱',SV:'🇸🇻',PR:'🇵🇷',VE:'🇻🇪',UY:'🇺🇾',GT:'🇬🇹',DO:'🇩🇴',CU:'🇨🇺',FR:'🇫🇷',NO:'🇳🇴' };
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
  const autoQs = [];

  const othersPhrase = STREAMERS.filter(s=>s.id!==streamer.id&&s.catchphrase?.trim());
  if (streamer.catchphrase?.trim() && othersPhrase.length>=3) {
    const wrongs = rnd(othersPhrase).slice(0,3).map(s=>s.catchphrase);
    autoQs.push({ q:`¿Cuál de estas frases es de ${streamer.display_name}?`, options:rnd([streamer.catchphrase,...wrongs]), answer:streamer.catchphrase, exp:`"${streamer.catchphrase}" es una de las frases más reconocibles de ${streamer.display_name}.` });
  }

  const debut = debutYear(streamer.created_at);
  if (debut) {
    const wrongs = rnd([debut-3,debut+2,debut-1,debut+1]).slice(0,3);
    autoQs.push({ q:`¿En qué año creó ${streamer.display_name} su canal de Twitch?`, options:rnd([debut,...wrongs]).map(String), answer:String(debut), exp:`${streamer.display_name} abrió su canal en ${debut}, lleva ${yearsActive(streamer.created_at)} años en Twitch.` });
  }

  const othersEmoji = STREAMERS.filter(s=>s.id!==streamer.id&&s.emojis?.trim());
  if (streamer.emojis?.trim() && othersEmoji.length>=3) {
    const wrongs = rnd(othersEmoji).slice(0,3).map(s=>s.emojis);
    autoQs.push({ q:`¿Cuál de estos grupos de emojis representa a ${streamer.display_name}?`, options:rnd([streamer.emojis,...wrongs]), answer:streamer.emojis, exp:`${streamer.emojis} son los emojis que representan a ${streamer.display_name} en Streamdle.` });
  }

  const hasQ1 = streamer.trivia_q1?.trim() && streamer.trivia_a1?.trim() && streamer.trivia_opts1?.length >= 1;
  const hasQ2 = streamer.trivia_q2?.trim() && streamer.trivia_a2?.trim() && streamer.trivia_opts2?.length >= 1;
  const customCount = (hasQ1 ? 1 : 0) + (hasQ2 ? 1 : 0);
  const pool = rnd(autoQs).slice(0, Math.max(0, 4 - customCount));

  const customs = [];
  if (hasQ1) {
    const opts = rnd([streamer.trivia_a1, ...streamer.trivia_opts1.slice(0,3)]);
    customs.push({ q: streamer.trivia_q1, options: opts, answer: streamer.trivia_a1, exp: streamer.trivia_exp1 || '' });
  }
  if (hasQ2) {
    const opts = rnd([streamer.trivia_a2, ...streamer.trivia_opts2.slice(0,3)]);
    customs.push({ q: streamer.trivia_q2, options: opts, answer: streamer.trivia_a2, exp: streamer.trivia_exp2 || '' });
  }
  return [...customs, ...pool];
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

  if (!questions.length) return <p style={{color:'var(--color-text-secondary)',fontSize:13,padding:'8px 0'}}>Cargando trivia…</p>;

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
        <div style={{display:'flex',gap:4}}>{questions.map((_,i)=><div key={i} style={{width:24,height:3,borderRadius:'var(--radius-xs)',background:i<current?'var(--color-purple)':i===current?'var(--color-purple-light)':'var(--color-border)'}}/>)}</div>
      </div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10,lineHeight:1.4}}>{q.q}</div>
      <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:10}}>
        {q.options.map(opt=>{
          const isSel=selected===opt, isRight=opt===q.answer;
          let bg='var(--bg-primary)',border='var(--color-border)',color='#fff';
          if (selected) { if(isRight){bg='rgba(22,163,74,0.2)';border=C.ok;color=C.okLight;}else if(isSel){bg='rgba(220,38,38,0.2)';border=C.error;color=C.errorLight;} }
          return <button key={opt} onClick={()=>{if(!selected){setSelected(opt);if(opt===q.answer)setScore(s=>s+1);}}} style={{background:bg,border:`1.5px solid ${border}`,color,borderRadius:'var(--radius-sm)',padding:'10px 13px',textAlign:'left',fontSize:13,fontWeight:600,cursor:selected?'default':'pointer',transition:'all 0.18s'}}>{opt}</button>;
        })}
      </div>
      {selected&&(
        <div>
          <div style={{fontSize:12,color:'var(--color-text-secondary)',background:'var(--bg-card)',borderRadius:'var(--radius-sm)',padding:'9px 12px',marginBottom:9,lineHeight:1.5,borderLeft:`3px solid ${selected===q.answer?C.ok:C.error}`}}>
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
    <div className="stat-card" style={{background:'var(--bg-card)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',padding:'13px 15px',minWidth:0,position:'relative',cursor:tooltip?'pointer':'default'}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>setHov(h=>!h)}>
      <div style={{fontSize:10,color:'var(--color-text-secondary)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:5}}>{label}</div>
      <div className="stat-valor" style={{fontSize:20,fontWeight:800,color:color||'#fff',lineHeight:1}}>{value}</div>
      {rank&&<div className="stat-rank" style={{fontSize:11,color:'var(--color-text-secondary)',marginTop:3,fontWeight:600}}>#{rank} en el sitio</div>}
      {tooltip&&hov&&(
        <div style={{position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:'var(--bg-card)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xs)',padding:'5px 10px',fontSize:12,fontWeight:600,color:'#fff',whiteSpace:'nowrap',zIndex:10,boxShadow:'0 4px 12px rgba(0,0,0,0.4)',pointerEvents:'none'}}>
          {tooltip}
        </div>
      )}
    </div>
  );
}



function SocialIcon({href,type}) {
  const [hov,setHov]=useState(false);
  if (!href?.trim()) return null;
  const d=SOCIAL_DATA[type]; if(!d) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={type}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:34,height:34,borderRadius:'var(--radius-sm)',background:hov?d.color+'22':'var(--bg-card)',border:`1px solid ${hov?d.color:'var(--color-border)'}`,color:hov?d.color:'var(--color-text-secondary)',transition:'all 0.18s',textDecoration:'none',flexShrink:0}}
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
    <Link href={`/${slug}`} style={{display:'flex',alignItems:'center',gap:10,background:hov?'var(--bg-card)':'transparent',border:`1px solid ${hov?'var(--color-purple)':'var(--color-border)'}`,borderRadius:'var(--radius-sm)',padding:'8px 10px',textDecoration:'none',color:'inherit',transition:'all 0.18s'}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {url&&!err?<img src={url} alt={streamer.display_name} style={{width:30,height:30,borderRadius:'50%',objectFit:'cover',flexShrink:0}} onError={()=>setErr(true)}/>
        :<div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,var(--color-purple),var(--color-kick))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff'}}>{streamer.display_name.slice(0,2).toUpperCase()}</div>}
      <div style={{minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{streamer.display_name}</div>
        <div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{flagOf(streamer.country)} · {fmt(streamer.total_followers)}</div>
      </div>
    </Link>
  );
}

function ComunidadInfo({streamer}){
  return (
    <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',gap:12,alignItems:'flex-start'}}>
      {streamer.community&&(
        <div>
          <div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Comunidad</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {(Array.isArray(streamer.community)?streamer.community:[streamer.community]).map(c=>(
              <span key={c} style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(83,252,24,0.12)',color:'var(--color-kick)',border:'1px solid rgba(83,252,24,0.25)'}}>{c}</span>
            ))}
          </div>
        </div>
      )}
      {streamer.esports_team&&(
        <div>
          <div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Equipo de Esports</div>
          <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(37,99,235,0.15)',color:C.blueLight,border:'1px solid rgba(37,99,235,0.3)'}}>⚔️ {streamer.esports_team}</span>
        </div>
      )}
      {streamer.events&&streamer.events.length>0&&(
        <div>
          <div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:600}}>Eventos</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {streamer.events.map(e=>{
              const url=EVENT_URLS[e];
              return url
                ?<a key={e} href={url} title={`Ver ${e}`} style={{textDecoration:'none'}}><span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(124,58,237,0.15)',color:'var(--color-purple-light)',border:'1px solid rgba(124,58,237,0.3)'}}>🎪 {e} <span aria-hidden="true" style={{fontSize:10,opacity:0.8}}>↗</span></span></a>
                :<span key={e} style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(124,58,237,0.15)',color:'var(--color-purple-light)',border:'1px solid rgba(124,58,237,0.3)'}}>🎪 {e}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DatosLista({items}){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:9}}>
      {items.map((d,i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,paddingBottom:i<items.length-1?9:0,borderBottom:i<items.length-1?'1px solid var(--color-border)':undefined}}>
          <span style={{fontSize:11,color:'var(--color-text-secondary)',flexShrink:0}}>{d.label}</span>
          <span style={{fontSize:12,fontWeight:600,color:'#fff',textAlign:'right',overflowWrap:'anywhere'}}>{d.href?<a href={d.href} title={`Ver más streamers: ${d.value}`} style={{color:'var(--color-purple-light)',textDecoration:'none'}}>{d.value} <span aria-hidden="true" style={{fontSize:10,opacity:0.8}}>↗</span></a>:d.value}</span>
        </div>
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',textAlign:'center'}}>
        <div style={{fontSize:72,marginBottom:16}}>👤</div>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>Streamer no encontrado</h1>
        <p style={{color:'var(--color-text-secondary)',fontSize:15,marginBottom:32,maxWidth:400}}>Este streamer no está en nuestra base de datos todavía.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center'}}>
          <Link href="/streamers" className="btn-primary" style={{textDecoration:'none'}}>Ver todos los streamers</Link>
          <Link href="/contacto" style={{textDecoration:'none',color:'var(--color-text-secondary)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-sm)',padding:'10px 20px',fontSize:14,fontWeight:600}}>Sugerir streamer</Link>
        </div>
      </div>
    </div>
  );
}

function ActividadPanel({streamer,enPanel}){
  const [a,setA]=useState(null);
  const [listo,setListo]=useState(false);
  useEffect(()=>{
    let vivo=true;
    fetch(`/api/actividad/${streamer.display_name.toLowerCase().replace(/\s+/g,'-')}`).then(r=>r.json()).then(d=>{if(vivo&&d.ok)setA(d);}).catch(()=>{}).finally(()=>{if(vivo)setListo(true);});
    return()=>{vivo=false;};
  },[streamer.id]);
  if(!a)return enPanel?<p style={{fontSize:13,color:'var(--color-text-secondary)',margin:0}}>{listo?'Todavía no hay actividad registrada para este streamer.':'Cargando actividad…'}</p>:null;
  const r=a.reciente, ms=a.meses||[];
  const max=r?Math.max(...r.porDia,1):1;
  const dias=r?Math.floor((Date.now()-new Date(r.ultimo).getTime())/86400000):0;
  const ult=ms[0], prev=ms[1];
  const delta=ult&&prev&&prev.horas>0?Math.round(((ult.horas-prev.horas)/prev.horas)*100):null;
  const maxH=Math.max(...ms.map(m=>m.horas),1);
  return(
    <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',padding:'12px 14px'}}>
      {r&&(<>
        <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Actividad · últimos {a.dias} días</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
          {[[`${r.horas} h`,'en vivo'],[r.sesiones,r.sesiones===1?'directo':'directos'],[`${r.diasActivos} de ${a.dias}`,'días activo'],[`${r.promHoras} h`,'por directo']].map(([v,l])=>(
            <div key={l} style={{background:'var(--bg-card)',borderRadius:'var(--radius-sm)',padding:'6px 10px'}}>
              <div style={{fontSize:16,fontWeight:800}}>{v}</div>
              <div style={{fontSize:10,color:'var(--color-text-secondary)'}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'flex-end',gap:4,height:44,marginBottom:4}}>
          {r.porDia.map((v,i)=><div key={i} title={`${r.nombresDia[i]}: ${v} h`} style={{flex:1,height:`${Math.max(8,(v/max)*100)}%`,background:r.nombresDia[i]===r.diaTop?'var(--color-purple)':'var(--color-border)',borderRadius:'var(--radius-xs)'}}/>)}
        </div>
        <div style={{display:'flex',gap:4,marginBottom:8}}>{r.nombresDia.map(n=><div key={n} style={{flex:1,textAlign:'center',fontSize:9,color:'var(--color-text-secondary)'}}>{n}</div>)}</div>
        <div style={{fontSize:12,color:'var(--color-text-secondary)',lineHeight:1.5}}>
          Suele empezar cerca de las <strong style={{color:'#fff'}}>{r.horaTipica}</strong> (hora de {r.zona}), sobre todo los <strong style={{color:'#fff'}}>{r.diaTop}</strong>. Último directo {dias<=0?'hoy':dias===1?'ayer':`hace ${dias} días`}.
        </div>
      </>)}
      {a.juegos&&a.juegos.length>0&&(
        <div style={{marginTop:r?12:0,paddingTop:r?10:0,borderTop:r?'1px solid var(--color-border)':'none'}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:6}}>Lo que más jugó · últimos 30 días</div>
          {a.juegos.map(j=>(
            <div key={j.juego} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <div style={{flex:1,fontSize:12,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{j.juego}</div>
              <div style={{width:70,height:6,background:'var(--color-border)',borderRadius:'var(--radius-xs)',overflow:'hidden'}}><div style={{width:`${j.pct}%`,height:'100%',background:'var(--color-purple)'}}/></div>
              <div style={{fontSize:11,color:'var(--color-text-secondary)',minWidth:34,textAlign:'right'}}>{j.pct}%</div>
            </div>
          ))}
        </div>
      )}
      {ult&&(
        <div style={{marginTop:r||(a.juegos&&a.juegos.length>0)?12:0,paddingTop:r?10:0,borderTop:r?'1px solid var(--color-border)':'none'}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:6}}>Mes anterior · {ult.mes}</div>
          <div style={{fontSize:13,lineHeight:1.5}}>
            <strong>{ult.horas} h</strong> en {plural(ult.sesiones, 'directo')}, activo {plural(ult.diasActivos, 'día')}
            {delta!==null&&<span style={{color:delta>=0?C.okLight:C.errorLight,fontWeight:700}}> ({delta>=0?'+':''}{delta}% vs {prev.mes})</span>}
          </div>
          {ms.length>1&&(
            <div style={{display:'flex',alignItems:'flex-end',gap:4,height:34,marginTop:8}}>
              {[...ms].reverse().map(m=><div key={m.clave} title={`${m.mes}: ${m.horas} h`} style={{flex:1,textAlign:'center'}}><div style={{height:`${Math.max(6,(m.horas/maxH)*28)}px`,background:'var(--color-purple)',borderRadius:'var(--radius-xs)',opacity:m.clave===ult.clave?1:0.5}}/><div style={{fontSize:8,color:'var(--color-text-secondary)',marginTop:2}}>{m.mes.slice(0,3)}</div></div>)}
            </div>
          )}
        </div>
      )}
      <div style={{fontSize:9,color:'var(--color-text-secondary)',marginTop:8}}>Según los directos guardados en Twitch y Kick.</div>
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
  const clipId=streamer?.top_clip_id||((streamer?.top_clip_url||'').match(/(clip_[A-Za-z0-9]+)/)||[])[1]||null;
  const esKickClip=!streamer?.top_clip_id&&!!clipId;
  const [clipInfo,setClipInfo]=useState(null);
  useEffect(()=>{
    if(!clipId)return;
    let vivo=true;
    fetch(`/api/clip/${clipId}`).then(r=>r.json()).then(d=>{if(vivo&&d.ok)setClipInfo(d);}).catch(()=>{});
    return()=>{vivo=false;};
  },[clipId]);
  useEffect(()=>{getAvatars().then(d=>setAvatars(d||{}));},[]);
  const [panel,setPanel]=useState(null);
  const cerrarPanel=useCallback(()=>setPanel(null),[]);

  if (!streamer) return <NotFound/>;

  const avatarUrl=getAvatarUrl(streamer,avatars);
  const related=useMemo(()=>getRelated(streamer),[streamer.id]);
  const debut=debutYear(streamer.created_at);
  const age=calcAge(streamer.birth_year, streamer.birth_month, streamer.birth_day);
  const isPartner=streamer.broadcaster_type==='partner';
  const twitchUrl=streamer.twitch?`https://twitch.tv/${streamer.twitch}`:null;
  const kickUrl=streamer.kick?`https://kick.com/${streamer.kick}`:null;

  const platforms=[
    streamer.twitch_followers>0&&{name:'Twitch',followers:streamer.twitch_followers,hours:streamer.twitch_hours,color:C.twitch,url:twitchUrl},
    streamer.kick_followers>0&&{name:'Kick',followers:streamer.kick_followers,hours:streamer.kick_hours,color:C.kick,url:kickUrl},
  ].filter(Boolean);

  const crumbs=[{label:'Explorar',href:'/explorar'},{label:'Streamers',href:'/streamers'}];
  const cSlug=countrySlug(streamer.country);
  crumbs.push({label:countryName(streamer.country),href:cSlug?`/streamers/${cSlug}`:null});
  crumbs.push({label:streamer.display_name,href:null});

  const chipGris={fontSize:12,fontWeight:700,padding:'5px 11px',borderRadius:'var(--radius-pill)',background:'var(--bg-card)',color:'#fff',border:'1px solid var(--color-border)'};
  const tieneComunidad=!!(streamer.community||streamer.esports_team||(streamer.events&&streamer.events.length>0));
  const enlaces=enlacesDeFicha(streamer);
  const badges=badgesDe(streamer);
  const hito=hitoDe(streamer);
  const extraData=[
    streamer.real_name&&{label:'Nombre real',value:streamer.real_name},
    age&&{label:'Edad',value:`${age} años`},
    streamer.birth_date&&{label:'Fecha de nac.',value:streamer.birth_date,href:enlaces.nacimiento},
    streamer.zodiac&&{label:'Signo',value:streamer.zodiac,href:enlaces.signo},
    streamer.generation&&{label:'Generación',value:streamer.generation,href:enlaces.generacion},
    streamer.personality&&{label:'Personalidad',value:streamer.personality,href:enlaces.personalidad},
  ].filter(Boolean);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)'}}>
      <style>{`
        .solo-movil{display:none!important;}
        @media(max-width:768px){
          .streamer-grid{grid-template-columns:minmax(0,1fr)!important;}
          .solo-desktop{display:none!important;}
          .solo-movil{display:flex!important;}
          .panel-relacionados{order:99;}
        }
        @media(max-width:420px){
          .stat-card{padding:10px 8px!important;}
          .stat-valor{font-size:17px!important;}
          .stat-rank{font-size:10px!important;}
          .hero-pad{padding:0 14px 14px!important;}
        }
        @media(max-width:640px){.header-icon{display:none!important;}}
      `}</style>


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
            <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-lg)',border:'1px solid var(--color-border)',overflow:'hidden',animation:'fadeIn 0.4s ease'}}>
              <div style={{height:90,position:'relative',overflow:'hidden',background:'linear-gradient(135deg,#1a0a2e,#0d1a0d)'}}>
                {avatarUrl&&!imgErr&&<img src={avatarUrl} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:'blur(20px) brightness(0.25) saturate(1.5)',transform:'scale(1.1)'}}/>}
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,var(--bg-secondary) 100%)'}}/>
              </div>
              <div className="hero-pad" style={{padding:'0 18px 18px',marginTop:-38,position:'relative'}}>
                <div style={{display:'flex',alignItems:'flex-end',gap:12,marginBottom:10,flexWrap:'wrap'}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    {avatarUrl&&!imgErr
                      ?<img src={avatarUrl} alt={streamer.display_name} style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',border:'3px solid var(--bg-secondary)',boxShadow:'0 0 0 2px var(--color-purple)'}} onError={()=>setImgErr(true)}/>
                      :<div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,var(--color-purple),var(--color-kick))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'#fff',border:'3px solid var(--bg-secondary)',boxShadow:'0 0 0 2px var(--color-purple)'}}>{streamer.display_name.slice(0,2).toUpperCase()}</div>
                    }
                    {streamer.is_active&&<span style={{position:'absolute',bottom:2,right:2,width:12,height:12,borderRadius:'50%',background:C.ok,border:'2px solid var(--bg-secondary)'}} title="Activo"/>}
                  </div>
                  <div style={{flex:'1 1 200px',minWidth:0,paddingBottom:2}}>
                    <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
                      <h1 style={{fontSize:'clamp(17px,3vw,24px)',fontWeight:800,margin:0}}>{streamer.display_name}</h1>
                      <VivoAhora twitch={streamer.twitch} kick={streamer.kick}/>
                      {isPartner&&<span style={{background:C.twitch,color:'#fff',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:'var(--radius-xs)'}}>PARTNER</span>}
                      {!streamer.is_active&&<span style={{background:'var(--bg-card)',color:'var(--color-text-secondary)',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:'var(--radius-xs)'}}>INACTIVO</span>}
                    </div>
                    <div style={{fontSize:12,color:'var(--color-text-secondary)',marginTop:3}}>{flagOf(streamer.country)} {countryName(streamer.country)}</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:7}}>
                      {streamer.twitch&&<span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'color-mix(in srgb, var(--color-twitch) 20%, transparent)',color:'#fff',border:'1px solid color-mix(in srgb, var(--color-twitch) 55%, transparent)'}}>Twitch</span>}
                      {streamer.kick&&<span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'color-mix(in srgb, var(--color-kick) 16%, transparent)',color:'var(--color-kick)',border:'1px solid color-mix(in srgb, var(--color-kick) 50%, transparent)'}}>Kick</span>}
                      {debut&&<span className="solo-desktop" title="Año en que se creó su canal de Twitch" style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'var(--bg-card)',color:'var(--color-text-secondary)',border:'1px solid var(--color-border)'}}>📅 En Twitch desde {debut}</span>}
                      {hito&&<span title={hito.title} style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'color-mix(in srgb, var(--color-warn) 18%, transparent)',color:'#fff',border:'1px solid color-mix(in srgb, var(--color-warn) 50%, transparent)'}}>{hito.texto}</span>}
                      {streamer.birth_month&&streamer.birth_day&&<CumpleChip dia={Number(streamer.birth_day)} mes={Number(streamer.birth_month)} anio={streamer.birth_year?Number(streamer.birth_year):null}/>}
                    </div>

                    {badges.length>0&&<div className="solo-desktop" style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:7}}>{badges.map(b=><a key={b.texto} href={b.href} title={b.title} style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(74,222,128,0.12)',color:C.okLight,border:'1px solid rgba(74,222,128,0.35)',textDecoration:'none'}}>{b.texto} <span aria-hidden="true" style={{fontSize:10,opacity:0.8}}>↗</span></a>)}</div>}
                  </div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {twitchUrl&&<SocialIcon href={twitchUrl} type="twitch"/>}
                    {kickUrl&&<SocialIcon href={kickUrl} type="kick"/>}
                    {streamer.youtube_url&&<SocialIcon href={streamer.youtube_url} type="youtube"/>}
                    {streamer.twitter_url&&<SocialIcon href={streamer.twitter_url} type="twitter"/>}
                    {streamer.instagram_url&&<SocialIcon href={streamer.instagram_url} type="instagram"/>}
                    {streamer.tiktok_url&&<SocialIcon href={streamer.tiktok_url} type="tiktok"/>}
                  </div>
                </div>
                {streamer.description?.trim()&&<p style={{overflowWrap:'anywhere',fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.6,margin:'0 0 10px',fontStyle:'italic',borderLeft:'3px solid var(--color-purple)',paddingLeft:12}}>"{streamer.description}"</p>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {streamer.top_category&&(()=>{
                      const sl=categoryToSlug(streamer.top_category);
                      const s={fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(124,58,237,0.2)',color:'var(--color-purple-light)',border:'1px solid rgba(124,58,237,0.3)',textDecoration:'none'};
                      return VALID_GAME_SLUGS.has(sl)
                        ?<Link href={`/juegos/${sl}`} title={`Ver streamers de ${streamer.top_category}`} style={s}>{streamer.top_category} <span aria-hidden="true" style={{fontSize:10,opacity:0.8}}>↗</span></Link>
                        :<span style={s}>{streamer.top_category}</span>;
                    })()}
                    {streamer.second_category&&streamer.second_category!=='(No tiene)'&&<span className="solo-desktop" style={{display:'contents'}}>{(()=>{
                      const sl=categoryToSlug(streamer.second_category);
                      const s={fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(124,58,237,0.1)',color:'var(--color-text-secondary)',border:'1px solid var(--color-border)',textDecoration:'none'};
                      return VALID_GAME_SLUGS.has(sl)
                        ?<Link href={`/juegos/${sl}`} title={`Ver streamers de ${streamer.second_category}`} style={s}>{streamer.second_category} <span aria-hidden="true" style={{fontSize:10,opacity:0.8}}>↗</span></Link>
                        :<span style={s}>{streamer.second_category}</span>;
                    })()}</span>}
                  </div>
                  {(streamer.top_content||streamer.second_content)&&(
                    <div className="solo-desktop" style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {streamer.top_content&&<span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(245,158,11,0.15)',color:C.warnLight,border:'1px solid rgba(245,158,11,0.3)'}}>🎯 {streamer.top_content}</span>}
                      {streamer.second_content&&<span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:'var(--radius-pill)',background:'rgba(245,158,11,0.08)',color:C.warn,border:'1px solid rgba(245,158,11,0.2)'}}>🎯 {streamer.second_content}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:7}}>En números</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:8}}>
                <StatCard label="Seguidores" value={fmt(streamer.total_followers)} tooltip={fmtFull(streamer.total_followers)} rank={RANK_BY_FOLLOWERS[streamer.id]} color="var(--color-purple-light)"/>
                <StatCard label="Peak histórico" value={fmt(streamer.peak_viewers)} tooltip={fmtFull(streamer.peak_viewers)} rank={RANK_BY_PEAK[streamer.id]} color="var(--color-warn)"/>
                <StatCard label="Horas en stream" value={fmt(streamer.total_hours)} tooltip={fmtFull(streamer.total_hours)+' hs · '+fmt_hours(streamer.total_hours)} rank={RANK_BY_HOURS[streamer.id]} color="var(--color-info)"/>
              </div>
            </div>

            {/* En móvil la info secundaria se abre en un panel inferior */}
            <div className="solo-movil" style={{gap:8,flexWrap:'wrap'}}>
              {[
                ['datos','📋 Datos'],
                ['actividad','📊 Actividad'],
                tieneComunidad&&['comunidad','👥 Comunidad'],
              ].filter(Boolean).map(([k,l])=>(
                <button key={k} onClick={()=>setPanel(k)} style={{flexShrink:0,background:'var(--bg-secondary)',border:'1px solid var(--color-border)',color:'#fff',borderRadius:'var(--radius-pill)',padding:'9px 14px',fontSize:13,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>{l} ›</button>
              ))}
            </div>

            {/* PLATAFORMAS */}
            {platforms.length>1&&(
              <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Por plataforma</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {platforms.map(p=>(
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{flex:1,minWidth:110,textDecoration:'none',background:'var(--bg-card)',borderRadius:'var(--radius-sm)',border:`1px solid ${p.color}44`,padding:'10px 12px',transition:'transform 0.15s'}}
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
            {tieneComunidad ? (
              <div className="community-section solo-desktop" style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Comunidad & Esports</div>
                <ComunidadInfo streamer={streamer}/>
              </div>
            ) : null}

            {/* CLIP */}
            {clipId&&(
              <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px'}}>🎬 Clip más visto</div>
                  {streamer.top_clip_url&&<a href={streamer.top_clip_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'var(--color-purple-light)',textDecoration:'none'}}>Ver en {esKickClip?'Kick':'Twitch'} ↗</a>}
                </div>
                <div style={{position:'relative',paddingBottom:'56.25%',height:0,borderRadius:'var(--radius-sm)',overflow:'hidden',background:'linear-gradient(135deg,#1A1A2E,#2D1B69)'}}>
                  {clipLoaded&&!esKickClip?(
                    <iframe
                      src={`https://clips.twitch.tv/embed?clip=${clipId}&parent=streamdle.net&parent=www.streamdle.net&autoplay=true`}
                      style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none',borderRadius:'var(--radius-sm)'}}
                      allowFullScreen
                      title={`Clip de ${streamer.display_name}`}
                    />
                  ):(
                    <a href={esKickClip?streamer.top_clip_url:undefined} target={esKickClip?'_blank':undefined} rel="noopener noreferrer"
                      onClick={esKickClip?undefined:(e)=>{e.preventDefault();setClipLoaded(true);}}
                      style={{position:'absolute',inset:0,display:'block',cursor:'pointer',textDecoration:'none'}}>
                      {clipInfo?.thumb&&<img src={clipInfo.thumb} alt={streamer.top_clip_title||`Clip de ${streamer.display_name}`} loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.25) 100%)'}}/>
                      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:58,height:58,borderRadius:'50%',background:'rgba(124,58,237,0.92)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,color:'#fff',boxShadow:'0 4px 20px rgba(0,0,0,0.5)'}}>▶</div>
                      {clipInfo?.duracion>0&&<span style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.75)',color:'#fff',fontSize:11,fontWeight:700,padding:'2px 7px',borderRadius:'var(--radius-xs)'}}>{Math.floor(clipInfo.duracion/60)}:{String(Math.round(clipInfo.duracion%60)).padStart(2,'0')}</span>}
                      <div style={{position:'absolute',left:12,right:12,bottom:10}}>
                        {(streamer.top_clip_title||clipInfo?.titulo)&&<div style={{fontSize:14,fontWeight:700,color:'#fff',lineHeight:1.3,textShadow:'0 1px 6px rgba(0,0,0,0.8)',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{streamer.top_clip_title||clipInfo.titulo}</div>}
                        {(streamer.top_clip_views>0||clipInfo?.vistas>0)&&<div style={{fontSize:11,color:'rgba(255,255,255,0.8)',marginTop:3}}>👁 {fmtFull(streamer.top_clip_views>0?streamer.top_clip_views:clipInfo.vistas)} vistas</div>}
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* TRIVIA */}
            <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-purple)',padding:'12px 14px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:12}}>🧠 ¿Cuánto sabés de {streamer.display_name}?</div>
              <TriviaSection streamer={streamer}/>
            </div>

            {/* BANNER JUEGOS */}
            <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(83,252,24,0.08))',border:'1px solid rgba(124,58,237,0.3)',borderRadius:'var(--radius-md)',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:800,marginBottom:2}}>¿Habrá salido {streamer.display_name} hoy?</div>
                <div style={{fontSize:11,color:'var(--color-text-secondary)'}}>Descubrilo en nuestros juegos diarios</div>
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[{ href: '/', label: '🎮 Nuestros juegos' }, { href: '/ruleta', label: '🎲 Descubrí un streamer' }].map(g=>(
                  <a key={g.href} href={g.href} style={{background:'var(--color-purple)',color:'#fff',borderRadius:'var(--radius-sm)',padding:'9px 16px',fontSize:13,fontWeight:600,textDecoration:'none',transition:'opacity 0.2s',whiteSpace:'nowrap'}}
                    onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>{g.label}</a>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div style={{padding:'14px 16px',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',background:'var(--bg-secondary)'}}>
              <h2 style={{fontSize:14,fontWeight:700,marginBottom:7}}>Sobre {streamer.display_name}</h2>
              {streamer.bio?.trim()
                ? <p style={{fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.7,margin:0}}>{streamer.bio}</p>
                : <p style={{fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.7,margin:0}}>
                    {streamer.display_name} es un streamer de {countryName(streamer.country)}{streamer.real_name?`, cuyo nombre real es ${streamer.real_name}`:''}
                    {age?` (${age} años)`:''}.{debut?` Activo en Twitch desde ${debut},`:''} acumula {fmtFull(streamer.total_followers)} seguidores y {fmtFull(streamer.total_hours)} horas de transmisión.
                    {streamer.top_category?` Su contenido principal es ${streamer.top_category}`:''}
                    {streamer.second_category&&streamer.second_category!=='(No tiene)'?` y ${streamer.second_category}`:''}.
                    {streamer.peak_viewers>0?` Su pico histórico fue de ${fmtFull(streamer.peak_viewers)} espectadores simultáneos.`:''}
                    {streamer.is_active?' Actualmente sigue activo.':''}
                  </p>
              }
            </div>
          </div>

          {/* DERECHA */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {extraData.length>0&&(
              <div className="panel-datos solo-desktop" style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Datos</div>
                <DatosLista items={extraData}/>
              </div>
            )}
            <div className="solo-desktop"><ActividadPanel streamer={streamer}/></div>
            {related.length>0&&(
              <div className="panel-relacionados" style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',padding:'12px 14px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:10}}>Relacionados</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {related.map(s=><RelatedCard key={s.id} streamer={s} avatars={avatars}/>)}
                </div>
              </div>
            )}
            <Link href="/" style={{display:'block',textAlign:'center',fontSize:13,fontWeight:700,color:'#fff',textDecoration:'none',padding:'9px 12px',borderRadius:'var(--radius-sm)',background:'var(--color-purple)'}}>🎮 Jugá con streamers →</Link>
            <Link href="/ruleta" style={{display:'block',textAlign:'center',fontSize:13,fontWeight:700,color:'#fff',textDecoration:'none',padding:'9px 12px',borderRadius:'var(--radius-sm)',background:'var(--bg-card)',border:'1px solid var(--color-purple)'}}>🎲 Descubrí otro streamer →</Link>
          </div>
        </div>
      </main>
      <PanelInferior abierto={!!panel} onCerrar={cerrarPanel} titulo={panel==='actividad'?'Actividad':panel==='comunidad'?'Comunidad & Esports':`Datos de ${streamer.display_name}`}>
        {panel==='datos'&&(
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {extraData.length>0&&<DatosLista items={extraData}/>}
            {(debut||hito||streamer.top_category||streamer.top_content||badges.length>0)&&(
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:8}}>Etiquetas</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {debut&&<span style={chipGris}>📅 En Twitch desde {debut}</span>}
                  {hito&&<span style={chipGris}>{hito.texto}</span>}
                  {[streamer.top_category,streamer.second_category].filter(c=>c&&c!=='(No tiene)').map(c=>{
                    const sl=categoryToSlug(c);
                    return VALID_GAME_SLUGS.has(sl)
                      ?<Link key={c} href={`/juegos/${sl}`} style={{...chipGris,color:'var(--color-purple-light)',textDecoration:'none'}}>🎮 {c} ↗</Link>
                      :<span key={c} style={chipGris}>🎮 {c}</span>;
                  })}
                  {[streamer.top_content,streamer.second_content].filter(Boolean).map(c=><span key={c} style={{...chipGris,color:C.warnLight}}>🎯 {c}</span>)}
                  {badges.map(b=><a key={b.texto} href={b.href} style={{...chipGris,color:C.okLight,textDecoration:'none'}}>{b.texto} ↗</a>)}
                </div>
              </div>
            )}
          </div>
        )}
        {panel==='actividad'&&<ActividadPanel streamer={streamer} enPanel/>}
        {panel==='comunidad'&&<ComunidadInfo streamer={streamer}/>}
      </PanelInferior>

    </div>
  );
}