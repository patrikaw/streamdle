'use client';
import { useState } from 'react';

const LABELS = ['A', 'B', 'C', 'D'];

const QUESTIONS = [
  {
    q: 'En los Coscu Army Awards 2026, Coker ganó el premio a "Streamer del Año". ¿Qué frase dijo al recibir la estatuilla?',
    opts: [
      'Esto es para todos los pibes que jugamos al CS',
      'Odio ganar esto porque es mucha presión... pero me lo llevo a casa',
      'El gaming revivió hoy con este premio',
      'Se lo dedico a Kick por darnos la libertad de ser nosotros',
    ],
    a: 1,
    ok: '¡Exacto!',
    ko: 'No era esa...',
    exp: 'Coker fue muy honesto en su discurso: reconoció que había votado a otros colegas como Mernosketti y que sentía mucha presión con el galardón, pero lo aceptó con su humor característico.',
  },
  {
    q: 'Aunque el grupo principal es de 5 integrantes, ¿quién es considerado el sexto miembro oficial de Top Globales según su sitio web?',
    opts: ['Unicornio', 'Rober Galati', 'Momo', 'K1ng'],
    a: 1,
    ok: '¡Correcto, Rober Galati!',
    ko: 'No exactamente...',
    exp: 'Según el sitio TopGlo, el grupo está compuesto oficialmente por Goncho, Coscu, Coker, Zeko, Duende y Rober Galati, quienes comparten el hub digital para "revivir el gaming" en Argentina.',
  },
  {
    q: '¿A qué integrante del grupo le dicen "El Doctor", aunque sus compañeros bromean con que nunca mostró el título?',
    opts: ['Coscu', 'DuendePablo', 'Goncho', 'Zeko'],
    a: 1,
    ok: '¡El Doctor, presente!',
    ko: 'Era otro del grupo...',
    exp: 'Es un chiste interno recurrente. DuendePablo es apodado "El Doctor" y "creador del gaming", aunque sus compañeros suelen burlarse diciendo que sus juegos son aburridos y que el título médico es un misterio.',
  },
  {
    q: '¿Qué fue el "Asado Gate" que generó reclamos de la comunidad en abril de 2026?',
    opts: [
      'La cancelación de un asado presencial tras publicar un flyer oficial',
      'Un stream donde Coscu no tenía carbón y tuvieron que pedir comida',
      'Una pelea entre Goncho y Coker por quién era el mejor asador',
      'El cobro de una comida muy cara tras perder una apuesta contra Windingo',
    ],
    a: 0,
    ok: '¡Asado Gate confirmado!',
    ko: 'No fue eso...',
    exp: 'En abril de 2026 se publicó un flyer que generó expectativas de un asado presencial que no se cumplió como la comunidad esperaba, desencadenando una ola de quejas por "vender humo".',
  },
];

export default function CommunityTrivia({ color }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[current];
  const isCorrect = selected !== null && selected === q.a;

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.a) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= QUESTIONS.length) setDone(true);
    else { setCurrent(c => c + 1); setSelected(null); }
  }

  function handleRestart() {
    setCurrent(0); setSelected(null); setScore(0); setDone(false);
  }

  if (done) {
    const pct = Math.round(score / QUESTIONS.length * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 50 ? '🔥' : '😅';
    const msg = pct === 100
      ? '¡Sos un experto del lore Top Globales!'
      : pct >= 50
      ? '¡Bien! Sabés lo tuyo del grupo.'
      : 'Hay que mirar más streams del grupo... 😂';
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>{emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: '#fff' }}>
          {score}/{QUESTIONS.length} correctas
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18 }}>{msg}</div>
        <button onClick={handleRestart} className="btn-primary">Jugar de nuevo</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          {current + 1}/{QUESTIONS.length}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              width: 28, height: 3, borderRadius: 2,
              background: i < current ? color : i === current ? color + 'aa' : 'var(--color-border)',
            }} />
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45, marginBottom: 14, color: '#fff' }}>
        {q.q}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {q.opts.map((opt, idx) => {
          const isSel = selected === idx;
          const isRight = idx === q.a;
          let bg = 'var(--bg-primary)', border = 'var(--color-border)', txtColor = '#fff';
          if (selected !== null) {
            if (isRight) { bg = 'rgba(22,163,74,0.2)'; border = '#16A34A'; txtColor = '#4ADE80'; }
            else if (isSel) { bg = 'rgba(220,38,38,0.2)'; border = '#DC2626'; txtColor = '#F87171'; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: bg, border: `1.5px solid ${border}`, color: txtColor,
              borderRadius: 9, padding: '10px 13px', textAlign: 'left',
              fontSize: 13, fontWeight: 600,
              cursor: selected !== null ? 'default' : 'pointer',
              transition: 'all 0.18s',
            }}>
              <span style={{
                flexShrink: 0, width: 20, height: 20, borderRadius: 5,
                background: selected !== null
                  ? (isRight ? '#16A34A33' : isSel ? '#DC262633' : 'var(--bg-card)')
                  : 'var(--bg-card)',
                border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: txtColor,
              }}>
                {LABELS[idx]}
              </span>
              <span style={{ lineHeight: 1.4 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div>
          <div style={{
            fontSize: 13, lineHeight: 1.55,
            background: 'var(--bg-card)', borderRadius: 9, padding: '10px 13px',
            marginBottom: 9,
            borderLeft: `3px solid ${isCorrect ? '#16A34A' : '#DC2626'}`,
          }}>
            <div style={{ fontWeight: 700, color: isCorrect ? '#4ADE80' : '#F87171', marginBottom: 4 }}>
              {isCorrect ? `✅ ${q.ok}` : `❌ ${q.ko}`}
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>{q.exp}</div>
          </div>
          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>
            {current + 1 >= QUESTIONS.length ? 'Ver resultado →' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
