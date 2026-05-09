'use client';
import { useState } from 'react';

const LABELS = ['A', 'B', 'C', 'D'];

export default function GameTrivia({ questions, color }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions?.length) return null;

  const q = questions[current];
  const isCorrect = selected !== null && selected === q.a;

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.a) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round(score / questions.length * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 50 ? '🔥' : '😅';
    const msg = pct === 100
      ? '¡Sos un experto de esta categoría!'
      : pct >= 50
      ? '¡Bien jugado! Sabés lo tuyo.'
      : 'Hay que ver más streams... 😂';
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>{emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: '#fff' }}>
          {score}/{questions.length} correctas
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
          {current + 1}/{questions.length}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, i) => (
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
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: bg, border: `1.5px solid ${border}`, color: txtColor,
                borderRadius: 9, padding: '10px 13px', textAlign: 'left',
                fontSize: 13, fontWeight: 600,
                cursor: selected !== null ? 'default' : 'pointer',
                transition: 'all 0.18s',
              }}
            >
              <span style={{
                flexShrink: 0, width: 20, height: 20,
                borderRadius: 5, background: selected !== null
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
            {current + 1 >= questions.length ? 'Ver resultado →' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
