#!/usr/bin/env python3
"""
Reverse of flip_to_light.py: light → dark theme flip.
Two-stage placeholder approach to avoid cascading substitutions.

Only touches the GLOBAL hex palette (page bg, text, borders, cards).
Component-level manual changes (QuestionCard white bg, ClipPicker white,
header nav white, etc.) need separate manual fixup after this runs.
"""
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

FILES = [
    REPO / "index.html",
    REPO / "scripts" / "panels_block.js",
]

# Stage 1: current light hex → placeholder
STAGE1 = [
    # Page / app background
    ("#ffffff", "__C_BG__"),
    # Card surface (was #f4f4f5 in light)
    ("#f4f4f5", "__C_CARD__"),
    # Active card (was #e4e4e7 in light — but this collides with PRIM3
    # target below; handle via ordering)
    ("#e4e4e7", "__C_ACTIVE__"),
    # Divider
    ("#d4d4d8", "__C_DIV__"),
    # Border (same as divider in light; they'll merge to same dark value)
    # — already captured above
    # Hover border
    ("#a1a1aa", "__C_BORDER2__"),
    # Quat text (same hex as hover border in light)
    # — already captured above
    # Secondary text
    ("#52525b", "__C_SECTEXT__"),
    # Prim2
    ("#3f3f46", "__C_PRIM2__"),
    # Prim3
    ("#27272a", "__C_PRIM3__"),
    # Primary text
    ("#18181b", "__C_PRIM__"),
]

# Stage 2: placeholder → dark target hex
STAGE2 = [
    ("__C_BG__",       "#0a0a0c"),
    ("__C_CARD__",     "#0c0d10"),
    ("__C_ACTIVE__",   "#14141a"),
    ("__C_DIV__",      "#1c1c1f"),
    ("__C_BORDER2__",  "#3f3f46"),
    ("__C_SECTEXT__",  "#a1a1aa"),
    ("__C_PRIM2__",    "#d4d4d8"),
    ("__C_PRIM3__",    "#e4e4e7"),
    ("__C_PRIM__",     "#fafafa"),
]


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
        p.write_text(new)
        diffs = sum(1 for a, b in zip(orig, new) if a != b)
        print(f"  flipped: {p}  ({diffs} char diffs)")


if __name__ == "__main__":
    main()
