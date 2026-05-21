// =============================================================================
// T3 + T9 cliff-panel components
// -----------------------------------------------------------------------------
// Drop-in replacements for the inner content of CliffBroadcastViewport when
// the active task is T3 (Compositional Video Retrieval) or T9 (Cross-Corpus
// Agentic Reasoning). The viewport chrome (REC dot, top label, bottom task
// strip) wraps these and is unchanged.
//
// Both components consume an `active` boolean — true while the cliff scroll
// progress is dwelling on this task's band. They use that to drive their own
// internal animation (T3 = auto-toggle between success and failure panels;
// T9 = build the trajectory strip left-to-right).
//
// Data is read from inline constants T3_PANEL and T9_PANEL emitted by
// scripts/build_panel_assets.py.
// =============================================================================

// ---------- T3 PANEL ----------

function T3Panel({ pillar, active }) {
  const c = PILLARS[pillar];
  const panels = T3_PANEL.panels;
  // Failure-only: one panel per sport. Single-axis sport selector.
  const sports = ['basketball', 'soccer', 'hockey'];
  const [sport, setSport] = useState('basketball');
  // selectedThumbId per panel; default = top-sim (first after sort).
  const [selectedByPanel, setSelectedByPanel] = useState({});
  const bigVideoRef = useRef(null);

  useEffect(() => {
    if (!active) { setSport('basketball'); setSelectedByPanel({}); }
  }, [active]);

  const panel = panels.find(p => p.sport === sport) || panels[0];
  const idx = panel.id;
  // Default selected thumb = the GT clip (so the user sees the right
  // answer first, then can click HNs to compare).
  const gtThumb = panel.thumbs.find(t => t.is_gt) || panel.thumbs[0];
  const defaultThumbId = gtThumb.id;
  const selectedId = selectedByPanel[idx] || defaultThumbId;
  const selectedThumb = panel.thumbs.find(t => t.id === selectedId) || gtThumb;

  useEffect(() => {
    const el = bigVideoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [idx, selectedId]);

  const pickThumb = (id) => setSelectedByPanel(s => ({ ...s, [idx]: id }));

  return (
    <div style={{
      position: 'absolute', top: 28, bottom: 32, left: 0, right: 0,
      display: 'flex', flexDirection: 'column',
      padding: '11px 14px', gap: 8,
      background: '#0c0d10',
    }}>
      {/* Query bar */}
      <div style={{
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: 15, lineHeight: 1.4, color: '#fafafa',
        padding: '10px 14px',
        background: 'rgba(20,20,26,0.85)',
        border: '1px solid #27272a',
        borderRadius: 3,
        flex: '0 0 auto',
      }}>
        <span style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          color: '#71717a', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginRight: 10,
        }}>Query</span>
        {panel.query_simple}
      </div>

      {/* Big video left + 4-thumb picker column right. Column height
          matches video height by spec: 4 thumbs @ aspect 16:9 with 3 gaps. */}
      <div style={{
        display: 'flex', gap: 10,
        flex: 1, minHeight: 0,
      }}>
        {/* Big video player. Border + badge tinted green if GT, red if HN. */}
        {(() => null)()}
        <div style={{
          flex: 1, minWidth: 0, position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>
          {(() => {
            const isGT = selectedThumb.is_gt;
            const edgeColor = isGT ? '#2ECC71' : '#E74C3C';
            const edgeGlow  = isGT ? 'rgba(46,204,113,0.45)' : 'rgba(231,76,60,0.45)';
            return (
            <div style={{
              position: 'relative', flex: 1, minHeight: 0,
              background: '#000',
              border: `2px solid ${edgeColor}`,
              borderRadius: 3, overflow: 'hidden',
              boxShadow: `0 0 22px ${edgeGlow}`,
            }}>
            <video
              ref={bigVideoRef}
              src={selectedThumb.video}
              muted playsInline loop autoPlay
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'contain', background: '#000',
                display: 'block',
              }}
            />
            {/* Sim score badge (top-left) */}
            <div style={{
              position: 'absolute', top: 8, left: 8,
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 12,
              fontWeight: 700, letterSpacing: '0.04em',
              color: '#fafafa',
              background: 'rgba(10,10,12,0.85)',
              padding: '4px 10px', borderRadius: 2,
              boxShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}>sim {selectedThumb.sim.toFixed(2)}</div>
            {isGT && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                fontFamily: '"IBM Plex Mono", monospace', fontSize: 12,
                fontWeight: 700, letterSpacing: '0.08em',
                color: '#0a0a0c', background: edgeColor,
                padding: '4px 10px', borderRadius: 2,
                boxShadow: `0 0 16px ${edgeGlow}`,
              }}>GT ✓</div>
            )}
            </div>
            );
          })()}
          {/* Caption */}
          <div style={{
            marginTop: 8,
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontSize: 14, lineHeight: 1.45,
            color: selectedThumb.is_gt ? '#fafafa' : '#d4d4d8',
            flex: '0 0 auto',
            minHeight: 36,
          }}>
            {selectedThumb.diff_substring
              ? renderCaptionWithDiff(selectedThumb.caption, selectedThumb.diff_substring, '#ef6f5e')
              : selectedThumb.caption}
          </div>
        </div>

        {/* Thumb picker column — 4 thumbs with red (wrong) / green (GT) edges. */}
        <div style={{
          width: 116, flex: '0 0 116px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {panel.thumbs.map(th => {
            const isSelected = th.id === selectedId;
            const isGT = th.is_gt;
            const edgeColor = isGT ? '#2ECC71' : '#E74C3C';   // green / red
            const edgeGlow  = isGT ? 'rgba(46,204,113,0.55)' : 'rgba(231,76,60,0.55)';
            return (
              <div key={th.id}
                onClick={() => pickThumb(th.id)}
                style={{
                  position: 'relative',
                  flex: 1, minHeight: 0,
                  background: '#000',
                  border: `2px solid ${edgeColor}`,
                  borderRadius: 3, overflow: 'hidden',
                  cursor: 'pointer',
                  opacity: isSelected ? 1 : 0.7,
                  transition: 'opacity 150ms, box-shadow 150ms',
                  boxShadow: isSelected ? `0 0 12px ${edgeGlow}` : 'none',
                }}>
                <video
                  src={th.video}
                  muted playsInline loop preload="metadata"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    filter: isSelected ? 'none' : 'saturate(0.7)',
                  }}
                />
                <div style={{
                  position: 'absolute', top: 4, left: 5,
                  fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5,
                  fontWeight: 700, letterSpacing: '0.04em',
                  color: '#fafafa',
                  background: 'rgba(10,10,12,0.85)',
                  padding: '2px 6px', borderRadius: 2,
                  lineHeight: 1.15,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <span>sim {th.sim.toFixed(2)}</span>
                  {isGT && <span style={{ color: '#2ECC71' }}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sport selector — large pill buttons, easy to spot as clickable. */}
      <div style={{
        display: 'flex', gap: 10, justifyContent: 'center',
        flex: '0 0 auto', marginTop: 2,
      }}>
        {sports.map(sp => {
          const isActive = sp === sport;
          return (
            <button key={sp}
              onClick={() => setSport(sp)}
              style={{
                border: 'none', cursor: 'pointer', userSelect: 'none',
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
                padding: '9px 22px', borderRadius: 999,
                background: isActive ? c.base : 'rgba(28,28,31,0.85)',
                color: isActive ? '#0a0a0c' : '#e4e4e7',
                boxShadow: isActive
                  ? `0 0 16px ${c.glow}`
                  : 'inset 0 0 0 1px #3f3f46',
                transition: 'background 180ms, color 180ms, box-shadow 180ms',
                textTransform: 'capitalize',
              }}>
              {sp}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderCaptionWithDiff(text, sub, color) {
  const i = text.indexOf(sub);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{
        color, fontWeight: 600,
        textDecoration: 'underline', textDecorationStyle: 'dotted',
        textUnderlineOffset: 2,
      }}>{sub}</span>
      {text.slice(i + sub.length)}
    </>
  );
}

// ---------- T9 PANEL ----------

const T9_TOOL_COLOR = {
  search_documents: '#4A7FB5',   // blue
  document_qa:      '#2E9E8F',   // teal-green
  search_videos:    '#8B5CF6',   // purple
  video_qa:         '#D4913A',   // amber
  video_qa_oracle:  '#D4913A',
};

// Two-letter abbreviation used inside the per-phase chip strip.
const TOOL_ABBREV_SHORT = {
  search_documents: 'SD',
  document_qa:      'DQ',
  search_videos:    'SV',
  video_qa:         'VQ',
  video_qa_oracle:  'VQ',
};

function T9Panel({ pillar, active, data, light, tileColors, noClick }) {
  const c = PILLARS[pillar];
  // `data` defaults to the cliff trajectory (Q45). Pass `T9_PANEL_ASK` for
  // the Ask-the-play trajectory (Q42).
  if (!data) data = T9_PANEL_CLIFF;
  // Optional per-panel color override for tiles. Falls back to T9_TOOL_COLOR.
  const toolColor = tileColors || T9_TOOL_COLOR;
  const turns = data.turns;
  const totalTiles = turns.length + 1;   // + final ✗

  // Light-mode color tokens. When `light` is true (§4 "See how the models
  // answer"), the panel renders on a white card; otherwise it stays as the
  // dark broadcast monitor (cliff section).
  const bg            = light ? '#ffffff'              : '#0c0d10';
  const headerBg      = light ? '#f4f4f5'              : 'rgba(20,20,26,0.85)';
  const headerBorder  = light ? '#d4d4d8'              : '#27272a';
  const textPrimary   = light ? '#18181b'              : '#fafafa';
  const textSecondary = light ? '#52525b'              : '#a1a1aa';
  const stripBg       = light ? '#fafafa'              : 'rgba(10,10,12,0.6)';
  const stripBorder   = light ? '#e4e4e7'              : '#1c1c1f';
  const tileBgIdle    = light ? '#e4e4e7'              : '#1c1c1f';
  const tileTextIdle  = light ? '#a1a1aa'              : '#3f3f46';
  const tileRevealedText = light ? '#ffffff'           : '#fafafa';
  const selectedOutline  = light ? '#18181b'           : '#fafafa';

  const [revealedCount, setRevealedCount] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  // Modal video player state: {clip_id, url} or null.
  const [modalClip, setModalClip] = useState(null);

  // Auto-step left-to-right when active. Reveals ~150 ms per tile.
  useEffect(() => {
    if (!active) { setRevealedCount(0); setSelectedIdx(null); return; }
    let cancelled = false;
    let n = 0;
    setRevealedCount(0);
    const step = () => {
      if (cancelled) return;
      n += 1;
      setRevealedCount(n);
      if (n < totalTiles) setTimeout(step, 150);
    };
    setTimeout(step, 250);
    return () => { cancelled = true; };
  }, [active, totalTiles]);

  const allRevealed = revealedCount >= totalTiles;

  // Tile geometry — scales down as the trajectory gets longer so the strip
  // doesn't outgrow its container. Long trajectories (Q42 non-oracle = 24
  // tiles) need thinner tiles to fit comfortably.
  const NUM_TILES_RAW = turns.length + 1;
  let TILE_W, TILE_H, TILE_GAP;
  if (NUM_TILES_RAW <= 12)      { TILE_W = 50; TILE_H = 36; TILE_GAP = 9; }
  else if (NUM_TILES_RAW <= 16) { TILE_W = 44; TILE_H = 34; TILE_GAP = 7; }
  else if (NUM_TILES_RAW <= 20) { TILE_W = 42; TILE_H = 32; TILE_GAP = 8; }
  else                          { TILE_W = 48; TILE_H = 34; TILE_GAP = 8; }
  const TILE_STRIDE = TILE_W + TILE_GAP;
  const STRIP_PAD_LEFT = 8;
  const NUM_TILES = totalTiles;
  const tileCenterX = (turnIdx) => STRIP_PAD_LEFT + (turnIdx - 1) * TILE_STRIDE + TILE_W / 2;
  const stripWidth = STRIP_PAD_LEFT * 2 + NUM_TILES * TILE_W + (NUM_TILES - 1) * TILE_GAP;

  const toggle = (i) => {
    if (!allRevealed || noClick) return;
    setSelectedIdx(prev => prev === i ? null : i);
  };

  return (
    <div style={{
      position: 'absolute', top: 28, bottom: 32, left: 0, right: 0,
      display: 'flex', flexDirection: 'column',
      padding: '12px 14px', gap: 10,
      background: bg,
    }}>
      {/* Query header */}
      <div style={{
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: 14, lineHeight: 1.45, color: textPrimary,
        padding: '10px 14px',
        background: headerBg,
        border: '1px solid ' + headerBorder,
        borderRadius: 3,
      }}>
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          color: '#71717a', letterSpacing: '0.14em',
          textTransform: 'uppercase', marginBottom: 5,
        }}>
          {data.model} · {data.num_turns} turns
        </div>
        {data.question}
      </div>

      {/* Trajectory strip — fixed-width to fit container, no scrollbar. */}
      <div style={{
        position: 'relative',
        padding: '14px 6px 10px',
        background: stripBg,
        border: '1px solid ' + stripBorder,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        {/* Tile row — tiles fill container width via flex */}
        <div style={{
          display: 'flex', gap: TILE_GAP, alignItems: 'center',
          width: '100%',
        }}>
          {turns.map((t, i) => {
            const revealed = i < revealedCount;
            const isSelected = selectedIdx === i;
            const color = toolColor[t.tool] || '#71717a';
            return (
              <div key={t.turn}
                onClick={() => toggle(i)}
                style={{
                  flex: 1, minWidth: 0, height: TILE_H,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 5,
                  background: revealed ? color : tileBgIdle,
                  color: revealed ? tileRevealedText : tileTextIdle,
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
                  outline: isSelected ? '2px solid ' + selectedOutline : '2px solid transparent',
                  outlineOffset: isSelected ? 1 : 0,
                  cursor: (allRevealed && !noClick) ? 'pointer' : 'default',
                  transition: 'background 180ms, color 180ms, outline-color 120ms',
                  userSelect: 'none',
                }}>
                {revealed ? t.abbrev : ''}
              </div>
            );
          })}
          {/* Final ✗ */}
          <div
            onClick={() => toggle(turns.length)}
            style={{
              flex: 1, minWidth: 0, height: TILE_H,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 5, marginLeft: 4,
              background: revealedCount > turns.length ? '#C0392B' : tileBgIdle,
              color: revealedCount > turns.length ? '#fafafa' : tileTextIdle,
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 18, fontWeight: 700,
              outline: selectedIdx === turns.length
                ? '2px solid ' + selectedOutline : '2px solid transparent',
              outlineOffset: selectedIdx === turns.length ? 1 : 0,
              cursor: (allRevealed && !noClick) ? 'pointer' : 'default',
              transition: 'background 180ms, outline-color 120ms',
              userSelect: 'none',
            }}>✗</div>
        </div>

        {/* Phase annotations — a thin pillar-tinted underline bracket
            spanning each phase's tile range, with the phase label
            centered below it. (Replaces the old colored-chip strip.) */}
        <div style={{
          position: 'relative', height: 32, marginTop: 6,
          width: '100%',
        }}>
          {data.phases.map((p, pi) => {
            if (revealedCount < p.start_turn) return null;
            const isLast = pi === data.phases.length - 1;
            // Percentage-based positioning (tiles are flex:1 so uniform width).
            const startIdx = p.start_turn - 1; // 0-based
            const endIdx = Math.min(p.end_turn, NUM_TILES); // inclusive, 0-based
            const leftPct = (startIdx / NUM_TILES * 100) + '%';
            const widthPct = ((endIdx - startIdx) / NUM_TILES * 100) + '%';
            return (
              <React.Fragment key={p.label}>
                <div style={{
                  position: 'absolute', top: 0,
                  left: leftPct, width: widthPct,
                  height: 2,
                  background: c.base,
                  opacity: 0.55,
                  borderRadius: 1,
                  animation: 'overlayIn 240ms ease',
                }} />
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: leftPct, width: widthPct,
                  textAlign: 'center',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 11.5,
                  color: textSecondary,
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  animation: 'overlayIn 240ms ease',
                  ...(isLast ? { textAlign: 'right' } : {}),
                }}>
                  {p.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Click-detail bubble OR stat + legend */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {selectedIdx !== null ? (
          <T9HoverBubble turn={selectedIdx < turns.length ? turns[selectedIdx] : null}
                        isFinal={selectedIdx === turns.length}
                        data={data} pillarColor={c.base}
                        light={light}
                        onClose={() => setSelectedIdx(null)}
                        onClipClick={(clip_id, url) => setModalClip({ clip_id, url })} />
        ) : (
          <T9LegendAndStats data={data} allRevealed={allRevealed} light={light} toolColor={toolColor} />
        )}
        {modalClip && (
          <T9ClipModal clip={modalClip} onClose={() => setModalClip(null)} />
        )}
      </div>
    </div>
  );
}

function T9ClipModal({ clip, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 50, cursor: 'pointer',
      animation: 'overlayIn 200ms ease',
      padding: 14,
    }}>
      <div onClick={(e) => e.stopPropagation()}
           style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%',
                    display: 'flex', flexDirection: 'column', gap: 6,
                    cursor: 'default' }}>
        <video src={clip.url} controls autoPlay loop
               style={{ maxWidth: '100%', maxHeight: '100%',
                        objectFit: 'contain', background: '#000',
                        borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          color: '#a1a1aa', letterSpacing: '0.06em',
        }}>
          <span>clip {clip.clip_id}</span>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #3f3f46',
            color: '#e4e4e7', padding: '4px 12px', borderRadius: 3,
            fontFamily: 'inherit', fontSize: 11, cursor: 'pointer',
          }}>close ✕</button>
        </div>
      </div>
    </div>
  );
}

function T9LegendAndStats({ data, allRevealed, light, toolColor }) {
  const tc = data.tool_counts;
  const _tc = toolColor || T9_TOOL_COLOR;
  const headerCol = light ? '#52525b' : '#a1a1aa';
  const itemActive = light ? '#18181b' : '#e4e4e7';
  const itemDim = light ? '#a1a1aa' : '#52525b';
  // Plain-English description so the user knows what each abbreviation does
  // without having to infer it from the tool name.
  const items = [
    { key: 'search_documents', abbrev: 'SD',
      desc: 'searches the game reports',
      count: tc.search_documents || 0 },
    { key: 'document_qa',      abbrev: 'DQ',
      desc: 'asks a report a question',
      count: tc.document_qa || 0 },
    { key: 'search_videos',    abbrev: 'SV',
      desc: 'searches the video clips',
      count: tc.search_videos || 0 },
    { key: 'video_qa',         abbrev: 'VQ',
      desc: 'asks a clip a question',
      count: (tc.video_qa || 0) + (tc.video_qa_oracle || 0) },
  ];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      fontFamily: '"IBM Plex Mono", monospace',
    }}>
      <div style={{
        fontSize: 12, letterSpacing: '0.1em', color: headerCol,
        textTransform: 'uppercase',
      }}>
        {data.num_turns} turns · {allRevealed ? 'click any tile to inspect' : 'tracing the agent…'}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '6px 18px',
      }}>
        {items.map(it => (
          <div key={it.key} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: it.count > 0 ? itemActive : itemDim,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 24, height: 18, borderRadius: 3,
              background: _tc[it.key],
              color: '#fafafa',
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
              opacity: it.count > 0 ? 1 : 0.3,
              flex: '0 0 auto',
            }}>{it.abbrev}</span>
            <span style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
              {it.desc}
            </span>
            <span style={{ color: '#71717a', marginLeft: 'auto' }}>×{it.count}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: itemActive,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 18, borderRadius: 3,
            background: '#C0392B', color: '#fafafa',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 12, fontWeight: 700,
            flex: '0 0 auto',
          }}>✗</span>
          <span style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            agent gave up
          </span>
        </div>
      </div>
    </div>
  );
}

function T9CloseButton({ onClose, light }) {
  return (
    <button onClick={onClose} style={{
      position: 'absolute', top: 6, right: 8,
      background: 'transparent', border: 'none',
      color: light ? '#52525b' : '#71717a',
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 14, lineHeight: 1, cursor: 'pointer', padding: 4,
    }}>×</button>
  );
}

function T9HoverBubble({ turn, isFinal, data, pillarColor, onClose, onClipClick, light }) {
  // Light-mode color tokens. Only the OUTER bubble + its immediate text
  // flip; nested result cards (T9DocCards / T9VideoCards / etc.) keep their
  // dark "instrument readout" styling on top of the light bubble.
  const bubbleBg     = light ? '#ffffff' : 'rgba(20,20,26,0.85)';
  const bubbleBorder = light ? '#d4d4d8' : '#27272a';
  const finalBg      = light ? 'rgba(192,57,43,0.05)' : 'rgba(192,57,43,0.08)';
  const finalBorder  = light ? 'rgba(192,57,43,0.45)' : 'rgba(192,57,43,0.5)';
  const thoughtCol   = light ? '#52525b' : '#a1a1aa';
  const answerCol    = light ? '#18181b' : '#e4e4e7';
  if (isFinal) {
    return (
      <div style={{
        position: 'relative',
        padding: '12px 14px',
        background: finalBg,
        border: '1px solid ' + finalBorder,
        borderRadius: 3,
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: 13.5, lineHeight: 1.45,
        animation: 'overlayIn 200ms ease',
      }}>
        <T9CloseButton onClose={onClose} light={light} />
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          color: '#C0392B', letterSpacing: '0.14em',
          textTransform: 'uppercase', marginBottom: 8,
        }}>Final answer · {data.verdict}</div>
        {data.final_thought && (
          <div style={{
            color: thoughtCol, fontStyle: 'italic',
            marginBottom: 10, fontSize: 12.5, lineHeight: 1.4,
          }}>“{data.final_thought}”</div>
        )}
        <div style={{ color: answerCol, marginBottom: 8 }}>
          <span style={{ color: '#C0392B', marginRight: 8, fontWeight: 600 }}>MODEL:</span>
          {data.final_answer}
        </div>
        <div style={{ color: answerCol }}>
          <span style={{
            color: pillarColor, marginRight: 8, fontWeight: 600,
          }}>GT:</span>
          {data.gt_answer}
        </div>
      </div>
    );
  }

  const args = turn.arguments || {};
  return (
    <div style={{
      position: 'relative',
      padding: '12px 14px',
      background: bubbleBg,
      border: '1px solid ' + bubbleBorder,
      borderRadius: 3,
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: 13, lineHeight: 1.45,
      animation: 'overlayIn 200ms ease',
      maxHeight: '100%', overflowY: 'auto',
    }}>
      <T9CloseButton onClose={onClose} light={light} />
      <div style={{
        fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
        color: T9_TOOL_COLOR[turn.tool], letterSpacing: '0.14em',
        textTransform: 'uppercase', marginBottom: 6,
      }}>
        Turn {turn.turn} · {turn.tool.replace('_oracle','')}
      </div>
      {turn.thought && (
        <div style={{
          color: thoughtCol, fontStyle: 'italic',
          marginBottom: 10, fontSize: 12.5, lineHeight: 1.4,
          borderLeft: `2px solid ${T9_TOOL_COLOR[turn.tool]}66`,
          paddingLeft: 8,
        }}>“{turn.thought}”</div>
      )}

      {/* Tool call args */}
      {turn.tool === 'search_documents' && (
        <T9SearchDocsArgs args={args} light={light} />
      )}
      {turn.tool === 'document_qa' && (
        <T9DocQAArgs args={args} light={light} />
      )}
      {turn.tool === 'search_videos' && (
        <T9SearchVideosArgs args={args} light={light} />
      )}
      {(turn.tool === 'video_qa' || turn.tool === 'video_qa_oracle') && (
        <T9VideoQAArgs args={args} light={light} />
      )}

      {/* Tool results */}
      <div style={{ marginTop: 8 }}>
        {turn.results.kind === 'documents' && (
          <T9DocCards results={turn.results} light={light} />
        )}
        {turn.results.kind === 'docqa' && (
          <T9DocQAResults results={turn.results} light={light} />
        )}
        {turn.results.kind === 'videos' && (
          <T9VideoCards results={turn.results} onClipClick={onClipClick} light={light} />
        )}
        {turn.results.kind === 'videoqa' && (
          <T9VideoQAResults results={turn.results} onClipClick={onClipClick} light={light} />
        )}
      </div>
    </div>
  );
}

// ---- T9 hover sub-renderers ----

function T9KV({ k, v, mono, light }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: 12.5, lineHeight: 1.4 }}>
      <span style={{
        fontFamily: '"IBM Plex Mono", monospace',
        color: light ? '#52525b' : '#71717a', minWidth: 72,
      }}>{k}</span>
      <span style={{
        color: light ? '#18181b' : '#e4e4e7',
        fontFamily: mono ? '"IBM Plex Mono", monospace' : 'inherit',
        wordBreak: 'break-word',
      }}>{v}</span>
    </div>
  );
}

function T9SearchDocsArgs({ args, light }) {
  return (
    <>
      <T9KV k="query" v={`"${args.query || ''}"`} light={light} />
      {args.doc_type && <T9KV k="doc_type" v={args.doc_type} mono light={light} />}
      {args.teams && <T9KV k="teams" v={args.teams.join(', ')} mono light={light} />}
    </>
  );
}

function T9DocQAArgs({ args, light }) {
  const ids = args.doc_ids || [];
  return (
    <>
      <T9KV k="doc_ids" v={`[${ids.length}] ${ids.slice(0,2).join(', ')}${ids.length > 2 ? '…' : ''}`} mono light={light} />
      <T9KV k="query" v={`"${args.query || ''}"`} light={light} />
    </>
  );
}

function T9SearchVideosArgs({ args, light }) {
  return (
    <>
      <T9KV k="query" v={`"${args.query || ''}"`} light={light} />
      {args.period && <T9KV k="period" v={args.period} mono light={light} />}
      {args.players && <T9KV k="players" v={args.players.join(', ')} mono light={light} />}
    </>
  );
}

function T9VideoQAArgs({ args, light }) {
  const ids = args.video_ids || [];
  return (
    <>
      <T9KV k="video_ids" v={`[${ids.length}]`} mono light={light} />
      <T9KV k="query" v={`"${args.query || ''}"`} light={light} />
    </>
  );
}

function T9DocIcon() {
  return (
    <svg width={11} height={13} viewBox="0 0 11 13" style={{ flexShrink: 0 }}>
      <rect x={0.5} y={0.5} width={10} height={12} rx={1} fill="none" stroke="#71717a" strokeWidth={1} />
      <line x1={2.5} y1={4} x2={8.5} y2={4} stroke="#71717a" strokeWidth={0.8} />
      <line x1={2.5} y1={6.5} x2={8.5} y2={6.5} stroke="#71717a" strokeWidth={0.8} />
      <line x1={2.5} y1={9} x2={6.5} y2={9} stroke="#71717a" strokeWidth={0.8} />
    </svg>
  );
}

function T9TargetSummary({ results, displayedN, kind }) {
  // Renders the contextual line that replaces the old "no target in pool".
  // - kind = 'docs' or 'clips'
  const noun = kind === 'docs' ? 'docs retrieved' : 'clips retrieved';
  const tr = results.target_ranks || [];
  const displayedRanks = (results.top || []).map(r => r.rank);
  let suffix;
  if (tr.length === 0) {
    suffix = ` · no target in top ${results.total}`;
  } else {
    const inDisplayed = tr.filter(r => displayedRanks.includes(r));
    if (inDisplayed.length > 0) {
      suffix = ` · target at #${inDisplayed.join(', #')}`;
    } else {
      // Target exists deeper in pool than the top we're showing.
      const first = tr[0];
      suffix = ` · target at #${first} (deeper)`;
    }
  }
  return (
    <div style={{
      fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
      color: tr.length > 0 ? '#2E9E8F' : '#71717a',
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      Top {displayedN} of {results.total} {noun}{suffix}
    </div>
  );
}

function T9DocCards({ results, light }) {
  const cardBg = light ? '#f4f4f5' : 'rgba(28,28,31,0.6)';
  const cardBorder = light ? '#d4d4d8' : '#27272a';
  const idCol = light ? '#18181b' : '#e4e4e7';
  const teamsCol = light ? '#52525b' : '#a1a1aa';
  const highlightCol = light ? '#3f3f46' : '#d4d4d8';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <T9TargetSummary results={results} displayedN={results.top.length} kind="docs" />
      {results.top.map(d => (
        <div key={d.rank} style={{
          display: 'flex', gap: 8, padding: '7px 9px',
          background: cardBg,
          border: `1px solid ${d.is_target ? '#2E9E8F' : cardBorder}`,
          borderRadius: 2,
        }}>
          <T9DocIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: 8,
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5,
              color: d.is_target ? '#2E9E8F' : idCol,
            }}>
              <span>#{d.rank}{d.is_target ? ' · target ✓' : ''}  ·  {d.doc_id}</span>
            </div>
            {d.teams && d.teams.length > 0 && (
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
                color: teamsCol, marginTop: 2,
              }}>{d.teams.join(' · ')}</div>
            )}
            <div style={{
              fontSize: 12, color: highlightCol, marginTop: 4,
              lineHeight: 1.4,
              fontStyle: 'italic',
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>{d.highlight}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function T9DocQAResults({ results, light }) {
  const cardBg = light ? '#f4f4f5' : 'rgba(28,28,31,0.6)';
  const cardBorder = light ? '#d4d4d8' : '#27272a';
  const idDimCol = light ? '#52525b' : '#a1a1aa';
  const answerCol = light ? '#18181b' : '#e4e4e7';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{
        fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
        color: '#71717a', letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {results.results.length} doc{results.results.length === 1 ? '' : 's'} answered
      </div>
      {results.results.slice(0, 2).map((r, i) => (
        <div key={i} style={{
          display: 'flex', gap: 8, padding: '6px 8px',
          background: cardBg,
          border: `1px solid ${r.contains_answer ? '#2E9E8F' : cardBorder}`,
          borderRadius: 2,
        }}>
          <T9DocIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
              color: r.contains_answer ? '#2E9E8F' : idDimCol,
              marginBottom: 3,
            }}>{r.doc_id} {r.contains_answer ? '· ✓ contains answer' : '· no evidence'}</div>
            <div style={{
              fontSize: 11, color: answerCol, lineHeight: 1.35,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{r.answer}</div>
          </div>
        </div>
      ))}
      {results.results.length > 2 && (
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
          color: '#52525b', textAlign: 'right',
        }}>+{results.results.length - 2} more</div>
      )}
    </div>
  );
}

function T9VideoIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 13 13" style={{ flexShrink: 0 }}>
      <rect x={0.5} y={1.5} width={12} height={10} rx={1} fill="none" stroke="#71717a" strokeWidth={1} />
      <polygon points="5,4.5 5,8.5 8.5,6.5" fill="#71717a" />
    </svg>
  );
}

function T9VideoCards({ results, onClipClick, light }) {
  const labelDim = light ? '#52525b' : '#a1a1aa';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <T9TargetSummary results={results} displayedN={results.top.length} kind="clips" />
      <div style={{ display: 'flex', gap: 8 }}>
        {results.top.map(v => {
          const hasClip = !!v.clip;
          return (
            <div key={v.rank}
                 onClick={() => hasClip && onClipClick && onClipClick(v.clip_id, v.clip)}
                 style={{
                   flex: 1, minWidth: 0,
                   border: `1px solid ${v.is_target ? '#D4913A' : '#27272a'}`,
                   borderRadius: 3, overflow: 'hidden',
                   background: '#000',
                   cursor: hasClip ? 'pointer' : 'default',
                   transition: 'transform 150ms, border-color 150ms',
                 }}
                 onMouseEnter={(e) => hasClip && (e.currentTarget.style.transform = 'scale(1.02)')}
                 onMouseLeave={(e) => hasClip && (e.currentTarget.style.transform = 'scale(1)')}>
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '16 / 9',
                background: '#000',
              }}>
                {v.frame ? (
                  <img src={v.frame} alt={`clip ${v.clip_id}`}
                       style={{ width: '100%', height: '100%',
                                objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3f3f46',
                  }}>
                    <T9VideoIcon />
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: 4, left: 5,
                  fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
                  fontWeight: 700, letterSpacing: '0.06em',
                  color: v.is_target ? '#0a0a0c' : '#fafafa',
                  background: v.is_target ? '#D4913A' : 'rgba(10,10,12,0.85)',
                  padding: '2px 6px', borderRadius: 2, lineHeight: 1.15,
                }}>{`#${v.rank}${v.is_target ? ' ✓' : ''}`}</div>
                {hasClip && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 12 12">
                        <polygon points="3,2 3,10 10,6" fill="#fafafa" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div style={{
                padding: '5px 7px',
                fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
                color: v.is_target ? '#D4913A' : labelDim,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{v.clip_id}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function T9VideoQAResults({ results, onClipClick, light }) {
  const items = results.results;
  const targetCount = items.filter(r => r.is_target).length;
  const cardBg = light ? '#f4f4f5' : 'rgba(28,28,31,0.6)';
  const cardBorder = light ? '#d4d4d8' : '#27272a';
  const cardBorderDim = light ? '#e4e4e7' : '#1c1c1f';
  const idDimCol = light ? '#52525b' : '#a1a1aa';
  const answerCol = light ? '#18181b' : '#e4e4e7';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
        color: targetCount > 0 ? '#2E9E8F' : '#71717a',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {items.length} clip{items.length === 1 ? '' : 's'} queried
        {targetCount > 0 ? ` · ${targetCount} target` : ''}
      </div>
      {items.slice(0, 3).map((r, i) => {
        const hasClip = !!r.clip;
        return (
          <div key={i} style={{
            display: 'flex', gap: 10, padding: '8px 10px',
            background: cardBg,
            border: `1px solid ${r.is_target ? '#D4913A' : (r.has_answer ? cardBorder : cardBorderDim)}`,
            borderRadius: 3,
          }}>
            <div onClick={() => hasClip && onClipClick && onClipClick(r.clip_id, r.clip)}
                 style={{
                   position: 'relative',
                   width: 96, height: 54, flex: '0 0 auto',
                   borderRadius: 2, background: '#000', overflow: 'hidden',
                   cursor: hasClip ? 'pointer' : 'default',
                   opacity: r.has_answer ? 1 : 0.55,
                 }}>
              {r.frame ? (
                <img src={r.frame} alt={r.clip_id}
                     style={{ width: '100%', height: '100%',
                              objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3f3f46',
                }}><T9VideoIcon /></div>
              )}
              {hasClip && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 12 12">
                      <polygon points="3,2 3,10 10,6" fill="#fafafa" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
                color: r.is_target ? '#D4913A' : idDimCol,
                marginBottom: 3,
              }}>
                {r.clip_id}{r.is_target ? ' · target ✓' : ''}{r.has_answer ? '' : ' · no evidence'}
              </div>
              <div style={{
                fontSize: 12, color: answerCol, lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{r.answer}</div>
            </div>
          </div>
        );
      })}
      {items.length > 3 && (
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          color: '#52525b', textAlign: 'right',
        }}>+{items.length - 3} more</div>
      )}
    </div>
  );
}
