#!/usr/bin/env python3
"""
Build the T3 + T9 cliff-panel asset JSONs and copy the T3 video files into
the project page's assets/ tree.

Outputs (relative to project page repo root):
  assets/t3_panel.json
  assets/t9_panel.json
  assets/t3_videos/{soccer_success,hockey_failure}/rank{N}.mp4

Sources:
  T3:  /mnt/arc/sha17/video_deep_research/data/comp_1113/scripts/
       qualitative_examples/appendix_0311_5/{metadata.json,videos/...}
  T9:  /mnt/arc/sha17/video_deep_research/data/vdr_0208/scripts/
       QA_visualization/gpt5_oracle_new/Q34/
"""

import json
import os
import shutil
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────
REPO_ROOT = Path("/mnt/arc/sha17/video_deep_research/data/project_page/SVI-Bench.github.io")
ASSETS = REPO_ROOT / "assets"
T3_VIDEO_OUT = ASSETS / "t3_videos"

T3_QUALITATIVE_ROOT = Path(
    "/mnt/arc/sha17/video_deep_research/data/comp_1113/scripts/"
    "qualitative_examples"
)

T9_VIZ_ROOT = Path(
    "/mnt/arc/sha17/video_deep_research/data/vdr_0208/scripts/"
    "QA_visualization/gpt5_oracle_new"
)
# Cliff panel uses Q45 (Westbrook/Batum), Ask-the-play uses Q42 (Booker
# six-threes / jersey number).
T9_VIZ_CLIFF = T9_VIZ_ROOT / "Q45"
T9_VIZ_ASK   = T9_VIZ_ROOT / "Q42"

ASSETS_ROOT = Path(
    "/mnt/arc/sha17/video_deep_research/data/project_page/"
    "SVI-Bench.github.io/assets"
)
T9_FRAME_OUT = ASSETS_ROOT / "t9_frames"

# ── T3 ─────────────────────────────────────────────────────────────────────

# Three T3 panels — failure cases only, one per sport. Each panel shows 1 GT
# + 3 hard negatives differing on *different* attribute axes (action,
# playtype, possession, shot type, …), not just jersey numbers. Source is
# `output_final_final/{sport}/example_NNN` which has rich composition data.
#
# Sim scores are illustrative (decreasing) — the dataset itself doesn't
# carry per-clip similarity numbers, so we synthesize plausible numbers
# with the GT at the bottom (model failed to rank it on top).
T3_PANEL_SPECS = [
    # Each panel: 1 positive (GT) + 3 hard negatives, each differing on a
    # different attribute axis. Captions written in the paper-figure style:
    # one natural sentence per clip, with the *differing* word highlighted
    # in red. Each HN caption preserves the GT sentence structure so the
    # diff jumps out. Sim scores are illustrative.
    {
        "id": "basketball",
        "sport": "basketball",
        "source": "output_final_final/basketball/example_003",
        "query_simple": (
            "Find the clip of a guard taking a contested low-post jumper "
            "after a catch-and-drive."
        ),
        "gt": {
            "sim": 0.62,
            "caption": "A guard catches the ball at the low post, drives, and puts up a contested two-point jumper.",
        },
        "negatives": [
            {"pick_diff": "playtype",  "sim": 0.84,
             "caption": "A guard catches the ball at the low post, posts up, and puts up a contested two-point jumper.",
             "diff_substring": "posts up"},
            {"pick_diff": "contesting", "sim": 0.79,
             "caption": "A guard catches the ball at the low post, drives, and puts up an uncontested two-point jumper.",
             "diff_substring": "uncontested"},
            {"pick_diff": "action_name", "sim": 0.74,
             "caption": "A guard catches the ball at the low post, drives, and makes a contested two-point shot.",
             "diff_substring": "makes"},
        ],
    },
    {
        "id": "soccer",
        "sport": "soccer",
        "source": "output_final_final/soccer/example_003",
        "query_simple": (
            "Find the clip of a defender making a lateral pass down the "
            "right wing."
        ),
        "gt": {
            "sim": 0.63,
            "caption": "A defender plays a lateral pass down the right flank.",
        },
        "negatives": [
            {"pick_diff": "flank", "sim": 0.83,
             "caption": "A defender plays a lateral pass through the center.",
             "diff_substring": "through the center"},
            {"pick_diff": "position", "sim": 0.78,
             "caption": "A midfielder plays a lateral pass down the right flank.",
             "diff_substring": "midfielder"},
            {"pick_diff": "primary_action", "sim": 0.73,
             "caption": "A defender's lateral pass down the right flank is intercepted.",
             "diff_substring": "is intercepted"},
        ],
    },
    {
        "id": "hockey",
        "sport": "hockey",
        "source": "output_final_final/hockey/example_003",
        "query_simple": (
            "Find the clip where a defender blocks a wrist shot in the "
            "offensive zone with the goalie in butterfly."
        ),
        "gt": {
            "sim": 0.60,
            "caption": "A defender blocks a wrist shot in the offensive zone, goalie set in the butterfly position.",
        },
        "negatives": [
            {"pick_diff": "shot_type", "sim": 0.82,
             "caption": "A defender blocks a slapshot in the offensive zone, goalie set in the butterfly position.",
             "diff_substring": "slapshot"},
            {"pick_diff": "action_name", "sim": 0.77,
             "caption": "A skater scores a goal in the offensive zone on a wrist shot, goalie set in the butterfly position.",
             "diff_substring": "scores a goal"},
            {"pick_diff": "goalie_stance", "sim": 0.73,
             "caption": "A defender blocks a wrist shot in the offensive zone, goalie set in the split position.",
             "diff_substring": "split position"},
        ],
    },
]


def _resolve_video(src_dir, abs_path_in_metadata):
    """Source-dir lookup: appendix dirs store videos under
    videos/<sport>_<outcome>/. Match by basename suffix to handle
    rename prefixes (rank0_gt_*, hn1_*, gt_*, etc.)."""
    base = os.path.basename(abs_path_in_metadata)
    matches = list(src_dir.glob(f"*{base}"))
    return matches[0] if matches else None


def _first_hn_with_diff(hns, diff_axis):
    """Return the first hard_negative entry whose differing_attribute matches
    the requested axis."""
    for hn in hns:
        if hn.get("differing_attribute") == diff_axis:
            return hn
    return None


def build_t3():
    """Build 3 failure panels (basketball/soccer/hockey), each with 1 GT
    + 3 attribute-diverse hard negatives, sorted by descending illustrative
    sim score. GT lands at the bottom (model failed to rank it on top)."""
    panels = []
    for spec in T3_PANEL_SPECS:
        sport = spec["sport"]
        src_root = T3_QUALITATIVE_ROOT / spec["source"]
        meta = json.loads((src_root / "metadata.json").read_text())
        out_dir = T3_VIDEO_OUT / sport
        out_dir.mkdir(parents=True, exist_ok=True)

        # Cleanup older per-panel dirs to avoid stale files.
        for stale in T3_VIDEO_OUT.glob("*"):
            if stale.name not in {s["sport"] for s in T3_PANEL_SPECS} \
               and stale.is_dir():
                shutil.rmtree(stale)

        # The positive (GT) video sits at metadata['positive']['video_path'];
        # the example dir also exposes a `positive.mp4` symlink. Use the
        # symlink to follow whatever the dataset points to.
        pos_src = src_root / "positive.mp4"
        pos_dst = out_dir / "gt.mp4"
        if not pos_dst.exists():
            shutil.copy2(pos_src, pos_dst)

        # For each negative spec, find the HN entry whose differing axis
        # matches `pick_diff`; copy its mp4 into the output dir.
        hns = meta["hard_negatives"]
        thumbs = []
        for i, neg in enumerate(spec["negatives"]):
            hn = _first_hn_with_diff(hns, neg["pick_diff"])
            if hn is None:
                raise ValueError(
                    f"No HN with differing_attribute={neg['pick_diff']} in {src_root}"
                )
            src = src_root / f"hn_{hn['index']:02d}_diff_{hn['differing_attribute']}.mp4"
            if not src.exists():
                src = Path(hn["video_path"])
            dst = out_dir / f"neg{i+1}.mp4"
            if not dst.exists():
                shutil.copy2(src, dst)
            thumbs.append({
                "id": f"neg{i+1}",
                "is_gt": False,
                "sim": neg["sim"],
                "video": f"assets/t3_videos/{sport}/neg{i+1}.mp4",
                "caption": neg["caption"],
                "diff_substring": neg["diff_substring"],
                "diff_axis": neg["pick_diff"],
                "diff_values": {
                    "positive": hn["positive_value"],
                    "negative": hn["negative_value"],
                },
            })

        # Append GT thumb last (lowest sim). Caller (UI) will sort by sim.
        thumbs.append({
            "id": "gt",
            "is_gt": True,
            "sim": spec["gt"]["sim"],
            "video": f"assets/t3_videos/{sport}/gt.mp4",
            "caption": spec["gt"]["caption"],
            "diff_substring": None,
            "diff_axis": None,
        })

        # Sort by sim descending (GT lands at the bottom).
        thumbs.sort(key=lambda t: t["sim"], reverse=True)

        panels.append({
            "id": sport,
            "sport": sport,
            "query_simple": spec["query_simple"],
            "query_full": meta["positive"].get("caption_manual",
                          meta["positive"].get("caption", "")),
            "composition": meta["positive"].get("composition_attributes", {}),
            "thumbs": thumbs,
        })
    return {"panels": panels}


# ── T9 ─────────────────────────────────────────────────────────────────────

# ── Q45 (cliff panel — Westbrook/Batum) ────────────────────────────────────
T9_CLIFF_PHASES = [
    {"start_turn": 1, "end_turn": 4, "label": "Find the game"},
    {"start_turn": 5, "end_turn": 5, "label": "Pivot to video"},
    {"start_turn": 6, "end_turn": 8, "label": "Probe clips"},
    {"start_turn": 9, "end_turn": 9, "label": "Give up"},
]
T9_CLIFF_FINAL_ANSWER = "I cannot find the answer in the provided documents or videos."
T9_CLIFF_THOUGHTS = {
    1: "Find the game — New Orleans wire-to-wire, 14 threes by halftime.",
    2: "First search missed it. Try again with both team names.",
    3: "Got the game report. Ask it for both deficits in one go.",
    4: "Report doesn't quote the scores. Ask it again, even more directly.",
    5: "Reports are a dead end. Search clips around Westbrook and Batum.",
    6: "Ask four clips what happened. Clip 188 (target) shows Batum's 3+1 — but only the action, not the score.",
    7: "Probe eleven more clips for Westbrook's play sequence. Still asking 'what happened?', not 'what's the score?'",
    8: "Finally ask one target clip for the score. Get back 'Clippers 48 – 56 Pelicans.'",
}
T9_CLIFF_FINAL_THOUGHT = (
    "Have Westbrook's deficit (Clippers down 8). For Batum's play, only "
    "the action description — no score state. Refuse without both."
)

# ── Q42 non-oracle (Ask-the-play) ──────────────────────────────────────────
# Source: legacy/batch_gpt5_5gpu_20260218_030401_nonoracle/chats/chat_18.json
# Final answer is concrete ("5") rather than a refusal.
_EXP_ROOT_FOR_ASK = Path(
    "/mnt/arc/sha17/video_deep_research/data/vdr_0208/pipeline/experiments"
)
T9_ASK_CHAT = (
    _EXP_ROOT_FOR_ASK / "legacy" / "batch_gpt5_5gpu_20260218_030401_nonoracle"
    / "chats" / "chat_18.json"
)
T9_ASK_GT_ANSWER = "1"
T9_ASK_PHASES = [
    {"start_turn": 1,  "end_turn": 2,  "label": "Find the game"},
    {"start_turn": 3,  "end_turn": 6,  "label": "First video pass"},
    {"start_turn": 7,  "end_turn": 11, "label": "Refine, ask more clips"},
    {"start_turn": 12, "end_turn": 18, "label": "Drill harder"},
    {"start_turn": 19, "end_turn": 23, "label": "Final attempts"},
    {"start_turn": 24, "end_turn": 24, "label": "Guess: 5"},
]
T9_ASK_THOUGHTS = {
    1: "Find the Suns–Bulls game where Booker had six threes and Phoenix made twenty.",
    2: "Ask the matched reports to confirm both stats.",
    3: "Pivot to video. Search the early-Q3 window in the right game.",
    4: "Ask the first returned clip what jersey number the scorer wore.",
    5: "Try another clip.",
    6: "And another. Still no jersey number.",
    7: "Refine the video search with a tighter temporal-boundary filter.",
    8: "Ask the new batch the same question.",
    9: "Repeat — still asking.",
    10: "Repeat.",
    11: "Repeat.",
    12: "Switch to a player-scoped search (Devin Booker).",
    13: "Tighter temporal window.",
    14: "Tighter still.",
    15: "Ask the new clips.",
    16: "Ask.",
    17: "Ask.",
    18: "Ask.",
    19: "One last video search — no query, just to surface candidates.",
    20: "Ask the final batch.",
    21: "Ask.",
    22: "Ask.",
    23: "Settles on '5' as the final answer.",
}
T9_ASK_FINAL_THOUGHT = (
    "Twenty-three turns of probing, never sees a jersey number on screen. "
    "Picks '5'. Wrong — GT was '1'."
)

T9_CLIP_OUT = ASSETS_ROOT / "t9_clips"
# Source roots for basketball clip .mp4 files (looked up by glob).
T9_CLIP_SRC_ROOTS = [
    Path("/mnt/arc/sha17/video_deep_research/data/vdr_0208/data/basketball"),
]
# Experiments root — used by chat-sourced specs below.
EXP_ROOT = Path(
    "/mnt/arc/sha17/video_deep_research/data/vdr_0208/pipeline/experiments"
)

TOOL_ABBREV = {
    "search_documents": "SD",
    "document_qa": "DQ",
    "search_videos": "SV",
    "video_qa": "VQ",
    "video_qa_oracle": "VQ",
}


def trim_doc_results(results, top_n=3):
    """For search_documents: keep the top N results with only the fields the
    hover bubble needs. Highlights truncated to 180 chars."""
    out = []
    for r in results.get("results", [])[:top_n]:
        hl = r.get("highlights_short") or r.get("highlights", "")
        if len(hl) > 180:
            hl = hl[:177].rstrip() + "…"
        out.append({
            "rank": r.get("rank"),
            "doc_id": r.get("doc_id"),
            "teams": r.get("teams", [])[:2],
            "highlight": hl,
            "is_target": r.get("is_target", False),
        })
    return {
        "kind": "documents",
        "total": results.get("total", 0),
        "target_count": results.get("target_count", 0),
        "target_ranks": results.get("target_ranks", [])[:5],
        "top": out,
    }


def trim_docqa_results(results, top_n=3):
    """For document_qa: top N results, answers truncated to 220 chars.
    `evidence` dropped (we don't render it)."""
    out = []
    for r in results.get("results", [])[:top_n]:
        ans = r.get("answer", "")
        if len(ans) > 220:
            ans = ans[:217].rstrip() + "…"
        out.append({
            "doc_id": r.get("doc_id"),
            "answer": ans,
            "is_target": r.get("is_target", False),
            "contains_answer": r.get("contains_answer", False),
        })
    return {"kind": "docqa", "results": out}


def trim_videos_results(results, top_n=3, clip_frame_index=None, clip_video_index=None):
    """For search_videos: keep top-N. Frame URL and clip mp4 URL looked up by
    clip_id from shared indices."""
    out = []
    for r in results.get("results", [])[:top_n]:
        clip_id = r.get("clip_id") or r.get("video_id")
        item = {
            "rank": r.get("rank"),
            "clip_id": clip_id,
            "quarter": r.get("quarter"),
            "is_target": r.get("is_target", False),
        }
        if clip_frame_index and clip_id in clip_frame_index:
            item["frame"] = clip_frame_index[clip_id]
        if clip_video_index and clip_id in clip_video_index:
            item["clip"] = clip_video_index[clip_id]
        out.append(item)
    return {
        "kind": "videos",
        "total": results.get("total", 0),
        "target_count": results.get("target_count", 0),
        "target_ranks": results.get("target_ranks", [])[:5],
        "top": out,
    }


def trim_videoqa_results(results, clip_frame_index=None, clip_video_index=None):
    """For video_qa / video_qa_oracle: per-clip {answer, is_target, has_answer,
    frame, clip}. Truncates answer to 220 chars."""
    out = []
    for r in results.get("results", []):
        ans = r.get("answer", "")
        if len(ans) > 220:
            ans = ans[:217].rstrip() + "…"
        clip_id = r.get("clip_id") or r.get("video_id")
        item = {
            "clip_id": clip_id,
            "answer": ans,
            "is_target": r.get("is_target", False),
            "has_answer": r.get("has_answer", r.get("contains_answer", False)),
        }
        if clip_frame_index and clip_id in clip_frame_index:
            item["frame"] = clip_frame_index[clip_id]
        if clip_video_index and clip_id in clip_video_index:
            item["clip"] = clip_video_index[clip_id]
        out.append(item)
    return {"kind": "videoqa", "results": out}


def trim_dispatch(tool, results, clip_frame_index=None, clip_video_index=None):
    if tool == "search_documents":
        return trim_doc_results(results)
    if tool == "document_qa":
        return trim_docqa_results(results)
    if tool == "search_videos":
        return trim_videos_results(results,
                                   clip_frame_index=clip_frame_index,
                                   clip_video_index=clip_video_index)
    if tool in ("video_qa", "video_qa_oracle"):
        return trim_videoqa_results(results,
                                    clip_frame_index=clip_frame_index,
                                    clip_video_index=clip_video_index)
    raise ValueError(f"Unknown tool: {tool}")


def copy_t9_frames_and_index(viz_dir):
    """Copy every frame from search_videos turns into the shared
    assets/t9_frames/clip_<id>.jpg flat layout, keyed by clip_id.
    Returns {clip_id: relative_url}. Source filenames:
    NNN_clip_GAMEID_CLIPID.jpg (NNN = retrieval rank)."""
    import re
    index = {}
    overview = json.loads((viz_dir / "overview.json").read_text())
    T9_FRAME_OUT.mkdir(parents=True, exist_ok=True)
    for t in overview["turns_summary"]:
        if t["tool"] != "search_videos":
            continue
        turn_idx = t["turn"]
        src_dir = viz_dir / f"turn_{turn_idx:02d}_search_videos" / "frames"
        if not src_dir.is_dir():
            continue
        for f in src_dir.glob("*.jpg"):
            m = re.match(r"^\d{3}_clip_(\d+_\d+)\.jpg$", f.name)
            if not m:
                continue
            clip_id = m.group(1)
            if clip_id in index:
                continue
            dst = T9_FRAME_OUT / f"clip_{clip_id}.jpg"
            if not dst.exists():
                shutil.copy2(f, dst)
            index[clip_id] = f"assets/t9_frames/clip_{clip_id}.jpg"
    return index


def collect_t9_clip_ids(viz_dir):
    """Walk a trajectory's turn dirs, gather clip_ids the user sees in the
    bubble (top-3 of SV results, first-3 of VQ results)."""
    overview = json.loads((viz_dir / "overview.json").read_text())
    ids = set()
    for t in overview["turns_summary"]:
        tool = t["tool"]
        if tool not in ("search_videos", "video_qa", "video_qa_oracle"):
            continue
        turn_dir = viz_dir / f"turn_{t['turn']:02d}_{tool}"
        results = json.loads((turn_dir / "results.json").read_text())
        for r in results.get("results", [])[:3]:
            cid = r.get("clip_id") or r.get("video_id")
            if cid:
                ids.add(cid)
    return ids


def copy_t9_clip_mp4s(clip_ids):
    """For each clip_id "<game>_<seq>", glob clip_<game>_<seq>_Q*.mp4 across
    the source tree and copy to assets/t9_clips/clip_<id>.mp4."""
    T9_CLIP_OUT.mkdir(parents=True, exist_ok=True)
    index = {}
    for cid in clip_ids:
        matches = []
        for root in T9_CLIP_SRC_ROOTS:
            matches.extend(root.rglob(f"clip_{cid}_Q*.mp4"))
        if not matches:
            continue
        src = matches[0]
        dst = T9_CLIP_OUT / f"clip_{cid}.mp4"
        if not dst.exists():
            shutil.copy2(src, dst)
        index[cid] = f"assets/t9_clips/clip_{cid}.mp4"
    return index


def build_t9(viz_dir, phases, thoughts, final_thought, final_answer,
             clip_frame_index, clip_video_index):
    overview = json.loads((viz_dir / "overview.json").read_text())
    turns = []
    for t in overview["turns_summary"]:
        turn_idx = t["turn"]
        tool = t["tool"]
        turn_dir = viz_dir / f"turn_{turn_idx:02d}_{tool}"
        call = json.loads((turn_dir / "call.json").read_text())
        results = json.loads((turn_dir / "results.json").read_text())
        trim = trim_dispatch(tool, results,
                             clip_frame_index=clip_frame_index,
                             clip_video_index=clip_video_index)
        turns.append({
            "turn": turn_idx,
            "tool": tool,
            "abbrev": TOOL_ABBREV[tool],
            "thought": thoughts.get(turn_idx, ""),
            "arguments": call.get("arguments", {}),
            "results": trim,
        })

    # Aggregate stats for the under-strip line.
    tool_counts = {}
    for t in turns:
        tool_counts[t["tool"]] = tool_counts.get(t["tool"], 0) + 1

    return {
        "question_id": overview["question_id"],
        "question": overview["question_text"],
        "category": overview["category"],
        "game_id": overview["game_id"],
        "gt_answer": overview["gt_answer"],
        "verdict": overview["verdict"],
        "model": "GPT-5.2",
        "mode": "oracle",
        "num_turns": overview["num_turns"],
        "tool_counts": tool_counts,
        "phases": phases,
        "turns": turns,
        "final_answer": final_answer,
        "final_thought": final_thought,
    }


# ── Main ───────────────────────────────────────────────────────────────────

# ── Tape archive: T3 attribute-axis wall (8 tiles) ─────────────────────────
# Each tile is one query + 1 GT + 3 hard negatives, all chosen to illustrate
# a *specific* compositional axis. The selected HNs come from the source's
# `hard_negatives` list, picked by their `differing_attribute` field.
T3_ARCHIVE_OUT = ASSETS_ROOT / "t3_archive"

T3_ARCHIVE_SPECS = [
    # Trimmed to 4 tiles per user request — 2 basketball + 1 soccer + 1
    # hockey, each illustrating a different attribute axis.
    {
        "id": "bb_jersey",
        "sport": "basketball",
        "axis_label": "jersey number",
        "source": "appendix_0311_5",   # uses top3_retrieval schema
        "subkey": ("basketball", "failure"),
        "query": "A player makes a free throw — find the clip of #55.",
        "gt_caption": "Player #55 makes a free throw.",
        "hn_captions": [
            ("#24", "Player #24 makes a free throw."),
            ("#16", "Player #16 makes a free throw."),
            ("#21", "Player #21 makes a free throw."),
        ],
    },
    {
        "id": "bb_hand",
        "sport": "basketball",
        "axis_label": "shooting hand",
        "source": "output_final_final/basketball/example_004",
        "query": "A contested two-point jumper from the top, right-handed.",
        "gt_caption": "A right-handed contested jumper from the top.",
        "hn_picks": [
            {"index": 1, "diff": "left-handed",
             "caption": "A left-handed contested jumper from the top."},
            {"index": 2, "diff": "uncontested",
             "caption": "An uncontested right-handed jumper from the top."},
            {"index": 3, "diff": "restricted area",
             "caption": "A right-handed contested jumper from the restricted area."},
        ],
    },
    {
        "id": "soc_player",
        "sport": "soccer",
        "axis_label": "player name",
        "source": "output_final_final/soccer/example_001",
        "query": "K. Stoup wins a duel attacking from the right side.",
        "gt_caption": "K. Stoup wins a duel attacking from the right side.",
        "hn_picks": [
            {"index": 4, "diff": "A. Pope",
             "caption": "A. Pope wins a duel attacking from the right side."},
            {"index": 5, "diff": "Nélson Semedo",
             "caption": "Nélson Semedo wins a duel attacking from the right side."},
            {"index": 2, "diff": "completes a pass",
             "caption": "K. Stoup completes a pass attacking from the right side."},
        ],
    },
    {
        "id": "hky_zone",
        "sport": "hockey",
        "axis_label": "rink zone",
        "source": "output_final_final/hockey/example_004",
        "query": "A wrist shot in the offensive zone, goalie in the butterfly position.",
        "gt_caption": "A wrist shot in the offensive zone, goalie in the butterfly.",
        "hn_picks": [
            {"index": 1, "diff": "neutral zone",
             "caption": "A wrist shot in the neutral zone, goalie in the butterfly."},
            {"index": 2, "diff": "sitting",
             "caption": "A wrist shot in the offensive zone, goalie sitting."},
            {"index": 3, "diff": "slapshot",
             "caption": "A slapshot in the offensive zone, goalie in the butterfly."},
        ],
    },
]


# ── Tape archive: T9 three failure modes — one per sport ───────────────────
# Two sources:
# - "viz": a pre-extracted gpt5_oracle_new/Q* directory (basketball only).
# - "chat": a raw chat_*.json path (hockey + soccer) — parsed via extract_chat.
T9_ARCHIVE_SPECS = [
    {
        "id": "doc_only",
        "label": "Stuck in documents",
        "sport": "basketball",
        "tagline": "Never escalates to video — searches reports, then refuses.",
        "viz": "Q34",
        "question_short": (
            "What shot type was the first made basket of the Heat player "
            "who tripled his usual first-quarter points?"
        ),
        "final_answer": (
            "I cannot find the answer in the provided documents or videos."
        ),
        "summary": (
            "Searches game reports 12 times, questions them 4 times. "
            "Never invokes a video tool."
        ),
        "gt_answer": "Alley oop",
    },
    {
        "id": "perception_bn",
        "label": "Video perception bottleneck",
        "sport": "hockey",
        "tagline": "Asks the clips, can't extract the right detail.",
        "chat": (EXP_ROOT /
                 "batch_gpt52_hockey_20260426_163945" / "chats" / "chat_165.json"),
        "question_short": (
            "From the opening faceoff to the Siegenthaler–Schenn puck "
            "battle, how many takeaways happened in New Jersey's "
            "back-to-back road win?"
        ),
        "summary": (
            "Pivots to video early and asks 10 clips for the count. "
            "Settles on '8' — wrong."
        ),
        "gt_answer": "2",
    },
    {
        "id": "aggregation_fail",
        "label": "Cross-clip aggregation failure",
        "sport": "soccer",
        "tagline": (
            "Inspects each clip on its own, never tallies the pass "
            "types across them."
        ),
        "chat": (EXP_ROOT /
                 "batch_gpt52_soccer_20260426_212247" / "chats" / "chat_102.json"),
        "question_short": (
            "In the Arsenal–Everton match where Arsenal took over 20 "
            "shots and Everton just three, which pass type was most "
            "common among Arsenal's key passes?"
        ),
        "summary": (
            "23 turns and 21 video calls. The agent looks at one key "
            "pass at a time but never counts up the pass types across "
            "clips — returning a player name instead of a pass type."
        ),
        "gt_answer": "cross",
    },
]


# ── Tape archive builders ───────────────────────────────────────────────────

def build_t3_archive():
    """Build the 8-tile T3 archive wall. Each tile carries 1 GT + 3 HNs
    with full caption + diff_substring, and the videos are copied into
    assets/t3_archive/<panel_id>/."""
    T3_ARCHIVE_OUT.mkdir(parents=True, exist_ok=True)
    panels = []
    for spec in T3_ARCHIVE_SPECS:
        panel_id = spec["id"]
        out_dir = T3_ARCHIVE_OUT / panel_id
        out_dir.mkdir(parents=True, exist_ok=True)

        if spec["source"] == "appendix_0311_5":
            # appendix_0311_5 schema: positive_video + top3_retrieval
            sport, label = spec["subkey"]
            meta = json.loads(
                (T3_QUALITATIVE_ROOT / "appendix_0311_5" / "metadata.json").read_text()
            )
            e = meta[sport][label]
            videos_dir = (T3_QUALITATIVE_ROOT / "appendix_0311_5" / "videos" /
                          f"{sport}_{label}")
            # Copy positive (GT). The appendix dir often *only* stores the
            # HN mp4s next to the panel.png; the GT lives at its absolute
            # source path. Fall back if the resolve-by-suffix misses.
            pos_src = _resolve_video(videos_dir, os.path.basename(e["positive_video"]))
            if pos_src is None:
                pos_src = Path(e["positive_video"])
            gt_dst = out_dir / "gt.mp4"
            if not gt_dst.exists():
                shutil.copy2(pos_src, gt_dst)
            # Copy 3 HNs from top3_retrieval
            hn_thumbs = []
            for i, r in enumerate(e["top3_retrieval"]):
                src = _resolve_video(videos_dir, os.path.basename(r["video"]))
                dst = out_dir / f"hn{i+1}.mp4"
                if not dst.exists() and src is not None:
                    shutil.copy2(src, dst)
                diff, caption = spec["hn_captions"][i]
                hn_thumbs.append({
                    "video": f"assets/t3_archive/{panel_id}/hn{i+1}.mp4",
                    "caption": caption,
                    "diff_substring": diff,
                })
            thumbs = [{
                "video": f"assets/t3_archive/{panel_id}/gt.mp4",
                "caption": spec["gt_caption"],
                "is_gt": True,
            }] + [dict(t, is_gt=False) for t in hn_thumbs]
        else:
            # output_final_final schema: positive + hard_negatives
            src_root = T3_QUALITATIVE_ROOT / spec["source"]
            meta = json.loads((src_root / "metadata.json").read_text())
            # Positive -> gt.mp4
            pos_src = src_root / "positive.mp4"
            gt_dst = out_dir / "gt.mp4"
            if not gt_dst.exists():
                shutil.copy2(pos_src, gt_dst)
            # Pick HNs by 1-based index from spec
            hns = meta["hard_negatives"]
            hn_thumbs = []
            for j, pick in enumerate(spec["hn_picks"]):
                hn = hns[pick["index"] - 1]
                hn_file_name = f"hn_{hn['index']:02d}_diff_{hn['differing_attribute']}.mp4"
                hn_src = src_root / hn_file_name
                if not hn_src.exists():
                    hn_src = Path(hn["video_path"])
                dst = out_dir / f"hn{j+1}.mp4"
                if not dst.exists():
                    shutil.copy2(hn_src, dst)
                hn_thumbs.append({
                    "video": f"assets/t3_archive/{panel_id}/hn{j+1}.mp4",
                    "caption": pick["caption"],
                    "diff_substring": pick["diff"],
                    "is_gt": False,
                })
            thumbs = [{
                "video": f"assets/t3_archive/{panel_id}/gt.mp4",
                "caption": spec["gt_caption"],
                "is_gt": True,
            }] + hn_thumbs

        panels.append({
            "id": panel_id,
            "sport": spec["sport"],
            "axis_label": spec["axis_label"],
            "query": spec["query"],
            "thumbs": thumbs,
        })
    return {"panels": panels}


def build_t9_archive():
    """Build the T9 archive cards. Each spec can source from either a
    pre-extracted gpt5_oracle_new/Q* dir ("viz") or a raw chat_*.json
    ("chat") that gets walked via extract_chat.build_compact_card."""
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from extract_chat import build_compact_card
    cards = []
    for spec in T9_ARCHIVE_SPECS:
        if "viz" in spec:
            viz = T9_VIZ_ROOT / spec["viz"]
            overview = json.loads((viz / "overview.json").read_text())
            tool_seq = [{"turn": t["turn"], "tool": t["tool"],
                         "abbrev": TOOL_ABBREV[t["tool"]]}
                        for t in overview["turns_summary"]]
            tool_counts = {}
            for t in tool_seq:
                tool_counts[t["tool"]] = tool_counts.get(t["tool"], 0) + 1
            card = {
                "question_id": overview["question_id"],
                "question": overview["question_text"],
                "gt_answer": overview["gt_answer"],
                "final_answer": spec["final_answer"],
                "num_turns": overview["num_turns"],
                "tool_counts": tool_counts,
                "tool_seq": tool_seq,
            }
        else:
            card = build_compact_card(
                spec["chat"], question_id=spec["id"],
                mode_label=spec["label"], tagline=spec["tagline"],
                summary=spec["summary"], gt_answer=spec["gt_answer"],
            )
        cards.append({
            "id": spec["id"],
            "label": spec["label"],
            "sport": spec["sport"],
            "tagline": spec["tagline"],
            "summary": spec["summary"],
            "question_short": spec.get("question_short"),
            **{k: v for k, v in card.items() if k not in
               ("label", "tagline", "summary", "id", "sport",
                "question_short")},
        })
    return {"cards": cards}


T9_TRAJECTORIES = [
    {
        "label": "cliff",
        "source_type": "viz",
        "viz_dir": T9_VIZ_CLIFF,
        "phases": T9_CLIFF_PHASES,
        "thoughts": T9_CLIFF_THOUGHTS,
        "final_answer": T9_CLIFF_FINAL_ANSWER,
        "final_thought": T9_CLIFF_FINAL_THOUGHT,
        "output": "t9_panel_cliff.json",
    },
    {
        "label": "ask",
        "source_type": "chat",
        "chat_path": T9_ASK_CHAT,
        "question_id": 42,
        "gt_answer": T9_ASK_GT_ANSWER,
        "phases": T9_ASK_PHASES,
        "thoughts": T9_ASK_THOUGHTS,
        "final_thought": T9_ASK_FINAL_THOUGHT,
        "output": "t9_panel_ask.json",
    },
]


def main():
    ASSETS_ROOT.mkdir(parents=True, exist_ok=True)
    T3_VIDEO_OUT.mkdir(parents=True, exist_ok=True)
    T9_FRAME_OUT.mkdir(parents=True, exist_ok=True)

    t3 = build_t3()
    (ASSETS_ROOT / "t3_panel.json").write_text(json.dumps(t3, indent=2))
    print(f"wrote t3_panel.json ({len(t3['panels'])} panels)")

    t3_archive = build_t3_archive()
    (ASSETS_ROOT / "t3_archive.json").write_text(json.dumps(t3_archive, indent=2))
    print(f"wrote t3_archive.json ({len(t3_archive['panels'])} tiles)")

    t9_archive = build_t9_archive()
    (ASSETS_ROOT / "t9_archive.json").write_text(json.dumps(t9_archive, indent=2))
    print(f"wrote t9_archive.json ({len(t9_archive['cards'])} cards)")

    # Build each T9 trajectory; frame + clip indices are shared.
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from extract_chat import build_full_panel

    for cfg in T9_TRAJECTORIES:
        if cfg["source_type"] == "viz":
            frame_index = copy_t9_frames_and_index(cfg["viz_dir"])
            clip_ids = collect_t9_clip_ids(cfg["viz_dir"])
            clip_video_index = copy_t9_clip_mp4s(clip_ids)
            t9 = build_t9(cfg["viz_dir"], cfg["phases"], cfg["thoughts"],
                          cfg["final_thought"], cfg["final_answer"],
                          frame_index, clip_video_index)
        else:   # "chat"
            # Reuse the existing flat clip-id frame + mp4 indices (we don't
            # extract new frames for chat-sourced trajectories — the panel
            # will show placeholder icons for clip thumbs without frames).
            existing_frames = {p.stem.replace("clip_", ""):
                               f"assets/t9_frames/{p.name}"
                               for p in T9_FRAME_OUT.glob("clip_*.jpg")}
            existing_clips = {p.stem.replace("clip_", ""):
                              f"assets/t9_clips/{p.name}"
                              for p in T9_CLIP_OUT.glob("clip_*.mp4")}
            t9 = build_full_panel(
                cfg["chat_path"], question_id=cfg["question_id"],
                model="GPT-5.2", mode="non-oracle",
                phases=cfg["phases"], thoughts=cfg["thoughts"],
                final_thought=cfg["final_thought"],
                gt_answer=cfg["gt_answer"], verdict="Wrong",
                frame_index=existing_frames, clip_index=existing_clips,
            )
        (ASSETS_ROOT / cfg["output"]).write_text(json.dumps(t9, indent=2))
        print(f"wrote {cfg['output']} ({t9['num_turns']} turns · {cfg['label']})")

    print(f"\nT3 videos in {T3_VIDEO_OUT}:")
    total_t3_mb = 0
    for p in sorted(T3_VIDEO_OUT.rglob("*.mp4")):
        kb = p.stat().st_size // 1024
        total_t3_mb += kb / 1024
    print(f"  {len(list(T3_VIDEO_OUT.rglob('*.mp4')))} files · {total_t3_mb:.1f} MB")

    n_frames = len(list(T9_FRAME_OUT.rglob("*.jpg")))
    print(f"\nT9 frames: {n_frames} jpgs")

    n_clips = len(list(T9_CLIP_OUT.rglob("*.mp4")))
    total_t9_mb = sum(p.stat().st_size for p in T9_CLIP_OUT.rglob("*.mp4")) / 1024 / 1024
    print(f"T9 clips: {n_clips} mp4s · {total_t9_mb:.1f} MB")

    # ── Assemble panels_block.js (data + compiled panels in plain JS so the
    # browser doesn't need Babel for it) ──────────────────────────────────
    repo_root = ASSETS_ROOT.parent
    panels_compiled = (repo_root / "scripts" / "panels.compiled.js").read_text()
    t3 = json.loads((ASSETS_ROOT / "t3_panel.json").read_text())
    t9_cliff = json.loads((ASSETS_ROOT / "t9_panel_cliff.json").read_text())
    t9_ask = json.loads((ASSETS_ROOT / "t9_panel_ask.json").read_text())
    t3_archive = json.loads((ASSETS_ROOT / "t3_archive.json").read_text())
    t9_archive = json.loads((ASSETS_ROOT / "t9_archive.json").read_text())
    block = "\n".join([
        "// ── Plain JS globals (shared with the Babel block) ──────────────────",
        "const { useEffect, useRef, useState } = React;",
        "",
        "const PILLARS = {",
        "  Perception: { base: '#4A7FB5', glow: 'rgba(74,127,181,0.55)', soft: 'rgba(74,127,181,0.12)' },",
        "  Reasoning:  { base: '#2E9E8F', glow: 'rgba(46,158,143,0.55)', soft: 'rgba(46,158,143,0.12)' },",
        "  Simulation: { base: '#D4913A', glow: 'rgba(212,145,58,0.55)', soft: 'rgba(212,145,58,0.12)' },",
        "  Agency:     { base: '#C0392B', glow: 'rgba(192,57,43,0.55)',  soft: 'rgba(192,57,43,0.12)' },",
        "};",
        "",
        "const T3_PANEL = " + json.dumps(t3) + ";",
        "const T9_PANEL_CLIFF = " + json.dumps(t9_cliff) + ";",
        "const T9_PANEL_ASK = " + json.dumps(t9_ask) + ";",
        "const T3_ARCHIVE = " + json.dumps(t3_archive) + ";",
        "const T9_ARCHIVE = " + json.dumps(t9_archive) + ";",
        "",
        "// ── Compiled T3Panel + T9Panel + Archive components ────────────────",
        panels_compiled,
    ])
    out_path = repo_root / "scripts" / "panels_block.js"
    out_path.write_text(block)
    print(f"\nwrote panels_block.js · {len(block)} bytes")


if __name__ == "__main__":
    main()
