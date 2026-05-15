# SVI-Bench Project Page — Engineering Handoff

**Date:** May 13, 2026
**Status:** All seven sections present as working prototypes, integrated into one unified page. Video and footer sections are placeholders within the integrated page. Ready for real eval data integration and final clip footage.
**Owner:** Gedas Bertasius (MVPG, UNC Chapel Hill)

---

## TL;DR

This is the handoff for the SVI-Bench public project page. One unified single-page prototype plus four standalone section prototypes, built around the central scientific claim of the paper — the **Performance Cliff**: models do well on Perception (~74% on T2) and collapse on Reasoning, Simulation, and Agency (down to 6% on T9).

The unified page renders all seven sections in one continuous scroll and runs in any browser by double-clicking the HTML file. All section content is live; only the promotional video and the authors footer are placeholders that need final content swapped in. Eval data throughout the page is sketched from the paper's framing — it needs replacement with real model traces, judge verdicts, and failure logs before public release.

The framing principle to preserve at every level: this is **a general AI benchmark instantiated in sports**, not a sports benchmark. Every label, blurb, and visual decision was made with that distinction in mind. Maintain it.

---

## File inventory

Eight files are included in this handoff. One is the unified production candidate; six are standalone section prototypes for focused iteration; one is this doc.

| File | Role | Description |
|------|------|-------------|
| `svi_bench_project_page.html` | **Primary deliverable** | Unified single-page integration of all seven sections. Pre-compiled JavaScript embedded directly in the file — no in-browser Babel step. Open in a browser and the whole page renders. |
| `svi_bench_cliff.html` | Section prototype | Hero + The performance cliff + What this means (outro). Source-readable JSX via in-browser Babel. Use this when iterating on the cliff specifically. |
| `svi_bench_ask_the_play.html` | Section prototype | Ask the play interactive clip explorer. Source-readable JSX. |
| `svi_bench_tape_archive.html` | Section prototype | Tape archive failure gallery. Source-readable JSX. |
| `svi_bench_cliff.jsx`<br>`svi_bench_ask_the_play.jsx`<br>`svi_bench_tape_archive.jsx` | React components | Default-export React components corresponding to each prototype. Use these if/when migrating to a Vite/Next.js production project. |
| `svi_bench_project_page_handoff.md` | This document | Engineering handoff and design notes. |

**To view the unified page:** download `svi_bench_project_page.html` and double-click it. Renders in any modern browser with no install.

**To iterate on a single section:** open the corresponding standalone prototype. These keep the JSX source human-readable via in-browser Babel compilation, so you can edit and refresh to see changes.

---

## If you're new to this project, start here

1. Open `svi_bench_project_page.html`. Scroll from top to bottom. Read the seven section headers and pay attention to how each section's layout differs but the dark surface, typography, and pillar colors carry through.
2. Open `svi_bench_cliff.html` separately. Scroll through the cliff section slowly. Pay attention to how the cliff bars build one at a time and how the right-panel broadcast viewport changes its overlay per task.
3. Open `svi_bench_ask_the_play.html` separately. Wait for the auto-play reveal (about 10 seconds total). Click a different clip in the picker. Try the "Reveal all" and "Replay" buttons.
4. Open `svi_bench_tape_archive.html` separately. Click each pillar chip to filter. Click "Surprise me" a few times. Hover over tiles.
5. Read the **Page structure** and **Design system** sections of this doc.
6. Pick a section in the **Section guides** below and go deeper.

---

## Page structure

The unified page renders seven sections in narrative order, each with an anchor ID for header navigation:

1. **Hero** (`#hero`) — claim setup
2. **Promotional video** (`#video`) — 2:30 explainer film placeholder
3. **The performance cliff** (`#cliff`) — quantitative evidence (scrollytelling)
4. **Ask the play** (`#ask`) — felt experience on one clip
5. **Tape archive** (`#archive`) — aggregate scale of failures
6. **What this means** (`#meaning`) — interpretation, the oracle gap
7. **Authors / paper / code / data** (`#about`) — resources, citation, contact

The arc:

> **Claim → story → evidence → felt experience → scale → meaning → access.**

Each section earns its place because the section before couldn't carry the next beat. Cliff is quantitative; Ask the play makes it visceral; archive shows it's everywhere. Together they argue something text alone wouldn't.

The fixed header at the top of the page contains a logo (returns to hero) and five anchor links: `Video · Cliff · Ask · Archive · About`. Smooth scrolling is enabled globally; each section has `scroll-margin-top: 72px` so anchor targets land below the fixed header rather than behind it.

---

## Design system

### Color palette

Base surface:
- `#0a0a0c` — page background (near-black)
- `#0c0d10` — slightly elevated surface (viewport interior)
- `#14141a` — active card backgrounds
- `#1c1c1f` — subtle dividers
- `#27272a` — standard borders
- `#3f3f46` — secondary borders / hover

Text hierarchy:
- `#fafafa` — primary
- `#e4e4e7` — slightly muted primary
- `#a1a1aa` — secondary
- `#71717a` — tertiary (labels, UI chrome)
- `#52525b` — quaternary (very subtle)

Four pillar colors (defined as `PILLARS` constant in every file):
- **Perception**: `#4A7FB5` (steel blue)
- **Reasoning**: `#2E9E8F` (teal)
- **Simulation**: `#D4913A` (amber)
- **Agency**: `#C0392B` (crimson)

Each pillar also has a `glow` variant (55% alpha — for box-shadows around active elements) and a `soft` variant (12% alpha — for tinted backgrounds).

### Typography

IBM Plex font family, loaded from Google Fonts:
- **IBM Plex Sans** (300–700) — body, paragraphs, blurbs
- **IBM Plex Serif** (400–700) — display headlines for editorial moments
- **IBM Plex Mono** (400–600) — labels, UI chrome, task IDs (T1–T9), scores, timecodes, kicker text

Type scale uses `clamp()` for responsive display sizes:
- Hero: `clamp(56px, 9vw, 132px)`
- Section titles: `clamp(40px, 6vw, 76px)`
- Outro headings: `clamp(36px, 5vw, 64px)`

### Shared components

The **broadcast monitor chrome** appears at three scales across all sections:

- **Cliff viewport** — medium chrome, right panel of cliff scrollytelling
- **Ask the play viewport** — large chrome, focal element of the section
- **Tape archive thumbnail** — small chrome, tile preview

This visual rhyme ties the three video surfaces together. Same REC dot indicator, same task badge + name in lower-third, same pillar-tinted progress bar. When real clips arrive, the chrome stays — only the inner content swaps from schematic SVG to a `<video>` element.

The **animated basketball pick-and-roll schematic** (defined in the `PLAY` constant and `PlayLoop` component) loops every 10 seconds. Player positions are piecewise-keyframed; ball follows P1 then transfers to P2 during the pass window. Used as a placeholder for real broadcast clips.

---

## Section guides

### 1. Hero (done)

**Location:** Top of `svi_bench_project_page.html` and `svi_bench_cliff.html`.

**Headline:** "Models can see the play. They can't read it." — second sentence italic in `#71717a` gray, on its own line.

**Subtitle paragraph:** Three sentences setting up the four-pillar framework and the cliff finding.

**Chips below subtitle:** ECCV 2026, Paper #2744, UNC Chapel Hill, 9 tasks · 4 pillars · 3 sports.

**Visual decoration:** Four small pillar-color dots top-right; "scroll to see the cliff" affordance at the bottom with a subtle 2.5-second opacity pulse.

**TODOs:**
- Update the "ECCV 2026" chip based on the final acceptance decision (poster vs. NeurIPS D&B resubmit)
- Paper number may change depending on final venue

---

### 2. Promotional video (placeholder built — needs final video)

**Location:** `#video` section of `svi_bench_project_page.html`.

**Current state:** The section is fully built with the same dark aesthetic as the rest of the page. A 16:9 frame at ~960px wide sits centered with broadcast monitor chrome (REC indicator, "SVI-BENCH · Explainer" label, "00:00 / 02:30" timecode placeholder, bottom progress bar). The center of the frame shows a large circular play button with hover feedback. A caption beneath the frame reads "placeholder · final cut from rewatchable goes here". Below the player are three chapter labels: "01 the cliff · 02 why sports · 03 what's next" matching the script structure.

**Position rationale:** Right after the hero, before the depth dive. The video is the 2:30 TL;DR of the entire claim. A visitor who lands, watches, and bounces still walks away with the full story. Anyone deeper in the funnel scrolls past into the cliff and demos.

**Open decisions:**
- Hosting format: YouTube iframe embed, Vimeo iframe embed, or self-hosted `<video src="...">`
- Autoplay (muted) on scroll-into-view, or require user click
- Whether the chapter labels under the player become actual scrubber markers or stay as static text

**To swap in the real video:** find the `VideoSection` component in the source. The inner `<div>` containing the play button and "placeholder" message is the swap target. Replace with a `<video>` element, YouTube iframe, or Vimeo iframe of the same aspect ratio. The chrome (REC dot, timecode, progress bar, chapter labels) stays.

**TODOs:**
- Receive final cut from Rewatchable (Ryan Reed, `rreed@rewatchable.com`)
- Decide hosting platform
- Swap placeholder for real video

---

### 3. The performance cliff (done)

**Location:** `#cliff` section.

**Mechanism:** Scrollytelling. The section is `position: sticky` while the user scrolls through approximately 7 viewport-heights of content. As they scroll, two things happen in sync:

1. **Cliff bars on the left** build one task at a time, T1 through T9, with each bar's height filling in via a smoothed scroll-progress mapping. The cliff shape becomes visible: bars peak at T2 (74), then collapse to T9 (6).
2. **Broadcast viewport on the right** cycles through per-task content. Each task's overlay highlights a different failure mode:
   - **T1** — GT vs MODEL caption boxes; model has struck-through wrong jersey numbers
   - **T2** — 4-option MCQ; model's wrong pick in red, correct answer in pillar color
   - **T3** — Query bar + 4 retrieval thumbnails; model's wrong top-1 marked
   - **T4** — Strategic question with side-by-side GT/MODEL reasoning
   - **T5** — Probability bars for predicted outcomes
   - **T6** — Game timeline with sparse "covered" events
   - **T7** — Prescribed (dashed white) vs predicted (pillar color, drifting) trajectories
   - **T8** — Multiple shot attempts radiating from a start point, most miss
   - **T9** — Replaces basketball schematic with agentic tool-call tree

After T9, the cliff drop is annotated with "−68 pts · same data · same models" — the central scientific finding made literal.

**Per-task scores:** Each bar uses the best-model normalized score (0–100) for that task. Stored in the `TASKS` array.

**Best-model attribution:** Each task is labeled with the model that achieved the best score (e.g., `LLaVA-Video-7B (ft)` for T1/T2, `GPT-5.2` for T4/T9, `Qwen3-VL-8B (ft)` for T5). Some are labeled `best baseline` — these need specific model attribution once final results are in.

**TODOs:**
- Verify final per-task scores against latest eval runs
- Replace `best baseline` placeholders with specific model names where appropriate
- Per-task blurbs are currently sketched from the paper's framing — check against final paper text for precise wording

---

### 4. Ask the play (built — needs real eval data)

**Location:** `#ask` section.

**Layout:** Two-column grid (~1.35fr left : 1fr right) with picker strip below.
- **Left:** Broadcast viewport with looping basketball schematic, top chrome (REC dot, "CAM 1 · NBA · Q3 04:13", timecode counting `00:00 / 00:10`), bottom chrome with task badge + name + progress bar + pillar chip
- **Right:** Analysis panel — question card (visible immediately), 3 model answer cards (stream in sequentially with blinking cursor), GT card (fades in after last model finishes), judge verdict line (reveals 2.4 seconds after GT)
- **Bottom:** 7-clip picker strip with static schematic thumbnails

**Streaming engine:** `useRevealEngine` hook. Stages progress: `question → m1 → m2 → m3 → gt → verdict → done`. Speed is 22ms per character with a 500ms pause between model answers and a 2.4-second beat before the verdict. Two control buttons appear contextually:
- **"↪ Reveal all"** — visible during streaming, skips animation
- **"↻ Replay"** — visible after verdict, reruns the sequence

Clicking a different clip while one is mid-reveal cancels the current animation cleanly and restarts with the new clip.

**Data structure (`CLIPS` constant):** Each clip has `id`, `taskId`, `pillar`, `teaser` (one-word picker label), `title`, `context` (game/period/time), `question`, `models` (array of 3 with `name`/`score`/`wrong`/`text`), `gt`, `verdictHeadline`.

**Current 7 clips and pillar coverage:**
1. T1 — Structured Play Description ("jersey mix") — Perception
2. T2 — Fine-Grained Action QA ("wrong action") — Perception
3. **T4** — Strategic Reasoning QA ("defense fail") — Reasoning ← **default starting clip**
4. T5 — Outcome Forecasting ("wrong outcome") — Reasoning
5. T6 — Long-Form Narrative ("missed events") — Reasoning
6. T8 — Goal-Conditioned Action Gen ("missed shot") — Simulation
7. T9 — Cross-Corpus Agentic Reasoning ("tool errors") — Agency

**Critical TODOs:**
- **All model answer texts are plausible failures sketched from the paper's framing — NOT pulled from real eval logs.** Each clip needs real model traces from the actual eval runs. The structure stays the same; only the strings change.
- Verdict headlines need to match actual eval results
- The schematic viewport will eventually swap for a real broadcast clip. The chrome stays; only the inner content changes from `<HalfCourt>` + `<PlayLoop>` to a `<video>` element
- Consider whether T6 should be replaced or supplemented with T7 to balance pillar coverage
- Default starting clip is T4 (most dramatic). Could alternatively default to T9 (the floor) for shock value — open question

---

### 5. Tape archive (built — needs real failure logs)

**Location:** `#archive` section.

**Layout:** Section header at top, filter row below, responsive grid in the middle, footer line at the bottom.
- **Filter row:** Pillar chips (All, Perception, Reasoning, Simulation, Agency) on the left, "Surprise me" dashed-border button on the right
- **Grid:** `grid-template-columns: repeat(auto-fit, minmax(230px, 1fr))` — auto-collapses from 4 columns on wide screens to 2 on narrower ones
- **Footer:** "Showing N of 287 · [filter state] · Explore all 287 failures →" link

**Each tile shows:**
- 4:3 aspect schematic thumbnail (court for basketball, pitch for soccer, rink for hockey, agent tree for T9) tinted by pillar color
- Task ID (top-left, pillar color)
- Sport label (top-right, mono caps)
- "Model name · failure" kicker
- One-line failure mode (`font-weight: 500`, white)
- Excerpt (gray, 1–2 lines)

**Hover behavior:** Tile lifts 2px, border switches from `#27272a` to pillar color, slight pillar-tinted shadow appears.

**Data structure (`FAILURES` constant):** Each failure has `id`, `taskId`, `pillar`, `model`, `sport` ('NBA' / 'EPL' / 'NHL'), `mode` (one-line failure mode), `excerpt` (brief evidence). Current count: 19 tiles.

**Critical TODOs:**
- **All 19 failure entries are sketches.** Replace each with a real failure pulled from eval logs.
- **`TOTAL_FAILURES` is set to 287 as a placeholder.** Replace with real count.
- The "Explore all 287 failures →" link is dead. Wire to a `/failures` sub-page once that exists. The on-page grid is the **preview wall**; the sub-page is the **full searchable archive** with pagination/virtualization, deeper filters (task ID, model, sport, free text search), and deep links per failure.
- Tile click currently does nothing. Future: modal expansion showing full Q / GT / model output. For tiles that overlap with Ask the play's 7 featured clips, add an "Open in Ask the play →" jump-up link.

---

### 6. What this means (done)

**Location:** `#meaning` section.

**Headline:** "The next bottleneck isn't seeing. It's understanding what's been seen." — second sentence italic gray, same pattern as the hero.

**Body:** One paragraph on the **oracle gap** — when the strongest model is given perfect textual descriptions of every frame, T9 accuracy jumps from 6% to 51%. Visual perception is a real limitation, but the 51% ceiling tells us multi-step planning, cross-modal reasoning, and strategic synthesis are equally unsolved.

**Stats row:** 35,000 hours · 15M annotations · 9 tasks · 4 pillars · 3 sports.

**TODOs:**
- Verify the 6% → 51% oracle gap matches the final paper number
- Verify "35,000 hours" and "15M annotations" match final dataset statistics
- The closing line "Sports gives us the structured, verifiable testbed for that work — the way math gives one to formal reasoning" is the framing assertion. Keep this language intact

---

### 7. Authors / paper / code / data (placeholder built)

**Location:** `#about` section of `svi_bench_project_page.html`.

**Current state:** Three-column footer with author list (current names: Gedas, Mohaiminul Islam, Yulu Pan, Seongsu Ha, Benjamin Zhang, Han Yi, Lorenzo Torresani), resources column with four entries (Paper, Code, Dataset, Contact — all tagged `to add`), and a citation block containing a BibTeX template with placeholder fields. A bottom row shows the affiliation and copyright.

**TODOs:**
- Verify author list and order with co-authors. Add affiliations where they differ from UNC.
- Fill the BibTeX with the real citation once venue is settled (currently shows `@inproceedings{svibench2026, title={SVI-Bench: ...}, ...}` as a template)
- Wire each "to add →" link to its real URL: arXiv, GitHub repo, HuggingFace dataset, contact email
- Optional: add a copy-to-clipboard button on the BibTeX block
- Optional: acknowledgments subsection (funding, compute, helpful discussions)

---

## How the integration was built

The unified page is **not** assembled by including the standalone HTML files. It is one self-contained HTML file with all section components defined once at the top of a single script block, then composed by a single `<App>` component that renders them in order. Specifically:

1. **One shared header** with anchor nav (`Video · Cliff · Ask · Archive · About`). Smooth scroll via `html { scroll-behavior: smooth; }`.
2. **Each section is its own `<section id="...">`** so anchor links work.
3. **Section dividers** — every section starts with `border-top: 1px solid #1c1c1f` to mark transitions without breaking flow.
4. **Consolidated shared definitions** — `PILLARS`, `PLAY` keyframe data, helper functions (`smooth`, `lerp`, `piecewise`, `useScrollProgress`, `usePlayClock`), and the `HalfCourt` / `PlayLoop` / `StaticCourtThumb` etc. components appear exactly once and are reused by every section.
5. **Two distinct broadcast viewport components** — the cliff version (`CliffBroadcastViewport`) composites per-task overlays on top of the schematic; the Ask the play version (`AskBroadcastViewport`) just renders chrome + schematic. Same chrome design, different responsibilities.

### Pre-compilation step

The standalone prototypes (`svi_bench_cliff.html`, `svi_bench_ask_the_play.html`, `svi_bench_tape_archive.html`) compile JSX in-browser using Babel-standalone. This works for files up to roughly 50 KB.

The merged page is ~91 KB of JavaScript before compilation. Babel-standalone choked on the combined file (rendered as a black page with no error) and the React CDN's `crossorigin` attribute introduced a second failure mode. The fix was to:

- **Run Babel locally** to pre-compile all JSX to `React.createElement(...)` calls
- **Embed the compiled output** directly in the merged file (no in-browser Babel step)
- **Remove the `crossorigin` attribute** from the React CDN tags
- **Wrap the init in a `DOMContentLoaded` + React-availability check** so the script doesn't run before React loads

The merged file's inline script is therefore plain JavaScript, not JSX. To make changes, edit the standalone section prototypes (where the JSX is still human-readable), then re-merge with a local Babel run.

If you ever need to re-merge after editing, the build is mechanical — let me know and I can produce a one-shot build script that takes the three section prototypes and outputs a fresh `svi_bench_project_page.html`. For ongoing work, see the production migration notes below.

---

## Editing workflow

For small text changes (copy edits, fixing a typo, updating a number):
- Edit directly in `svi_bench_project_page.html` if the change is purely string content. Search-and-replace works. The compiled JavaScript is ugly but the string literals are still findable.

For structural or design changes to a single section:
- Edit the corresponding standalone prototype (`svi_bench_cliff.html`, `svi_bench_ask_the_play.html`, or `svi_bench_tape_archive.html`) where the JSX source is readable
- Verify the change works in the standalone prototype
- Re-merge into `svi_bench_project_page.html` via the pre-compile step

For adding a new section or significant restructuring:
- Don't do this in the prototypes. Migrate to a real React project (see below) and do the work there.

---

## Critical TODOs before public launch

In rough priority order:

1. **Real eval data everywhere.** All Ask the play model traces and judge verdicts. All Tape archive failure modes and excerpts. Cliff per-task scores. The structure is right; the content is sketched.
2. **Replace basketball schematics with real clips** in Ask the play and Tape archive thumbnails. The broadcast chrome stays — only the inner content swaps from schematic SVG to `<video>` or `<img>` with poster frame. The chrome dimensions (4:3 aspect ratio for the viewport) are designed to accommodate broadcast aspect ratios; verify the real clips fit cleanly.
3. **Swap the promotional video placeholder.** Need format decision (YouTube iframe vs local mp4 vs Vimeo) and final cut from Rewatchable. The section's chrome and surrounding layout are ready; only the inner play button + placeholder caption need replacing.
4. **Fill the authors/footer section.** Verify author list, add affiliations, wire resource links to real URLs, fill BibTeX.
5. **Build the `/failures` sub-page** for Tape archive's "Explore all 287 →" link. Full searchable archive with pagination, deeper filters, deep links.
6. **Cross-link Ask the play ↔ Tape archive.** Tape archive tiles for the 7 featured clips should have "Open in Ask the play →" jump-up. Ask the play could end with "See 39 more T4 failures →" linking into the archive filtered to that task.
7. **Mobile responsive review.** Current prototypes are desktop-first. The cliff scrollytelling specifically needs careful mobile design (probably collapse the two-column sticky layout into stacked); Ask the play stacks vertically on narrow widths naturally; Tape archive grid `auto-fit`s already.
8. **Production deploy.** Migrate from CDN-based prototype to a built React app. Host at a stable URL.

---

## Open design questions

- **Default starting clip in Ask the play:** T4 (dramatic — Strategic Reasoning failure) or T9 (the floor — 5.6% on Agentic)? Currently T4.
- **Tile click behavior in Tape archive:** Inline expansion, modal, or no-op until sub-page exists? Currently no-op.
- **Task-level filter chips in Tape archive:** Currently only pillar-level. Adding task chips (T1–T9) gives more power but more UI complexity.
- **Number of model answers per Ask the play clip:** Three (current) keeps the "every frontier model trips on the same play" effect. Two reads tighter but loses the visual chorus.
- **Video section chapter markers:** Three small chips currently sit below the scrubber. Useful navigation or visual clutter?
- **Hero CTA:** Currently has chips (ECCV / Paper / UNC / task count) but no "primary action" button (e.g., "Read the paper →"). Worth considering — most academic project pages have something explicit.

---

## Technical stack

### Prototype stack (standalone files)

- React 18, loaded from `unpkg.com/react@18/umd/react.production.min.js`
- Babel Standalone for in-browser JSX compilation
- IBM Plex fonts from Google Fonts
- No build step, no install, no package.json
- Single `.html` file per section

Fine for design iteration at section scale. Drawbacks: in-browser Babel adds ~1 second of compile on first load, and there's an effective size ceiling around 50–60 KB of JSX before Babel-standalone fails silently (this is what broke the first merged file).

### Unified page stack

- React 18, loaded from `unpkg.com/react@18/umd/react.production.min.js`
- **No Babel-standalone** — JSX is pre-compiled to `React.createElement(...)` before deployment
- Inline `<script>` containing the compiled bundle
- `DOMContentLoaded` + React-availability gate so the script doesn't race the CDN

Faster first paint (no compile step), no size ceiling, but the inline script is no longer human-readable.

### Migration path for production

- **Vite + React + TypeScript** (recommended)
- Components migrate as-is — the existing JSX in the `.jsx` files is valid React, paste into a Vite project structure
- Fonts via `@fontsource/ibm-plex-sans` / `@fontsource/ibm-plex-mono` / `@fontsource/ibm-plex-serif` packages
- Styling: current code uses inline `style={}` objects. Easy to migrate to CSS modules, Tailwind, or vanilla CSS as preferred.
- Deploy via Vercel / Netlify / UNC CS hosting

### Performance notes

- The cliff section's per-task overlays are SVG with React state. Smooth on modern hardware; may stutter on low-end laptops. If needed, throttle the scroll handler or memoize per-task overlay components.
- Ask the play streaming uses async `setTimeout` loops with clean cancellation via a `cancelled` ref. Watch for memory leaks if/when the page is ever embedded in a parent context.
- Tape archive grid is 19 static tiles currently — no performance concern. The future `/failures` sub-page with 200+ tiles should use virtualization (`react-window`, `@tanstack/react-virtual`, or similar) and/or pagination.

---

## What to preserve

A few things worth maintaining as the page evolves:

- **Framing as "general AI benchmark in sports," not "sports benchmark"** — every label, blurb, headline, and chip was written with this distinction in mind. Don't drift back to "the basketball benchmark" or "AI for sports."
- **The Performance Cliff as the central organizing claim** — every section either establishes, demonstrates, or interprets the cliff. Resist adding sections that don't serve this arc.
- **Failure framing as general capability gaps**, not sports-specific shortcomings — when describing what models get wrong, the language should generalize. "The model can't track entity identity across time" not "the model is bad at basketball jersey numbers."
- **Honest language over marketing** — precise statements that preempt criticism beat confident overclaims. The cliff is real and dramatic enough; let it speak.
- **Visual rhyme across the three video surfaces** — the broadcast monitor chrome at three scales (cliff viewport, Ask the play viewport, Tape archive thumbnail) ties the page together. New video surfaces should reuse this chrome.

---

## Contact

For design intent, layout decisions, or component patterns: Gedas knows the framing principles and visual hierarchy. Reach out before making structural changes — small tweaks are fine, larger restructures should align with the "claim → story → evidence → felt → scale → meaning" narrative arc.
