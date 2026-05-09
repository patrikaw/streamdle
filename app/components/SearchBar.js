'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { STREAMERS } from '../../data/streamers';
import { getCategoriesWithMinStreamers } from '../../lib/categories';

function norm(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, ' ').trim();
}

function fmt(n) {
  if (!n) return '';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return String(n);
}

const FLAG = {
  ES:'🇪🇸', AR:'🇦🇷', MX:'🇲🇽', PE:'🇵🇪', CO:'🇨🇴', CL:'🇨🇱',
  SV:'🇸🇻', PR:'🇵🇷', VE:'🇻🇪', UY:'🇺🇾', GT:'🇬🇹', DO:'🇩🇴',
  CU:'🇨🇺', FR:'🇫🇷', NO:'🇳🇴',
};

// Built once at module level — static data, no re-computation on re-renders
const INDEX = (() => {
  const streamers = STREAMERS.map(s => ({
    type: 'streamer',
    label: s.display_name,
    sub: `${FLAG[s.country] ?? '🌍'} · ${fmt(s.total_followers)}`,
    href: `/${s.name}`,
    tokens: norm([s.display_name, s.name, ...(Array.isArray(s.aliases) ? s.aliases : [])].join(' ')),
  }));
  const games = getCategoriesWithMinStreamers(7).map(c => ({
    type: 'game',
    label: c.name,
    sub: `${c.totalCount} streamers`,
    href: `/juegos/${c.slug}`,
    tokens: norm(c.name),
  }));
  return [...streamers, ...games];
})();

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const [active, setActive] = useState(-1);
  const router   = useRouter();
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);

  const matches = useMemo(() => {
    const q = norm(query);
    if (!q) return { streamers: [], games: [] };
    const all = INDEX.filter(it => it.tokens.includes(q));
    return {
      streamers: all.filter(it => it.type === 'streamer').slice(0, 5),
      games:     all.filter(it => it.type === 'game').slice(0, 4),
    };
  }, [query]);

  const flat = [...matches.streamers, ...matches.games];
  const hasResults = flat.length > 0;

  function go(item) {
    router.push(item.href);
    setQuery('');
    setOpen(false);
    setActive(-1);
  }

  function onKey(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); const t = flat[active] ?? flat[0]; if (t) go(t); }
    else if (e.key === 'Escape') { setOpen(false); setActive(-1); inputRef.current?.blur(); }
  }

  useEffect(() => {
    function out(e) {
      if (!wrapRef.current?.contains(e.target)) { setOpen(false); setActive(-1); }
    }
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);

  const showDropdown = open && !!query;

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, maxWidth: 220, minWidth: 100 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--bg-card)',
        border: `1px solid ${showDropdown && hasResults ? 'var(--color-purple-light)' : 'var(--color-border)'}`,
        borderRadius: 8, padding: '5px 10px',
        transition: 'border-color 0.15s',
      }}>
        <span style={{ fontSize: 11, opacity: 0.45, flexShrink: 0 }}>🔍</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => { if (query) setOpen(true); }}
          onKeyDown={onKey}
          placeholder="Buscar streamer o juego..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: '#fff', fontSize: 12, width: '100%',
            caretColor: 'var(--color-purple-light)',
          }}
        />
        {query && (
          <button
            onMouseDown={e => { e.preventDefault(); setQuery(''); setOpen(false); inputRef.current?.focus(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0 }}
          >×</button>
        )}
      </div>

      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: 'var(--bg-secondary)', border: '1px solid var(--color-border)',
          borderRadius: 10, overflow: 'hidden', minWidth: 260,
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)', zIndex: 200,
        }}>
          {hasResults ? (
            <>
              {matches.streamers.length > 0 && (
                <Section
                  label="Streamers" items={matches.streamers}
                  active={active} offset={0}
                  onSelect={go} onHover={setActive}
                />
              )}
              {matches.games.length > 0 && (
                <Section
                  label="Juegos" items={matches.games}
                  active={active} offset={matches.streamers.length}
                  onSelect={go} onHover={setActive}
                  border={matches.streamers.length > 0}
                />
              )}
            </>
          ) : query.length >= 2 ? (
            <div style={{ padding: '14px 12px', fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              Sin resultados para <strong style={{ color: '#fff' }}>"{query}"</strong>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Section({ label, items, active, offset, onSelect, onHover, border }) {
  return (
    <div style={{ borderTop: border ? '1px solid var(--color-border)' : 'none' }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)',
        padding: '8px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </div>
      {items.map((item, i) => {
        const idx = offset + i;
        return (
          <button
            key={item.href}
            onMouseDown={() => onSelect(item)}
            onMouseEnter={() => onHover(idx)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '7px 12px', border: 'none', textAlign: 'left', cursor: 'pointer',
              background: active === idx ? 'var(--bg-card)' : 'transparent',
              transition: 'background 0.1s',
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.type === 'streamer' ? '🎙️' : '🎮'}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{item.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
