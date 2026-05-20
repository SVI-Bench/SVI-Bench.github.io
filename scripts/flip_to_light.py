#!/usr/bin/env python3
"""
One-shot dark → light theme flip. Run after all per-section work is done
to invert the color palette across every file at once.

Uses placeholders so substitutions don't cascade (e.g. so '#fafafa' →
'#18181b' doesn't then become '#e4e4e7' on a later '#18181b' → … pass).

Pillar colors (blue/teal/amber/crimson), green/red GT-marker colors, and
tool-tile colors are intentionally NOT remapped — they remain brand
accents and need to stand against either background.
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# Targeted file list — JSX + HTML files we actually own.
FILES = [
    REPO / "index.html",
    REPO / "svi_bench_cliff.html",
    REPO / "scripts" / "panels.jsx",
    REPO / "scripts" / "panels_block.js",
]
EXTRA = [
    Path("/tmp/archive_section.jsx"),
    Path("/tmp/ask_section_v2.jsx"),
]
for p in EXTRA:
    if p.exists():
        FILES.append(p)

# Two-step replacement: each dark hex first becomes a placeholder; then
# placeholders become their light-theme target. Order in stage 1 doesn't
# matter (no overlap); stage 2 likewise.

STAGE1 = [
    # Page background, near-black
    ("#0a0a0c", "__C_BG__"),
    # Slightly elevated dark surface (viewport interior, panel bg)
    ("#0c0d10", "__C_CARD__"),
    # Active card / slightly more elevated
    ("#14141a", "__C_ACTIVE__"),
    # Subtle divider line
    ("#1c1c1f", "__C_DIV__"),
    # Standard border
    ("#27272a", "__C_BORDER__"),
    # Hover / secondary border
    ("#3f3f46", "__C_BORDER2__"),
    # Quaternary text (was very-dim on dark; should become a light gray
    # on light bg so it stays "background-y")
    ("#52525b", "__C_QUAT__"),
    # Secondary text (was light gray on dark; should become a medium-dark
    # text on light bg)
    ("#a1a1aa", "__C_SECTEXT__"),
    # Slightly muted primary text
    ("#d4d4d8", "__C_PRIM2__"),
    ("#e4e4e7", "__C_PRIM3__"),
    # Primary text — near-white on dark; flips to near-black on light
    ("#fafafa", "__C_PRIM__"),
    # 0a0a0c also appears uppercase in some places
    ("#0A0A0C", "__C_BG__"),
    ("#FAFAFA", "__C_PRIM__"),
]

STAGE2 = [
    ("__C_BG__",       "#ffffff"),   # white page bg
    ("__C_CARD__",     "#f4f4f5"),   # light grey card — clearly distinct from white bg
    ("__C_ACTIVE__",   "#e4e4e7"),   # more elevated active card
    ("__C_DIV__",      "#d4d4d8"),   # visible divider
    ("__C_BORDER__",   "#d4d4d8"),   # visible border
    ("__C_BORDER2__",  "#a1a1aa"),   # hover border — pronounced
    ("__C_QUAT__",     "#a1a1aa"),   # quat-text — light gray
    ("__C_SECTEXT__",  "#52525b"),   # secondary text — medium-dark
    ("__C_PRIM2__",    "#3f3f46"),
    ("__C_PRIM3__",    "#27272a"),
    ("__C_PRIM__",     "#18181b"),   # primary text — near black
]

# rgba(0,0,0, X) → rgba(255,255,255, X) for vignette overlays, etc.,
# is intentionally NOT done globally. Vignettes that exist over images/
# videos should still darken (they're meant to define edges against
# bright media). Manual cleanup may be needed for a few specific gradients.


def flip(text):
    for src, ph in STAGE1:
        text = text.replace(src, ph)
    for ph, dst in STAGE2:
        text = text.replace(ph, dst)
    return text


def main():
    for p in FILES:
        if not p.exists():
            print(f"  skip (missing): {p}")
            continue
        orig = p.read_text()
        new = flip(orig)
        if new == orig:
            print(f"  no changes:   {p}")
            continue
        # Backup once
        bak = p.with_suffix(p.suffix + ".darkbak")
        if not bak.exists():
            bak.write_text(orig)
        p.write_text(new)
        # Count substitutions for reporting
        diffs = sum(1 for a, b in zip(orig, new) if a != b)
        print(f"  flipped: {p}  ({diffs} char diffs)")


if __name__ == "__main__":
    main()
