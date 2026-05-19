#!/usr/bin/env python3
"""
Extract a compact T9-panel JSON directly from a raw chat_*.json file. Used
when a question doesn't have a pre-computed QA_visualization output.

Two output formats:
- "full":    same shape as t9_panel_cliff.json / t9_panel_ask.json — used
             for the interactive Ask-the-play panel (needs thoughts).
- "compact": same shape as a card in t9_archive.json — used for the static
             tape-archive trajectory cards (no per-turn data, just the
             tile sequence + final answer + question metadata).

Trim policy mirrors `build_panel_assets.py`:
- search_documents → top-3 docs with highlights truncated
- document_qa → top-3 docs with answers truncated
- search_videos → top-3 clips, target ranks preserved
- video_qa / video_qa_oracle → first-3 clips with answers truncated

The agent's reasoning per turn isn't auto-paraphrased — the caller can
inject `thoughts` (dict turn_number → string) when producing the "full"
form.
"""

from __future__ import annotations
import json
import re
import sys
from pathlib import Path

TOOL_ABBREV = {
    "search_documents": "SD",
    "document_qa":      "DQ",
    "search_videos":    "SV",
    "video_qa":         "VQ",
    "video_qa_oracle":  "VQ",
}


def _truncate(s: str, n: int) -> str:
    if not isinstance(s, str):
        return ""
    return s[: n - 1].rstrip() + "…" if len(s) > n else s


def _trim_search_docs(results, top_n=3):
    out = []
    for r in (results.get("results") or [])[:top_n]:
        hl = r.get("highlights_short") or r.get("highlights", "")
        out.append({
            "rank": r.get("rank"),
            "doc_id": r.get("doc_id"),
            "teams": (r.get("metadata") or {}).get("teams", r.get("teams", []))[:2],
            "highlight": _truncate(hl, 180),
            "is_target": r.get("is_target", False),
        })
    return {
        "kind": "documents",
        "total": results.get("total", 0),
        "target_count": results.get("target_count", 0),
        "target_ranks": (results.get("target_ranks") or [])[:5],
        "top": out,
    }


def _trim_doc_qa(results, top_n=3):
    out = []
    if isinstance(results, dict) and "results" in results:
        for r in results["results"][:top_n]:
            out.append({
                "doc_id": r.get("doc_id"),
                "answer": _truncate(r.get("answer", ""), 220),
                "is_target": r.get("is_target", False),
                "contains_answer": r.get("contains_answer", r.get("has_answer", False)),
            })
    return {"kind": "docqa", "results": out}


def _trim_search_videos(results, top_n=3, frame_index=None, clip_index=None):
    out = []
    for r in (results.get("results") or [])[:top_n]:
        cid = r.get("clip_id") or r.get("video_id")
        item = {
            "rank": r.get("rank"),
            "clip_id": cid,
            "quarter": r.get("quarter"),
            "is_target": r.get("is_target", False),
        }
        if frame_index and cid in frame_index:
            item["frame"] = frame_index[cid]
        if clip_index and cid in clip_index:
            item["clip"] = clip_index[cid]
        out.append(item)
    return {
        "kind": "videos",
        "total": results.get("total", 0),
        "target_count": results.get("target_count", 0),
        "target_ranks": (results.get("target_ranks") or [])[:5],
        "top": out,
    }


def _trim_video_qa(results, top_n=3, frame_index=None, clip_index=None):
    out = []
    raw = results.get("results") or []
    for r in raw[:top_n]:
        cid = r.get("clip_id") or r.get("video_id")
        item = {
            "clip_id": cid,
            "answer": _truncate(r.get("answer", ""), 220),
            "is_target": r.get("is_target", False),
            "has_answer": r.get("has_answer", r.get("contains_answer", False)),
        }
        if frame_index and cid in frame_index:
            item["frame"] = frame_index[cid]
        if clip_index and cid in clip_index:
            item["clip"] = clip_index[cid]
        out.append(item)
    return {"kind": "videoqa", "results": out}


_TRIM = {
    "search_documents": _trim_search_docs,
    "document_qa": _trim_doc_qa,
    "search_videos": _trim_search_videos,
    "video_qa": _trim_video_qa,
    "video_qa_oracle": _trim_video_qa,
}


def parse_chat(chat_path: Path):
    """Walk a chat file and yield {turn, tool, args, results} dicts in order.
    Looks for tool_calls in assistant messages and matches them with the
    raw_tool_response on the following user message."""
    c = json.loads(chat_path.read_text())
    turns = []
    pending_call = None  # {tool, args}
    turn_counter = 0
    for msg in c:
        if msg["role"] == "assistant":
            content = msg.get("content", "")
            m = re.search(r"<tool_call>(.*?)</tool_call>", content, re.S)
            if m:
                try:
                    obj = json.loads(m.group(1))
                    pending_call = {
                        "tool": obj.get("name"),
                        "arguments": obj.get("arguments", {}),
                    }
                except json.JSONDecodeError:
                    pending_call = None
        elif msg["role"] == "user" and pending_call is not None:
            # The result is typically a stringified list/dict in raw_tool_response
            extra = msg.get("extra", {}) or {}
            raw = extra.get("raw_tool_response")
            results = None
            if raw is not None:
                results = raw if isinstance(raw, (dict, list)) else None
            if results is None:
                # Try to recover by parsing the JSON in the <tool_response> tag.
                m = re.search(r"<tool_response>\s*(?:Observation:)?\s*(.*?)\s*</tool_response>",
                              msg.get("content", ""), re.S)
                if m:
                    try:
                        results = json.loads(m.group(1))
                    except json.JSONDecodeError:
                        results = None
            # Coerce list → {"results": list} so the trimmers see a uniform shape
            if isinstance(results, list):
                results = {"results": results}
            elif results is None:
                results = {}
            turn_counter += 1
            turns.append({
                "turn": turn_counter,
                "tool": pending_call["tool"],
                "arguments": pending_call["arguments"],
                "results": results,
            })
            pending_call = None
    # Final-answer extraction
    final_answer = None
    for msg in reversed(c):
        if msg["role"] == "assistant":
            m = re.search(r"<answer>(.*?)</answer>", msg.get("content", ""), re.S)
            if m:
                final_answer = m.group(1).strip()
                break
    # First non-tool user message = question
    question = None
    for msg in c:
        if msg["role"] == "user" and "<tool_response>" not in msg.get("content", ""):
            question = msg["content"]
            break
    return question, turns, final_answer


def build_full_panel(chat_path: Path, question_id, model, mode,
                     phases, thoughts, final_thought,
                     gt_answer, verdict,
                     frame_index=None, clip_index=None):
    """Build a full t9_panel_*.json-shaped dict from a raw chat."""
    question, turns, final_answer = parse_chat(chat_path)
    out_turns = []
    tool_counts = {}
    for t in turns:
        tool = t["tool"]
        trim_fn = _TRIM.get(tool)
        if trim_fn is None:
            continue
        if tool in ("search_videos", "video_qa", "video_qa_oracle"):
            trimmed = trim_fn(t["results"], frame_index=frame_index,
                              clip_index=clip_index)
        else:
            trimmed = trim_fn(t["results"])
        out_turns.append({
            "turn": t["turn"],
            "tool": tool,
            "abbrev": TOOL_ABBREV[tool],
            "thought": thoughts.get(t["turn"], "") if thoughts else "",
            "arguments": t["arguments"],
            "results": trimmed,
        })
        tool_counts[tool] = tool_counts.get(tool, 0) + 1
    return {
        "question_id": question_id,
        "question": question,
        "model": model,
        "mode": mode,
        "gt_answer": gt_answer,
        "verdict": verdict,
        "num_turns": len(out_turns),
        "tool_counts": tool_counts,
        "phases": phases,
        "turns": out_turns,
        "final_answer": final_answer or "(no answer extracted)",
        "final_thought": final_thought,
    }


def build_compact_card(chat_path: Path, question_id, mode_label, tagline,
                       summary, gt_answer):
    """Build a compact tape-archive card from a raw chat (no per-turn data,
    just the tool sequence + final answer + question metadata)."""
    question, turns, final_answer = parse_chat(chat_path)
    tool_seq = [{"turn": t["turn"], "tool": t["tool"],
                 "abbrev": TOOL_ABBREV[t["tool"]]} for t in turns
                if t["tool"] in TOOL_ABBREV]
    tool_counts = {}
    for t in tool_seq:
        tool_counts[t["tool"]] = tool_counts.get(t["tool"], 0) + 1
    return {
        "label": mode_label,
        "tagline": tagline,
        "summary": summary,
        "question_id": question_id,
        "question": question,
        "gt_answer": gt_answer,
        "final_answer": final_answer or "(no answer extracted)",
        "num_turns": len(tool_seq),
        "tool_counts": tool_counts,
        "tool_seq": tool_seq,
    }


if __name__ == "__main__":
    # Quick CLI for ad-hoc inspection
    if len(sys.argv) < 2:
        print("usage: extract_chat.py <chat.json>")
        sys.exit(1)
    q, turns, fa = parse_chat(Path(sys.argv[1]))
    print(f"Question: {q[:120]}")
    print(f"Turns: {len(turns)}")
    for t in turns:
        print(f"  T{t['turn']:>2} {t['tool']:18s} args={list(t['arguments'].keys())}")
    print(f"Final answer: {fa!r}")
